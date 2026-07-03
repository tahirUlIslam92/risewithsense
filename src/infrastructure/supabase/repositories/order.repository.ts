// import { IOrderRepository, OrderFilters } from "@/domain/interfaces/order.repository.interface";
// import { Order, OrderItem } from "@/domain/entities/order.entity";
// import { Money } from "@/domain/value-objects/money";
// import { Email } from "@/domain/value-objects/email";
// import { OrderStatus } from "@/domain/enums/order-status.enum";
// import { PaginatedResult, PaginationParams } from "@/shared/types";
// import { SupabaseClient } from "@supabase/supabase-js";
// import { Database } from "@/shared/types/database.types";
// import { SupabaseError } from "@/shared/errors/app-error";

// type Supabase = SupabaseClient<Database>;

// export class SupabaseOrderRepository implements IOrderRepository {
//   constructor(private readonly supabase: Supabase) {}

//   async save(order: Order): Promise<void> {
//     const { error } = await this.supabase
//       .from("orders")
//       .insert({
//         id: order.id,
//         customer_name: order.customerName,
//         customer_phone: order.customerPhone,
//         customer_city: order.customerCity,
//         customer_addr: order.customerAddress,
//         total: order.total.amount,
//         status: order.status,
//         payment_method: "cod",
//         notes: order.notes || null,
//         created_at: order.createdAt.toISOString(),
//         updated_at: order.updatedAt.toISOString(),
//       });

//     if (error) {
//       throw new SupabaseError(`Failed to save order: ${error.message}`, error);
//     }

//     // Save order items
//     const orderItems = order.items.map(item => ({
//       order_id: order.id,
//       product_id: item.productId,
//       quantity: item.quantity,
//       price: item.unitPrice.amount,
//     }));

//     const { error: itemsError } = await this.supabase
//       .from("order_items")
//       .insert(orderItems);

//     if (itemsError) {
//       throw new SupabaseError(`Failed to save order items: ${itemsError.message}`, itemsError);
//     }
//   }

//   async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
//     const { error } = await this.supabase
//       .from("orders")
//       .update({ status, updated_at: new Date().toISOString() })
//       .eq("id", orderId);

//     if (error) {
//       throw new SupabaseError(`Failed to update order status: ${error.message}`, error);
//     }
//   }

//   async findById(orderId: string): Promise<Order | null> {
//     const { data, error } = await this.supabase
//       .from("orders")
//       .select("*, order_items(*)")
//       .eq("id", orderId)
//       .single();

//     if (error) {
//       if (error.code === "PGRST116") return null;
//       throw new SupabaseError(`Failed to find order: ${error.message}`, error);
//     }

//     return data ? this.toDomain(data) : null;
//   }

//   async findByCustomerPhone(
//     phone: string,
//     params: PaginationParams
//   ): Promise<PaginatedResult<Order>> {
//     const from = (params.page - 1) * params.limit;
//     const to = from + params.limit - 1;

//     const { data, error, count } = await this.supabase
//       .from("orders")
//       .select("*, order_items(*)", { count: "exact" })
//       .eq("customer_phone", phone)
//       .order("created_at", { ascending: false })
//       .range(from, to);

//     if (error) {
//       throw new SupabaseError(`Failed to find orders: ${error.message}`, error);
//     }

//     return {
//       data: (data || []).map(row => this.toDomain(row)),
//       pagination: {
//         page: params.page,
//         limit: params.limit,
//         total: count || 0,
//         totalPages: Math.ceil((count || 0) / params.limit),
//         hasNext: from + params.limit < (count || 0),
//         hasPrev: params.page > 1,
//       },
//     };
//   }

//   async findAll(
//     params: PaginationParams,
//     filters?: OrderFilters
//   ): Promise<PaginatedResult<Order>> {
//     let query = this.supabase
//       .from("orders")
//       .select("*, order_items(*)", { count: "exact" });

//     if (filters?.status) {
//       query = query.eq("status", filters.status);
//     }
//     if (filters?.search) {
//       query = query.or(
//         `customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`
//       );
//     }
//     if (filters?.startDate) {
//       query = query.gte("created_at", filters.startDate.toISOString());
//     }
//     if (filters?.endDate) {
//       query = query.lte("created_at", filters.endDate.toISOString());
//     }

//     const from = (params.page - 1) * params.limit;
//     const to = from + params.limit - 1;

//     const { data, error, count } = await query
//       .order("created_at", { ascending: false })
//       .range(from, to);

//     if (error) {
//       throw new SupabaseError(`Failed to fetch orders: ${error.message}`, error);
//     }

//     return {
//       data: (data || []).map(row => this.toDomain(row)),
//       pagination: {
//         page: params.page,
//         limit: params.limit,
//         total: count || 0,
//         totalPages: Math.ceil((count || 0) / params.limit),
//         hasNext: from + params.limit < (count || 0),
//         hasPrev: params.page > 1,
//       },
//     };
//   }

//   async countByStatus(status: OrderStatus): Promise<number> {
//     const { count, error } = await this.supabase
//       .from("orders")
//       .select("*", { count: "exact", head: true })
//       .eq("status", status);

//     if (error) {
//       throw new SupabaseError(`Failed to count orders: ${error.message}`, error);
//     }

//     return count || 0;
//   }

//   async getRevenue(startDate: Date, endDate: Date): Promise<number> {
//     const { data, error } = await this.supabase
//       .from("orders")
//       .select("total")
//       .gte("created_at", startDate.toISOString())
//       .lte("created_at", endDate.toISOString())
//       .eq("status", "delivered");

//     if (error) {
//       throw new SupabaseError(`Failed to calculate revenue: ${error.message}`, error);
//     }

//     return (data || []).reduce((sum, row) => sum + Number(row.total), 0);
//   }

//   private toDomain(row: any): Order {
//     const items: OrderItem[] = (row.order_items || []).map((item: any) => ({
//       productId: item.product_id,
//       productName: item.product_name || "",
//       productSlug: item.product_slug || "",
//       quantity: item.quantity,
//       unitPrice: Money.fromAmount(Number(item.price), "PKR"),
//       totalPrice: Money.fromAmount(Number(item.price) * item.quantity, "PKR"),
//     }));

//     return new Order({
//       id: row.id,
//       customerName: row.customer_name,
//       customerPhone: row.customer_phone,
//       customerCity: row.customer_city,
//       customerAddress: row.customer_addr,
//       items,
//       total: Money.fromAmount(Number(row.total), "PKR"),
//       status: row.status as OrderStatus,
//       notes: row.notes,
//       createdAt: new Date(row.created_at),
//       updatedAt: new Date(row.updated_at),
//     });
//   }
// }