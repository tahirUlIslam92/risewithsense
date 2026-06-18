"use client";

import Link from "next/link";

interface ProductCardProps {
  product: { id: string; name: string; slug: string; brand: string; price: number; primaryImage: string | null; isInStock: boolean; featured: boolean };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] border border-[#2A2520] aspect-[3/4] mb-4 group-hover:border-[#D4A574]/30 transition-all duration-500">
        {product.primaryImage ? (
          <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" loading={priority ? "eager" : "lazy"} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-[#2A2520]" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && <span className="px-2.5 py-1 bg-gradient-to-r from-[#B8860B] to-[#D4A574] text-[#0F0F0F] text-[10px] font-bold rounded-full">Featured</span>}
          {!product.isInStock && <span className="px-2.5 py-1 bg-red-500/90 text-white text-[10px] font-bold rounded-full">Sold Out</span>}
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold mb-1">{product.brand}</p>
      <h3 className="text-sm font-semibold text-[#F5F0EB] group-hover:text-[#D4A574] transition-colors line-clamp-1">{product.name}</h3>
      <p className="text-lg font-bold text-[#F5F0EB] mt-1.5">Rs. {product.price.toLocaleString()}</p>
      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-400 font-medium">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        COD Available
      </div>
    </Link>
  );
}