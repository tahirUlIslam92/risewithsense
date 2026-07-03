import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { BottomNav } from "@/components/shop/BottomNav";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Clock } from "lucide-react";

export const metadata = { title: "All Products | Rise With Sense" };

const COMING_SOON_CATEGORIES: Record<string, string> = {
  earbuds: "Earbuds",
  perfumes: "Perfumes",
  clothing: "Clothing",
  wallets: "Wallets",
  grooming: "Grooming",
  accessories: "Accessories",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createRlsServerClient();

  let query = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });

  if (category) {
    if (category === "watches") {
      query = query.in("type", ["analog", "digital", "chronograph", "smart"]);
    } else if (category === "earbuds") {
      query = query.eq("type", "earbuds");
    } else if (category === "perfumes") {
      query = query.eq("type", "perfume");
    } else if (category === "clothing") {
      query = query.eq("type", "clothing");
    } else if (category === "wallets") {
      query = query.in("type", ["wallet", "purse"]);
    } else if (category === "grooming") {
      query = query.eq("type", "grooming");
    } else if (category === "accessories") {
      query = query.eq("type", "accessories");
    }
  }

  const { data: products } = await query;

  const activeCategory = category || "";
  const isComingSoonCategory = !!COMING_SOON_CATEGORIES[activeCategory];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-4 pb-24 md:pt-8 md:pb-16">
        <h1 className="text-xl font-bold mb-6">
          {activeCategory
            ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
            : "All Products"}
        </h1>

        {/* Coming Soon */}
        {isComingSoonCategory && (products || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Clock className="w-16 h-16 text-[#8B7355]/20 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Coming Soon</h2>
            <p className="text-sm text-[#999] max-w-sm">
              We're curating the best {COMING_SOON_CATEGORIES[activeCategory].toLowerCase()} for you. Stay tuned!
            </p>
            <Link
              href="/products"
              className="mt-6 px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#8B7355] transition-colors"
            >
              Browse Available Products
            </Link>
          </div>
        ) : (products || []).length === 0 ? (
          <p className="text-center text-[#999] py-20">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {(products || []).map((p: any) => {
              const Icon = getCategoryIcon(p.type);
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-700 ease-out"
                >
                  <div className="relative aspect-square bg-[#F8F5F0] flex items-center justify-center overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" loading="lazy" />
                    ) : (
                      <Icon className="w-10 h-10 text-[#8B7355]/40 group-hover:text-[#8B7355]/60 transition-colors" strokeWidth={1.5} />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* "Take a Closer Look" Button */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-medium text-[#1A1A1A] tracking-wide shadow-lg hover:bg-[#8B7355] hover:text-white transition-all duration-300 whitespace-nowrap">
                        Take a Closer Look
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#8B7355] font-semibold">{p.brand}</p>
                    <h3 className="text-xs font-medium line-clamp-1 mt-0.5">{p.name}</h3>
                    <p className="text-sm font-bold mt-1">Rs. {Number(p.price).toLocaleString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}