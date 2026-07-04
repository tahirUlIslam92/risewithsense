// import { z } from "zod";
// import { Order } from "@/domain/entities/order.entity";

// /**
//  * Order DTO - Shapes order data for API
//  */

// // ============================================
// // RESPONSE DTO
// // ============================================

// export interface OrderDTO {
//   id: string;
//   customerName: string;
//   customerPhone: string;
//   customerEmail: string | undefined;
//   customerCity: string;
//   customerAddress: string;
//   items: OrderItemDTO[];
//   total: number;
//   formattedTotal: string;
//   status: string;
//   notes: string | undefined;
//   trackingId: string | undefined;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface OrderItemDTO {
//   productId: string;
//   productName: string;
//   productSlug: string;
//   quantity: number;
//   unitPrice: number;
//   formattedUnitPrice: string;
//   totalPrice: number;
//   formattedTotalPrice: string;
// }

// export function toOrderDTO(order: Order): OrderDTO {
//   return {
//     id: order.id,
//     customerName: order.customerName,
//     customerPhone: order.customerPhone,
//     customerEmail: order.customerEmail?.value,
//     customerCity: order.customerCity,
//     customerAddress: order.customerAddress,
//     items: order.items.map(item => ({
//       productId: item.productId,
//       productName: item.productName,
//       productSlug: item.productSlug,
//       quantity: item.quantity,
//       unitPrice: item.unitPrice.amount,
//       formattedUnitPrice: item.unitPrice.formatPKR(),
//       totalPrice: item.totalPrice.amount,
//       formattedTotalPrice: item.totalPrice.formatPKR(),
//     })),
//     total: order.total.amount,
//     formattedTotal: order.total.formatPKR(),
//     status: order.status,
//     notes: order.notes,
//     trackingId: order.trackingId,
//     isActive: order.isActive,
//     createdAt: order.createdAt.toISOString(),
//     updatedAt: order.updatedAt.toISOString(),
//   };
// }

// // ============================================
// // INPUT DTO
// // ============================================

// export const createOrderSchema = z.object({
//   customerName: z.string().min(3).max(100),
//   customerPhone: z.string().regex(/^03\d{9}$/, "Invalid Pakistani phone"),
//   customerEmail: z.string().email().optional(),
//   customerCity: z.string().min(2).max(50),
//   customerAddress: z.string().min(10).max(500),
//   items: z.array(
//     z.object({
//       productId: z.string(),
//       quantity: z.number().int().min(1).max(10),
//     })
//   ).min(1).max(20),
//   notes: z.string().max(500).optional(),
// });

// export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// export const updateOrderStatusSchema = z.object({
//   orderId: z.string(),
//   status: z.enum(["confirmed", "shipped", "delivered", "cancelled"]),
//   trackingId: z.string().optional(),
// });

// export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// export const orderFiltersSchema = z.object({
//   page: z.coerce.number().int().positive().default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(20),
//   status: z.string().optional(),
//   search: z.string().optional(),
//   startDate: z.string().optional(),
//   endDate: z.string().optional(),
// });

// export type OrderFiltersInput = z.infer<typeof orderFiltersSchema>;