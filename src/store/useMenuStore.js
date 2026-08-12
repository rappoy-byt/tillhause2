import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { products as FALLBACK_MENU, CATEGORIES as FALLBACK_CATS } from '../data/menuData';

export const useMenuStore = create((set, get) => ({
  menuItems: [],
  categories: [],
  isLoading: true,
  error: null,

  initRealtimeMenu: async () => {
    set({ isLoading: true, error: null });

    if (!isSupabaseConfigured) {
      // Fallback if no Supabase configured
      set({ 
        menuItems: FALLBACK_MENU, 
        categories: FALLBACK_CATS,
        isLoading: false 
      });
      return;
    }

    try {
      // 1. Fetch Categories
      const { data: catsData, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (catsError) throw catsError;

      // Map to the format used in frontend (id, label)
      const mappedCats = catsData.map(c => ({
        id: c.id, // we might need to map ID to string or keep UUID. If uuid, we need to ensure activeCategory matches. 
        // Wait, the frontend uses string IDs like 'hot-beverages'. 
        // Let's assume the admin can set names. We'll map label to name.
        // For compatibility with frontend activeCategory, we'll use a slugified name for id if needed, or just use the UUID.
        // Let's use the DB id as the actual id, but label as name.
        id: c.id,
        label: c.name
      }));

      // 2. Fetch Menu Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('products')
        .select('*');

      if (itemsError) throw itemsError;

      // Map to the format used in frontend
      const mappedItems = itemsData.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category_id, // Map category_id to category
        price: Number(item.price),
        image: item.image_url || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        description: item.description || '',
        badges: item.is_recommended ? ['Recommended'] : [],
        isSoldOut: item.is_sold_out,
        // Default options for coffee shop app compatibility
        temperatureOptions: ['Ice', 'Hot'],
        sugarOptions: ['Normal', 'Less Sugar', 'No Sugar'],
        iceOptions: ['Normal Ice', 'Less Ice', 'No Ice'],
        toppingOptions: []
      }));

      // Set initial data
      set({ 
        categories: mappedCats.length > 0 ? mappedCats : FALLBACK_CATS, 
        menuItems: mappedItems.length > 0 ? mappedItems : FALLBACK_MENU, 
        isLoading: false 
      });

      // 3. Setup Realtime Subscriptions
      // Subscribe to products changes
      const menuSub = supabase
        .channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
          get().fetchMenuDataSilently(); // Re-fetch all to keep it simple, or update specific item
        })
        .subscribe();

      // Subscribe to categories changes
      const catSub = supabase
        .channel('public:categories')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, payload => {
          get().fetchMenuDataSilently();
        })
        .subscribe();

      // We technically should save the subscription to remove it later, but Zustand stores are global.
    } catch (err) {
      console.error("Error fetching menu from Supabase:", err);
      // Fallback
      set({ 
        menuItems: FALLBACK_MENU, 
        categories: FALLBACK_CATS,
        error: err.message,
        isLoading: false 
      });
    }
  },

  // Helper to re-fetch without showing loading spinner
  fetchMenuDataSilently: async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: catsData } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      const { data: itemsData } = await supabase.from('products').select('*');
      
      if (catsData) {
        set({ categories: catsData.map(c => ({ id: c.id, label: c.name })) });
      }
      if (itemsData) {
        set({ 
          menuItems: itemsData.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category_id,
            price: Number(item.price),
            image: item.image_url || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
            description: item.description || '',
            badges: item.is_recommended ? ['Recommended'] : [],
            isSoldOut: item.is_sold_out,
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

  // Note: Add, update, delete functions are handled in Admin Dashboard components directly via Supabase.
}));
