"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const NAV_ITEMS = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Search", href: "/products", Icon: Search },
  { label: "Cart", href: "/cart", Icon: ShoppingBag },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EEE] z-50">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
                active ? "text-[#8B7355]" : "text-[#999]"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              {label}
              {label === "Cart" && totalItems > 0 && (
                <span className="absolute -top-1 right-1 w-4 h-4 bg-[#8B7355] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
