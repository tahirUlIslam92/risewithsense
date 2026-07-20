import { Suspense } from "react";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { BottomNav } from "@/components/shop/BottomNav";
import { createServerClient } from "@/infrastructure/supabase/client.server";
import { Package, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  confirmed: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", label: "Confirmed" },
  shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-50", label: "Shipped" },
  delivered: { icon: Package, color: "text-emerald-600", bg: "bg-emerald-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Cancelled" },
};

export default async function MyOrdersPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
          <Package className="w-16 h-16 mx-auto mb-6 text-[#8B7355]/30" strokeWidth={1} />
          <h1 className="text-xl font-bold mb-4">Sign in to view your orders</h1>
          <Link href="/" className="inline-block px-8 py-3 bg-[#1A1A1A] text-white text-sm rounded-full hover:bg-[#8B7355] transition-colors">
            Go to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_phone", user.email || user.phone || "")
    .order("created_at", { ascending: false });

  // Also fetch orders by user ID if you have user_id column
  const { data: userOrders } = await (supabase as any)
    .from("orders")
    .select("*")
    .or(`customer_phone.eq.${user.email},customer_phone.eq.${user.phone || ""}`)
    .order("created_at", { ascending: false });

  const allOrders = orders || userOrders || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Suspense fallback={<div className="h-14" />}>
        <Navbar />
      </Suspense>

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-24 md:pt-28 md:pb-16">
        <h1 className="text-xl font-bold mb-6">My Orders</h1>

        {allOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-[#8B7355]/20" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">No orders yet</h2>
            <p className="text-sm text-[#999] mb-6">Start shopping to see your orders here.</p>
            <Link href="/products" className="inline-block px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#8B7355] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {allOrders.map((order: any) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-[#EEE] p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-[#999] font-mono">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm font-semibold mt-1">{order.customer_name}</p>
                      <p className="text-xs text-[#999]">{order.customer_city}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-1 mt-4">
                    {["pending", "confirmed", "shipped", "delivered"].map((s, i) => {
                      const isComplete = ["pending", "confirmed", "shipped", "delivered"].indexOf(order.status) >= i;
                      const isCurrent = order.status === s;
                      return (
                        <div key={s} className="flex-1 flex items-center">
                          <div className={`h-1.5 rounded-full flex-1 ${isComplete ? (isCurrent ? "bg-[#8B7355]" : "bg-emerald-400") : "bg-[#EEE]"}`} />
                          {i < 3 && <div className="w-1" />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-[#999] uppercase">
                    <span>Pending</span>
                    <span>Confirmed</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#EEE]">
                    <p className="text-sm font-bold">Rs. {Number(order.total).toLocaleString()}</p>
                    <p className="text-[10px] text-[#999]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
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