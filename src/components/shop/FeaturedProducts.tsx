import { ProductCard } from "./ProductCard";
import Link from "next/link";

// This will be replaced with actual data fetching
const featuredProducts = [
  {
    id: "1",
    name: "Classic Chronograph",
    slug: "classic-chronograph",
    brand: "Rolex",
    price: 50000,
    primaryImage: null,
    isInStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Digital Pro",
    slug: "digital-pro",
    brand: "Casio",
    price: 15000,
    primaryImage: null,
    isInStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Smart Elite",
    slug: "smart-elite",
    brand: "Apple",
    price: 120000,
    primaryImage: null,
    isInStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Diver's Edition",
    slug: "divers-edition",
    brand: "Omega",
    price: 75000,
    primaryImage: null,
    isInStock: true,
    featured: false,
  },
];

export function FeaturedProducts() {
  return (
    <section id="featured" className="container mx-auto px-4 py-16 md:py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div>
          <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">
            Curated Selection
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-stone-900 mt-2">
            Featured Watches
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium transition-colors text-sm"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {featuredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product as any} 
            priority={index < 2}
          />
        ))}
      </div>

      {/* Mobile View All */}
      <Link
        href="/products"
        className="sm:hidden mt-8 w-full py-4 border-2 border-stone-200 rounded-xl text-center font-semibold text-stone-700 hover:border-stone-400 transition-colors block"
      >
        View All Watches
      </Link>
    </section>
  );
}