"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function GoogleSignInGate() {
  const { user, signInWithGoogle } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem("gate-dismissed");
    const timer = setTimeout(() => {
      if (!user && !hasDismissed) setShow(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  if (!show || user) return null;

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("gate-dismissed", "true");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#F8F5F0] rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-[#8B7355]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Welcome to Rise With Sense</h2>
        <p className="text-sm text-[#999] mb-6">Sign in to sync your cart across all devices.</p>
        <button onClick={signInWithGoogle} className="w-full py-4 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-[#8B7355] transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
        <button onClick={dismiss} className="mt-3 text-xs text-[#999] hover:text-[#666] transition-colors">Maybe later</button>
      </div>
    </div>
  );
}