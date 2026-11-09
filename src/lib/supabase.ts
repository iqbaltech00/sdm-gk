import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Peringatan: Variabel VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur di file .env Anda.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);