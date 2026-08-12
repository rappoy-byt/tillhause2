import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { loginAdmin, logoutAdmin } from '../../lib/api';

// --- A. Component Form Login Admin ---
function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginAdmin(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Email atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      {/* Tombol Kembali di Pojok Kiri Atas */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-700 transition"
      >
        ← Kembali ke Menu Utama
      </a>

      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-black text-slate-900 mb-1">Login Admin Cafe</h2>
        <p className="text-xs text-slate-500 mb-6">Masuk untuk mengelola pesanan & menu</p>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-semibold mb-4 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tilehause.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>

        {/* Tombol Kembali di Bawah Form */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            ← Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </div>
  );
}

// --- B. Component Protected Route & Layout Admin ---
export default function AdminProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Auth check error:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listener otomatis jika status login berubah
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-slate-400 text-sm">
        Memeriksa hak akses admin...
      </div>
    );
  }

  // Jika belum login, tampilkan form AdminLogin
  if (!user) {
    return <AdminLogin onLoginSuccess={checkAuth} />;
  }

  // Jika sudah login, tampilkan Dashboard Admin dengan Bar Navigation Top
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Bar Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="font-extrabold text-lg text-white">TileHause Admin</h1>
          <p className="text-xs text-slate-400">Logged in as: {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </header>

      {/* Konten Utama Admin */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}