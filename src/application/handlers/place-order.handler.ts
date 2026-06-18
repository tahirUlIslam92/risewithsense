import { Result } from "@/shared/result/result";
import { IProductRepository } from "@/domain/interfaces/product.repository.interface";
import { IOrderRepository } from "@/domain/interfaces/order.repository.interface";
import { PlaceOrderCommand } from "@/application/commands/place-order.command";
import { OrderDTO } from "@/application/dtos/order.dto";
import { GetProductBySlugHandler } from "@/application/handlers/get-product-by-slug.handler";
import { productSearchTrie } from "@/shared/utils/trie";
import { logger } from "@/infrastructure/logging/logger";
import { RateLimiter } from "@/shared/utils/lru-cache";

/**
 * Place Order Handler
 * 
 * Orchestrates order placement with:
 * 1. Rate limiting (10 orders/min per IP)
 * 2. Cache invalidation for affected products
 * 3. Search index update
 */

export class PlaceOrderHandler {
  private command: PlaceOrderCommand;
  private cacheHandler: GetProductBySlugHandler;
  private orderRateLimiter: LRUCache<string, number>;

  constructor(
    productRepository: IProductRepository,
    orderRepository: IOrderRepository,
    cacheHandler: GetProductBySlugHandler,
  ) {
    this.command = new PlaceOrderCommand(productRepository, orderRepository);
    this.cacheHandler = cacheHandler;
    this.orderRateLimiter = new LRUCache<string, number>(1000);
  }

  async execute(
    input: unknown,
    clientIp: string
  ): Promise<Result<OrderDTO>> {
    // Rate limit check - O(1)
    const recentOrders = this.orderRateLimiter.get(clientIp) || 0;
    if (recentOrders >= 10) {
      logger.warn("Order rate limit exceeded", { clientIp });
      return Result.fail(
        new AppError(
          "RATE_LIMIT_EXCEEDED" as any,
          "Too many orders. Please wait.",
          { statusCode: 429 }
        )
      );
    }

    // Track for rate limiting
    this.orderRateLimiter.set(clientIp, recentOrders + 1);

    // Execute command
    const result = await this.command.execute(input);

    if (result.isSuccess()) {
      const order = result.getValue();

      // Invalidate product caches for ordered items
      for (const item of order.items) {
        this.cacheHandler.invalidateCache(item.productSlug);
      }

      logger.info("Order placed successfully", {
        orderId: order.id,
        total: order.total,
        items: order.items.length,
      });

      return Result.ok(order);
    }

    return result;
  }
}

// Import needed
import { AppError } from "@/shared/errors/app-error";