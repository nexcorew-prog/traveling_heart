import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminSupabase = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
}) : null;

const sanitizeFileName = (value: string) =>
  value
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 200) || 'image';

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey || !adminSupabase) {
    return NextResponse.json(
      { error: 'Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.' },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const bucket = (formData.get('bucket') as string) || 'gallery';
  const folder = (formData.get('folder') as string) || 'gallery';
  const rawFileName = (formData.get('fileName') as string) || '';

  if (!file) {
    return NextResponse.json({ error: 'No se envió el archivo.' }, { status: 400 });
  }

  const fileName = sanitizeFileName(rawFileName || (file as File).name || `image-${Date.now()}`);
  const path = `${folder}/${fileName}`;

  const { data, error } = await adminSupabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    return NextResponse.json(
      {
        error: `Error subiendo imagen a ${bucket}/${path}: ${error.message}`,
      },
      { status: 500 },
    );
  }

  const { data: urlData, error: urlError } = adminSupabase.storage.from(bucket).getPublicUrl(path);

  if (urlError) {
    return NextResponse.json(
      { error: `No se pudo generar la URL pública: ${urlError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ publicUrl: urlData.publicUrl, path });
}
