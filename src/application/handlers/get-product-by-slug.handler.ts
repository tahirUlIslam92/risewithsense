// import { GetProductBySlugQuery } from "@/application/queries/get-product-by-slug.query";
// import { IProductRepository } from "@/domain/interfaces/product.repository.interface";
// import { ProductDTO } from "@/application/dtos/product.dto";
// import { Result } from "@/shared/result/result";
// import { LRUCache } from "@/shared/utils/lru-cache";
// import { logger } from "@/infrastructure/logging/logger";

// /**
//  * Get Product By Slug Handler
//  * 
//  * Adds caching layer on top of query.
//  * Uses LRU cache for frequently accessed products.
//  * 
//  * Cache Strategy:
//  * - Cache hit: O(1) - HashMap lookup
//  * - Cache miss: O(log n) - Database query
//  * - Cache TTL: 5 minutes (handled by LRU with periodic cleanup)
//  */

// export class GetProductBySlugHandler {
//   private query: GetProductBySlugQuery;
//   private cache: LRUCache<string, ProductDTO>;

//   constructor(productRepository: IProductRepository) {
//     this.query = new GetProductBySlugQuery(productRepository);
//     this.cache = new LRUCache<string, ProductDTO>(200); // Cache 200 products
//   }

//   async execute(slug: string): Promise<Result<ProductDTO>> {
//     // Check cache first - O(1)
//     const cached = this.cache.get(slug);
//     if (cached) {
//       logger.debug("Cache hit for product", { slug });
//       return Result.ok(cached);
//     }

//     logger.debug("Cache miss for product", { slug });

//     // Fetch from database
//     const result = await this.query.execute(slug);

//     // Cache successful results
//     if (result.isSuccess()) {
//       this.cache.set(slug, result.getValue());
//     }

//     return result;
//   }

//   /**
//    * Invalidate cache for a specific slug
//    * O(1)
//    */
//   invalidateCache(slug: string): void {
//     this.cache.delete(slug);
//     logger.debug("Cache invalidated", { slug });
//   }

//   /**
//    * Invalidate all cache
//    * O(1)
//    */
//   invalidateAllCache(): void {
//     this.cache.clear();
//     logger.debug("Product cache cleared");
//   }
// }