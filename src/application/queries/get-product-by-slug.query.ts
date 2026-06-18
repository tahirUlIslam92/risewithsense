import { Result } from "@/shared/result/result";
import { IProductRepository } from "@/domain/interfaces/product.repository.interface";
import { Slug } from "@/domain/value-objects/slug";
import { ProductDTO, toProductDTO } from "@/application/dtos/product.dto";
import { NotFoundError, AppError, ErrorCode } from "@/shared/errors/app-error";

/**
 * Get Product By Slug Query (CQRS Read Operation)
 * 
 * Pure read operation - no side effects.
 * Time Complexity: O(log n) - B-tree index lookup on slug
 * Space Complexity: O(1)
 */

export class GetProductBySlugQuery {
  constructor(private readonly productRepository: IProductRepository) {}

  /**
   * Execute query
   * 
   * @param slug - Product URL slug
   * @returns ProductDTO or NotFoundError
   */
  async execute(slug: string): Promise<Result<ProductDTO>> {
    try {
      // Validate slug format
      const slugVO = Slug.from(slug);

      // Fetch from repository (B-tree indexed lookup)
      const product = await this.productRepository.findBySlug(slugVO);

      if (!product) {
        return Result.fail(
          new NotFoundError("Product", slug)
        );
      }

      // Check if published (non-admin users should only see published)
      if (!product.isPublished) {
        return Result.fail(
          new NotFoundError("Product", slug)
        );
      }

      // Map to DTO
      const dto = toProductDTO(product);
      return Result.ok(dto);

    } catch (error) {
      if (error instanceof NotFoundError) {
        return Result.fail(error);
      }
      return Result.fail(
        new AppError(ErrorCode.INTERNAL_ERROR, "Failed to fetch product", {
          cause: error as Error,
          context: { slug },
        })
      );
    }
  }

  /**
   * Execute for admin (returns unpublished products too)
   */
  async executeAdmin(slug: string): Promise<Result<ProductDTO>> {
    try {
      const slugVO = Slug.from(slug);
      const product = await this.productRepository.findBySlug(slugVO);

      if (!product) {
        return Result.fail(new NotFoundError("Product", slug));
      }

      const dto = toProductDTO(product);
      return Result.ok(dto);

    } catch (error) {
      return Result.fail(
        new AppError(ErrorCode.INTERNAL_ERROR, "Failed to fetch product", {
          cause: error as Error,
          context: { slug },
        })
      );
    }
  }
}