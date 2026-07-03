"use client";

import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { BottomNav } from "@/components/shop/BottomNav";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[#8B7355]/30" strokeWidth={1} />
          <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#8B7355] transition-colors"
          >
            Continue Shopping
          </Link>
        </main>
        <BottomNav />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-16">
        <h1 className="text-xl font-bold mb-6">Shopping Cart ({totalItems} items)</h1>

        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-4 bg-white rounded-2xl border border-[#EEE]">
              <div className="w-16 h-16 bg-[#F8F5F0] rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-[#8B7355]/40" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase text-[#8B7355] font-semibold">{item.brand}</p>
                <Link href={`/products/${item.slug}`} className="text-sm font-medium hover:text-[#8B7355]">
                  {item.name}
                </Link>
                <p className="text-sm font-bold mt-0.5">Rs. {item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-[#EEE] flex items-center justify-center hover:border-[#8B7355]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" strokeWidth={2} />
                  </button>
                  <span className="text-sm w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-[#EEE] flex items-center justify-center hover:border-[#8B7355]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto flex items-center gap-1 text-xs text-red-500 uppercase"
                  >
                    <X className="w-3 h-3" strokeWidth={2} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EEE] space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#999]">Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#999]">Shipping</span>
            <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : `Rs. ${shipping}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#EEE]">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="block w-full mt-4 py-4 bg-[#1A1A1A] text-white text-center text-xs uppercase tracking-wider rounded-full font-medium hover:bg-[#8B7355] transition-colors"
        >
          Proceed to Checkout
        </Link>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
