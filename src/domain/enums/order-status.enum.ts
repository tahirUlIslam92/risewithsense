/**
 * Order Status Enumeration
 * 
 * Represents the lifecycle of an order.
 * Transitions are strictly controlled to prevent invalid states.
 * 
 * Valid Transitions:
 *   PENDING    → CONFIRMED, CANCELLED
 *   CONFIRMED  → SHIPPED, CANCELLED
 *   SHIPPED    → DELIVERED
 *   DELIVERED  → (terminal)
 *   CANCELLED  → (terminal)
 * 
 * State Machine: 5 states, 6 valid transitions
 */

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

/**
 * Order Status Machine - controls valid transitions
 * 
 * Time Complexity: O(1) lookup
 * Space Complexity: O(1) fixed map
 */
export class OrderStatusMachine {
  private static readonly transitions: Map<OrderStatus, OrderStatus[]> = new Map([
    [OrderStatus.PENDING, [OrderStatus.CONFIRMED, OrderStatus.CANCELLED]],
    [OrderStatus.CONFIRMED, [OrderStatus.SHIPPED, OrderStatus.CANCELLED]],
    [OrderStatus.SHIPPED, [OrderStatus.DELIVERED]],
    [OrderStatus.DELIVERED, []], // Terminal
    [OrderStatus.CANCELLED, []], // Terminal
  ]);

  /**
   * Check if transition is valid - O(1)
   */
  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowed = OrderStatusMachine.transitions.get(from);
    return allowed ? allowed.includes(to) : false;
  }

  /**
   * Get valid next statuses - O(1)
   */
  static nextStatuses(current: OrderStatus): OrderStatus[] {
    return OrderStatusMachine.transitions.get(current) || [];
  }

  /**
   * Check if status is terminal - O(1)
   */
  static isTerminal(status: OrderStatus): boolean {
    return status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED;
  }

  /**
   * Check if status is active (can still change) - O(1)
   */
  static isActive(status: OrderStatus): boolean {
    return !OrderStatusMachine.isTerminal(status);
  }

  /**
   * Get human-readable label in Urdu/English
   */
  static label(status: OrderStatus, locale: "en" | "ur" = "en"): string {
    const labels = {
      en: {
        [OrderStatus.PENDING]: "Pending",
        [OrderStatus.CONFIRMED]: "Confirmed",
        [OrderStatus.SHIPPED]: "Shipped",
        [OrderStatus.DELIVERED]: "Delivered",
        [OrderStatus.CANCELLED]: "Cancelled",
      },
      ur: {
        [OrderStatus.PENDING]: "زیر التواء",
        [OrderStatus.CONFIRMED]: "تصدیق شدہ",
        [OrderStatus.SHIPPED]: "بھیج دیا گیا",
        [OrderStatus.DELIVERED]: "ڈیلیور ہو گیا",
        [OrderStatus.CANCELLED]: "منسوخ",
      },
    };
    return labels[locale][status];
  }
}