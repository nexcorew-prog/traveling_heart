import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function POST(request: Request) {
  const body = await request.json();
  const { title, category, image_url } = body;

  if (!title || !image_url) {
    return NextResponse.json(
      { error: 'Faltan campos obligatorios: title, image_url' },
      { status: 400 },
    );
  }

  const { error } = await adminSupabase.from('gallery_images').insert({
    title: title.trim(),
    category: category ?? 'Paisaje',
    image_url: image_url.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
