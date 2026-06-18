import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import Link from "next/link";

// Demo orders
const orders = [
  { id: "#WS-001", customer: "Ahmed Khan", phone: "03001234567", city: "Karachi", total: 85000, status: "Pending", items: 3, date: "2 hours ago" },
  { id: "#WS-002", customer: "Sara Ali", phone: "03019876543", city: "Lahore", total: 15000, status: "Confirmed", items: 1, date: "5 hours ago" },
  { id: "#WS-003", customer: "Bilal Hassan", phone: "03015559999", city: "Islamabad", total: 120000, status: "Shipped", items: 2, date: "1 day ago" },
  { id: "#WS-004", customer: "Zainab Raza", phone: "03017778888", city: "Faisalabad", total: 45000, status: "Pending", items: 1, date: "1 day ago" },
  { id: "#WS-005", customer: "Usman Tariq", phone: "03016665555", city: "Peshawar", total: 75000, status: "Delivered", items: 2, date: "2 days ago" },
  { id: "#WS-006", customer: "Fatima Noor", phone: "03014443333", city: "Multan", total: 35000, status: "Cancelled", items: 1, date: "3 days ago" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const tabs = ["All", "Pending", "Confirmed", "Shipped", "Delivered"];

export default function AdminOrders() {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        <Header />

        <main className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-stone-900">Orders</h2>
            <p className="text-sm text-stone-500 mt-1">{orders.length} total orders</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  tab === "All"
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by customer name or phone..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all bg-white"
            />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-4 bg-white rounded-2xl border border-stone-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-xs text-amber-600 font-semibold">{order.id}</p>
                    <p className="font-semibold text-stone-900 text-sm mt-0.5">{order.customer}</p>
                    <p className="text-xs text-stone-400">{order.city} · {order.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{order.items} items</span>
                  <span className="font-bold text-stone-900">Rs. {order.total.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-50">
                  {["Order ID", "Customer", "Phone", "City", "Items", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors cursor-pointer">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-mono text-amber-600 hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-stone-900">{order.customer}</td>
                    <td className="px-5 py-3 text-sm text-stone-500">{order.phone}</td>
                    <td className="px-5 py-3 text-sm text-stone-500">{order.city}</td>
                    <td className="px-5 py-3 text-sm text-stone-500">{order.items}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-stone-900">Rs. {order.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-stone-400">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}