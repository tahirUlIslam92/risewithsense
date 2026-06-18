import { Metadata } from "next";
import { ProductDTO } from "@/application/dtos/product.dto";
import { SEO } from "@/config/constants";

/**
 * SEO Metadata Builder
 * 
 * Generates Next.js Metadata objects for SEO.
 * Google's #1 ranking factor: unique, descriptive title + description.
 * 
 * Usage:
 *   export async function generateMetadata({ params }): Promise<Metadata> {
 *     return ProductMetaBuilder.generate(params.slug);
 *   }
 */

export class ProductMetaBuilder {
  /**
   * Generate metadata for product page
   * O(1) - string formatting
   */
  static generate(product: ProductDTO): Metadata {
    const title = `${product.name} - ${product.brand} | ${SEO.DEFAULT_TITLE}`;
    const description = ProductMetaBuilder.buildDescription(product);

    return {
      title,
      description,
      keywords: ProductMetaBuilder.buildKeywords(product),
      openGraph: {
        title,
        description,
        images: product.primaryImage ? [{ url: product.primaryImage, width: 1200, height: 630 }] : [],
        type: "product",
        locale: "ur_PK",
        siteName: "WatchStore Pakistan",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.primaryImage ? [product.primaryImage] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }

  private static buildDescription(product: ProductDTO): string {
    if (product.description) {
      return product.description.substring(0, 160);
    }
    return `Buy ${product.name} by ${product.brand} online in Pakistan. COD available. Fast delivery across Karachi, Lahore, Islamabad. Rs. ${product.price.toLocaleString()}`;
  }

  private static buildKeywords(product: ProductDTO): string[] {
    return [
      product.name,
      product.brand,
      product.type,
      `${product.brand} watches`,
      `buy ${product.brand} in Pakistan`,
      "watches Pakistan",
      "COD watches",
      ...(product.gender ? [`${product.gender} watches`] : []),
    ];
  }
}

export class CategoryMetaBuilder {
  static generate(categoryName: string): Metadata {
    const title = `${categoryName} | WatchStore Pakistan`;
    const description = `Shop ${categoryName.toLowerCase()} online in Pakistan. Premium quality watches with Cash on Delivery. Fast shipping across Pakistan.`;

    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { card: "summary", title, description },
    };
  }
}

export class HomeMetaBuilder {
  static generate(): Metadata {
    return {
      title: "WatchStore - Premium Watches in Pakistan | COD Available",
      description: "Buy premium watches online in Pakistan. Cash on Delivery. Fast delivery across Karachi, Lahore, Islamabad and all cities. Analog, Digital, Smart watches available.",
      keywords: [
        "watches Pakistan",
        "buy watches online Pakistan",
        "premium watches",
        "COD watches",
        "analog watches",
        "digital watches",
        "smart watches Pakistan",
      ],
      openGraph: {
        title: "WatchStore - Premium Watches in Pakistan",
        description: "Premium watches with Cash on Delivery across Pakistan",
        type: "website",
        locale: "ur_PK",
        siteName: "WatchStore Pakistan",
      },
      robots: { index: true, follow: true },
    };
  }
}