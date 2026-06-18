import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-12 md:py-20 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-stone-500 mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Order ID</span>
            <span className="font-mono font-medium text-stone-900">#WS-2026-001</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Date</span>
            <span className="font-medium text-stone-900">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Payment</span>
            <span className="font-medium text-green-600">Cash on Delivery</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Status</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-100">
            <span>Total</span>
            <span>Rs. 65,000</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-amber-50 rounded-2xl p-5 mb-8 text-left">
          <h3 className="font-semibold text-amber-900 text-sm mb-2">📱 What's Next?</h3>
          <ol className="space-y-2 text-sm text-amber-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              You'll receive a confirmation call on your provided number.
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              Order will be dispatched within 24 hours.
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              Delivery in 2-5 business days.
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-all active:scale-95 text-sm"
          >
            Continue Shopping
          </Link>
          <a
            href="https://wa.me/923000000000"
            target="_blank"
            className="flex-1 py-3 border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}