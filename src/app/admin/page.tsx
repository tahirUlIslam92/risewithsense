import { createRlsServerClient } from "@/infrastructure/supabase/client.server";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, DollarSign, ArrowUpRight, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createRlsServerClient();
  const { count: products } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true);
  const { count: orders } = await supabase.from("orders").select("*", { count: "exact", head: true });
  const { count: pending } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending");

  const stats = [
    { label: "Active Products", value: products || 0, change: "+12%", icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: orders || 0, change: "+8%", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600" },
    { label: "Pending", value: pending || 0, change: "Action needed", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
    { label: "Revenue", value: "Rs. 0", change: "This month", icon: DollarSign, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">Dashboard</h2>
          <p className="text-sm text-[#94A3B8] mt-0.5">Overview of your store</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white text-sm font-medium rounded-xl hover:bg-[#8B7355] transition-all shadow-lg shadow-[#1E293B]/10">
          <Plus className="w-4 h-4" />
          New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:shadow-lg hover:shadow-[#1E293B]/5 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-[#1E293B] tracking-tight">{stat.value}</p>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-[#94A3B8]">{stat.label}</p>
              <p className="text-[10px] text-emerald-500 font-medium">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Add Product", href: "/admin/products/new", icon: Plus },
            { label: "View Products", href: "/admin/products", icon: Package },
            { label: "View Orders", href: "/admin/orders", icon: ShoppingBag },
            { label: "Visit Store", href: "/", icon: ArrowUpRight },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-center">
              <action.icon className="w-5 h-5 text-[#64748B]" strokeWidth={1.5} />
              <span className="text-xs font-medium text-[#1E293B]">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}