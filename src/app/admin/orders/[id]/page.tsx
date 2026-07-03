import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";

const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};

interface Props { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createRlsServerClient();

  // Fetch order
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  // Fetch order items separately
  const { data: orderItems } = await supabase.from("order_items").select("*").eq("order_id", id);

  const nextStatus = NEXT_STATUS[order.status];

  return (
    <div>
      <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-[#999] hover:text-[#1A1A1A] mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#EEE] p-5">
          <h2 className="font-semibold mb-4">Order #{order.id.slice(0, 8)}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#999]">Customer</span><span>{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-[#999]">Phone</span><span>{order.customer_phone}</span></div>
            <div className="flex justify-between"><span className="text-[#999]">City</span><span>{order.customer_city}</span></div>
            <div className="flex justify-between"><span className="text-[#999]">Address</span><span>{order.customer_addr}</span></div>
            <div className="flex justify-between"><span className="text-[#999]">Total</span><span className="font-bold">Rs. {Number(order.total).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-[#999]">Status</span><span className="font-medium capitalize">{order.status}</span></div>
          </div>

          {nextStatus && (
            <form action={async () => {
              "use server";
              const supabase = await createRlsServerClient();
              await supabase.from("orders").update({ status: nextStatus }).eq("id", id);
              revalidatePath(`/admin/orders/${id}`);
            }}>
              <button className="w-full mt-4 py-3 bg-[#1A1A1A] text-white text-sm rounded-xl hover:bg-[#8B7355] transition-colors">
                Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EEE] p-5">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {(orderItems || []).map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm p-3 bg-[#F8F8F8] rounded-xl">
                <span>Product #{item.product_id.slice(0, 8)}</span>
                <span>Qty: {item.quantity}</span>
                <span className="font-medium">Rs. {Number(item.price).toLocaleString()}</span>
              </div>
            ))}
            {(!orderItems || orderItems.length === 0) && (
              <p className="text-sm text-[#999] text-center py-4">No items found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}