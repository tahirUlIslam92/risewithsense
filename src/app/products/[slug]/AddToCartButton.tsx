"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCartStore";
import { useState } from "react";
import { Check } from "lucide-react";

export function AddToCartButton({ product }: { product: any }) {
  const { user, signInWithGoogle } = useAuth();
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    setLoading(true);
    await addItem(product.id);
    setLoading(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={product.stock_qty === 0 || loading}
      className={`w-full mt-6 py-4 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-500 flex items-center justify-center gap-2 ${
        added ? "bg-emerald-500 text-white" : "bg-[#1A1A1A] text-white hover:bg-[#8B7355]"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {added && <Check className="w-4 h-4" strokeWidth={2.5} />}
      {loading ? "Adding..." : added ? "Added to Cart" : product.stock_qty > 0 ? `Add to Cart — Rs. ${Number(product.price).toLocaleString()}` : "Out of Stock"}
    </button>
  );
}