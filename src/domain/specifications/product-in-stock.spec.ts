import { Product } from "@/domain/entities/product.entity";

/**
 * Specification Pattern - Composite Pattern for Business Rules
 * 
 * Specifications are boolean predicates that can be combined
 * using logical operators (AND, OR, NOT).
 * 
 * Benefits:
 * - Business rules are explicit and testable
 * - Rules can be combined without modifying existing code
 * - Domain logic stays in the domain layer
 * 
 * Time Complexity: O(1) per specification
 * Space Complexity: O(1)
 */

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

/**
 * Check if product is in stock
 */
export class ProductInStockSpec implements ISpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return product.stock > 0;
  }

  and(other: ISpecification<Product>): ISpecification<Product> {
    return new AndSpec(this, other);
  }

  or(other: ISpecification<Product>): ISpecification<Product> {
    return new OrSpec(this, other);
  }

  not(): ISpecification<Product> {
    return new NotSpec(this);
  }
}

/**
 * Check if product is published
 */
export class ProductPublishedSpec implements ISpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return product.isPublished;
  }

  and(other: ISpecification<Product>): ISpecification<Product> {
    return new AndSpec(this, other);
  }

  or(other: ISpecification<Product>): ISpecification<Product> {
    return new OrSpec(this, other);
  }

  not(): ISpecification<Product> {
    return new NotSpec(this);
  }
}

/**
 * Check if product price is within range
 */
export class ProductPriceRangeSpec implements ISpecification<Product> {
  constructor(private minPrice: number, private maxPrice: number) {}

  isSatisfiedBy(product: Product): boolean {
    return product.price.amount >= this.minPrice && 
           product.price.amount <= this.maxPrice;
  }

  and(other: ISpecification<Product>): ISpecification<Product> {
    return new AndSpec(this, other);
  }

  or(other: ISpecification<Product>): ISpecification<Product> {
    return new OrSpec(this, other);
  }

  not(): ISpecification<Product> {
    return new NotSpec(this);
  }
}

/**
 * Check if product belongs to a specific brand
 */
export class ProductBrandSpec implements ISpecification<Product> {
  constructor(private brand: string) {}

  isSatisfiedBy(product: Product): boolean {
    return product.brand.toLowerCase() === this.brand.toLowerCase();
  }

  and(other: ISpecification<Product>): ISpecification<Product> {
    return new AndSpec(this, other);
  }

  or(other: ISpecification<Product>): ISpecification<Product> {
    return new OrSpec(this, other);
  }

  not(): ISpecification<Product> {
    return new NotSpec(this);
  }
}

/**
 * Composite specification - AND
 * O(n) where n = number of sub-specifications
 */
class AndSpec<T> implements ISpecification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && 
           this.right.isSatisfiedBy(candidate);
  }

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpec(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpec(this, other);
  }

  not(): ISpecification<T> {
    return new NotSpec(this);
  }
}

/**
 * Composite specification - OR
 * O(n) where n = number of sub-specifications
 */
class OrSpec<T> implements ISpecification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || 
           this.right.isSatisfiedBy(candidate);
  }

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpec(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpec(this, other);
  }

  not(): ISpecification<T> {
    return new NotSpec(this);
  }
}

/**
 * Composite specification - NOT
 * O(n) where n = time of sub-specification
 */
class NotSpec<T> implements ISpecification<T> {
  constructor(private spec: ISpecification<T>) {}

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpec(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpec(this, other);
  }

  not(): ISpecification<T> {
    return this.spec; // Double negation = original
  }
}

/**
 * Pre-built specification combinations
 */
export const ProductAvailableSpec = new ProductInStockSpec()
  .and(new ProductPublishedSpec());