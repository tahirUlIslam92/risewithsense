"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import { adminLogout } from "@/lib/supabase/admin";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

// Single source of truth for "is this nav item active" — used by both the
// sidebar highlight AND the header title, so they can never disagree again.
function isRouteActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  href,
  label,
  Icon,
  active,
  onClick,
  variant = "desktop",
}: {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  active: boolean;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B5638] focus-visible:ring-offset-2 ${
        isMobile ? "px-4 py-3.5 active:scale-[0.98]" : "px-4 py-3"
      } ${
        active
          ? "bg-gradient-to-br from-[#6B5638] to-[#8B7355] text-white shadow-lg shadow-[#6B5638]/20"
          : "text-[#665C52] hover:bg-[#F1EBE1] hover:text-[#1C1917] active:bg-[#EDE8E0]"
      }`}
    >
      {/* left accent tick — a small nod to a watch hand, only visible on the active item */}
      {active && (
        <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-white/70" />
      )}
      <Icon
        className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
          active ? "text-white" : "text-[#A0937F] group-hover:text-[#6B5638]"
        }`}
        strokeWidth={1.5}
      />
      <span className="flex-1">{label}</span>
      {active && !isMobile && <ChevronRight className="h-4 w-4 opacity-70" strokeWidth={2} />}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeItem = navItems.find((item) => isRouteActive(pathname, item.href));
  const pageTitle = activeItem?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#F7F5F1]">
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="sticky top-0 hidden min-h-screen w-72 flex-col border-r border-[#E8E2D9] bg-white lg:flex">
        {/* Logo */}
        <div className="p-8">
          <Link href="/admin" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B5638] to-[#8B7355] shadow-lg shadow-[#6B5638]/20 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-[#6B5638]/30">
              {/* faint bezel ring — quiet nod to the watch-store brand, respects reduced motion */}
              <span className="motion-safe:animate-spin-slow absolute inset-[-3px] rounded-2xl border border-dashed border-[#8B7355]/40" />
              <Sparkles className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-[#1C1917]">RiseWithSense</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A0937F]">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0937F]">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={isRouteActive(pathname, item.href)}
            />
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-[#E8E2D9] p-5">
          <div className="mb-4 flex items-center gap-3 px-2">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B5638] to-[#8B7355] text-xs font-bold text-white shadow-md">
              A
              {/* live status dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#1C1917]">Admin</p>
              <p className="text-[10px] text-[#A0937F]">Super Admin</p>
            </div>
          </div>
          <form action={adminLogout}>
            <button className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[#A0937F] transition-all duration-300 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B5638] focus-visible:ring-offset-2">
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" strokeWidth={1.5} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top Header */}
        <header
          className={`sticky top-0 z-30 transition-all duration-300 ${
            scrolled
              ? "border-b border-[#E8E2D9] bg-white/90 shadow-sm backdrop-blur-2xl"
              : "border-b border-transparent bg-white"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="-ml-2 rounded-xl p-2 transition-all hover:bg-[#F1EBE1] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B5638] lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-[#1C1917]" strokeWidth={1.5} />
              </button>
              <h1 className="text-sm font-bold text-[#1C1917]">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hidden items-center gap-2 text-xs font-medium text-[#A0937F] transition-colors hover:text-[#6B5638] sm:flex"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Visit Store
              </Link>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B5638] to-[#8B7355] text-xs font-bold text-white shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* ============ MOBILE DRAWER ============ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm animate-in slide-in-from-left bg-white shadow-2xl duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D9] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B5638] to-[#8B7355] shadow-md">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-bold text-[#1C1917]">Admin Panel</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 transition-all hover:bg-[#F1EBE1] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B5638]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-[#665C52]" strokeWidth={1.5} />
              </button>
            </div>

            {/* Drawer Links */}
            <nav className="space-y-1 p-4">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0937F]">Main Menu</p>
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  Icon={item.icon}
                  active={isRouteActive(pathname, item.href)}
                  onClick={() => setMobileOpen(false)}
                  variant="mobile"
                />
              ))}

              <div className="mt-4 border-t border-[#E8E2D9] pt-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="mb-1 flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#665C52] transition-all hover:bg-[#F1EBE1] active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4 text-[#A0937F]" strokeWidth={1.5} />
                  Visit Store
                </Link>
                <form action={adminLogout}>
                  <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#A0937F] transition-all hover:bg-red-50 hover:text-red-500 active:scale-[0.98]">
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    Sign Out
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

/*
  If motion-safe:animate-spin-slow isn't defined in your tailwind.config yet, add:

  theme: {
    extend: {
      animation: { "spin-slow": "spin 6s linear infinite" },
    },
  }
*/