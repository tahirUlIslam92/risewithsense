import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-8 md:py-12">
        <h1 className="text-xl md:text-2xl font-bold text-stone-900 mb-6">Checkout</h1>

        <form className="space-y-5">
          {/* Contact Info */}
          <div className="p-5 bg-white rounded-2xl border border-stone-100 space-y-4">
            <h2 className="font-semibold text-stone-900 text-sm">Contact Information</h2>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Full Name *</label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" placeholder="Enter your full name" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Phone Number *</label>
              <input type="tel" required pattern="03[0-9]{9}" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" placeholder="03XXXXXXXXX" />
            </div>
          </div>

          {/* Shipping */}
          <div className="p-5 bg-white rounded-2xl border border-stone-100 space-y-4">
            <h2 className="font-semibold text-stone-900 text-sm">Shipping Address</h2>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">City *</label>
              <select required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all bg-white">
                <option value="">Select city</option>
                {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Full Address *</label>
              <textarea required rows={3} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none" placeholder="House no., Street, Area..." />
            </div>
          </div>

          {/* Payment */}
          <div className="p-5 bg-white rounded-2xl border border-stone-100 space-y-3">
            <h2 className="font-semibold text-stone-900 text-sm">Payment Method</h2>
            
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-amber-500 bg-amber-50 cursor-pointer">
              <input type="radio" name="payment" value="cod" defaultChecked className="w-4 h-4 accent-amber-500" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Cash on Delivery</p>
                <p className="text-xs text-stone-500">Pay when you receive your order</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-stone-200 cursor-pointer hover:border-stone-300 transition-colors">
              <input type="radio" name="payment" value="bank" className="w-4 h-4 accent-amber-500" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Bank Transfer</p>
                <p className="text-xs text-stone-500">Manual bank deposit</p>
              </div>
            </label>
          </div>

          {/* Order Summary */}
          <div className="p-5 bg-white rounded-2xl border border-stone-100 space-y-2">
            <h2 className="font-semibold text-stone-900 text-sm">Order Summary</h2>
            <div className="flex justify-between text-sm"><span className="text-stone-500">Subtotal (2 items)</span><span>Rs. 65,000</span></div>
            <div className="flex justify-between text-sm"><span className="text-stone-500">Shipping</span><span className="text-green-600">Free</span></div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-stone-100"><span>Total</span><span>Rs. 65,000</span></div>
          </div>

          {/* Place Order */}
          <button
            type="submit"
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-semibold hover:bg-stone-800 transition-all active:scale-[0.98]"
          >
            Place Order — Rs. 65,000
          </button>

          <p className="text-xs text-stone-400 text-center">
            By placing this order, you agree to our terms and conditions.
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}