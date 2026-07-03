import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import Link from "next/link";
import { Eye } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  shipped: "bg-purple-50 text-purple-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

export default async function AdminOrdersPage() {
  const supabase = await createRlsServerClient();
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white rounded-2xl border border-[#EEE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EEE] bg-[#FAFAFA]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#999] uppercase">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#999] uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#999] uppercase">City</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#999] uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#999] uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#999] uppercase">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#999] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((o: any) => (
                <tr key={o.id} className="border-b border-[#EEE] hover:bg-[#FAFAFA]">
                  <td className="px-4 py-3 text-xs font-mono text-[#666]">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm">{o.customer_name}</td>
                  <td className="px-4 py-3 text-xs text-[#999]">{o.customer_city}</td>
                  <td className="px-4 py-3 text-sm font-medium">Rs. {Number(o.total).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[o.status] || "bg-gray-50 text-gray-600"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#999]">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="p-2 hover:bg-[#F0F0F0] rounded-lg inline-flex">
                      <Eye className="w-4 h-4 text-[#666]" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!orders || orders.length === 0) && <p className="text-center text-[#999] py-10">No orders yet.</p>}
      </div>
    </div>
  );
}