import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { BottomNav } from "@/components/shop/BottomNav";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import { CATEGORY_LIST, getCategoryIcon } from "@/lib/categoryIcons";

export const metadata = {
  title: "Rise With Sense — Premium Lifestyle Store | Pakistan",
  description:
    "Shop watches, earbuds, perfumes, clothing, wallets, grooming & accessories. COD available across Pakistan.",
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const supabase = await createRlsServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      {/* HERO */}
      <section className="relative px-4 pt-6 pb-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#8B7355] font-medium mb-4">
            Rise With Sense
          </p>
          <h1 className="text-4xl md:text-7xl font-bold text-[#1A1A1A] leading-[1.05]">
            Elevate Your
            <br />
            <span className="text-[#8B7355]">Lifestyle</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-[#999] max-w-md mx-auto">
            Premium watches, audio, perfumes, clothing & accessories. Curated for those who appreciate quality.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-full font-medium hover:bg-[#8B7355] transition-colors"
          >
            Shop Now <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 pb-10 md:pb-16">
        <h2 className="text-lg font-semibold mb-4 px-1">Shop by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:grid md:grid-cols-4 md:overflow-visible">
          {CATEGORY_LIST.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="flex-shrink-0 w-28 md:w-auto p-4 rounded-2xl bg-white border border-[#EEE] text-center hover:shadow-md hover:border-[#8B7355]/30 transition-all"
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-[#8B7355]" strokeWidth={1.5} />
                <p className="text-[10px] font-semibold text-[#1A1A1A]">{cat.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS — Trending Now */}
      <section className="px-4 pb-16 md:pb-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Trending Now</h2>
          <Link href="/products" className="text-xs text-[#8B7355] font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {(products || []).map((p: any) => {
            const Icon = getCategoryIcon(p.type);
            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-700 ease-out"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-[#F8F5F0] flex items-center justify-center overflow-hidden">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="group-hover:scale-105 transition-transform duration-[1.2s] ease-out">
                      <Icon className="w-12 h-12 text-[#8B7355]/30 group-hover:text-[#8B7355]/50 transition-colors duration-700" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Dark Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* "Take a Closer Look" Button */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-medium text-[#1A1A1A] tracking-wide shadow-lg hover:bg-[#8B7355] hover:text-white hover:scale-105 transition-all duration-300 whitespace-nowrap">
                      Take a Closer Look
                      <ArrowRight className="w-3 h-3" strokeWidth={2} />
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#8B7355] font-semibold">{p.brand}</p>
                  <h3 className="text-xs font-medium line-clamp-1 mt-0.5">{p.name}</h3>
                  <p className="text-sm font-bold mt-1">Rs. {Number(p.price).toLocaleString()}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <BottomNav />
      <Footer />
    </div>
  );
}