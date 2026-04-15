import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase env vars. URL: ${supabaseUrl ? "ok" : "MISSING"}, KEY: ${supabaseKey ? "ok" : "MISSING"}`
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}