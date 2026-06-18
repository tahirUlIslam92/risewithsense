import { Entity } from "@/shared/kernel/entity";
import { Money } from "@/domain/value-objects/money";
import { Email } from "@/domain/value-objects/email";
import { OrderStatus, OrderStatusMachine } from "@/domain/enums/order-status.enum";
import { BusinessRuleViolationError, ValidationError } from "@/shared/errors/app-error";

/**
 * Order Entity
 * 
 * Represents a customer order with items.
 * Encapsulates order lifecycle management.
 */

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

interface OrderProps {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: Email;
  customerCity: string;
  customerAddress: string;
  items: OrderItem[];
  total: Money;
  status: OrderStatus;
  notes?: string;
  trackingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends Entity<string> {
  private props: OrderProps;

  constructor(props: OrderProps) {
    super(props.id);
    this.props = props;
    this.validateInvariants();
  }

  // ============================================
  // GETTERS
  // ============================================

  get customerName(): string { return this.props.customerName; }
  get customerPhone(): string { return this.props.customerPhone; }
  get customerEmail(): Email | undefined { return this.props.customerEmail; }
  get customerCity(): string { return this.props.customerCity; }
  get customerAddress(): string { return this.props.customerAddress; }
  get items(): OrderItem[] { return [...this.props.items]; }
  get total(): Money { return this.props.total; }
  get status(): OrderStatus { return this.props.status; }
  get notes(): string | undefined { return this.props.notes; }
  get trackingId(): string | undefined { return this.props.trackingId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  // Computed
  get itemCount(): number { return this.props.items.length; }
  get totalQuantity(): number { 
    return this.props.items.reduce((sum, item) => sum + item.quantity, 0); 
  }
  get isActive(): boolean { return OrderStatusMachine.isActive(this.props.status); }

  // ============================================
  // DOMAIN BEHAVIORS
  // ============================================

  /**
   * Confirm order - O(1)
   */
  public confirm(): void {
    this.transitionTo(OrderStatus.CONFIRMED);
  }

  /**
   * Mark as shipped with tracking ID - O(1)
   */
  public ship(trackingId?: string): void {
    this.transitionTo(OrderStatus.SHIPPED);
    this.props.trackingId = trackingId;
  }

  /**
   * Mark as delivered - O(1)
   */
  public deliver(): void {
    this.transitionTo(OrderStatus.DELIVERED);
  }

  /**
   * Cancel order - O(1)
   * Can only cancel if not yet shipped
   */
  public cancel(): void {
    if (this.props.status === OrderStatus.SHIPPED) {
      throw new BusinessRuleViolationError("Cannot cancel a shipped order");
    }
    this.transitionTo(OrderStatus.CANCELLED);
  }

  /**
   * Add note to order - O(1)
   */
  public addNote(note: string): void {
    if (note.length > 500) {
      throw new ValidationError("Note must be at most 500 characters");
    }
    this.props.notes = note;
    this.props.updatedAt = new Date();
  }

  // ============================================
  // PRIVATE
  // ============================================

  private transitionTo(newStatus: OrderStatus): void {
    if (!OrderStatusMachine.canTransition(this.props.status, newStatus)) {
      throw new BusinessRuleViolationError(
        `Cannot transition order from ${this.props.status} to ${newStatus}`
      );
    }
    this.props.status = newStatus;
    this.props.updatedAt = new Date();
  }

  private validateInvariants(): void {
    if (!this.props.customerName || this.props.customerName.length < 3) {
      throw new ValidationError("Customer name required");
    }
    if (!this.props.customerPhone || !/^03\d{9}$/.test(this.props.customerPhone)) {
      throw new ValidationError("Valid Pakistani phone number required");
    }
    if (!this.props.customerCity) {
      throw new ValidationError("City required");
    }
    if (!this.props.customerAddress || this.props.customerAddress.length < 10) {
      throw new ValidationError("Complete address required");
    }
    if (this.props.items.length === 0) {
      throw new ValidationError("Order must contain at least one item");
    }
    if (this.props.total.isZero() || this.props.total.amount < 0) {
      throw new ValidationError("Order total must be positive");
    }
  }

  public toPrimitives(): Record<string, unknown> {
    return {
      id: this.props.id,
      customerName: this.props.customerName,
      customerPhone: this.props.customerPhone,
      customerEmail: this.props.customerEmail?.value,
      customerCity: this.props.customerCity,
      customerAddress: this.props.customerAddress,
      items: this.props.items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        productSlug: i.productSlug,
        quantity: i.quantity,
        unitPrice: i.unitPrice.amount,
        totalPrice: i.totalPrice.amount,
      })),
      total: this.props.total.amount,
      status: this.props.status,
      notes: this.props.notes,
      trackingId: this.props.trackingId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}