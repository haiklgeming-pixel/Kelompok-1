-- Supabase schema for showcase_products and showcase_reviews

-- Create products table
CREATE TABLE IF NOT EXISTS showcase_products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text,
  image_url text,
  description text,
  specs text,
  process text,
  created_at timestamptz DEFAULT now()
);

-- Add image galleries to existing installations as well as new tables.
ALTER TABLE showcase_products
  ADD COLUMN IF NOT EXISTS documentation jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS infographic jsonb DEFAULT '[]'::jsonb;

-- Create reviews table
CREATE TABLE IF NOT EXISTS showcase_reviews (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text,
  rating int DEFAULT 5,
  comment text NOT NULL,
  blocked boolean DEFAULT false,
  reply text,
  created_at timestamptz DEFAULT now()
);

-- Store the shared documentation gallery separately from browser local storage.
CREATE TABLE IF NOT EXISTS showcase_documentation (
  id text PRIMARY KEY,
  images jsonb NOT NULL DEFAULT '[]'::jsonb
);

-- Allow the public showcase admin panel to manage rows with the anon key.
ALTER TABLE showcase_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_documentation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read documentation" ON showcase_documentation;
CREATE POLICY "Public can read documentation"
  ON showcase_documentation FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can insert documentation" ON showcase_documentation;
CREATE POLICY "Public can insert documentation"
  ON showcase_documentation FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update documentation" ON showcase_documentation;
CREATE POLICY "Public can update documentation"
  ON showcase_documentation FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read products" ON showcase_products;
CREATE POLICY "Public can read products"
  ON showcase_products FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can insert products" ON showcase_products;
CREATE POLICY "Public can insert products"
  ON showcase_products FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update products" ON showcase_products;
CREATE POLICY "Public can update products"
  ON showcase_products FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete products" ON showcase_products;
CREATE POLICY "Public can delete products"
  ON showcase_products FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "Public can read reviews" ON showcase_reviews;
CREATE POLICY "Public can read reviews"
  ON showcase_reviews FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can insert reviews" ON showcase_reviews;
CREATE POLICY "Public can insert reviews"
  ON showcase_reviews FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update reviews" ON showcase_reviews;
CREATE POLICY "Public can update reviews"
  ON showcase_reviews FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete reviews" ON showcase_reviews;
CREATE POLICY "Public can delete reviews"
  ON showcase_reviews FOR DELETE TO anon USING (true);

-- Create the public bucket used by the admin image uploader.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
CREATE POLICY "Public can read product images"
  ON storage.objects FOR SELECT TO anon USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can upload product images" ON storage.objects;
CREATE POLICY "Public can upload product images"
  ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can update product images" ON storage.objects;
CREATE POLICY "Public can update product images"
  ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can delete product images" ON storage.objects;
CREATE POLICY "Public can delete product images"
  ON storage.objects FOR DELETE TO anon USING (bucket_id = 'product-images');
