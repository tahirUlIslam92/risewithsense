"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getCartItems } from "@/app/actions/cart";

const LINKS = [
  { label: "Watches", href: "/products?category=watches" },
  { label: "Earbuds", href: "/products?category=earbuds" },
  { label: "Perfumes", href: "/products?category=perfumes" },
  { label: "Clothing", href: "/products?category=clothing" },
  { label: "Grooming", href: "/products?category=grooming" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  // Fetch cart count from database
  useEffect(() => {
    if (user) {
      getCartItems().then(items => setCartCount(items.length));
    } else {
      setCartCount(0);
    }
  }, [user, pathname]); // Re-fetch on route change

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      <div className="md:hidden bg-[#8B7355] text-white text-[10px] text-center py-1.5 uppercase tracking-wider">
        Free Shipping above Rs. 5000 ✦ COD
      </div>

      <header className={`sticky top-0 z-50 transition-all bg-white ${isScrolled ? "shadow-sm" : ""}`}>
        <nav className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex h-14 md:h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsOpen(true)} className="md:hidden p-2" aria-label="Open menu">
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-bold tracking-tight text-[#1A1A1A]">
                  Rise<span className="text-[#8B7355] font-light italic">WithSense</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {LINKS.map((link) => {
                const isActive = pathname.includes(link.href.split("=")[1]);
                return (
                  <Link key={link.href} href={link.href}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-full transition-colors ${isActive ? "bg-[#F5F0E8] text-[#8B7355]" : "text-[#666] hover:text-[#1A1A1A]"}`}>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setCartOpen(true)} className="relative p-2" aria-label="Open cart">
                <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#8B7355] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#EEE]">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" strokeWidth={1.5} /></button>
            </div>
            <div className="p-4 space-y-1">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-[#666] hover:bg-[#F8F5F0]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/20" onClick={() => setCartOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#EEE]">
              <h3 className="font-semibold">Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)}><X className="w-5 h-5" strokeWidth={1.5} /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-center text-[#999] mt-10">Open cart page to view items</p>
            </div>
            <div className="p-4 border-t border-[#EEE] bg-white">
              <Link href="/cart" onClick={() => setCartOpen(false)}
                className="block w-full py-3 bg-[#1A1A1A] text-white text-center text-xs uppercase tracking-wider rounded-full font-medium hover:bg-[#8B7355] transition-colors">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}