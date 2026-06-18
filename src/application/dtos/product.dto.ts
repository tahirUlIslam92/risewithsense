import { z } from "zod";
import { Product } from "@/domain/entities/product.entity";
import { WATCH_TYPE, GENDER } from "@/shared/types";

/**
 * Product DTO - Data Transfer Object
 * 
 * Shapes data for API responses.
 * Decouples domain entities from presentation.
 */

// ============================================
// RESPONSE DTO (Database → Client)
// ============================================

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  brand: string;
  type: string;
  price: number;
  formattedPrice: string;
  costPrice: number;
  stock: number;
  description: string;
  images: string[];
  status: string;
  featured: boolean;
  gender: string | null;
  caseSize: string | null;
  waterResistance: string | null;
  categoryId: string | null;
  categoryName: string | null;
  profitMargin: number;
  isInStock: boolean;
  isPublished: boolean;
  primaryImage: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Map domain entity to DTO
 * O(n) where n = number of properties
 */
export function toProductDTO(product: Product): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    type: product.type,
    price: product.price.amount,
    formattedPrice: product.price.formatPKR(),
    costPrice: product.costPrice.amount,
    stock: product.stock,
    description: product.description,
    images: product.images,
    status: product.status,
    featured: product.featured,
    gender: product.gender,
    caseSize: product.caseSize,
    waterResistance: product.waterResistance,
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    profitMargin: Math.round(product.profitMargin * 100) / 100,
    isInStock: product.isInStock(),
    isPublished: product.isPublished,
    primaryImage: product.primaryImage,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

// ============================================
// INPUT DTO (Client → Server) - Zod validated
// ============================================

export const createProductSchema = z.object({
  name: z.string().min(3).max(200),
  brand: z.string().min(2).max(100),
  type: z.enum(["analog", "digital", "chronograph", "smart"]),
  price: z.number().positive().max(99999999),
  costPrice: z.number().positive().max(99999999),
  stock: z.number().int().min(0).max(99999),
  description: z.string().min(10).max(5000),
  images: z.array(z.string().url()).min(0).max(10),
  gender: z.enum(["men", "women", "unisex"]).optional(),
  caseSize: z.string().max(20).optional(),
  waterResistance: z.string().max(50).optional(),
  categoryId: z.string().optional(),
  featured: z.boolean().default(false),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  type: z.string().optional(),
  brand: z.string().optional(),
  gender: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  sortBy: z.enum(["price", "createdAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  featured: z.coerce.boolean().optional(),
});

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;