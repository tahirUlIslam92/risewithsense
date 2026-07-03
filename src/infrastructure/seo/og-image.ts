// import { ProductDTO } from "@/application/dtos/product.dto";

// /**
//  * Dynamic OG Image Generator
//  * 
//  * Generates Open Graph images for social sharing.
//  * 
//  * For production, use:
//  * - @vercel/og for edge-generated images
//  * - Or a static fallback image per product
//  * 
//  * Current implementation: Returns product primary image or fallback
//  */

// export class OgImageGenerator {
//   /**
//    * Get OG image URL for product
//    * O(1)
//    */
//   static forProduct(product: ProductDTO): string {
//     if (product.primaryImage) {
//       return product.primaryImage;
//     }

//     // Fallback: Use dynamic OG image generation endpoint
//     // return `${process.env.NEXT_PUBLIC_APP_URL}/api/og?title=${encodeURIComponent(product.name)}&price=${product.price}&brand=${product.brand}`;

//     return `${process.env.NEXT_PUBLIC_APP_URL}/images/site/og-default.jpg`;
//   }

//   /**
//    * Get OG image URL for homepage
//    * O(1)
//    */
//   static forHome(): string {
//     return `${process.env.NEXT_PUBLIC_APP_URL}/images/site/og-home.jpg`;
//   }

//   /**
//    * Generate OG image URL with text overlay
//    * 
//    * Production: Use @vercel/og or Cloudinary transformations
//    * Example: /api/og?title=Product%20Name&price=50000&image=url
//    */
//   static generateUrl(params: {
//     title: string;
//     subtitle?: string;
//     price?: number;
//     imageUrl?: string;
//   }): string {
//     const searchParams = new URLSearchParams();
//     searchParams.set("title", params.title);
//     if (params.subtitle) searchParams.set("subtitle", params.subtitle);
//     if (params.price) searchParams.set("price", params.price.toString());
//     if (params.imageUrl) searchParams.set("image", params.imageUrl);

//     return `${process.env.NEXT_PUBLIC_APP_URL}/api/og?${searchParams.toString()}`;
//   }
// }