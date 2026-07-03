import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { BottomNav } from "@/components/shop/BottomNav";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { AddToCartButton } from "./AddToCartButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createRlsServerClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();

  if (!product) return { title: "Product Not Found | Rise With Sense" };

  return {
    title: `${product.name} — ${product.brand} | Rise With Sense`,
    description: product.description?.slice(0, 160) || `Shop ${product.name} by ${product.brand}.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createRlsServerClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).eq("is_active", true).single();

  if (!product) notFound();

  const Icon = getCategoryIcon(product.type);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-4 pb-24 md:pt-8 md:pb-16">
        <nav className="text-[11px] text-[#999] mb-4">
          <Link href="/" className="hover:text-[#8B7355]">Home</Link> /{" "}
          <Link href="/products" className="hover:text-[#8B7355]">Products</Link> /{" "}
          <span className="text-[#1A1A1A]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-white rounded-2xl border border-[#EEE] flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon className="w-24 h-24 text-[#8B7355]/30" strokeWidth={1} />
            )}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#8B7355] font-semibold">{product.brand}</p>
            <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            <p className="text-2xl font-bold mt-3">Rs. {Number(product.price).toLocaleString()}</p>

            {product.description && (
              <p className="text-sm text-[#666] leading-relaxed mt-4">{product.description}</p>
            )}

            <p className="text-xs mt-4">
              {product.stock_qty > 0 ? (
                <span className="text-emerald-600 font-medium">In Stock ({product.stock_qty} available)</span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </p>

            <AddToCartButton product={product} />
          </div>
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}