// Supabase client setup for database and authentication access
// Maintained by divyansh
// Uses environment variables for security and flexibility
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase project URL and public anon key from Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a typed Supabase client for use throughout the app
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage, // Store session in browser localStorage
    persistSession: true,  // Keep user logged in after refresh
    autoRefreshToken: true, // Automatically refresh session tokens
  }
});