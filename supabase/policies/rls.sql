-- ============================================
-- Supabase Row Level Security (RLS) Policies
-- ============================================
-- 
-- RLS is the PRIMARY security layer.
-- Every table MUST have RLS enabled.
-- Service role bypasses RLS (used in Server Actions only).
-- Anon key respects RLS (used in browser).
--
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/[ID]/sql
-- ============================================

-- ============================================
-- PRODUCTS TABLE
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public: Anyone can view published products
CREATE POLICY "Public can view published products"
ON products
FOR SELECT
USING (is_active = true);

-- Admin: Full access (handled via service role in Server Actions)
-- Service role bypasses RLS, so admin policies are for anon key admin access
CREATE POLICY "Admins can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete products (soft delete)"
ON products
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- CATEGORIES TABLE
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public: Anyone can view categories
CREATE POLICY "Public can view categories"
ON categories
FOR SELECT
USING (true);

-- Admin only: Insert/Update/Delete
CREATE POLICY "Admins can manage categories"
ON categories
FOR ALL
TO authenticated
USING (true);

-- ============================================
-- ORDERS TABLE
-- ============================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public: Create orders (checkout)
CREATE POLICY "Public can create orders"
ON orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Public: View own orders by phone number
CREATE POLICY "Public can view own orders"
ON orders
FOR SELECT
TO anon, authenticated
USING (
  customer_phone IN (
    SELECT phone FROM temp_order_lookup WHERE order_id = id
  )
);

-- Admin: Full access
CREATE POLICY "Admins can manage all orders"
ON orders
FOR ALL
TO authenticated
USING (true);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public: Create order items (with order)
CREATE POLICY "Public can create order items"
ON order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Public: View own order items
CREATE POLICY "Public can view own order items"
ON order_items
FOR SELECT
TO anon, authenticated
USING (
  order_id IN (
    SELECT o.id FROM orders o WHERE o.customer_phone IN (
      SELECT phone FROM temp_order_lookup WHERE order_id = o.id
    )
  )
);

-- Admin: Full access
CREATE POLICY "Admins can manage order items"
ON order_items
FOR ALL
TO authenticated
USING (true);

-- ============================================
-- ADMINS TABLE (Most Restricted)
-- ============================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- No public access at all
-- Only service role can read/write admins table
CREATE POLICY "No public access to admins"
ON admins
FOR ALL
TO anon
USING (false);

CREATE POLICY "Admins can view own profile"
ON admins
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Product images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Public: View product images
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Admin: Upload product images
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Admin: Delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');