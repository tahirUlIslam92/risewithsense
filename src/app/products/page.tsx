import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import Link from "next/link";

export const metadata = { title: "All Watches | WatchStore Pakistan", description: "Browse our complete collection." };

export default async function ProductsPage() {
  const supabase = await createRlsServerClient();
  const { data: products } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.4em] text-[#8B7355] font-medium mb-2">Collection</p>
        <h1 className="text-3xl font-light text-[#1A1A1A] mb-2">All Watches</h1>
        <p className="text-sm text-[#999] mb-10">{(products||[]).length} products</p>
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {["All","Analog","Digital","Chronograph","Smart"].map(f=>(
            <Link key={f} href={f==="All"?"/products":`/products?type=${f.toLowerCase()}`} className="px-5 py-2 border border-[#E8E4DF] text-xs uppercase tracking-wider font-medium text-[#666] hover:border-[#8B7355] hover:text-[#8B7355] transition-colors whitespace-nowrap">{f}</Link>
          ))}
        </div>
        {(!products||products.length===0)?(
          <div className="text-center py-20"><p className="text-[#999]">No products available yet.</p></div>
        ):(
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product:any)=>(
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <div className="aspect-[3/4] bg-[#F8F6F3] mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#DDD] group-hover:text-[#C4A882]" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><path d="M12 5v7l5 3"/></svg>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355] font-semibold mb-1">{product.brand}</p>
                <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#8B7355] line-clamp-1">{product.name}</h3>
                <p className="text-base font-semibold text-[#1A1A1A] mt-1.5">Rs. {Number(product.price).toLocaleString()}</p>
                <p className="text-[10px] text-emerald-600 font-medium mt-1">{product.stock_qty>0?"✓ In Stock":"× Out of Stock"}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}