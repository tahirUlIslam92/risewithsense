import { MetadataRoute } from "next";

/**
 * Robots.txt Configuration
 * 
 * Tells search engine crawlers which pages to index.
 * 
 * URL: /robots.txt (Next.js auto-generates this route)
 * 
 * Rules:
 * 1. Allow: Homepage, products, search
 * 2. Disallow: Cart, checkout, admin, API
 * 3. Sitemap: Points to sitemap.xml
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/products/",
          "/search/",
        ],
        disallow: [
          "/cart/",
          "/checkout/",
          "/order-confirmation/",
          "/account/",
          "/admin/",
          "/api/",
        ],
      },
      // Block AI training bots
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}