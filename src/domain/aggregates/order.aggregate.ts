import { AggregateRoot } from "@/shared/kernel/aggregate-root";
import { Order } from "@/domain/entities/order.entity";
import { Product } from "@/domain/entities/product.entity";
import { OrderPlacedEvent } from "@/domain/events/order-placed.event";
import { OrderFactory } from "@/domain/factories/order.factory";
import { OrderStatus } from "@/domain/enums/order-status.enum";
import { IProductRepository } from "@/domain/interfaces/product.repository.interface";
import { BusinessRuleViolationError } from "@/shared/errors/app-error";
import { Result } from "@/shared/result/result";

/**
 * Order Aggregate
 * 
 * Aggregate root that manages the entire order lifecycle.
 * Ensures all order invariants are maintained.
 * 
 * Rules:
 * 1. Order items must reference valid products
 * 2. Products must have sufficient stock
 * 3. Stock is decremented atomically with order creation
 * 4. Order total must equal sum of item totals
 */

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  items: Array<{ productId: string; quantity: number }>;
  notes?: string;
}

export class OrderAggregate extends AggregateRoot<string> {
  private order: Order;

  private constructor(order: Order) {
    super(order.id);
    this.order = order;
  }

  /**
   * Create a new order - O(n) where n = number of items
   * 
   * This is the main entry point for order creation.
   * Validates products, checks stock, calculates total.
   */
  static async create(
    input: CreateOrderInput,
    productRepository: IProductRepository
  ): Promise<Result<OrderAggregate>> {
    try {
      // 1. Fetch all products in one query
      const productIds = input.items.map(i => i.productId);
      const products = await Promise.all(
        productIds.map(id => productRepository.findById(id))
      );

      // 2. Validate all products exist
      const missingProducts = productIds.filter((_, i) => !products[i]);
      if (missingProducts.length > 0) {
        return Result.fail(
          new BusinessRuleViolationError(`Products not found: ${missingProducts.join(", ")}`)
        );
      }

      // 3. Build order items with product data
      const orderItems = input.items.map((item, index) => ({
        product: products[index]!,
        quantity: item.quantity,
      }));

      // 4. Create order through factory (validates all rules)
      const order = OrderFactory.create({
        ...input,
        items: orderItems,
      });

      // 5. Create aggregate
      const aggregate = new OrderAggregate(order);

      // 6. Add domain event
      aggregate.addDomainEvent(
        new OrderPlacedEvent(
          order.id,
          order.customerName,
          order.customerPhone,
          order.customerCity,
          order.total.amount,
          order.itemCount,
          "cod"
        )
      );

      return Result.ok(aggregate);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }

  /**
   * Get the underlying order entity
   */
  get orderEntity(): Order {
    return this.order;
  }

  /**
   * Confirm the order - O(1)
   */
  public confirm(): void {
    this.order.confirm();
  }

  /**
   * Ship the order - O(1)
   */
  public ship(trackingId?: string): void {
    this.order.ship(trackingId);
  }

  /**
   * Mark as delivered - O(1)
   */
  public deliver(): void {
    this.order.deliver();
  }

  /**
   * Cancel the order - O(1)
   */
  public cancel(): void {
    this.order.cancel();
  }

  /**
   * Add admin note - O(1)
   */
  public addNote(note: string): void {
    this.order.addNote(note);
  }

  // Getters
  get status(): OrderStatus { return this.order.status; }
  get totalAmount(): number { return this.order.total.amount; }
  get itemCount(): number { return this.order.itemCount; }

  public toPrimitives(): Record<string, unknown> {
    return this.order.toPrimitives();
  }
}