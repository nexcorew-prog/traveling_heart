/*
# Traveling Heart - Database Schema

## Overview
Creates the full schema for the Traveling Heart tourism agency website:
- Tours (destinations + tour details)
- Reservations (customer bookings)
- Blog posts (travel tips)
- Gallery images
- Contact messages
- Testimonials

## Tables
1. `tours` - Tour/destination catalog with pricing, duration, itinerary, images, category
2. `reservations` - Customer bookings linked to a tour
3. `blog_posts` - Travel articles/tips
4. `gallery_images` - Photo gallery entries
5. `contacts` - Contact form submissions
6. `testimonials` - Client reviews

## Security
- Public tables (tours, blog_posts, gallery_images, testimonials): readable by anon/authenticated (public website content). Writes restricted to authenticated (admin).
- Private tables (reservations, contacts): inserts allowed by anon (customers submit forms), reads/updates/deletes restricted to authenticated (admin only).

## Notes
- No user_id columns: this is a single-admin app. The admin signs in via Supabase auth; public visitors are anon.
- Reservations and contacts are submitted by anonymous visitors, so INSERT is open to anon but SELECT/UPDATE/DELETE are authenticated-only.
*/

-- TOURS
CREATE TABLE IF NOT EXISTS tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  destination text NOT NULL,
  category text NOT NULL DEFAULT 'Aventura',
  duration text NOT NULL,
  description text NOT NULL,
  itinerary jsonb NOT NULL DEFAULT '[]'::jsonb,
  includes jsonb NOT NULL DEFAULT '[]'::jsonb,
  price numeric(10,2) NOT NULL DEFAULT 0,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  available_dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'activo',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_tours" ON tours;
CREATE POLICY "anon_read_tours" ON tours FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_tours" ON tours;
CREATE POLICY "auth_insert_tours" ON tours FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_tours" ON tours;
CREATE POLICY "auth_update_tours" ON tours FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_tours" ON tours;
CREATE POLICY "auth_delete_tours" ON tours FOR DELETE
  TO authenticated USING (true);

-- RESERVATIONS
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id) ON DELETE SET NULL,
  tour_name text NOT NULL,
  travel_date date NOT NULL,
  num_people int NOT NULL DEFAULT 1,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text,
  total numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'tarjeta',
  status text NOT NULL DEFAULT 'pendiente',
  reservation_code text NOT NULL DEFAULT upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8)),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "anon_insert_reservations" ON reservations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_reservations" ON reservations;
CREATE POLICY "auth_read_reservations" ON reservations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_reservations" ON reservations;
CREATE POLICY "auth_update_reservations" ON reservations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reservations" ON reservations;
CREATE POLICY "auth_delete_reservations" ON reservations FOR DELETE
  TO authenticated USING (true);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'Traveling Heart',
  published_date date NOT NULL DEFAULT CURRENT_DATE,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'publicado',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_blog" ON blog_posts;
CREATE POLICY "anon_read_blog" ON blog_posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_blog" ON blog_posts;
CREATE POLICY "auth_insert_blog" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_blog" ON blog_posts;
CREATE POLICY "auth_update_blog" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_blog" ON blog_posts;
CREATE POLICY "auth_delete_blog" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- GALLERY IMAGES
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'paisaje',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_gallery" ON gallery_images;
CREATE POLICY "anon_read_gallery" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery_images;
CREATE POLICY "auth_insert_gallery" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery_images;
CREATE POLICY "auth_update_gallery" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery_images;
CREATE POLICY "auth_delete_gallery" ON gallery_images FOR DELETE
  TO authenticated USING (true);

-- CONTACTS
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'nuevo',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
CREATE POLICY "anon_insert_contacts" ON contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_contacts" ON contacts;
CREATE POLICY "auth_read_contacts" ON contacts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contacts" ON contacts;
CREATE POLICY "auth_update_contacts" ON contacts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contacts" ON contacts;
CREATE POLICY "auth_delete_contacts" ON contacts FOR DELETE
  TO authenticated USING (true);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  destination text NOT NULL,
  comment text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  avatar text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_testimonials" ON testimonials;
CREATE POLICY "anon_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);
