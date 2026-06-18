import { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/domain/enums/order-status.enum";
import { PaginatedResult, PaginationParams } from "@/shared/types";

/**
 * Order Repository Interface (Port)
 */

export interface IOrderRepository {
  /**
   * Save order (create)
   * Must use database transactions for stock decrement
   */
  save(order: Order): Promise<void>;

  /**
   * Update order status
   */
  updateStatus(orderId: string, status: OrderStatus): Promise<void>;

  /**
   * Find order by ID with items
   */
  findById(orderId: string): Promise<Order | null>;

  /**
   * Find orders by customer phone
   */
  findByCustomerPhone(phone: string, params: PaginationParams): Promise<PaginatedResult<Order>>;

  /**
   * Find all orders with pagination (admin)
   */
  findAll(
    params: PaginationParams,
    filters?: OrderFilters
  ): Promise<PaginatedResult<Order>>;

  /**
   * Count orders by status
   */
  countByStatus(status: OrderStatus): Promise<number>;

  /**
   * Get revenue for date range
   */
  getRevenue(startDate: Date, endDate: Date): Promise<number>;
}

export interface OrderFilters {
  status?: OrderStatus;
  search?: string; // Search by customer name or phone
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: string;
}