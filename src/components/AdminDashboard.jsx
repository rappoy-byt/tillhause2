import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  QrCode,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ArrowLeft,
  AlertCircle,
  Lock,
  Wifi,
  WifiOff,
  Layers,
  CheckCircle2,
  Ban,
  Upload,
  Image as ImageIcon,
  FolderOpen
} from 'lucide-react';
import { useMenuStore } from '../store/useMenuStore';
import AdminQrPage from './AdminQrPage';

const MANAGEMENT_GALLERY = [
  { id: 'g-1', name: 'Milky Coffee', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-2', name: 'Caramel Macchiato', url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-3', name: 'Espresso Double Shot', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-4', name: 'Sandwich Toast', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-5', name: 'French Fries / Munchies', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-6', name: 'Dessert Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-7', name: 'Fresh Iced Mocktail', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' }
];

export default function AdminDashboard({ onBackToApp }) {
  // PIN Security
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('tilehause_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab: 'menu' | 'qr' | 'orders'
  const [activeTab, setActiveTab] = useState('menu');

  // Menu Store
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, toggleSoldOut, isFirebaseActive, initRealtimeMenu } = useMenuStore();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if adding new item

  // Form Input States
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('hot-beverages');
  const [formPrice, setFormPrice] = useState('');
  const [formImage, setFormImage] = useState('');
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'gallery' | 'url'
  const [formDescription, setFormDescription] = useState('');
  const [formBadges, setFormBadges] = useState('');
  const [formIsSoldOut, setFormIsSoldOut] = useState(false);
  const [formError, setFormError] = useState('');

  // Handle Local Device File Upload (Galeri HP / Laptop)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Ukuran file foto terlalu besar (Maksimal 5MB)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormImage(reader.result);
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  // Confirm Delete State
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    initRealtimeMenu();
  }, [initRealtimeMenu]);

  // Handle PIN Login
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('tilehause_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('PIN Salah! (Default: 1234)');
    }
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('hot-beverages');
    setFormPrice('');
    setFormImage('');
    setFormDescription('');
    setFormBadges('');
    setFormIsSoldOut(false);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormName(item.name || '');
    setFormCategory(item.category || 'hot-beverages');
    setFormPrice(item.price ? item.price.toString() : '');
    setFormImage(item.image || '');
    setFormDescription(item.description || '');
    setFormBadges(item.badges ? item.badges.join(', ') : '');
    setFormIsSoldOut(Boolean(item.isSoldOut));
    setFormError('');
    setIsModalOpen(true);
  };

  // Save Menu Item (Add or Edit)
  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Nama menu wajib diisi!');
      return;
    }
    if (!formPrice || Number(formPrice) <= 0) {
      setFormError('Harga menu wajib diisi!');
      return;
    }

    const badgeArray = formBadges
      .split(',')
      .map(b => b.trim().toUpperCase())
      .filter(Boolean);

    const payload = {
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
      description: formDescription.trim(),
      badges: badgeArray,
      isSoldOut: formIsSoldOut
    };

    const isEditMode = Boolean(editingItem);

    if (isEditMode) {
      await updateMenuItem(editingItem.id, payload);
    } else {
      await addMenuItem(payload);
    }

    setIsModalOpen(false);
  };

  // Delete Action
  const handleDeleteConfirm = async (id) => {
    await deleteMenuItem(id);
    setDeletingId(null);
  };

  // Toggle Sold Out Action
  const handleToggleSoldOut = async (item) => {
    await toggleSoldOut(item.id);
  };

  // Filtered Menu
  const filteredMenu = menuItems.filter(item => {
    const matchesCat = selectedCat === 'all' || item.category === selectedCat;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Calculate Metrics
  const totalMenuCount = menuItems.length;
  const activeMenuCount = menuItems.filter(m => !m.isSoldOut).length;
  const soldOutCount = menuItems.filter(m => m.isSoldOut).length;

  // Render PIN Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800 border border-slate-700 w-full max-w-md p-6 rounded-3xl text-white shadow-2xl text-center space-y-5"
        >
          <div className="w-16 h-16 bg-slate-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-xl font-black uppercase tracking-wider">Akses Dashboard Admin</h2>
            <p className="text-xs text-slate-400 mt-1">Masukkan PIN Admin Tile Hause untuk melanjutkan</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN (Default: 1234)"
                className="w-full bg-slate-900 border border-slate-700 text-center font-mono font-black text-lg py-3 rounded-2xl outline-none focus:border-slate-400 tracking-widest text-slate-100"
                autoFocus
              />
              {pinError && (
                <p className="text-xs font-bold text-rose-500 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {pinError}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBackToApp}
                className="w-1/2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Kembali ke App
              </button>
              <button
                type="submit"
                className="w-1/2 bg-slate-700 hover:bg-slate-600 text-white font-black py-3 rounded-xl text-xs shadow-md transition-colors"
              >
                Masuk Admin
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-slate-800 selection:text-white">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
              title="Kembali ke App Pelanggan"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-wide uppercase">
                  Tile Hause <span className="text-slate-400">Admin Panel</span>
                </h1>
                {isFirebaseActive ? (
                  <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Cloud Live Sync
                  </span>
                ) : (
                  <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Local Mode Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Kelola Menu, Stok, QR Standee Meja & Pesanan Masuk</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700/60 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${activeTab === 'menu'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Manajemen Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${activeTab === 'qr'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Standee QR Meja</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* TAB 1: MANAJEMEN MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Menu</p>
                  <h3 className="text-2xl font-black text-white mt-1">{totalMenuCount}</h3>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-300">
                  <Utensils className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Menu Aktif</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{activeMenuCount}</h3>
                </div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Sold Out (Habis)</p>
                  <h3 className="text-2xl font-black text-rose-400 mt-1">{soldOutCount}</h3>
                </div>
                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
                  <Ban className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Kategori</p>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">{categories.length}</h3>
                </div>
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Action Bar (Search, Category Filter, Add Button) */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama menu atau deskripsi..."
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#FF5500]"
                  />
                </div>

                {/* Filter Category */}
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 py-2.5 px-3 rounded-xl outline-none focus:border-[#FF5500]"
                >
                  <option value="all">Semua Kategori ({menuItems.length})</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} ({menuItems.filter(m => m.category === cat.id).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add New Menu Button */}
              <button
                onClick={handleOpenAddModal}
                className="bg-slate-700 hover:bg-slate-600 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tambah Menu Baru</span>
              </button>
            </div>

            {/* Menu Items Table Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Item Menu</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Harga</th>
                      <th className="py-3.5 px-4">Badge Promo</th>
                      <th className="py-3.5 px-4 text-center">Status Stok</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredMenu.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                          Tidak ada menu ditemukan. Silakan tambah menu baru!
                        </td>
                      </tr>
                    ) : (
                      filteredMenu.map(item => {
                        const catObj = categories.find(c => c.id === item.category);
                        return (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                            {/* Product Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                                />
                                <div>
                                  <h4 className="font-extrabold text-white text-xs">{item.name}</h4>
                                  <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{item.description}</p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4">
                              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                                {catObj?.label || item.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4 font-black text-white">
                              {formatIDR(item.price)}
                            </td>

                            {/* Badges */}
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {item.badges && item.badges.length > 0 ? (
                                  item.badges.map((b, idx) => (
                                    <span key={idx} className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                      {b}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-600">-</span>
                                )}
                              </div>
                            </td>

                            {/* Sold Out Switch */}
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleSoldOut(item)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all flex items-center justify-center gap-1 mx-auto ${item.isSoldOut
                                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30'
                                  : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
                                  }`}
                              >
                                {item.isSoldOut ? (
                                  <>
                                    <Ban className="w-3 h-3" />
                                    <span>SOLD OUT</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>TERSEDIA</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(item)}
                                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
                                  title="Edit Menu"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingId(item.id)}
                                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors"
                                  title="Hapus Menu"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STANDEE QR MEJA */}
        {activeTab === 'qr' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl">
            <AdminQrPage onBackToApp={() => setActiveTab('menu')} />
          </div>
        )}
      </main>

      {/* MODAL FORM: TAMBAH / EDIT MENU */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-slate-100 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-slate-400" />
                  <span>{editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSaveMenu} className="p-5 space-y-4 overflow-y-auto flex-1">
                {formError && (
                  <div className="bg-rose-500/10 border border-rose-500/40 text-rose-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Nama Menu */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nama Menu *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Milky Way Coffee"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-slate-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Kategori */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Kategori *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-2.5 outline-none focus:border-slate-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Harga */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Harga (IDR) *</label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="Contoh: 25000"
                      className="w-full bg-slate-800 border border-slate-700 text-xs text-white font-bold rounded-xl px-3 py-2.5 outline-none focus:border-slate-500"
                      required
                    />
                  </div>
                </div>

                {/* Multi-mode Image Selection (Upload Device / Galeri Management / URL) */}
                <div className="space-y-2 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-slate-400" /> Gambar Menu
                    </label>
                    <span className="text-[10px] text-slate-400">Galeri / Upload / URL</span>
                  </div>

                  {/* Mode Tab Switcher */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${imageTab === 'upload' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Upload Galeri
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('gallery')}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${imageTab === 'gallery' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Pilih Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${imageTab === 'url' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Link URL
                    </button>
                  </div>

                  {/* 1. Upload Device Mode */}
                  {imageTab === 'upload' && (
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        id="admin-menu-file-input"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="admin-menu-file-input"
                        className="w-full bg-slate-800 hover:bg-slate-700/80 border-2 border-dashed border-slate-600 hover:border-slate-500 p-3.5 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center"
                      >
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-200">Pilih Foto dari Galeri HP / Perangkat</span>
                        <span className="text-[9px] text-slate-400">Klik di sini untuk membuka galeri perangkat (Maks 5MB)</span>
                      </label>
                    </div>
                  )}

                  {/* 2. Management Gallery Presets */}
                  {imageTab === 'gallery' && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-medium">Pilih dari Galeri Management Café:</p>
                      <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 no-scrollbar">
                        {MANAGEMENT_GALLERY.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setFormImage(g.url)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${formImage === g.url ? 'border-slate-500 ring-2 ring-slate-500/40 scale-95' : 'border-slate-700 hover:border-slate-500'
                              }`}
                            title={g.name}
                          >
                            <img src={g.url} alt={g.name} className="w-full h-full object-cover" />
                            {formImage === g.url && (
                              <div className="absolute inset-0 bg-slate-500/40 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white stroke-[3]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. URL Link Mode */}
                  {imageTab === 'url' && (
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-slate-500"
                    />
                  )}

                  {/* Preview Selected Image */}
                  {formImage && (
                    <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-700 mt-2">
                      <img src={formImage} alt="Preview Foto Menu" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        className="absolute top-2 right-2 bg-rose-600/90 text-white px-2 py-1 rounded-lg text-[10px] font-extrabold shadow-md hover:bg-rose-700 transition-colors"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  )}
                </div>

                {/* Deskripsi */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Contoh: Susu creamy spesial racikan CEO dengan rasa lembut manis..."
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-slate-500"
                  />
                </div>

                {/* Badge Promo */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Badge (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={formBadges}
                    onChange={(e) => setFormBadges(e.target.value)}
                    placeholder="Contoh: BEST SELLER, CEO FAVORITE, HOT"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-slate-500"
                  />
                </div>

                {/* Status Toggle Sold Out */}
                <div className="bg-slate-800 border border-slate-700/80 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">Status Menu Sold Out (Habis)</h5>
                    <p className="text-[10px] text-slate-400">Jika diaktifkan, pelanggan tidak dapat memesan menu ini.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormIsSoldOut(!formIsSoldOut)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${formIsSoldOut ? 'bg-rose-500' : 'bg-slate-600'
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${formIsSoldOut ? 'translate-x-6' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-slate-700 hover:bg-slate-600 text-white font-black py-3 rounded-xl text-xs shadow-md transition-all active:scale-95"
                  >
                    {editingItem ? 'Simpan Perubahan' : 'Tambah Menu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE MODAL */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/40">
                <Trash2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-black text-white">Hapus Menu Ini?</h3>
                <p className="text-xs text-slate-400 mt-1">Tindakan ini akan menghapus menu dari katalog secara permanen.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteConfirm(deletingId)}
                  className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 rounded-xl text-xs shadow-md"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
