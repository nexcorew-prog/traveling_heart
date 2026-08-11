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

function parseStorageUrl(url: string) {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (!match) return null;
    return { bucket: match[1], path: decodeURIComponent(match[2]) };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const urls: string[] = Array.isArray(body.urls) ? body.urls : [];

  if (!urls.length) {
    return NextResponse.json({ error: 'No se proporcionaron URLs para eliminar.' }, { status: 400 });
  }

  const results = [];

  for (const url of urls) {
    const parsed = parseStorageUrl(url);
    if (!parsed) {
      results.push({ url, skipped: true, reason: 'URL no válida de Supabase Storage' });
      continue;
    }

    const { data, error } = await adminSupabase.storage.from(parsed.bucket).remove([parsed.path]);
    if (error) {
      results.push({ url, error: error.message });
      continue;
    }

    results.push({ url, deleted: parsed.path });
  }

  return NextResponse.json({ results });
}
