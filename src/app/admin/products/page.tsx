import Link from "next/link";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import { Plus, Search, Pencil, Trash2, Eye, Package } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminProductsPage() {
  const supabase = await createRlsServerClient();
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1C1917]">Products</h2>
          <p className="mt-0.5 text-sm text-[#8A7F72]">{(products || []).length} total products</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#6B5638] to-[#8B7355] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#6B5638]/20 transition-all hover:shadow-xl hover:shadow-[#6B5638]/30">
          <Plus className="h-4 w-4" />Add Product
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B3A896]" />
        <input placeholder="Search products..." className="w-full rounded-xl border border-[#E8E2D9] bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#6B5638] focus:ring-2 focus:ring-[#6B5638]/10" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E2D9] bg-[#FAF7F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8A7F72]">Product</th>
                <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8A7F72] md:table-cell">Category</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8A7F72]">Price</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8A7F72]">Stock</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8A7F72]">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#8A7F72]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {(products || []).map((p: any) => (
                <tr key={p.id} className="group transition-colors hover:bg-[#FAF7F2]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F1EBE1] text-lg">
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /> : "⌚"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1C1917]">{p.name}</p>
                        <p className="text-[11px] text-[#8A7F72]">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell"><span className="text-xs capitalize text-[#665C52]">{p.type}</span></td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#1C1917]">Rs. {Number(p.price).toLocaleString()}</td>
                  <td className="px-5 py-4"><span className={`text-sm font-medium ${p.stock_qty < 5 ? "text-red-500" : "text-[#1C1917]"}`}>{p.stock_qty}</span></td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${p.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-red-500"}`} />{p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link href={`/products/${p.slug}`} className="rounded-lg p-2 transition-colors hover:bg-[#F1EBE1]" title="View"><Eye className="h-4 w-4 text-[#8A7F72]" /></Link>
                      <Link href={`/admin/products/${p.id}/edit`} className="rounded-lg p-2 transition-colors hover:bg-[#F1EBE1]" title="Edit"><Pencil className="h-4 w-4 text-[#8A7F72]" /></Link>
                      <DeleteButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!products || products.length === 0) && (
          <div className="py-16 text-center">
            <Package className="mx-auto mb-3 h-12 w-12 text-[#D8CFC0]" />
            <p className="font-medium text-[#8A7F72]">No products yet</p>
            <Link href="/admin/products/new" className="mt-1 inline-block text-sm font-medium text-[#8B7355] hover:underline">Add your first product</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={async () => {
      "use server";
      const supabase = await createRlsServerClient();
      await supabase.from("products").update({ is_active: false }).eq("id", id);
      revalidatePath("/admin/products");
    }}>
      <button className="rounded-lg p-2 transition-colors hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4 text-[#8A7F72] hover:text-red-500" /></button>
    </form>
  );
}