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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1C1917]">Dashboard</h2>
          <p className="mt-0.5 text-sm text-[#8A7F72]">Overview of your store</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#6B5638] to-[#8B7355] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#6B5638]/20 transition-all hover:shadow-xl hover:shadow-[#6B5638]/30">
          <Plus className="h-4 w-4" />New Product
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group rounded-2xl border border-[#E8E2D9] bg-white p-5 transition-all hover:shadow-lg hover:shadow-[#1C1917]/5">
            <div className="mb-3 flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#B3A896] opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold tracking-tight text-[#1C1917]">{stat.value}</p>
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-xs text-[#8A7F72]">{stat.label}</p>
              <p className="text-[10px] font-medium text-emerald-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E8E2D9] bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#1C1917]">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Add Product", href: "/admin/products/new", icon: Plus },
            { label: "View Products", href: "/admin/products", icon: Package },
            { label: "View Orders", href: "/admin/orders", icon: ShoppingBag },
            { label: "Visit Store", href: "/", icon: ArrowUpRight },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="flex flex-col items-center gap-2 rounded-xl bg-[#FAF7F2] p-4 text-center transition-colors hover:bg-[#F1EBE1]">
              <action.icon className="h-5 w-5 text-[#8B7355]" strokeWidth={1.5} />
              <span className="text-xs font-medium text-[#1C1917]">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}