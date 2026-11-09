import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type Role = 'admin_bagian' | 'asman_bagian' | 'manager_bagian' | 'asman_sdm' | 'admin_sdm' | 'manager_keuangan' | 'gm';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  role: Role;
  username: string;
  isLoading: boolean;
  login: (usernameOrEmail: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  role: 'asman_sdm', // Default fallback
  username: '',
  isLoading: true,

  initializeAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || 'asman_sdm';
        const username = session.user.user_metadata?.username || session.user.email || '';
        set({ isAuthenticated: true, user: session.user, role: userRole, username, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error("Gagal menginisialisasi sesi auth:", err);
      set({ isLoading: false });
    }
  },

  login: async (usernameOrEmail, password) => {
    try {
      // Jika input tidak mengandung '@', petakan ke format email internal SGN
      let email = usernameOrEmail;
      if (!email.includes('@')) {
        email = `${usernameOrEmail.toLowerCase()}@sgn.co.id`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userRole = data.user.user_metadata?.role || 'asman_sdm';
        const username = data.user.user_metadata?.username || usernameOrEmail;
        set({ isAuthenticated: true, user: data.user, role: userRole, username });
        return { success: true };
      }
      return { success: false, error: 'Autentikasi gagal: Pengguna tidak ditemukan.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Username atau password salah.' };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, username: '' });
  },
}));