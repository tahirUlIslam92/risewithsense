import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/infrastructure/supabase/client.server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();
    const { customerName, customerPhone, customerCity, customerAddr, items, total } = body;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // 1. Create order with manual ID
    const orderId = crypto.randomUUID();
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_city: customerCity,
        customer_addr: customerAddr,
        total,
        status: "pending",
        payment_method: "cod",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // 2. Create order items + update stock
    for (const item of items) {
      await supabase.from("order_items").insert({
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: 0,
      });

      // Decrement stock
      const { data: product } = await supabase
        .from("products")
        .select("stock_qty")
        .eq("id", item.productId)
        .single();

      if (product) {
        const newStock = Math.max(0, product.stock_qty - item.quantity);
        await supabase
          .from("products")
          .update({ stock_qty: newStock })
          .eq("id", item.productId);
      }
    }

    // 3. Clear cart after successful order
    if (userId) {
      await (supabase as any)
        .from("cart_items")
        .delete()
        .eq("user_id", userId);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}