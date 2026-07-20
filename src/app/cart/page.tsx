"use client";

import { Suspense, useEffect } from "react";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { BottomNav } from "@/components/shop/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCartStore";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";

function CartSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-3 p-4 bg-white rounded-2xl border border-[#EEE] animate-pulse">
          <div className="w-20 h-20 bg-[#E8E4DF] rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[#E8E4DF] rounded w-1/4" />
            <div className="h-4 bg-[#E8E4DF] rounded w-3/4" />
            <div className="h-3 bg-[#E8E4DF] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CartContent() {
  const { user, signInWithGoogle } = useAuth();
  const { items, loading, userId, setUserId, fetchFromDB, removeItem, updateQty, getSubtotal, getCount } = useCartStore();

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchFromDB();
    } else {
      setUserId(null);
    }
  }, [user]);

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[#8B7355]/30" strokeWidth={1} />
        <h1 className="text-xl font-bold mb-4">Sign in to view your cart</h1>
        <button onClick={signInWithGoogle} className="px-8 py-3 bg-[#1A1A1A] text-white text-sm font-medium rounded-2xl hover:bg-[#8B7355] transition-all active:scale-[0.98]">
          Sign in with Google
        </button>
      </main>
    );
  }

  if (loading && items.length === 0) {
    return <main className="max-w-3xl mx-auto px-4 pt-20 pb-24"><h1 className="text-xl font-bold mb-6">Shopping Cart</h1><CartSkeleton /></main>;
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[#8B7355]/30" strokeWidth={1} />
        <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/products" className="inline-block px-8 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-2xl hover:bg-[#8B7355] transition-all active:scale-[0.98]">Continue Shopping</Link>
      </main>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-16">
      <h1 className="text-xl font-bold mb-6">Shopping Cart ({getCount()} items)</h1>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#EEE] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-20 h-20 bg-[#F8F5F0] rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.products?.images?.[0] ? (
                <img src={item.products.images[0]} alt={item.products.name} className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag className="w-8 h-8 text-[#8B7355]/30" strokeWidth={1.5} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B7355] font-semibold">{item.products?.brand}</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">{item.products?.name}</p>
              <p className="text-sm font-bold mt-1">Rs. {Number(item.products?.price || 0).toLocaleString()}</p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 bg-[#F8F5F0] rounded-full p-0.5">
                  <button onClick={() => updateQty(item.product_id, item.quantity - 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all active:scale-90">
                    <Minus className="w-3.5 h-3.5 text-[#666]" strokeWidth={2} />
                  </button>
                  <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product_id, item.quantity + 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all active:scale-90">
                    <Plus className="w-3.5 h-3.5 text-[#666]" strokeWidth={2} />
                  </button>
                </div>

                <button onClick={() => removeItem(item.product_id)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50/50 border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 shadow-sm shadow-red-100/50 hover:shadow-md hover:shadow-red-200/50 transition-all duration-300 active:scale-95 group">
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-[#EEE] shadow-sm space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-[#999]">Subtotal</span><span className="font-medium">Rs. {subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-[#999]">Shipping</span><span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `Rs. ${shipping}`}</span></div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#EEE]"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
      </div>

      <Link href="/checkout" className="block w-full mt-4 py-4 bg-[#1A1A1A] text-white text-center text-xs uppercase tracking-wider rounded-2xl font-semibold hover:bg-[#8B7355] transition-all active:scale-[0.98] shadow-lg shadow-[#1A1A1A]/10">
        Proceed to Checkout
      </Link>
    </main>
  );
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Suspense fallback={<div className="pt-20 text-center">Loading...</div>}><Navbar /></Suspense>
      <CartContent />
      <BottomNav />
      <Footer />
    </div>
  );
}