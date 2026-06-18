import { Order } from "@/domain/entities/order.entity";
import { OrderItem } from "@/domain/entities/order.entity";
import { Money } from "@/domain/value-objects/money";
import { Email } from "@/domain/value-objects/email";
import { OrderStatus } from "@/domain/enums/order-status.enum";
import { Product } from "@/domain/entities/product.entity";
import { ValidationError, InsufficientStockError } from "@/shared/errors/app-error";

/**
 * Order Factory
 * 
 * Encapsulates complex order creation logic.
 * Ensures all invariants are satisfied before order exists.
 * 
 * Design Pattern: Factory Pattern
 * Time Complexity: O(n) where n = number of order items
 * Space Complexity: O(n)
 */

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  items: Array<{
    product: Product;
    quantity: number;
  }>;
  notes?: string;
}

export class OrderFactory {
  /**
   * Create a new order from products
   * 
   * Validates:
   * - All products are in stock with sufficient quantity
   * - All products are published
   * - Cart is not empty
   * - Customer info is valid
   * 
   * @throws ValidationError if customer info invalid
   * @throws InsufficientStockError if stock insufficient
   * @throws BusinessRuleViolationError if product not published
   */
  static create(input: CreateOrderInput): Order {
    // Validate customer info
    OrderFactory.validateCustomerInfo(input);

    // Validate items
    if (!input.items || input.items.length === 0) {
      throw new ValidationError("Order must contain at least one item");
    }

    // Validate each item and calculate total
    const orderItems: OrderItem[] = [];
    let total = Money.zero(Money.PKR);

    for (const item of input.items) {
      OrderFactory.validateOrderItem(item);
      
      const itemTotal = item.product.price.multiply(item.quantity);
      total = total.add(itemTotal);

      orderItems.push({
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: itemTotal,
      });
    }

    // Create order
    const order = new Order({
      id: crypto.randomUUID(), // Will be replaced by database ID
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerEmail: input.customerEmail 
        ? Email.from(input.customerEmail) 
        : undefined,
      customerCity: input.customerCity.trim(),
      customerAddress: input.customerAddress.trim(),
      items: orderItems,
      total,
      status: OrderStatus.PENDING,
      notes: input.notes?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return order;
  }

  /**
   * Validate customer information
   * O(1)
   */
  private static validateCustomerInfo(input: CreateOrderInput): void {
    if (!input.customerName || input.customerName.trim().length < 3) {
      throw new ValidationError("Customer name must be at least 3 characters");
    }

    if (!input.customerPhone || !/^03\d{9}$/.test(input.customerPhone.trim())) {
      throw new ValidationError("Invalid Pakistani phone number");
    }

    if (!input.customerCity || input.customerCity.trim().length < 2) {
      throw new ValidationError("City is required");
    }

    if (!input.customerAddress || input.customerAddress.trim().length < 10) {
      throw new ValidationError("Please enter complete address (at least 10 characters)");
    }
  }

  /**
   * Validate an order item
   * O(1)
   */
  private static validateOrderItem(item: CreateOrderInput["items"][0]): void {
    if (!item.product.isPublished) {
      throw new ValidationError(`Product "${item.product.name}" is not available`);
    }

    if (!item.product.isInStock()) {
      throw new InsufficientStockError(
        item.product.id,
        item.quantity,
        item.product.stock
      );
    }

    if (item.quantity <= 0) {
      throw new ValidationError("Quantity must be at least 1");
    }

    if (item.quantity > 10) {
      throw new ValidationError("Maximum 10 units per product per order");
    }

    if (!item.product.hasEnoughStock(item.quantity)) {
      throw new InsufficientStockError(
        item.product.id,
        item.quantity,
        item.product.stock
      );
    }
  }
}