// "use server";

// import { revalidatePath } from "next/cache";
// import { Result } from "@/shared/result/result";
// import { ProductDTO, CreateProductInput, UpdateProductInput } from "@/application/dtos/product.dto";
// import { ProductValidator } from "@/application/validators/product.validator";
// import { GetProductBySlugHandler } from "@/application/handlers/get-product-by-slug.handler";
// import { GetProductsQuery } from "@/application/queries/get-products.query";
// import { isAuthenticated, isAdmin } from "@/shared/guards/auth.guard";
// import { createServerClient } from "@/infrastructure/supabase/client.server";
// import { SupabaseProductRepository } from "@/infrastructure/supabase/repositories/product.repository";
// import { UnauthorizedError, ForbiddenError, AppError } from "@/shared/errors/app-error";

// /**
//  * Product Server Actions
//  * 
//  * Next.js Server Actions are the API layer.
//  * These are called directly from React components.
//  * 
//  * Security:
//  * 1. Every action checks authentication
//  * 2. Admin actions check admin role
//  * 3. Input validated with Zod
//  * 4. Rate limiting via Supabase RLS
//  */

// const supabase = createServerClient();
// const productRepository = new SupabaseProductRepository(supabase);
// const getProductsQuery = new GetProductsQuery(productRepository);
// const getProductHandler = new GetProductBySlugHandler(productRepository);

// // ============================================
// // PUBLIC ACTIONS (No auth required)
// // ============================================

// /**
//  * Get product by slug (public)
//  * Used on product detail pages
//  */
// export async function getProductBySlug(
//   slug: string
// ): Promise<Result<ProductDTO>> {
//   return getProductHandler.execute(slug);
// }

// /**
//  * Get published products with filters (public)
//  * Used on listing pages
//  */
// export async function getProducts(
//   filters: unknown
// ): Promise<Result<{ data: ProductDTO[]; pagination: any }>> {
//   return getProductsQuery.execute(filters);
// }

// /**
//  * Search products for autocomplete (public)
//  * Uses Trie for prefix search
//  */
// export async function searchProducts(
//   query: string
// ): Promise<Result<string[]>> {
//   try {
//     // For production: Use Supabase full-text search
//     // For now: Return empty (Trie populated from product list)
//     const results = await productRepository.search(query, 5);
//     return Result.ok(results.map(p => p.name));
//   } catch (error) {
//     return Result.fail(error as Error);
//   }
// }

// // ============================================
// // ADMIN ACTIONS (Auth required)
// // ============================================

// /**
//  * Create product (admin only)
//  */
// export async function createProduct(
//   input: unknown
// ): Promise<Result<ProductDTO>> {
//   // Security guard
//   const auth = await isAuthenticated();
//   if (auth.isFailure()) return Result.fail(new UnauthorizedError());

//   const admin = await isAdmin();
//   if (admin.isFailure()) return Result.fail(new ForbiddenError("Admin access required"));

//   // Validate
//   const validation = ProductValidator.validateCreate(input);
//   if (validation.isFailure()) return Result.fail(validation.getError());

//   try {
//     const data = validation.getValue();
//     const supabase = createServerClient();
    
//     // Insert into Supabase
//     const { data: product, error } = await supabase
//       .from("products")
//       .insert({
//         name: data.name,
//         slug: data.name.toLowerCase().replace(/\s+/g, "-"),
//         brand: data.brand,
//         type: data.type,
//         price: data.price,
//         cost_price: data.costPrice,
//         stock_qty: data.stock,
//         description: data.description,
//         images: data.images,
//         featured: data.featured,
//         is_active: true,
//         gender: data.gender,
//         case_size: data.caseSize,
//         water_resist: data.waterResistance,
//         category_id: data.categoryId,
//       })
//       .select()
//       .single();

//     if (error) {
//       return Result.fail(
//         new AppError("SUPABASE_ERROR" as any, error.message, { cause: error })
//       );
//     }

//     // Revalidate paths
//     revalidatePath("/products");
//     revalidatePath("/");
//     revalidatePath("/admin/products");

//     // Invalidate cache
//     getProductHandler.invalidateCache(product.slug);

//     return Result.ok(product as unknown as ProductDTO);
//   } catch (error) {
//     return Result.fail(error as Error);
//   }
// }

// /**
//  * Update product (admin only)
//  */
// export async function updateProduct(
//   id: string,
//   input: unknown
// ): Promise<Result<ProductDTO>> {
//   const auth = await isAuthenticated();
//   if (auth.isFailure()) return Result.fail(new UnauthorizedError());

//   const admin = await isAdmin();
//   if (admin.isFailure()) return Result.fail(new ForbiddenError());

//   const validation = ProductValidator.validateUpdate(input);
//   if (validation.isFailure()) return Result.fail(validation.getError());

//   try {
//     const data = validation.getValue();
//     const supabase = createServerClient();
    
//     const { data: product, error } = await supabase
//       .from("products")
//       .update(data)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) {
//       return Result.fail(new AppError("SUPABASE_ERROR" as any, error.message));
//     }

//     revalidatePath("/products");
//     revalidatePath(`/products/${product.slug}`);
//     revalidatePath("/admin/products");

//     return Result.ok(product as unknown as ProductDTO);
//   } catch (error) {
//     return Result.fail(error as Error);
//   }
// }