"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createBrowserClient } from "@/infrastructure/supabase/client.browser";
import { Session, User } from "@supabase/supabase-js";

interface SupabaseContextType {
  supabase: ReturnType<typeof createBrowserClient> | null;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

interface SupabaseProviderProps {
  children: ReactNode;
  initialSession?: Session | null;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserClient> | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only create browser client on client side
    const client = createBrowserClient();
    setSupabase(client);

    // Get initial session
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setSession(null);
    }
  };

  const refreshSession = async () => {
    if (supabase) {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      setSession(newSession);
    }
  };

  const value: SupabaseContextType = {
    supabase,
    session,
    user: session?.user || null,
    isLoading,
    isAuthenticated: !!session,
    signOut,
    refreshSession,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase(): SupabaseContextType {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}

export function useAuth() {
  const { user, session, isAuthenticated, isLoading, signOut } = useSupabase();
  return { user, session, isAuthenticated, isLoading, signOut };
}