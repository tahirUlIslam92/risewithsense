"use server";

import { createServerClient } from "@/infrastructure/supabase/client.server";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string, quantity: number = 1) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in" };

  const { error } = await (supabase as any)
    .from("cart_items")
    .upsert({
      user_id: user.id,
      product_id: productId,
      quantity,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,product_id" });

  if (error) return { error: error.message };
  revalidatePath("/cart");
  return { success: true };
}

export async function getCartItems() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await (supabase as any)
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function removeFromCart(productId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await (supabase as any)
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartQuantity(productId: string, quantity: number) {
  if (quantity < 1) return removeFromCart(productId);

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await (supabase as any)
    .from("cart_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("product_id", productId);

  revalidatePath("/cart");
  return { success: true };
}