/**
 * Browser-side Supabase client
 * Use this in client components and hooks
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client during build - will work in runtime
    console.warn("Supabase credentials not configured yet");
    return createBrowserClient<Database>("https://placeholder.supabase.co", "placeholder-key");
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export type { Database };
