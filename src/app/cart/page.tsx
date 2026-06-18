import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";

const cartItems = [
  { id: "1", name: "Classic Chronograph", slug: "classic-chronograph", price: 50000, image: null, quantity: 2 },
  { id: "2", name: "Digital Pro", slug: "digital-pro", price: 15000, image: null, quantity: 1 },
];

const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
const total = subtotal;

export default function CartPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-bold text-stone-900 mb-6">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500">Your cart is empty</p>
            <Link href="/products" className="text-amber-600 font-semibold text-sm mt-2 inline-block">Continue Shopping →</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border">
                  <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-xl">⌚</div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <p className="text-sm font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                    <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-white rounded-2xl border space-y-2">
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
            </div>
            <Link href="/checkout" className="block w-full mt-4 py-4 bg-stone-900 text-white text-center rounded-2xl font-semibold">Checkout</Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}