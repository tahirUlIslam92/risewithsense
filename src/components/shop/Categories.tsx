import Link from "next/link";

const categories = [
  {
    name: "Analog",
    slug: "analog",
    icon: "🕐",
    description: "Classic timepieces with mechanical movements",
    gradient: "from-blue-50 to-blue-100",
    textColor: "text-blue-700",
  },
  {
    name: "Digital",
    slug: "digital",
    icon: "📟",
    description: "Modern digital displays for everyday wear",
    gradient: "from-emerald-50 to-emerald-100",
    textColor: "text-emerald-700",
  },
  {
    name: "Chronograph",
    slug: "chronograph",
    icon: "⏱️",
    description: "Precision timing with stopwatch functionality",
    gradient: "from-purple-50 to-purple-100",
    textColor: "text-purple-700",
  },
  {
    name: "Smart",
    slug: "smart",
    icon: "⌚",
    description: "Connected watches for the modern lifestyle",
    gradient: "from-orange-50 to-orange-100",
    textColor: "text-orange-700",
  },
];

export function Categories() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-8 md:mb-12">
        <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">
          Browse By
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-stone-900 mt-2">
          Watch Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?type=${category.slug}`}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-stone-900/10 active:scale-95`}
          >
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">{category.icon}</div>
            <h3 className={`text-sm md:text-lg font-bold ${category.textColor} mb-1`}>
              {category.name}
            </h3>
            <p className="text-xs md:text-sm text-stone-500 hidden md:block">
              {category.description}
            </p>
            <div className={`absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${category.textColor}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}