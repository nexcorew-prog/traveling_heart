import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase.');
}

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

// Compress an image file in the browser using a canvas. Returns a File.
export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.8,
): Promise<File> {
  return await new Promise<File>((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'));
            const newFile = new File([blob], file.name, { type: blob.type });
            resolve(newFile);
          },
          'image/jpeg',
          quality,
        );
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(new Error('Image load error'));
    img.src = URL.createObjectURL(file);
  });
}

// Upload an image File/Blob to Supabase Storage and return the public URL and path.
export async function uploadImageToStorage(
  file: File | Blob,
  options?: { bucket?: string; folder?: string; fileName?: string },
): Promise<{ publicUrl: string; path: string }> {
  const bucket = options?.bucket ?? 'public';
  const folder = options?.folder ?? 'images';

  const sanitizeFileName = (value: string) =>
    value
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 200) || 'image';

  const originalName = sanitizeFileName(
    options?.fileName ?? (file as File).name ?? 'image',
  );

  const uniqueSuffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);

  const fileName = `${Date.now()}_${uniqueSuffix}_${originalName}`;
  const path = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage.from(bucket).upload(path, file as File | Blob, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(
      `Error subiendo imagen a Supabase Storage en ${bucket}/${path}: ${error.message}`,
    );
  }

  const { data: urlData, error: urlError } = supabase.storage.from(bucket).getPublicUrl(path);
  if (urlError) {
    throw new Error(`No se pudo generar la URL pública: ${urlError.message}`);
  }

  return { publicUrl: urlData.publicUrl, path };
}
