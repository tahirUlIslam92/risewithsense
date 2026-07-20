"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { adminLogout } from "@/lib/supabase/admin";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-[#E2E8F0] min-h-screen sticky top-0">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#8B7355] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E293B]">RiseWithSense</p>
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-all group">
              <item.icon className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B7355] transition-colors" strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#94A3B8]" />
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[#E2E8F0]">
          <form action={adminLogout}>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:bg-red-50 hover:text-red-500 transition-all">
              <LogOut className="w-4 h-4" />Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[#F1F5F9] active:scale-90 transition-all">
              <Menu className="w-5 h-5 text-[#64748B]" />
            </button>
            <h1 className="text-sm font-semibold text-[#1E293B]">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8B7355] flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[80%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <span className="font-bold text-sm text-[#1E293B]">Admin Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-[#F1F5F9] active:scale-90 transition-all">
                <X className="w-5 h-5 text-[#64748B]" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="p-3 space-y-0.5">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] active:scale-[0.98] active:bg-[#E8F0FE] transition-all">
                  <item.icon className="w-4 h-4 text-[#94A3B8]" strokeWidth={1.5} />
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-[#E2E8F0]">
                <form action={adminLogout}>
                  <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-[#94A3B8] hover:bg-red-50 hover:text-red-500 active:scale-[0.98] transition-all">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}