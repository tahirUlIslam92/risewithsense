/**
 * Composite Specification - Re-export
 * 
 * This file exists for clean imports.
 * The actual composite classes (AndSpec, OrSpec, NotSpec) 
 * are in product-in-stock.spec.ts to avoid circular deps.
 * 
 * For new specifications, extend ISpecification<T> and use
 * the and(), or(), not() methods provided by the base.
 */

export type { ISpecification } from "./product-in-stock.spec";
export {
  ProductInStockSpec,
  ProductPublishedSpec,
  ProductPriceRangeSpec,
  ProductBrandSpec,
  ProductAvailableSpec,
} from "./product-in-stock.spec";