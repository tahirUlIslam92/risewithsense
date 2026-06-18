import { MetadataRoute } from "next";
import { createServerClient } from "@/infrastructure/supabase/client.server";
import { SEO } from "@/config/constants";

/**
 * Dynamic Sitemap Generation
 * 
 * Google fetches sitemap.xml to discover all pages.
 * This generates the sitemap dynamically from Supabase.
 * 
 * URL: /sitemap.xml (Next.js auto-generates this route)
 * 
 * Priority:
 * - Homepage: 1.0 (highest)
 * - Product pages: 0.9
 * - Category pages: 0.7
 * - Static pages: 0.5
 * 
 * Change Frequency:
 * - Products: daily (inventory changes)
 * - Homepage: daily (new products)
 * - Categories: weekly
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supabase = createServerClient();

  // Fetch all published products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  // Fetch all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at");

  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Product pages
  const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at || now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Category pages (if you have category pages)
  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${baseUrl}/products?category=${cat.slug}`,
    lastModified: cat.updated_at || now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}