import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import Link from "next/link";

// Demo products
const products = [
  { id: "1", name: "Classic Chronograph", brand: "Rolex", type: "Analog", price: 50000, stock: 10, status: "Published", featured: true },
  { id: "2", name: "Digital Pro", brand: "Casio", type: "Digital", price: 15000, stock: 25, status: "Published", featured: true },
  { id: "3", name: "Smart Elite", brand: "Apple", type: "Smart", price: 120000, stock: 5, status: "Published", featured: true },
  { id: "4", name: "Diver Edition", brand: "Omega", type: "Analog", price: 75000, stock: 0, status: "Draft", featured: false },
  { id: "5", name: "Chronograph Pro", brand: "Tag Heuer", type: "Chronograph", price: 95000, stock: 3, status: "Published", featured: false },
];

const statusColors: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-stone-100 text-stone-500",
  Archived: "bg-red-100 text-red-700",
};

export default function AdminProducts() {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        <Header />

        <main className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-900">Products</h2>
              <p className="text-sm text-stone-500 mt-1">{products.length} total products</p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all bg-white"
            />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="block p-4 bg-white rounded-2xl border border-stone-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-amber-600 font-semibold uppercase">{product.brand}</p>
                    <h3 className="font-semibold text-stone-900 text-sm">{product.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[product.status]}`}>
                    {product.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span>Rs. {product.price.toLocaleString()}</span>
                  <span className={`${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                    Stock: {product.stock}
                  </span>
                  {product.featured && <span className="text-amber-600">★ Featured</span>}
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-50">
                  {["Product", "Brand", "Type", "Price", "Stock", "Status", "Featured"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors cursor-pointer">
                    <td className="px-5 py-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-sm font-semibold text-stone-900 hover:text-amber-600">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-stone-500">{product.brand}</td>
                    <td className="px-5 py-3 text-sm text-stone-500">{product.type}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-stone-900">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusColors[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {product.featured ? (
                        <span className="text-amber-500 text-sm">★</span>
                      ) : (
                        <span className="text-stone-300 text-sm">☆</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}