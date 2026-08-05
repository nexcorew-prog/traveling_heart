import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Tour = {
  id: string;
  name: string;
  destination: string;
  category: string;
  duration: string;
  description: string;
  itinerary: string[];
  includes: string[];
  price: number;
  images: string[];
  available_dates: string[];
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: string;
  tour_id: string | null;
  tour_name: string;
  travel_date: string;
  num_people: number;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  total: number;
  payment_method: string;
  status: string;
  reservation_code: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  published_date: string;
  tags: string[];
  status: string;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
};

export type Contact = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  destination: string;
  comment: string;
  rating: number;
  avatar: string;
  created_at: string;
};
