import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#F8F6F3] border-t border-[#E8E4DF]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-[#1A1A1A]">
              WATCH<span className="text-[#8B7355]">STORE</span>
            </Link>
            <p className="text-xs text-[#999] mt-4 leading-relaxed max-w-xs">
              Premium timepieces for the discerning individual. Authenticity guaranteed.
            </p>
          </div>
          {[
            { title: "SHOP", links: ["All Watches", "Analog", "Digital", "Smart"].map(l => ({ href: l === "All Watches" ? "/products" : `/products?type=${l.toLowerCase()}`, label: l })) },
            { title: "SUPPORT", links: [{ href: "/contact", label: "Contact" },{ href: "/shipping", label: "Shipping" },{ href: "/returns", label: "Returns" }] },
            { title: "CONTACT", links: [{ href: "tel:+923000000000", label: "0300 0000000" },{ href: "mailto:hello@watchstore.pk", label: "hello@watchstore.pk" }] },
          ].map(s => (
            <div key={s.title}>
              <h4 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em] mb-5">{s.title}</h4>
              <ul className="space-y-3">
                {s.links.map(l => <li key={l.label}><Link href={l.href} className="text-xs text-[#666] hover:text-[#8B7355] transition-colors uppercase tracking-wider">{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-[#E8E4DF] text-center text-[10px] text-[#999] uppercase tracking-[0.3em]">
          © 2026 WatchStore. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}