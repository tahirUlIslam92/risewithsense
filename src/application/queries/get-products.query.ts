import { Result } from "@/shared/result/result";
import { IProductRepository, ProductFilters } from "@/domain/interfaces/product.repository.interface";
import { ProductDTO, toProductDTO, ProductFiltersInput } from "@/application/dtos/product.dto";
import { productFiltersSchema } from "@/application/dtos/product.dto";
import { PaginatedResult } from "@/shared/types";
import { AppError, ErrorCode } from "@/shared/errors/app-error";

/**
 * Get Products Query (CQRS Read)
 * 
 * Fetches paginated, filtered product list.
 * Time Complexity: O(n) where n = results per page
 * Database handles filtering via indexes
 */

export class GetProductsQuery {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: unknown): Promise<Result<PaginatedResult<ProductDTO>>> {
    try {
      // Validate and parse filters
      const parsed = productFiltersSchema.safeParse(input);
      if (!parsed.success) {
        return Result.fail(
          new AppError(ErrorCode.VALIDATION_ERROR, parsed.error.message)
        );
      }

      const filters = parsed.data;

      // Map to repository filters
      const repoFilters: ProductFilters = {
        brand: filters.brand,
        type: filters.type,
        gender: filters.gender,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        categoryId: filters.categoryId,
        isFeatured: filters.featured,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      // Fetch from repository
      const result = await this.productRepository.findAllPublished(
        { page: filters.page, limit: filters.limit },
        repoFilters
      );

      // Map to DTOs
      const data = result.data.map(toProductDTO);

      return Result.ok({
        data,
        pagination: result.pagination,
      });

    } catch (error) {
      return Result.fail(
        new AppError(ErrorCode.INTERNAL_ERROR, "Failed to fetch products", {
          cause: error as Error,
        })
      );
    }
  }

  /**
   * Admin version - includes unpublished products
   */
  async executeAdmin(input: unknown): Promise<Result<PaginatedResult<ProductDTO>>> {
    try {
      const parsed = productFiltersSchema.safeParse(input);
      if (!parsed.success) {
        return Result.fail(
          new AppError(ErrorCode.VALIDATION_ERROR, parsed.error.message)
        );
      }

      const filters = parsed.data;
      const result = await this.productRepository.findAll(
        { page: filters.page, limit: filters.limit },
        {
          brand: filters.brand,
          type: filters.type,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }
      );

      const data = result.data.map(toProductDTO);
      return Result.ok({ data, pagination: result.pagination });

    } catch (error) {
      return Result.fail(
        new AppError(ErrorCode.INTERNAL_ERROR, "Failed to fetch products", {
          cause: error as Error,
        })
      );
    }
  }
}