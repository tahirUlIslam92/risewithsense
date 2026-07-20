"use client";

import { Suspense, useEffect, useState } from "react";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { BottomNav } from "@/components/shop/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { getCartItems, removeFromCart, updateCartQuantity } from "@/app/actions/cart";
import Link from "next/link";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";

function CartContent() {
  const { user, signInWithGoogle } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) return;
    const data = await getCartItems();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemove = async (productId: string) => {
    await removeFromCart(productId);
    setItems(prev => prev.filter(i => i.product_id !== productId));
  };

  const handleQuantity = async (productId: string, newQty: number) => {
    if (newQty < 1) return handleRemove(productId);
    await updateCartQuantity(productId, newQty);
    setItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: newQty } : i));
  };

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[#8B7355]/30" strokeWidth={1} />
        <h1 className="text-xl font-bold mb-4">Sign in to view your cart</h1>
        <p className="text-sm text-[#999] mb-6">Your cart syncs across all your devices.</p>
        <button onClick={signInWithGoogle} className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#8B7355] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </main>
    );
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center"><p className="text-[#999]">Loading cart...</p></main>;
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[#8B7355]/30" strokeWidth={1} />
        <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/products" className="inline-block px-8 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#8B7355] transition-colors">Continue Shopping</Link>
      </main>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.products.price) * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-16">
      <h1 className="text-xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 p-4 bg-white rounded-2xl border border-[#EEE]">
            <div className="w-16 h-16 bg-[#F8F5F0] rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6 text-[#8B7355]/40" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase text-[#8B7355] font-semibold">{item.products.brand}</p>
              <p className="text-sm font-medium">{item.products.name}</p>
              <p className="text-sm font-bold mt-0.5">Rs. {Number(item.products.price).toLocaleString()}</p>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => handleQuantity(item.product_id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-[#EEE] flex items-center justify-center hover:border-[#8B7355]">
                  <Minus className="w-3 h-3" strokeWidth={2} />
                </button>
                <span className="text-sm w-5 text-center">{item.quantity}</span>
                <button onClick={() => handleQuantity(item.product_id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-[#EEE] flex items-center justify-center hover:border-[#8B7355]">
                  <Plus className="w-3 h-3" strokeWidth={2} />
                </button>
                <button onClick={() => handleRemove(item.product_id)} className="ml-auto flex items-center gap-1 text-xs text-red-500 uppercase">
                  <X className="w-3 h-3" strokeWidth={2} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 border border-[#EEE] space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-[#999]">Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-[#999]">Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : `Rs. ${shipping}`}</span></div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#EEE]"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
      </div>
      <Link href="/checkout" className="block w-full mt-4 py-4 bg-[#1A1A1A] text-white text-center text-xs uppercase tracking-wider rounded-full font-medium hover:bg-[#8B7355] transition-colors">
        Proceed to Checkout
      </Link>
    </main>
  );
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Suspense fallback={<div className="pt-20 text-center">Loading...</div>}>
        <Navbar />
      </Suspense>
      <CartContent />
      <BottomNav />
      <Footer />
    </div>
  );
}