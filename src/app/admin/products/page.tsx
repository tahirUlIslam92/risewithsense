import Link from "next/link";
import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import { Plus, Search, Pencil, Trash2, Eye, Package } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminProductsPage() {
  const supabase = await createRlsServerClient();
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">Products</h2>
          <p className="text-sm text-[#94A3B8] mt-0.5">{(products || []).length} total products</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white text-sm font-medium rounded-xl hover:bg-[#8B7355] transition-all">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input placeholder="Search products..." className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/10 transition-all" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Stock</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {(products || []).map((p: any) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-lg">⌚</div>
                      <div>
                        <p className="text-sm font-medium text-[#1E293B]">{p.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-[#64748B] capitalize">{p.type}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#1E293B]">Rs. {Number(p.price).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${p.stock_qty < 5 ? "text-red-500" : "text-[#1E293B]"}`}>
                      {p.stock_qty}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      p.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/products/${p.slug}`} className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-[#94A3B8]" />
                      </Link>
                      <Link href={`/admin/products/${p.id}/edit`} className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors" title="Edit">
                        <Pencil className="w-4 h-4 text-[#94A3B8]" />
                      </Link>
                      <DeleteButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!products || products.length === 0) && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#94A3B8] font-medium">No products yet</p>
            <Link href="/admin/products/new" className="text-sm text-[#8B7355] font-medium mt-1 inline-block hover:underline">Add your first product</Link>
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
      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
        <Trash2 className="w-4 h-4 text-[#94A3B8] hover:text-red-500" />
      </button>
    </form>
  );
}