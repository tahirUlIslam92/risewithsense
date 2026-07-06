"use client";

import { createBrowserClient } from "@/infrastructure/supabase/client.browser";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const isLocal = window.location.hostname === "localhost";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: isLocal
          ? "http://localhost:3000"
          : "https://risewithsense.vercel.app",
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, signInWithGoogle, signOut };
}