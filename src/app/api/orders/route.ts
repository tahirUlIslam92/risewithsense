import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/infrastructure/supabase/client.server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();
    console.log("Order body:", JSON.stringify(body, null, 2));
    const { customerName, customerPhone, customerCity, customerAddr, items, total } = body;

    // 1. Create order with manual ID
    const orderId = crypto.randomUUID();
    const { data: order, error: orderError } = await supabase
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
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // 2. Create order items + update stock
    for (const item of items) {
      const { error: itemError } = await supabase.from("order_items").insert({
        id: crypto.randomUUID(),
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: 0,
      });

      if (itemError) {
        return NextResponse.json({ error: itemError.message }, { status: 400 });
      }

      // Get current stock
      const { data: product } = await supabase
        .from("products")
        .select("stock_qty")
        .eq("id", item.productId)
        .single();

      // Decrement stock
      if (product) {
        const newStock = Math.max(0, product.stock_qty - item.quantity);
        await supabase
          .from("products")
          .update({ stock_qty: newStock })
          .eq("id", item.productId);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}