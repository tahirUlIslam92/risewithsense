// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { ProductDTO } from "@/application/dtos/product.dto";
// import { getProducts, getProductBySlug } from "@/application/actions/product.action";
// import { LRUCache } from "@/shared/utils/lru-cache";

// /**
//  * useProducts Hook
//  * 
//  * Custom hook for fetching product listings with:
//  * - Client-side caching (LRU - 50 items)
//  * - Pagination
//  * - Loading/error states
//  * - Filter persistence
//  * 
//  * Data Structure: LRU Cache for O(1) product access
//  * 
//  * Usage:
//  *   const { products, isLoading, loadMore, hasMore } = useProducts();
//  */

// interface UseProductsOptions {
//   initialPage?: number;
//   limit?: number;
//   filters?: Record<string, string>;
// }

// interface UseProductsReturn {
//   products: ProductDTO[];
//   isLoading: boolean;
//   error: string | null;
//   hasMore: boolean;
//   total: number;
//   loadMore: () => Promise<void>;
//   refresh: () => Promise<void>;
//   updateFilters: (filters: Record<string, string>) => void;
// }

// // Global cache shared across component instances
// const productListCache = new LRUCache<string, {
//   products: ProductDTO[];
//   total: number;
//   hasMore: boolean;
// }>(20); // Cache 20 page results

// export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
//   const {
//     initialPage = 1,
//     limit = 12,
//     filters: initialFilters = {},
//   } = options;

//   const [products, setProducts] = useState<ProductDTO[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [filters, setFilters] = useState(initialFilters);
//   const pageRef = useRef(initialPage);
//   const abortControllerRef = useRef<AbortController | null>(null);

//   const cacheKey = JSON.stringify({ page: pageRef.current, limit, filters });

//   /**
//    * Fetch products from server
//    * O(1) cache check + O(n) network where n = page size
//    */
//   const fetchProducts = useCallback(async (page: number, isLoadMore: boolean = false) => {
//     // Check cache first - O(1)
//     const cached = productListCache.get(cacheKey);
//     if (cached) {
//       setProducts(cached.products);
//       setTotal(cached.total);
//       setHasMore(cached.hasMore);
//       return;
//     }

//     // Cancel previous request
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//     abortControllerRef.current = new AbortController();

//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await getProducts({
//         page,
//         limit,
//         ...filters,
//       });

//       if (result.isSuccess()) {
//         const data = result.getValue();
//         const newProducts = data.data;
//         const totalProducts = data.pagination.total;

//         if (isLoadMore) {
//           const merged = [...products, ...newProducts];
//           setProducts(merged);
//         } else {
//           setProducts(newProducts);
//         }

//         setTotal(totalProducts);
//         setHasMore(data.pagination.hasNext);

//         // Cache the result
//         productListCache.set(cacheKey, {
//           products: isLoadMore ? [...products, ...newProducts] : newProducts,
//           total: totalProducts,
//           hasMore: data.pagination.hasNext,
//         });
//       } else {
//         setError(result.getError().message);
//       }
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [limit, filters, cacheKey]);

//   // Initial fetch
//   useEffect(() => {
//     pageRef.current = initialPage;
//     fetchProducts(initialPage, false);

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [initialPage, fetchProducts]);

//   /**
//    * Load next page
//    * O(1) page increment + O(n) fetch
//    */
//   const loadMore = useCallback(async () => {
//     if (!hasMore || isLoading) return;
//     pageRef.current += 1;
//     await fetchProducts(pageRef.current, true);
//   }, [hasMore, isLoading, fetchProducts]);

//   /**
//    * Refresh current page
//    */
//   const refresh = useCallback(async () => {
//     pageRef.current = 1;
//     productListCache.clear(); // Invalidate cache
//     await fetchProducts(1, false);
//   }, [fetchProducts]);

//   /**
//    * Update filters and reload
//    */
//   const updateFilters = useCallback((newFilters: Record<string, string>) => {
//     setFilters(newFilters);
//     pageRef.current = 1;
//     productListCache.clear();
//     fetchProducts(1, false);
//   }, [fetchProducts]);

//   return {
//     products,
//     isLoading,
//     error,
//     hasMore,
//     total,
//     loadMore,
//     refresh,
//     updateFilters,
//   };
// }

// /**
//  * useProduct Hook - Single product with caching
//  * O(1) cache hit, O(log n) cache miss
//  */
// const singleProductCache = new LRUCache<string, ProductDTO>(50);

// export function useProduct(slug: string) {
//   const [product, setProduct] = useState<ProductDTO | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     async function fetchProduct() {
//       // Check cache - O(1)
//       const cached = singleProductCache.get(slug);
//       if (cached) {
//         if (!cancelled) {
//           setProduct(cached);
//           setIsLoading(false);
//         }
//         return;
//       }

//       setIsLoading(true);

//       try {
//         const result = await getProductBySlug(slug);

//         if (!cancelled) {
//           if (result.isSuccess()) {
//             const product = result.getValue();
//             setProduct(product);
//             singleProductCache.set(slug, product);
//           } else {
//             setError(result.getError().message);
//           }
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError((err as Error).message);
//         }
//       } finally {
//         if (!cancelled) {
//           setIsLoading(false);
//         }
//       }
//     }

//     if (slug) {
//       fetchProduct();
//     }

//     return () => {
//       cancelled = true;
//     };
//   }, [slug]);

//   const refresh = useCallback(async () => {
//     singleProductCache.delete(slug);
//     setIsLoading(true);
//     const result = await getProductBySlug(slug);
//     if (result.isSuccess()) {
//       setProduct(result.getValue());
//     } else {
//       setError(result.getError().message);
//     }
//     setIsLoading(false);
//   }, [slug]);

//   return { product, isLoading, error, refresh };
// }