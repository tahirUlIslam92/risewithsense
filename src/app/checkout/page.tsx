"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { useCart } from "@/hooks/useCart";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", phone: "", city: "", addr: "" });
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
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
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          total,
        }),
      });
      if (res.ok) {
        clearCart();
        router.push("/order-confirmation");
      } else {
        const d = await res.json();
        setError(d.error || "Failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
          <h1 className="text-xl font-bold">No items to checkout</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 pt-20 pb-24 md:pt-28">
        <h1 className="text-xl font-bold mb-6">Checkout</h1>
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>}

          <input
            required
            placeholder="Full Name"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            className="w-full px-4 py-3.5 bg-white border border-[#EEE] rounded-2xl text-sm outline-none focus:border-[#8B7355]"
          />
          <input
            required
            type="tel"
            placeholder="03XXXXXXXXX"
            value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value })}
            className="w-full px-4 py-3.5 bg-white border border-[#EEE] rounded-2xl text-sm outline-none focus:border-[#8B7355]"
          />
          <select
            required
            value={f.city}
            onChange={(e) => setF({ ...f, city: e.target.value })}
            className="w-full px-4 py-3.5 bg-white border border-[#EEE] rounded-2xl text-sm outline-none focus:border-[#8B7355]"
          >
            <option value="">Select City</option>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <textarea
            required
            rows={3}
            placeholder="Full Address"
            value={f.addr}
            onChange={(e) => setF({ ...f, addr: e.target.value })}
            className="w-full px-4 py-3.5 bg-white border border-[#EEE] rounded-2xl text-sm outline-none resize-none focus:border-[#8B7355]"
          />

          <div className="bg-white rounded-2xl p-5 border border-[#EEE] space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#999]">Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#999]">Shipping</span>
              <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : `Rs. ${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-[#EEE]">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-full font-medium hover:bg-[#8B7355] transition-colors disabled:opacity-50"
          >
            {loading ? "Placing Order..." : `Place Order — Rs. ${total.toLocaleString()}`}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
