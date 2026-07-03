// import { ProductDTO } from "@/application/dtos/product.dto";
// import { OrderDTO } from "@/application/dtos/order.dto";
// import { SEO } from "@/config/constants";

// /**
//  * JSON-LD Structured Data Generator
//  * 
//  * Google uses structured data for:
//  * - Rich snippets (star ratings, price, availability)
//  * - Product carousel
//  * - Breadcrumb navigation
//  * - Organization info
//  * 
//  * Schema.org types used:
//  * - Product
//  * - BreadcrumbList
//  * - Organization
//  * - LocalBusiness (for physical store)
//  */

// export class StructuredData {
//   /**
//    * Generate Product schema
//    * 
//    * This enables Google Shopping rich results:
//    * - Price display
//    * - Stock availability
//    * - Star ratings (if reviews exist)
//    * - Product image carousel
//    */
//   static product(product: ProductDTO): Record<string, unknown> {
//     return {
//       "@context": "https://schema.org",
//       "@type": "Product",
//       name: product.name,
//       description: product.description,
//       image: product.images,
//       sku: product.id,
//       mpn: product.id,
//       brand: {
//         "@type": "Brand",
//         name: product.brand,
//       },
//       offers: {
//         "@type": "Offer",
//         url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
//         priceCurrency: "PKR",
//         price: product.price,
//         availability: product.isInStock
//           ? "https://schema.org/InStock"
//           : "https://schema.org/OutOfStock",
//         seller: {
//           "@type": "Organization",
//           name: "WatchStore Pakistan",
//         },
//       },
//       ...(product.gender && {
//         audience: {
//           "@type": "PeopleAudience",
//           suggestedGender: product.gender,
//         },
//       }),
//     };
//   }

//   /**
//    * Generate BreadcrumbList schema
//    * 
//    * Enables breadcrumb rich snippets in Google:
//    *   Home > Products > Product Name
//    */
//   static breadcrumbs(items: Array<{ name: string; url: string }>): Record<string, unknown> {
//     return {
//       "@context": "https://schema.org",
//       "@type": "BreadcrumbList",
//       itemListElement: items.map((item, index) => ({
//         "@type": "ListItem",
//         position: index + 1,
//         name: item.name,
//         item: item.url,
//       })),
//     };
//   }

//   /**
//    * Generate Organization schema
//    * 
//    * Helps Google understand your business for:
//    * - Knowledge Graph panel
//    * - Local search results
//    */
//   static organization(): Record<string, unknown> {
//     return {
//       "@context": "https://schema.org",
//       "@type": "Organization",
//       name: "WatchStore Pakistan",
//       url: process.env.NEXT_PUBLIC_APP_URL,
//       logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/site/logo.png`,
//       contactPoint: {
//         "@type": "ContactPoint",
//         telephone: "+92-300-0000000",
//         contactType: "customer service",
//         availableLanguage: ["English", "Urdu"],
//       },
//       sameAs: [
//         "https://facebook.com/watchstore.pk",
//         "https://instagram.com/watchstore.pk",
//       ],
//     };
//   }

//   /**
//    * Generate LocalBusiness schema
//    * 
//    * For physical store location.
//    * Enables Google Maps listing.
//    */
//   static localBusiness(): Record<string, unknown> {
//     return {
//       "@context": "https://schema.org",
//       "@type": "LocalBusiness",
//       name: "WatchStore Pakistan",
//       image: `${process.env.NEXT_PUBLIC_APP_URL}/images/site/store.jpg`,
//       address: {
//         "@type": "PostalAddress",
//         streetAddress: "Shop 4, Watch Plaza",
//         addressLocality: "Karachi",
//         addressCountry: "PK",
//       },
//       telephone: "+92-300-0000000",
//       openingHoursSpecification: [
//         {
//           "@type": "OpeningHoursSpecification",
//           dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
//           opens: "10:00",
//           closes: "21:00",
//         },
//       ],
//     };
//   }

//   /**
//    * Generate WebSite schema with Sitelinks Searchbox
//    */
//   static website(): Record<string, unknown> {
//     return {
//       "@context": "https://schema.org",
//       "@type": "WebSite",
//       name: "WatchStore Pakistan",
//       url: process.env.NEXT_PUBLIC_APP_URL,
//       potentialAction: {
//         "@type": "SearchAction",
//         target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
//         "query-input": "required name=search_term_string",
//       },
//     };
//   }
// }