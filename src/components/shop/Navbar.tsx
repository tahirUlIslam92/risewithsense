"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"}`}>
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between border-b border-[#E8E4DF]">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1A1A1A]">
            WATCH<span className="text-[#8B7355]">STORE</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["All Watches", "Analog", "Digital", "Smart"].map((item) => (
              <Link key={item} href={item === "All Watches" ? "/products" : `/products?type=${item.toLowerCase()}`}
                className={`text-xs uppercase tracking-wider font-medium transition-colors ${pathname.includes(item.toLowerCase()) ? "text-[#8B7355]" : "text-[#666] hover:text-[#1A1A1A]"}`}
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 hover:bg-[#F8F6F3] transition-colors">
              <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B7355] text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
              <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 pb-4" : "max-h-0"}`}>
          {["All Watches", "Analog", "Digital", "Smart"].map((item) => (
            <Link key={item} href={item === "All Watches" ? "/products" : `/products?type=${item.toLowerCase()}`}
              className="block px-4 py-3 text-sm text-[#666] hover:text-[#1A1A1A] hover:bg-[#F8F6F3] uppercase tracking-wider font-medium"
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}