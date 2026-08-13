import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Utensils,
  Receipt,
  BarChart3,
  LogOut,
  Menu as MenuIcon,
  X,
  ArrowLeft,
  QrCode
} from 'lucide-react';

import AdminOverview from './admin/AdminOverview';
import AdminLiveOrders from './admin/AdminLiveOrders';
import AdminMenuManager from './admin/AdminMenuManager';
import AdminReports from './admin/AdminReports';
import AdminTableQR from './admin/AdminTableQR';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import { logoutAdmin } from '../lib/api';

export default function AdminDashboard({ onBackToApp }) {
  // Active Main Tab: 'overview' | 'orders' | 'menu' | 'reports'
  const [activeTab, setActiveTab] = useState('overview');

  // Mobile Nav Drawer Toggle
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Handle Logout via Supabase
  const handleLogout = async () => {
    try {
      await logoutAdmin();
      // Optional: Refresh atau arahkan kembali ke tampilan awal jika perlu
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: Receipt },
    { id: 'menu', label: 'Menu & Kategori', icon: Utensils },
    { id: 'reports', label: 'Laporan Penjualan', icon: BarChart3 },
    { id: 'qr', label: 'QR Meja', icon: QrCode },
  ];

  // Seluruh tampilan Sidebar dan Konten dibungkus oleh AdminProtectedRoute
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row selection:bg-zinc-800 selection:text-white w-full">

        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex w-64 shrink-0 bg-zinc-900/90 border-r border-zinc-800/80 flex-col justify-between p-5 sticky top-0 h-screen z-20 backdrop-blur-md">
          <div className="space-y-6">
            {/* Brand Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white text-zinc-950 rounded-xl flex items-center justify-center font-black text-sm shadow-md">
                  TH
                </div>
                <div>
                  <h1 className="font-black text-sm text-white tracking-wider uppercase font-display leading-none">
                    Tile Hause
                  </h1>
                  <span className="text-[10px] text-zinc-400 font-mono">Admin 👤</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-extrabold text-xs transition-all ${activeTab === item.id
                      ? 'bg-white text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* System Status & Logout */}
          <div className="space-y-3 border-t border-zinc-800/80 pt-4">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={onBackToApp}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors border border-zinc-700/50"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> App Client
              </button>

              <button
                onClick={handleLogout}
                className="p-2 bg-zinc-800 hover:bg-rose-950/80 hover:text-rose-400 text-zinc-400 rounded-xl text-xs font-bold transition-colors border border-zinc-700/50"
                title="Keluar Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE TOP HEADER BAR */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden sticky top-0 z-30 bg-zinc-900/95 border-b border-zinc-800 px-4 py-3 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button onClick={onBackToApp} className="p-2 bg-zinc-800 rounded-xl text-zinc-300">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="font-black text-xs text-white uppercase tracking-wider">Tile Hause Admin</h1>
              </div>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 bg-zinc-800 text-white rounded-xl"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </header>

          {/* Mobile Drawer Navigation */}
          <AnimatePresence>
            {isMobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-3 space-y-2 text-xs font-bold"
              >
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileNavOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl ${activeTab === item.id ? 'bg-white text-zinc-950 font-black' : 'text-zinc-300'
                      }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="h-px bg-zinc-800 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2.5 text-rose-400 font-bold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari Admin
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'orders' && <AdminLiveOrders />}
            {activeTab === 'menu' && <AdminMenuManager />}
            {activeTab === 'reports' && <AdminReports />}
            {activeTab === 'qr' && <AdminTableQR />}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}