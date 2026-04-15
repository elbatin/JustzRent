import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function createClient() {
  // Server-only env vars (no NEXT_PUBLIC_ prefix — not exposed to browser)
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL

  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase env vars. URL: ${supabaseUrl ? "ok" : "MISSING"}, KEY: ${supabaseKey ? "ok" : "MISSING"}`
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}