// import { Product } from "@/domain/entities/product.entity";
// import { Slug } from "@/domain/value-objects/slug";
// import { ProductStatus } from "@/domain/enums/product-status.enum";
// import { PaginatedResult, PaginationParams } from "@/shared/types";

// /**
//  * Product Repository Interface (Port)
//  * 
//  * Defines the contract for product persistence.
//  * Domain layer defines this interface.
//  * Infrastructure layer implements it with Supabase.
//  * 
//  * This enables:
//  * - Testing with mock repositories
//  * - Swapping database without changing domain logic
//  * - Clear separation of concerns
//  */

// export interface IProductRepository {
//   /**
//    * Save product (create or update)
//    * 
//    * @throws {SupabaseError} If database operation fails
//    */
//   save(product: Product): Promise<void>;

//   /**
//    * Find product by slug
//    * 
//    * @returns Product or null if not found
//    */
//   findBySlug(slug: Slug): Promise<Product | null>;

//   /**
//    * Find product by ID
//    */
//   findById(id: string): Promise<Product | null>;

//   /**
//    * Find all published products with pagination
//    * 
//    * @param params - Pagination parameters
//    * @param filters - Optional filters
//    */
//   findAllPublished(
//     params: PaginationParams,
//     filters?: ProductFilters
//   ): Promise<PaginatedResult<Product>>;

//   /**
//    * Find all products (admin use)
//    */
//   findAll(
//     params: PaginationParams,
//     filters?: ProductFilters
//   ): Promise<PaginatedResult<Product>>;

//   /**
//    * Find featured products
//    */
//   findFeatured(limit: number): Promise<Product[]>;

//   /**
//    * Find related products (same category, excluding current)
//    */
//   findRelated(productId: string, categoryId: string, limit: number): Promise<Product[]>;

//   /**
//    * Search products by name or brand
//    * Uses Supabase full-text search or ILIKE
//    */
//   search(query: string, limit: number): Promise<Product[]>;

//   /**
//    * Delete product (soft delete - status change)
//    */
//   delete(id: string): Promise<void>;

//   /**
//    * Check if slug already exists (for uniqueness)
//    */
//   slugExists(slug: Slug, excludeId?: string): Promise<boolean>;

//   /**
//    * Count products by status
//    */
//   countByStatus(status: ProductStatus): Promise<number>;

//   /**
//    * Get total product count
//    */
//   totalCount(): Promise<number>;
// }

// /**
//  * Product Filters for queries
//  */
// export interface ProductFilters {
//   status?: ProductStatus;
//   brand?: string;
//   type?: string;
//   gender?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   categoryId?: string;
//   isFeatured?: boolean;
//   sortBy?: "price" | "createdAt" | "name" | "popularity";
//   sortOrder?: "asc" | "desc";
// }