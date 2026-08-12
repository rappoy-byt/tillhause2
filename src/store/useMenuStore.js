import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { products as FALLBACK_MENU, CATEGORIES as FALLBACK_CATS } from '../data/menuData';

let productsChannel = null;
let categoriesChannel = null;

export const useMenuStore = create((set, get) => ({
  menuItems: [],
  categories: [],
  isLoading: true,
  error: null,

  // Alias untuk mempermudah pemanggilan dari komponen
  fetchMenuItems: () => get().initRealtimeMenu(),

  initRealtimeMenu: async () => {
    set({ isLoading: true, error: null });

    try {
      // 1. Ambil Data Kategori
      const { data: catsData, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (catsError) throw catsError;

      const mappedCats = (catsData || []).map((c) => ({
        id: c.id,
        label: c.name,
      }));

      // 2. Ambil Data Produk / Menu
      const { data: itemsData, error: itemsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      const mappedItems = (itemsData || []).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category_id,
        price: Number(item.price),
        image: item.image_url || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        description: item.description || '',
        badges: item.is_recommended ? ['Recommended'] : [],
        isSoldOut: item.is_available === false || item.is_sold_out === true,
        is_available: item.is_available ?? !item.is_sold_out,
        temperatureOptions: ['Ice', 'Hot'],
        sugarOptions: ['Normal', 'Less Sugar', 'No Sugar'],
        iceOptions: ['Normal Ice', 'Less Ice', 'No Ice'],
        toppingOptions: []
      }));

      // Set data jika ada di database, jika belum ada gunakan fallback lokal
      set({ 
        categories: mappedCats.length > 0 ? mappedCats : FALLBACK_CATS, 
        menuItems: mappedItems.length > 0 ? mappedItems : FALLBACK_MENU, 
        isLoading: false 
      });

      // 3. Cleanup channel lama jika sudah aktif
      if (productsChannel) await supabase.removeChannel(productsChannel);
      if (categoriesChannel) await supabase.removeChannel(categoriesChannel);

      // 4. Setup Listener Realtime
      productsChannel = supabase
        .channel('realtime_products_store')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          get().fetchMenuDataSilently();
        })
        .subscribe();

      // Fix Syntax Realtime Category
      categoriesChannel = supabase
        .channel('realtime_categories_store')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
          get().fetchMenuDataSilently();
        })
        .subscribe();

    } catch (err) {
      console.error("Gagal mengambil menu dari Supabase:", err);
      set({ 
        menuItems: FALLBACK_MENU, 
        categories: FALLBACK_CATS,
        error: err.message,
        isLoading: false 
      });
    }
  },

  // Helper fetch data di background tanpa trigger loading spinner
  fetchMenuDataSilently: async () => {
    try {
      const { data: catsData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      const { data: itemsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (catsData && catsData.length > 0) {
        set({ categories: catsData.map(c => ({ id: c.id, label: c.name })) });
      }
      
      if (itemsData && itemsData.length > 0) {
        set({ 
          menuItems: itemsData.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category_id,
            price: Number(item.price),
            image: item.image_url || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
            description: item.description || '',
            badges: item.is_recommended ? ['Recommended'] : [],
            isSoldOut: item.is_available === false || item.is_sold_out === true,
            is_available: item.is_available ?? !item.is_sold_out,
            temperatureOptions: ['Ice', 'Hot'],
            sugarOptions: ['Normal', 'Less Sugar', 'No Sugar'],
            iceOptions: ['Normal Ice', 'Less Ice', 'No Ice'],
            toppingOptions: []
          }))
        });
      }
    } catch (e) {
      console.error("Silent fetch error:", e);
    }
  }
}));