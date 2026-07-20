"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";

const CATEGORIES = [
  { id: "cat_watches", name: "Watches" },
  { id: "cat_earbuds", name: "Earbuds" },
  { id: "cat_perfumes", name: "Perfumes" },
  { id: "cat_clothing", name: "Clothing" },
  { id: "cat_wallets", name: "Wallets" },
  { id: "cat_grooming", name: "Grooming" },
  { id: "cat_accessories", name: "Accessories" },
];

const TYPES: Record<string, string> = {
  cat_watches: "analog", cat_earbuds: "earbuds", cat_perfumes: "perfume",
  cat_clothing: "clothing", cat_wallets: "wallet", cat_grooming: "grooming", cat_accessories: "accessories",
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", brand: "", category_id: "cat_watches", price: "", cost_price: "", stock_qty: "", description: "", gender: "unisex", case_size: "", water_resist: "" });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, slug, type: TYPES[form.category_id] || "analog", price: Number(form.price), cost_price: Number(form.cost_price), stock_qty: Number(form.stock_qty), images: [], featured: false, is_active: true }) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); setLoading(false); return; }
      if (imageFiles.length > 0) { for (const file of imageFiles) { const fd = new FormData(); fd.append("file", file); fd.append("slug", slug); await fetch("/api/admin/upload", { method: "POST", body: fd }); } }
      router.push("/admin/products"); router.refresh();
    } catch { setError("Network error"); } finally { setLoading(false); }
  };

  const updateField = (f: string, v: string) => setForm({ ...form, [f]: v });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1C1917]">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-500">{error}</p>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Product Name" value={form.name} onChange={v => updateField("name", v)} required />
          <Input label="Brand" value={form.brand} onChange={v => updateField("brand", v)} required />
        </div>
        <Select label="Category" value={form.category_id} onChange={v => updateField("category_id", v)} options={CATEGORIES.map(c => ({ value: c.id, label: c.name }))} />
        <div className="grid grid-cols-3 gap-4">
          <Input label="Price (Rs.)" type="number" value={form.price} onChange={v => updateField("price", v)} required />
          <Input label="Cost Price" type="number" value={form.cost_price} onChange={v => updateField("cost_price", v)} required />
          <Input label="Stock Qty" type="number" value={form.stock_qty} onChange={v => updateField("stock_qty", v)} required />
        </div>
        <Select label="Gender" value={form.gender} onChange={v => updateField("gender", v)} options={[{ value: "men", label: "Men" }, { value: "women", label: "Women" }, { value: "unisex", label: "Unisex" }]} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Case Size" value={form.case_size} onChange={v => updateField("case_size", v)} />
          <Input label="Water Resistance" value={form.water_resist} onChange={v => updateField("water_resist", v)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#8A7F72]">Description</label>
          <textarea rows={4} value={form.description} onChange={e => updateField("description", e.target.value)} className="w-full resize-none rounded-xl border border-[#E8E2D9] px-4 py-3 text-sm outline-none transition-colors focus:border-[#6B5638] focus:ring-2 focus:ring-[#6B5638]/10" required />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#8A7F72]">Product Images</label>
          <div className="mb-3 flex flex-wrap gap-3">
            {imagePreviews.map((url, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl bg-[#F1EBE1]">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-3 w-3" /></button>
              </div>
            ))}
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8CFC0] transition-colors hover:border-[#6B5638] hover:bg-[#FAF7F2]">
              <Upload className="h-5 w-5 text-[#B3A896]" /><span className="mt-1 text-[10px] text-[#8A7F72]">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            </label>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-br from-[#6B5638] to-[#8B7355] py-4 text-sm font-medium text-white shadow-lg shadow-[#6B5638]/20 transition-all hover:shadow-xl hover:shadow-[#6B5638]/30 disabled:opacity-50">
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#8A7F72]">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full rounded-xl border border-[#E8E2D9] px-4 py-3 text-sm outline-none transition-colors focus:border-[#6B5638] focus:ring-2 focus:ring-[#6B5638]/10" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#8A7F72]">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#6B5638] focus:ring-2 focus:ring-[#6B5638]/10">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}