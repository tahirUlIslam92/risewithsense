import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { Database } from "@/shared/types/database.types";

/**
 * Supabase Browser Client
 * 
 * Used ONLY in Client Components.
 * Uses ANON key only - all operations go through RLS.
 * 
 * Security:
 * - ANON key is safe to expose (it's in NEXT_PUBLIC_)
 * - RLS enforces all access rules
 * - Cannot perform admin operations
 * 
 * Use this in:
 * - "use client" components
 * - Client-side hooks
 * - Realtime subscriptions
 */

export function createBrowserClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Singleton browser client
 * 
 * Reuses the same client instance across components.
 * Supabase client is lightweight and can be shared.
 */

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function getBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("Browser client cannot be used on server");
  }

  if (!browserClient) {
    browserClient = createBrowserClient();
  }

  return browserClient;
}