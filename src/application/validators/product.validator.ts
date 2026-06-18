import { z } from "zod";
import { createProductSchema, updateProductSchema } from "@/application/dtos/product.dto";
import { Result } from "@/shared/result/result";
import { ValidationError } from "@/shared/errors/app-error";

/**
 * Product Validator
 * 
 * Validates product input data using Zod schemas.
 * Returns Result type for railway-oriented error handling.
 */

export class ProductValidator {
  /**
   * Validate create product input
   * O(n) where n = number of fields
   */
  static validateCreate(input: unknown): Result<z.infer<typeof createProductSchema>> {
    const result = createProductSchema.safeParse(input);

    if (!result.success) {
      const errors = result.error.errors.map(e => 
        `${e.path.join(".")}: ${e.message}`
      ).join(", ");
      return Result.fail(new ValidationError(errors));
    }

    // Additional business validations
    const data = result.data;
    
    // Price must be greater than cost price
    if (data.price <= data.costPrice) {
      return Result.fail(
        new ValidationError("Selling price must be greater than cost price")
      );
    }

    return Result.ok(data);
  }

  /**
   * Validate update product input
   * O(n)
   */
  static validateUpdate(input: unknown): Result<z.infer<typeof updateProductSchema>> {
    const result = updateProductSchema.safeParse(input);

    if (!result.success) {
      const errors = result.error.errors.map(e => 
        `${e.path.join(".")}: ${e.message}`
      ).join(", ");
      return Result.fail(new ValidationError(errors));
    }

    const data = result.data;

    // If both prices provided, validate relationship
    if (data.price !== undefined && data.costPrice !== undefined) {
      if (data.price <= data.costPrice) {
        return Result.fail(
          new ValidationError("Selling price must be greater than cost price")
        );
      }
    }

    return Result.ok(data);
  }
}