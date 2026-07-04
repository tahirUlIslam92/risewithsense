import { Suspense } from "react";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Suspense fallback={<div className="h-14" />}>
        <Navbar />
      </Suspense>
      <main className="max-w-lg mx-auto px-4 pt-24 pb-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-[#999] mb-8">Thank you for your purchase. We will contact you shortly.</p>
        <Link
          href="/products"
          className="inline-block px-8 py-3.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#8B7355] transition-colors"
        >
          Continue Shopping
        </Link>
      </main>
      <Footer />
    </div>
  );
}

