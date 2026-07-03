"use client";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { Check } from "lucide-react";

export function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      price: Number(product.price),
      image: product.images?.[0] || null,
      stock: product.stock_qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={product.stock_qty === 0}
      className={`w-full mt-6 py-4 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-500 flex items-center justify-center gap-2 ${
        added ? "bg-emerald-500 text-white" : "bg-[#1A1A1A] text-white hover:bg-[#8B7355]"
      } disabled:opacity-40`}
    >
      {added && <Check className="w-4 h-4" strokeWidth={2.5} />}
      {added
        ? "Added to Cart"
        : product.stock_qty > 0
        ? `Add to Cart — Rs. ${Number(product.price).toLocaleString()}`
        : "Out of Stock"}
    </button>
  );
}
