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
  cat_watches: "analog",
  cat_earbuds: "earbuds",
  cat_perfumes: "perfume",
  cat_clothing: "clothing",
  cat_wallets: "wallet",
  cat_grooming: "grooming",
  cat_accessories: "accessories",
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", brand: "", category_id: "cat_watches", price: "", cost_price: "", stock_qty: "", description: "", gender: "unisex", case_size: "", water_resist: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    const previews = newFiles.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    try {
      // Step 1: Create product
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug,
          type: TYPES[form.category_id] || "analog",
          price: Number(form.price),
          cost_price: Number(form.cost_price),
          stock_qty: Number(form.stock_qty),
          images: [],
          featured: false,
          is_active: true,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to create product");
        setLoading(false);
        return;
      }

      // Step 2: Upload images via server API (service role)
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("slug", slug);

          await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Name" value={form.name} onChange={v => updateField("name", v)} required />
          <Input label="Brand" value={form.brand} onChange={v => updateField("brand", v)} required />
        </div>

        <Select label="Category" value={form.category_id} onChange={v => updateField("category_id", v)} options={CATEGORIES.map(c => ({ value: c.id, label: c.name }))} />

        <div className="grid grid-cols-3 gap-4">
          <Input label="Price (Rs.)" type="number" value={form.price} onChange={v => updateField("price", v)} required />
          <Input label="Cost Price" type="number" value={form.cost_price} onChange={v => updateField("cost_price", v)} required />
          <Input label="Stock Qty" type="number" value={form.stock_qty} onChange={v => updateField("stock_qty", v)} required />
        </div>

        <Select label="Gender" value={form.gender} onChange={v => updateField("gender", v)} options={[
          { value: "men", label: "Men" }, { value: "women", label: "Women" }, { value: "unisex", label: "Unisex" }
        ]} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Case Size (optional)" value={form.case_size} onChange={v => updateField("case_size", v)} />
          <Input label="Water Resistance (optional)" value={form.water_resist} onChange={v => updateField("water_resist", v)} />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#999] uppercase mb-1">Description</label>
          <textarea rows={4} value={form.description} onChange={e => updateField("description", e.target.value)}
            className="w-full px-4 py-3 border border-[#EEE] rounded-xl text-sm outline-none focus:border-[#8B7355] resize-none" required />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-xs font-medium text-[#999] uppercase mb-2">Product Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {imagePreviews.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5F5F5]">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#DDD] flex flex-col items-center justify-center cursor-pointer hover:border-[#8B7355] transition-colors">
              <Upload className="w-5 h-5 text-[#999]" />
              <span className="text-[10px] text-[#999] mt-1">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 bg-[#1A1A1A] text-white text-sm font-medium rounded-xl hover:bg-[#8B7355] transition-colors disabled:opacity-50">
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#999] uppercase mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-4 py-3 border border-[#EEE] rounded-xl text-sm outline-none focus:border-[#8B7355] transition-colors" />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#999] uppercase mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-[#EEE] rounded-xl text-sm outline-none focus:border-[#8B7355] bg-white transition-colors">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}