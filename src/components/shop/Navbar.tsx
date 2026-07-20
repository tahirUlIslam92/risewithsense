"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, Package } from "lucide-react";
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
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setCartLoading(true);
    const data = await getCartItems();
    setCartItems(data || []);
    setCartLoading(false);
  };

  // Fetch on route change + user change
  useEffect(() => {
    fetchCartItems();
  }, [user, pathname]);

  // Refetch when cart drawer opens
  useEffect(() => {
    if (cartOpen) fetchCartItems();
  }, [cartOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const cartCount = cartItems.length;

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
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#EEE]">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" strokeWidth={1.5} /></button>
            </div>
            <div className="p-4 space-y-1">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-3 rounded-xl text-sm font-medium text-[#666] hover:bg-[#F8F5F0]">{link.label}</Link>
              ))}
              {user && (
                <Link href="/my-orders" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#666] hover:bg-[#F8F5F0]">
                  <Package className="w-4 h-4" />My Orders
                </Link>
              )}
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
              {!user ? (
                <div className="text-center mt-10">
                  <p className="text-[#999] mb-4">Sign in to view your cart</p>
                  <button onClick={signInWithGoogle} className="text-sm text-[#8B7355] font-medium">Sign in with Google</button>
                </div>
              ) : cartLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 p-3 bg-[#F8F5F0] rounded-xl animate-pulse">
                      <div className="w-14 h-14 bg-[#E8E4DF] rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#E8E4DF] rounded w-2/3" />
                        <div className="h-3 bg-[#E8E4DF] rounded w-1/3" />
                        <div className="h-3 bg-[#E8E4DF] rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : cartItems.length === 0 ? (
                <p className="text-center text-[#999] mt-10">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
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

            {cartItems.length > 0 && (
              <div className="p-4 border-t border-[#EEE] bg-white">
                <Link href="/cart" onClick={() => setCartOpen(false)}
                  className="block w-full py-3 bg-[#1A1A1A] text-white text-center text-xs uppercase tracking-wider rounded-full font-medium hover:bg-[#8B7355] transition-colors">
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}