/**
 * Supabase client configuration and utilities
 * Re-exports browser client only (use server.ts directly for server-side)
 */

export { createClient } from "./browser";
export type { Database } from "./browser";
