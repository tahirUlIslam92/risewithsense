"use client";

import { useState } from "react";
import { adminLogin } from "@/lib/supabase/admin";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await adminLogin(password);
    
    if (result.success) {
      window.location.replace("/admin");
    } else {
      setError(result.error || "Invalid password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#8B7355]" />
          </div>
          <h1 className="text-2xl font-bold">Rise Admin</h1>
          <p className="text-sm text-[#999] mt-1">Enter password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[#EEE] shadow-sm space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>}
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 border border-[#EEE] rounded-xl text-sm outline-none focus:border-[#8B7355]" required autoFocus />
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-xl hover:bg-[#8B7355] transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}