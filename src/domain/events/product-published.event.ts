import { DomainEvent } from "@/shared/kernel/aggregate-root";

/**
 * Product Published Domain Event
 * 
 * Emitted when a product transitions from draft to published.
 * Listeners:
 * - SEO: Trigger sitemap regeneration
 * - Cache: Invalidate product list cache
 * - Search: Index product in search trie
 * - Notification: Notify waitlisted customers
 */

export class ProductPublishedEvent implements DomainEvent {
  readonly eventName = "ProductPublished";
  readonly occurredAt: Date;

  constructor(
    readonly aggregateId: string,
    readonly slug: string,
    readonly name: string,
    readonly brand: string,
    readonly price: number,
  ) {
    this.occurredAt = new Date();
  }

  /**
   * Serialize for event bus / queue
   * O(n) where n = number of properties
   */
  toPrimitives(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      aggregateId: this.aggregateId,
      slug: this.slug,
      name: this.name,
      brand: this.brand,
      price: this.price,
      occurredAt: this.occurredAt.toISOString(),
    };
  }

  /**
   * Deserialize from event bus
   * O(1)
   */
  static fromPrimitives(data: Record<string, unknown>): ProductPublishedEvent {
    return new ProductPublishedEvent(
      data.aggregateId as string,
      data.slug as string,
      data.name as string,
      data.brand as string,
      data.price as number,
    );
  }
}