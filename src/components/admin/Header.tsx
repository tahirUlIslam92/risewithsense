"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Mobile Logo + Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Menu"
        >
          <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-stone-900 text-sm">WatchStore</span>
      </div>

      {/* Title (Desktop) */}
      <h1 className="hidden md:block text-lg font-bold text-stone-900">
        Dashboard
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-stone-100 transition-colors">
          <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2 p-2 rounded-full hover:bg-stone-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600">
            A
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-stone-100 p-4 md:hidden shadow-lg">
          <nav className="flex flex-col gap-1">
            {[
              { href: "/admin", label: "Dashboard" },
              { href: "/admin/products", label: "Products" },
              { href: "/admin/orders", label: "Orders" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-1" />
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl text-sm text-stone-500 hover:bg-stone-50 transition-colors"
            >
              ← Back to Store
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}