import { IProductRepository, ProductFilters } from "@/domain/interfaces/product.repository.interface";
import { Product } from "@/domain/entities/product.entity";
import { Slug } from "@/domain/value-objects/slug";
import { Money } from "@/domain/value-objects/money";
import { ProductStatus } from "@/domain/enums/product-status.enum";
import { PaginatedResult, PaginationParams } from "@/shared/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/types/database.types";
import { SupabaseError } from "@/shared/errors/app-error";

/**
 * Supabase Product Repository
 * 
 * Implements IProductRepository using Supabase as the database.
 * Translates between domain entities and database rows.
 * 
 * Database: Supabase (PostgreSQL)
 * Indexes: B-tree on slug (unique), category_id, brand
 * Full-text search: GIN index on name, description
 */

type Supabase = SupabaseClient<Database>;
type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export class SupabaseProductRepository implements IProductRepository {
  constructor(private readonly supabase: Supabase) {}

  // ============================================
  // SAVE
  // ============================================

  async save(product: Product): Promise<void> {
    const data = this.toPersistence(product);

    const { error } = await this.supabase
      .from("products")
      .upsert(data, { onConflict: "id" });

    if (error) {
      throw new SupabaseError(`Failed to save product: ${error.message}`, error);
    }
  }

  // ============================================
  // QUERIES - O(log n) for indexed lookups
  // ============================================

  async findBySlug(slug: Slug): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name)")
      .eq("slug", slug.value)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw new SupabaseError(`Failed to find product by slug: ${error.message}`, error);
    }

    return data ? this.toDomain(data) : null;
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new SupabaseError(`Failed to find product: ${error.message}`, error);
    }

    return data ? this.toDomain(data) : null;
  }

  async findAllPublished(
    params: PaginationParams,
    filters?: ProductFilters
  ): Promise<PaginatedResult<Product>> {
    return this.findAllInternal(params, { ...filters, status: ProductStatus.PUBLISHED });
  }

  async findAll(
    params: PaginationParams,
    filters?: ProductFilters
  ): Promise<PaginatedResult<Product>> {
    return this.findAllInternal(params, filters);
  }

  private async findAllInternal(
    params: PaginationParams,
    filters?: ProductFilters
  ): Promise<PaginatedResult<Product>> {
    let query = this.supabase
      .from("products")
      .select("*, categories(name)", { count: "exact" });

    // Apply filters - O(1) per filter
    if (filters?.status) {
      query = query.eq("is_active", filters.status === ProductStatus.PUBLISHED);
    }
    if (filters?.brand) {
      query = query.ilike("brand", `%${filters.brand}%`);
    }
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }
    if (filters?.gender) {
      query = query.eq("gender", filters.gender);
    }
    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }
    if (filters?.isFeatured) {
      query = query.eq("featured", true);
    }
    if (filters?.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }

    // Sorting
    const sortBy = filters?.sortBy || "created_at";
    const sortOrder = filters?.sortOrder || "desc";
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Pagination - O(log n + limit)
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new SupabaseError(`Failed to fetch products: ${error.message}`, error);
    }

    const products = (data || []).map(row => this.toDomain(row));

    return {
      data: products,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasNext: from + params.limit < (count || 0),
        hasPrev: params.page > 1,
      },
    };
  }

  async findFeatured(limit: number): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name)")
      .eq("featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new SupabaseError(`Failed to fetch featured products: ${error.message}`, error);
    }

    return (data || []).map(row => this.toDomain(row));
  }

  async findRelated(productId: string, categoryId: string, limit: number): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name)")
      .eq("category_id", categoryId)
      .neq("id", productId)
      .eq("is_active", true)
      .limit(limit);

    if (error) {
      throw new SupabaseError(`Failed to fetch related products: ${error.message}`, error);
    }

    return (data || []).map(row => this.toDomain(row));
  }

  /**
   * Search products using PostgreSQL ILIKE (case-insensitive)
   * 
   * For production with large catalogs:
   * Use Supabase full-text search with GIN index
   * or integrate Algolia/Meilisearch
   */
  async search(query: string, limit: number): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name)")
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
      .eq("is_active", true)
      .limit(limit);

    if (error) {
      throw new SupabaseError(`Search failed: ${error.message}`, error);
    }

    return (data || []).map(row => this.toDomain(row));
  }

  async delete(id: string): Promise<void> {
    // Soft delete - set inactive
    const { error } = await this.supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      throw new SupabaseError(`Failed to delete product: ${error.message}`, error);
    }
  }

  async slugExists(slug: Slug, excludeId?: string): Promise<boolean> {
    let query = this.supabase
      .from("products")
      .select("id")
      .eq("slug", slug.value);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== "PGRST116") {
      throw new SupabaseError(`Failed to check slug: ${error.message}`, error);
    }

    return !!data;
  }

  async countByStatus(status: ProductStatus): Promise<number> {
    const { count, error } = await this.supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", status === ProductStatus.PUBLISHED);

    if (error) {
      throw new SupabaseError(`Failed to count products: ${error.message}`, error);
    }

    return count || 0;
  }

  async totalCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new SupabaseError(`Failed to count products: ${error.message}`, error);
    }

    return count || 0;
  }

  // ============================================
  // DATA MAPPING
  // ============================================

  /**
   * Convert database row to domain entity
   * O(n) where n = number of properties
   */
  private toDomain(row: any): Product {
    return new Product({
      id: row.id,
      name: row.name,
      slug: Slug.from(row.slug),
      brand: row.brand,
      type: row.type as any,
      price: Money.fromAmount(Number(row.price), "PKR"),
      costPrice: Money.fromAmount(Number(row.cost_price), "PKR"),
      stock: row.stock_qty,
      description: row.description || "",
      images: row.images || [],
      status: row.is_active ? ProductStatus.PUBLISHED : ProductStatus.ARCHIVED,
      featured: row.featured || false,
      gender: row.gender as any,
      caseSize: row.case_size,
      waterResistance: row.water_resist,
      categoryId: row.category_id,
      categoryName: row.categories?.name || null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  /**
   * Convert domain entity to database row
   * O(n)
   */
  private toPersistence(product: Product): Record<string, unknown> {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      type: product.type,
      price: product.price.amount,
      cost_price: product.costPrice.amount,
      stock_qty: product.stock,
      description: product.description,
      images: product.images,
      is_active: product.isPublished,
      featured: product.featured,
      gender: product.gender,
      case_size: product.caseSize,
      water_resist: product.waterResistance,
      category_id: product.categoryId,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    };
  }
}