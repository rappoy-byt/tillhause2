import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Sesuaikan path import supabase Anda

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/admin');
        } catch (err) {
            console.error('Login error:', err);
            setErrorMsg('Email atau password salah. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1320] flex flex-col justify-center items-center p-4 relative font-sans">

            {/* Tombol Kembali di Pojok Kiri Atas */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                <span>Kembali ke Menu Utama</span>
            </Link>

            {/* Card Login Admin */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Login Admin Cafe</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Masuk untuk mengelola pesanan & menu
                    </p>
                </div>

                {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="admin@tilehause.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0d1527] hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md mt-2 disabled:opacity-50"
                    >
                        {loading ? 'Memproses...' : 'Masuk Dashboard'}
                    </button>
                </form>

                {/* Tombol Kembali di Bawah Form */}
                <div className="text-center pt-2 border-t border-slate-100">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        <span>Kembali ke Halaman Utama</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}