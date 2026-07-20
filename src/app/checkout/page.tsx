"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCartStore";
import { User, Phone, MapPin, Home, CreditCard, ArrowRight, Check } from "lucide-react";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan"];

function CheckoutSkeleton() {
  return (
    <main className="max-w-lg mx-auto px-4 pt-20 pb-24 md:pt-28">
      <div className="animate-pulse space-y-5">
        <div className="h-8 bg-[#E8E4DF] rounded-xl w-1/3" />
        <div className="h-14 bg-[#E8E4DF] rounded-2xl" />
        <div className="h-14 bg-[#E8E4DF] rounded-2xl" />
        <div className="h-14 bg-[#E8E4DF] rounded-2xl" />
        <div className="h-28 bg-[#E8E4DF] rounded-2xl" />
        <div className="h-40 bg-[#E8E4DF] rounded-2xl" />
        <div className="h-14 bg-[#E8E4DF] rounded-full" />
      </div>
    </main>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
  const { items, setUserId, fetchFromDB, clearCart, getSubtotal } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", phone: "", city: "", addr: "" });

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setLoading(true);
      fetchFromDB().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: f.name,
          customerPhone: f.phone,
          customerCity: f.city,
          customerAddr: f.addr,
          items: items.map((i) => ({ productId: i.product_id, quantity: i.quantity })),
          total,
        }),
      });

      if (res.ok) {
        clearCart();
        setSuccess(true);
        setTimeout(() => router.push("/order-confirmation"), 1000);
      } else {
        const d = await res.json();
        setError(d.error || "Failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setPlacing(false);
    }
  };

  if (!user) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-28 pb-20 text-center">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-[#1A1A1A]/5">
          <CreditCard className="w-12 h-12 text-[#8B7355]/40 mx-auto mb-4" strokeWidth={1} />
          <h1 className="text-xl font-bold mb-2">Sign in to Checkout</h1>
          <p className="text-sm text-[#999] mb-6">Please sign in to continue.</p>
          <button onClick={signInWithGoogle} className="w-full py-4 bg-[#1A1A1A] text-white text-sm font-medium rounded-2xl hover:bg-[#8B7355] transition-all duration-300 active:scale-[0.98]">
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  if (loading) return <CheckoutSkeleton />;

  if (items.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-28 pb-20 text-center">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-[#1A1A1A]/5">
          <h1 className="text-xl font-bold mb-2">No items to checkout</h1>
          <p className="text-sm text-[#999]">Add products to your cart first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 pt-20 pb-24 md:pt-28">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8 tracking-tight">Checkout</h1>

      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl">{error}</div>
        )}

        {/* Contact */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-[#1A1A1A]/5 space-y-4">
          <p className="text-xs font-semibold text-[#8B7355] uppercase tracking-[0.2em]">Contact</p>
          
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CCC] group-focus-within:text-[#8B7355] transition-colors" strokeWidth={1.5} />
            <input required placeholder="Full Name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-[#F8F5F0] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:bg-white transition-all" />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CCC] group-focus-within:text-[#8B7355] transition-colors" strokeWidth={1.5} />
            <input required type="tel" placeholder="03XXXXXXXXX" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-[#F8F5F0] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:bg-white transition-all" />
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-[#1A1A1A]/5 space-y-4">
          <p className="text-xs font-semibold text-[#8B7355] uppercase tracking-[0.2em]">Shipping</p>

          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CCC] group-focus-within:text-[#8B7355] transition-colors" strokeWidth={1.5} />
            <select required value={f.city} onChange={e => setF({ ...f, city: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-[#F8F5F0] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:bg-white transition-all appearance-none">
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative group">
            <Home className="absolute left-4 top-4 w-4 h-4 text-[#CCC] group-focus-within:text-[#8B7355] transition-colors" strokeWidth={1.5} />
            <textarea required rows={3} placeholder="Full Address" value={f.addr} onChange={e => setF({ ...f, addr: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-[#F8F5F0] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:bg-white transition-all resize-none" />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-[#1A1A1A]/5 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-[#999]">Subtotal ({items.length} items)</span><span className="font-medium">Rs. {subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#999]">Shipping</span><span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `Rs. ${shipping}`}</span></div>
          <div className="flex justify-between font-bold text-base pt-3 border-t border-[#F0EDE8]"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={placing || success}
          className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${
            success ? "bg-emerald-500 text-white" : "bg-[#1A1A1A] text-white hover:bg-[#8B7355]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}>
          {success ? (
            <><Check className="w-5 h-5" strokeWidth={2.5} /> Order Placed!</>
          ) : placing ? (
            "Placing Order..."
          ) : (
            <>Place Order — Rs. {total.toLocaleString()} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Suspense fallback={<div className="h-14" />}><Navbar /></Suspense>
      <CheckoutForm />
      <Footer />
    </div>
  );
}