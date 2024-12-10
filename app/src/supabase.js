import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_APP_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_APIKEY;

export const supabase = createClient(supabaseUrl, supabaseKey,{
  persistSession:true,
  localStorage:sessionStorage,
});
