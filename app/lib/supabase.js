import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabaseClient() {
  if (_supabase) return _supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
    _supabase = createClient(supabaseUrl, supabaseKey)
  }
  return _supabase
}

// Legacy named export — use getSupabaseClient() in server components
export const supabase = null
