import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/shared/types/database.types";

/**
 * Supabase Middleware Client
 * 
 * Used ONLY in Next.js middleware.ts.
 * Refreshes the session on every request.
 * 
 * Flow:
 * 1. Request comes in
 * 2. Middleware creates server client
 * 3. getSession() refreshes expired tokens
 * 4. Session is set in response cookies
 * 5. Request continues to page/API
 */

export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
}