"use server";

import { revalidatePath } from "next/cache";
import { Result } from "@/shared/result/result";
import { OrderDTO, CreateOrderInput } from "@/application/dtos/order.dto";
import { PlaceOrderHandler } from "@/application/handlers/place-order.handler";
import { GetProductBySlugHandler } from "@/application/handlers/get-product-by-slug.handler";
import { isAuthenticated, isAdmin } from "@/shared/guards/auth.guard";
import { createServerClient } from "@/infrastructure/supabase/client.server";
import { SupabaseProductRepository } from "@/infrastructure/supabase/repositories/product.repository";
import { SupabaseOrderRepository } from "@/infrastructure/supabase/repositories/order.repository";
import { UnauthorizedError, ForbiddenError, AppError } from "@/shared/errors/app-error";
import { getClientIp } from "@/lib/security";
import { headers } from "next/headers";

/**
 * Order Server Actions
 */

const supabase = createServerClient();
const productRepository = new SupabaseProductRepository(supabase);
const orderRepository = new SupabaseOrderRepository(supabase);
const cacheHandler = new GetProductBySlugHandler(productRepository);
const placeOrderHandler = new PlaceOrderHandler(
  productRepository,
  orderRepository,
  cacheHandler
);

// ============================================
// PUBLIC ACTIONS
// ============================================

/**
 * Place a new order (public - no auth required)
 * 
 * This is the main checkout action.
 * Rate limited by IP address.
 */
export async function placeOrder(
  input: unknown
): Promise<Result<OrderDTO>> {
  try {
    // Get client IP for rate limiting
    const headersList = headers();
    const clientIp = headersList.get("x-forwarded-for") || 
                     headersList.get("x-real-ip") || 
                     "127.0.0.1";

    const result = await placeOrderHandler.execute(input, clientIp);
    return result;
  } catch (error) {
    return Result.fail(
      new AppError("INTERNAL_ERROR" as any, "Failed to place order", {
        cause: error as Error,
      })
    );
  }
}

// ============================================
// ADMIN ACTIONS
// ============================================

/**
 * Get all orders (admin only)
 */
export async function getOrders(
  filters: unknown
): Promise<Result<{ data: OrderDTO[]; pagination: any }>> {
  const auth = await isAuthenticated();
  if (auth.isFailure()) return Result.fail(new UnauthorizedError());

  const admin = await isAdmin();
  if (admin.isFailure()) return Result.fail(new ForbiddenError());

  try {
    const supabase = createServerClient();
    // Implement order fetching logic
    return Result.ok({ data: [], pagination: { page: 1, limit: 20, total: 0 } });
  } catch (error) {
    return Result.fail(error as Error);
  }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingId?: string
): Promise<Result<OrderDTO>> {
  const auth = await isAuthenticated();
  if (auth.isFailure()) return Result.fail(new UnauthorizedError());

  const admin = await isAdmin();
  if (admin.isFailure()) return Result.fail(new ForbiddenError());

  try {
    const supabase = createServerClient();
    
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (trackingId) {
      updateData.tracking_id = trackingId;
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      return Result.fail(new AppError("SUPABASE_ERROR" as any, error.message));
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return Result.ok(order as unknown as OrderDTO);
  } catch (error) {
    return Result.fail(error as Error);
  }
}

/**
 * Get single order (admin only)
 */
export async function getOrderById(
  orderId: string
): Promise<Result<OrderDTO>> {
  const auth = await isAuthenticated();
  if (auth.isFailure()) return Result.fail(new UnauthorizedError());

  const admin = await isAdmin();
  if (admin.isFailure()) return Result.fail(new ForbiddenError());

  try {
    const supabase = createServerClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("id", orderId)
      .single();

    if (error) {
      return Result.fail(new AppError("SUPABASE_ERROR" as any, error.message));
    }

    return Result.ok(order as unknown as OrderDTO);
  } catch (error) {
    return Result.fail(error as Error);
  }
}