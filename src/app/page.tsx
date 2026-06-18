import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";

export const metadata = {
  title: "WatchStore - Premium Watches in Pakistan",
  description: "Discover curated premium timepieces. Authentic watches with Cash on Delivery across Pakistan.",
};

export default async function HomePage() {
  const supabase = await createRlsServerClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })
    .limit(4);

  const categoryIcons: Record<string, string> = {
    analog: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm1-13h-2v6l5.2 3.2.8-1.3-4-2.4V7z",
    digital: "M4 6h16v12H4V6zm2 2v8h12V8H6zm2 2h3v4H8v-4zm5 0h3v2h-3v-2zm0 3h3v2h-3v-2z",
    chronograph: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm1-13h-2v6l5.2 3.2.8-1.3-4-2.4V7z",
    smart: "M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h10V4H7zm5 12c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z",
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="relative bg-[#F8F6F3] overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#8B7355] font-medium mb-6">Established 2026</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#1A1A1A] leading-[1.08] tracking-tight">
                Crafted for<br /><span className="font-semibold">those who value</span><br /><span className="text-[#8B7355] font-semibold">precision.</span>
              </h1>
              <p className="mt-6 text-base text-[#666] max-w-md leading-relaxed">Discover our curated selection of premium timepieces. Each watch tells a story of craftsmanship and elegance.</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 bg-[#1A1A1A] text-white rounded-none font-medium text-sm uppercase tracking-wider hover:bg-[#8B7355] transition-colors duration-300">Shop Collection</Link>
                <Link href="#featured" className="inline-flex items-center justify-center px-8 py-4 border border-[#CCC] text-[#1A1A1A] rounded-none font-medium text-sm uppercase tracking-wider hover:border-[#8B7355] transition-colors duration-300">View Featured</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="aspect-[4/5] bg-[#E8E4DF] flex items-center justify-center">
                <svg className="w-32 h-32 text-white/50" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.4em] text-[#8B7355] font-medium text-center mb-3">Featured Collection</p>
        <h2 className="text-3xl md:text-4xl font-light text-[#1A1A1A] text-center mb-16 tracking-tight">Our Finest Selection</h2>
        {(!featuredProducts || featuredProducts.length === 0) ? (
          <p className="text-center text-[#999]">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <div className="aspect-[3/4] bg-[#F8F6F3] mb-5 flex items-center justify-center overflow-hidden">
                  <svg className="w-20 h-20 text-[#DDD] group-hover:text-[#C4A882] transition-colors duration-500" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><path d="M12 5v7l5 3"/></svg>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355] font-semibold mb-1.5">{product.brand}</p>
                <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#8B7355] transition-colors mb-1">{product.name}</h3>
                <p className="text-lg font-semibold text-[#1A1A1A]">Rs. {Number(product.price).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-14">
          <Link href="/products" className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#1A1A1A] font-medium text-sm uppercase tracking-wider transition-colors">View All Watches <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></Link>
        </div>
      </section>

      <section className="bg-[#F8F6F3] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[#8B7355] font-medium text-center mb-3">Categories</p>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A1A1A] text-center mb-16 tracking-tight">Explore by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(categories || []).map((cat: any) => (
              <Link key={cat.id} href={`/products?type=${cat.slug}`} className="group bg-white p-8 text-center hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#F8F6F3] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#8B7355]" fill="currentColor" viewBox="0 0 24 24"><path d={categoryIcons[cat.slug] || "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"}/></svg>
                </div>
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1A1A1A] text-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {["Authentic","Cash on Delivery","Nationwide","Warranty"].map((title,i) => (
              <div key={title}><div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center"><svg className="w-5 h-5 text-[#C4A882]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div><h3 className="font-semibold text-sm mb-1">{title}</h3><p className="text-white/50 text-xs">{["100% genuine","Pay upon receipt","2-5 day delivery","1-year coverage"][i]}</p></div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}