import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  loading: true,

  // 1. Cek sesi saat aplikasi pertama kali dimuat
  checkSession: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const user = session.user;
      // Ambil role dari user_metadata (default 'admin' jika metadata diset)
      const role = user.user_metadata?.role || 'admin';
      set({ user, role, loading: false });
    } else {
      set({ user: null, role: null, loading: false });
    }
  },

  // 2. Fungsi Login Admin
  loginAdmin: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false });
      throw new Error('Email atau password salah!');
    }

    const user = data.user;
    const role = user.user_metadata?.role || 'admin';

    // Validasi Role Admin
    if (role !== 'admin') {
      await supabase.auth.signOut();
      set({ user: null, role: null, loading: false });
      throw new Error('Akses ditolak: Akun Anda bukan Admin!');
    }

    set({ user, role, loading: false });
    return data;
  },

  // 3. Fungsi Logout
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null });
  },
}));