"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCartStore";

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
  const pathname = usePathname();
  const { user, signInWithGoogle } = useAuth();
  const { items, loading, userId, setUserId, fetchFromDB, getCount } = useCartStore();

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchFromDB();
    } else {
      setUserId(null);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setCartOpen(false);
  }, [pathname]);

  const cartCount = getCount();

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, cartOpen]);

  return (
    <>
      <div className="md:hidden bg-[#8B7355] text-white text-[10px] text-center py-1.5 uppercase tracking-wider">
        Free Shipping above Rs. 5000 ✦ COD
      </div>

      <header className={`sticky top-0 z-50 transition-all bg-white ${isScrolled ? "shadow-sm" : ""}`}>
        <nav className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsOpen(true)} className="md:hidden p-2 -ml-2" aria-label="Open menu">
                <Menu className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
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

            {/* Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/my-orders" className="hidden md:flex items-center gap-1.5 text-xs text-[#666] hover:text-[#8B7355] uppercase tracking-wider font-medium transition-colors">
                    <Package className="w-3.5 h-3.5" />My Orders
                  </Link>
                  <button onClick={() => setCartOpen(true)} className="relative p-2" aria-label="Open cart">
                    <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#8B7355] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <button onClick={signInWithGoogle} className="text-xs text-[#8B7355] font-medium">Sign In</button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#EEE]">
              <span className="font-bold text-lg text-[#1A1A1A]">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-[#F5F0E8] active:scale-90 transition-all">
                <X className="w-5 h-5 text-[#666]" strokeWidth={1.5} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="p-4 space-y-1 overflow-y-auto">
              {LINKS.map((link) => {
                const isActive = pathname.includes(link.href.split("=")[1]);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97] ${
                      isActive
                        ? "bg-[#F5F0E8] text-[#8B7355]"
                        : "text-[#666] hover:bg-[#F8F5F0] hover:text-[#1A1A1A] active:bg-[#F0EBE4]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {user && (
                <Link
                  href="/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-[#666] hover:bg-[#F8F5F0] hover:text-[#1A1A1A] active:bg-[#F0EBE4] active:scale-[0.97] transition-all mt-2 border-t border-[#EEE] pt-4"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>
              )}

              {!user && (
                <button
                  onClick={() => { signInWithGoogle(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium bg-[#1A1A1A] text-white active:scale-[0.97] transition-all mt-2 border-t border-[#EEE]"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#EEE]">
              <h3 className="font-semibold text-[#1A1A1A]">Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-[#F5F0E8] active:scale-90 transition-all">
                <X className="w-5 h-5 text-[#666]" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {!user ? (
                <div className="text-center mt-10">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#8B7355]/20" strokeWidth={1} />
                  <p className="text-[#999] mb-4">Sign in to view your cart</p>
                  <button onClick={() => { signInWithGoogle(); setCartOpen(false); }} className="text-sm text-[#8B7355] font-medium">Sign in with Google</button>
                </div>
              ) : loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 p-3 bg-[#F8F5F0] rounded-xl animate-pulse">
                      <div className="w-14 h-14 bg-[#E8E4DF] rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#E8E4DF] rounded w-2/3" />
                        <div className="h-3 bg-[#E8E4DF] rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <p className="text-center text-[#999] mt-10">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-[#F8F5F0] rounded-xl">
                      <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        {item.products?.images?.[0] ? (
                          <img src={item.products.images[0]} alt={item.products.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-[#8B7355]/40" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.products?.name}</p>
                        <p className="text-xs text-[#8B7355] font-semibold">Rs. {Number(item.products?.price || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-[#999]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-[#EEE] bg-white">
                <Link href="/cart" onClick={() => setCartOpen(false)}
                  className="block w-full py-3 bg-[#1A1A1A] text-white text-center text-xs uppercase tracking-wider rounded-full font-medium hover:bg-[#8B7355] active:scale-[0.98] transition-all">
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EEE] z-40">
        <div className="flex items-center justify-around py-2">
          {[
            { label: "Home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
            { label: "Cart", href: "/cart", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
            { label: "Orders", href: "/my-orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-90 ${
                  isActive ? "text-[#8B7355]" : "text-[#999]"
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}