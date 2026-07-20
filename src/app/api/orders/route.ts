import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/infrastructure/supabase/client.server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();
    const { customerName, customerPhone, customerCity, customerAddr, items, total } = body;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to place order" }, { status: 401 });
    }

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
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any);

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    for (const item of items) {
      await supabase.from("order_items").insert({
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: 0,
      } as any);

      const { data: product } = await supabase
        .from("products")
        .select("stock_qty")
        .eq("id", item.productId)
        .single();

      if (product) {
        const newStock = Math.max(0, product.stock_qty - item.quantity);
        await supabase
          .from("products")
          .update({ stock_qty: newStock } as any)
          .eq("id", item.productId);
      }
    }

    // Clear cart
    await (supabase as any)
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}