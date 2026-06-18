/**
 * Product Status Enumeration
 * 
 * Controls product visibility in the store.
 */

export enum ProductStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  DISCONTINUED = "discontinued",
}

/**
 * Product Status Machine
 * 
 * Valid Transitions:
 *   DRAFT        → PUBLISHED, ARCHIVED
 *   PUBLISHED    → ARCHIVED, DISCONTINUED
 *   ARCHIVED     → PUBLISHED (re-publish)
 *   DISCONTINUED → (terminal)
 */
export class ProductStatusMachine {
  private static readonly transitions: Map<ProductStatus, ProductStatus[]> = new Map([
    [ProductStatus.DRAFT, [ProductStatus.PUBLISHED, ProductStatus.ARCHIVED]],
    [ProductStatus.PUBLISHED, [ProductStatus.ARCHIVED, ProductStatus.DISCONTINUED]],
    [ProductStatus.ARCHIVED, [ProductStatus.PUBLISHED]],
    [ProductStatus.DISCONTINUED, []],
  ]);

  static canTransition(from: ProductStatus, to: ProductStatus): boolean {
    const allowed = ProductStatusMachine.transitions.get(from);
    return allowed ? allowed.includes(to) : false;
  }

  static isVisible(status: ProductStatus): boolean {
    return status === ProductStatus.PUBLISHED;
  }

  static isTerminal(status: ProductStatus): boolean {
    return status === ProductStatus.DISCONTINUED;
  }

  static label(status: ProductStatus): string {
    const labels: Record<ProductStatus, string> = {
      [ProductStatus.DRAFT]: "Draft",
      [ProductStatus.PUBLISHED]: "Published",
      [ProductStatus.ARCHIVED]: "Archived",
      [ProductStatus.DISCONTINUED]: "Discontinued",
    };
    return labels[status];
  }
}