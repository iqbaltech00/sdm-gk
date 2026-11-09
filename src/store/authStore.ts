import { create } from 'zustand';

type Role = 'admin_bagian' | 'asman_bagian' | 'manager_bagian' | 'asman_sdm' | 'admin_sdm' | 'manager_keuangan' | 'gm';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null; // Nanti diganti dengan User Supabase
  role: Role;
  username: string;
  login: (role: Role, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  role: 'asman_sdm', // Default sesuai HTML
  username: '',
  
  login: (role, username) => set({ isAuthenticated: true, role, username, user: { id: 'simulated-uuid' } }),
  logout: () => set({ isAuthenticated: false, user: null, username: '' })
}));