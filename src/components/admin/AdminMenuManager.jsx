import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Search, CheckCircle2, Ban } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';

export default function AdminMenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsSoldOut, setFormIsSoldOut] = useState(false);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catFormName, setCatFormName] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: cats, error: errCat } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (errCat) throw errCat;
      setCategories(cats || []);

      // Fetch menu items
      const { data: items, error: errItem } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('name', { ascending: true });
      if (errItem) throw errItem;
      setMenuItems(items || []);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategoryId(categories.length > 0 ? categories[0].id : '');
    setFormPrice('');
    setFormDescription('');
    setFormImageUrl('');
    setFormIsSoldOut(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormName(item.name || '');
    setFormCategoryId(item.category_id || '');
    setFormPrice(item.price ? item.price.toString() : '');
    setFormDescription(item.description || '');
    setFormImageUrl(item.image_url || '');
    setFormIsSoldOut(item.is_sold_out || false);
    setIsModalOpen(true);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;

    const payload = {
      name: formName,
      category_id: formCategoryId,
      price: Number(formPrice),
      description: formDescription,
      image_url: formImageUrl,
      is_sold_out: formIsSoldOut
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([payload]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Save error:', err);
      alert('Gagal menyimpan data');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('categories').insert([{ name: catFormName }]);
      if (error) throw error;
      setIsCatModalOpen(false);
      fetchData(); // Refresh list to get new category
    } catch (err) {
      console.error('Save category error:', err);
      alert('Gagal menambah kategori');
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleSoldOut = async (item) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_sold_out: !item.is_sold_out })
        .eq('id', item.id);
      if (error) throw error;
      
      // Update local state for immediate feedback
      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, is_sold_out: !m.is_sold_out } : m));
    } catch (err) {
      console.error('Toggle sold out error:', err);
    }
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 text-center text-zinc-500">
        Supabase belum dikonfigurasi.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wide font-display">
            Manajemen Menu
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Atur daftar menu, update harga, dan kelola stok.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCatFormName(''); setIsCatModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Kategori</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 font-black px-4 py-3 rounded-2xl text-xs shadow-lg transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Menu Baru</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama menu..."
          className="w-full bg-zinc-900 text-white text-xs rounded-xl pl-10 pr-4 py-3 outline-none border border-zinc-800 focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-zinc-400 text-[11px] font-mono uppercase tracking-wider border-b border-zinc-800">
                <th className="py-3 px-4">Menu</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-zinc-500">Memuat...</td></tr>
              ) : filteredMenu.length > 0 ? (
                filteredMenu.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3 px-4 text-zinc-400">{item.categories?.name || '-'}</td>
                    <td className="py-3 px-4 font-mono text-zinc-300">{formatIDR(item.price)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleSoldOut(item)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 w-fit ${
                          item.is_sold_out
                            ? 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                            : 'bg-emerald-950/30 text-emerald-400 border-emerald-800/60'
                        }`}
                      >
                        {item.is_sold_out ? (
                          <><Ban className="w-3 h-3" /> Sold Out</>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3" /> Tersedia</>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteMenu(item.id)} className="p-1.5 bg-zinc-800 hover:bg-rose-950 text-rose-400 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="py-8 text-center text-zinc-500">Tidak ada data menu.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="font-black text-white">{editingItem ? 'Edit Menu' : 'Tambah Menu'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveMenu} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Nama Menu</label>
                <input required type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Kategori</label>
                  <select required value={formCategoryId} onChange={e => setFormCategoryId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none">
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Harga (Rp)</label>
                  <input required type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl text-xs">Batal</button>
                <button type="submit" className="flex-1 bg-white text-zinc-950 font-black py-3 rounded-xl text-xs">Simpan Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="font-black text-white">Tambah Kategori</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Nama Kategori</label>
                <input required type="text" value={catFormName} onChange={e => setCatFormName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none" placeholder="Contoh: Coffee" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl text-xs">Batal</button>
                <button type="submit" className="flex-1 bg-white text-zinc-950 font-black py-3 rounded-xl text-xs">Simpan Kategori</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
