import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { ProductCard } from "@/components/shop/ProductCard";

const featuredProducts = [
  { id: "1", name: "Classic Chronograph", slug: "classic-chronograph", brand: "Rolex", price: 50000, primaryImage: null, isInStock: true, featured: true },
  { id: "2", name: "Digital Pro", slug: "digital-pro", brand: "Casio", price: 15000, primaryImage: null, isInStock: true, featured: true },
  { id: "3", name: "Smart Elite", slug: "smart-elite", brand: "Apple", price: 120000, primaryImage: null, isInStock: true, featured: true },
  { id: "4", name: "Diver Edition", slug: "diver-edition", brand: "Omega", price: 75000, primaryImage: null, isInStock: false, featured: false },
];

const categories = [
  { name: "Analog", slug: "analog", icon: "🕐", desc: "Classic timepieces" },
  { name: "Digital", slug: "digital", icon: "📟", desc: "Modern displays" },
  { name: "Chronograph", slug: "chronograph", icon: "⏱️", desc: "Precision timing" },
  { name: "Smart", slug: "smart", icon: "⌚", desc: "Connected watches" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Premium Collection
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.05]">
            Timeless
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
              Elegance
            </span>
          </h1>
          
          <p className="mt-4 text-base md:text-lg text-stone-500 max-w-md mx-auto">
            Curated premium watches. Authentic timepieces delivered across Pakistan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition-all active:scale-95"
            >
              Shop Collection
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#featured"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-stone-200 rounded-full font-semibold text-stone-700 hover:border-stone-400 transition-all active:scale-95"
            >
              View Featured
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-xs text-stone-400">
            {["✓ COD Available", "✓ Nationwide Delivery", "✓ 7-Day Returns"].map((t) => (
              <span key={t} className="flex items-center gap-1">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 text-center mb-8">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?type=${cat.slug}`}
              className="group p-4 md:p-6 rounded-2xl bg-white hover:shadow-lg hover:shadow-stone-900/5 transition-all duration-300 active:scale-95 border border-stone-100"
            >
              <span className="text-3xl md:text-4xl block mb-3">{cat.icon}</span>
              <h3 className="text-sm md:text-base font-bold text-stone-900">{cat.name}</h3>
              <p className="text-xs text-stone-400 mt-1 hidden md:block">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider">Curated</span>
            <h2 className="text-xl md:text-2xl font-bold text-stone-900 mt-1">Featured Watches</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>

        <Link
          href="/products"
          className="sm:hidden mt-6 flex items-center justify-center w-full py-3 border-2 border-stone-200 rounded-xl font-semibold text-stone-700 hover:border-stone-400 transition-colors text-sm"
        >
          View All Watches
        </Link>
      </section>

      {/* ============ BENEFITS BAR ============ */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "✓", title: "Authentic", desc: "100% genuine" },
              { icon: "📦", title: "COD", desc: "Pay on delivery" },
              { icon: "🔄", title: "Returns", desc: "7-day policy" },
              { icon: "🚚", title: "Fast", desc: "2-5 day delivery" },
            ].map((b) => (
              <div key={b.title}>
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="font-semibold text-sm">{b.title}</h3>
                <p className="text-stone-400 text-xs mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}