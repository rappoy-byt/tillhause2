import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to prevent crash if .env is missing/empty
let supabase = null;
export let isSupabaseConfigured = false;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseConfigured = true;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
} else {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file. The app will run in fallback mode.');
  // Create a mock client that resolves promises safely if needed, or simply let `supabase` be null
  // In our components, we should check `if (isSupabaseConfigured)` or `if (supabase)` before calling db.
}

export { supabase };
