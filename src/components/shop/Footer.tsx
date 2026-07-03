import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1A1817] text-white pb-16 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">
              Rise<span className="text-[#8B7355] font-light italic">WithSense</span>
            </Link>
            <p className="mt-3 text-xs text-[#999] leading-relaxed">
              Premium lifestyle store. Curated products for the modern you.
            </p>
          </div>
          {[
            { t: "Categories", l: ["Watches", "Earbuds", "Perfumes", "Clothing", "Wallets", "Grooming"] },
            { t: "Help", l: ["Contact", "Shipping", "Returns", "FAQ"] },
            { t: "Contact", l: ["0300 0000000", "hello@risewithsense.pk", "Karachi, Pakistan"] },
          ].map((s) => (
            <div key={s.t}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B7355] mb-4">{s.t}</h4>
              <ul className="space-y-2.5">
                {s.l.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[#2A2827] py-4 text-center text-[10px] text-[#666]">
        © 2026 Rise With Sense. All rights reserved.
      </div>
    </footer>
  );
}
