import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await createRlsServerClient();
  const { data: product } = await supabase.from("products").select("name,brand,description").eq("slug",params.slug).single();
  if(!product) return { title: "Not Found" };
  return { title: `${product.name} by ${product.brand} | WatchStore`, description: product.description?.substring(0,160) };
}

export default async function ProductPage({ params }: Props) {
  const supabase = await createRlsServerClient();
  const { data: product } = await supabase.from("products").select("*, categories(name)").eq("slug",params.slug).single();
  if(!product) notFound();

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id ?? "")
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8 md:py-14">
        <nav className="text-xs text-[#999] mb-8 flex gap-2 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#8B7355]">Home</Link><span>/</span>
          <Link href="/products" className="hover:text-[#8B7355]">Products</Link><span>/</span>
          <span className="text-[#1A1A1A]">{product.name}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div className="aspect-square bg-[#F8F6F3] flex items-center justify-center">
            <svg className="w-32 h-32 text-[#DDD]" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><path d="M12 5v7l5 3"/></svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#8B7355] font-semibold mb-3">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-light text-[#1A1A1A]">{product.name}</h1>
            <p className="text-3xl font-semibold text-[#1A1A1A] mt-6">Rs. {Number(product.price).toLocaleString()}</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Cash on Delivery Available</div>
            <p className="mt-4 text-sm">{product.stock_qty>0?<span className="text-emerald-600 font-medium">In Stock ({product.stock_qty} available)</span>:<span className="text-red-500 font-medium">Out of Stock</span>}</p>
            <div className="grid grid-cols-2 gap-4 mt-8 p-6 bg-[#F8F6F3]">
              {product.type&&<Spec label="Type" value={product.type}/>}
              {product.gender&&<Spec label="Gender" value={product.gender}/>}
              {product.case_size&&<Spec label="Case Size" value={product.case_size}/>}
              {product.water_resist&&<Spec label="Water Resist" value={product.water_resist}/>}
              {product.categories&&<Spec label="Category" value={(product.categories as any).name}/>}
            </div>
            <button disabled={product.stock_qty===0} className="w-full mt-8 py-4 bg-[#1A1A1A] text-white font-medium text-sm uppercase tracking-wider hover:bg-[#8B7355] transition-colors duration-300 disabled:opacity-40">{product.stock_qty>0?`Add to Cart — Rs. ${Number(product.price).toLocaleString()}`:"Out of Stock"}</button>
            <a href={`https://wa.me/923000000000?text=I'm interested in ${product.name}`} target="_blank" className="flex items-center justify-center gap-2 w-full mt-3 py-3 border border-emerald-500 text-emerald-600 font-medium text-sm uppercase tracking-wider hover:bg-emerald-50 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>WhatsApp Inquiry</a>
            <div className="mt-10"><h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Description</h2><p className="text-sm text-[#666] leading-relaxed">{product.description}</p></div>
          </div>
        </div>
        {(relatedProducts||[]).length>0&&(
          <section className="mt-20 pt-16 border-t border-[#E8E4DF]">
            <h2 className="text-2xl font-light text-[#1A1A1A] text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts!.map((rp:any)=>(
                <Link key={rp.id} href={`/products/${rp.slug}`} className="group">
                  <div className="aspect-[3/4] bg-[#F8F6F3] mb-4 flex items-center justify-center"><svg className="w-12 h-12 text-[#DDD]" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><path d="M12 5v7l5 3"/></svg></div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355] font-semibold mb-1">{rp.brand}</p>
                  <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#8B7355]">{rp.name}</h3>
                  <p className="text-base font-semibold text-[#1A1A1A] mt-1">Rs. {Number(rp.price).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] uppercase text-[#999] tracking-wider">{label}</p><p className="text-sm font-medium text-[#1A1A1A] capitalize">{value}</p></div>;
}