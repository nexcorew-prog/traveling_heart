'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaTrash,
  FaImages,
  FaUpload,
  FaCircleNotch,
} from 'react-icons/fa';
import { supabase, type GalleryImage, compressImage, uploadImageToStorage } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const defaultCategories = [
  'Paisaje',
  'Ciudad',
  'Cultura',
  'Aventura',
  'Gastronomía',
  'Naturaleza',
  'Patrimonio',
];

export default function AdminGalleryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Paisaje');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const categoryOptions = Array.from(
    new Set([...defaultCategories, ...galleryItems.map((item) => item.category).filter(Boolean)]),
  );

  const loadGallery = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    setGalleryItems((data as GalleryImage[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    if (!file) {
      setImageUrl('');
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || (!imageFile && !imageUrl.trim())) {
      toast({
        title: 'Faltan datos',
        description: 'Agrega un título y una imagen o URL de imagen.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: 'Sesión requerida',
        description: 'Vuelve a iniciar sesión en el panel administrativo para guardar imágenes.',
        variant: 'destructive',
      });
      setSaving(false);
      router.push('/admin/login');
      return;
    }

    let finalImageUrl = imageUrl.trim();

    if (imageFile) {
      try {
        // Compress image before upload
        const compressed = await compressImage(imageFile, 1600, 0.78);
        const fileExt = (imageFile.name.split('.').pop() || 'jpg').replace(/\?.*$/, '');
        const fileName = `${Date.now()}_${title.replace(/\s+/g, '_')}.${fileExt}`;
        // Upload to Supabase Storage using helper
        const { publicUrl } = await uploadImageToStorage(compressed, {
          bucket: 'gallery',
          folder: 'gallery',
          fileName,
        });
        finalImageUrl = publicUrl;
      } catch (err: any) {
        toast({
          title: 'Error al subir imagen',
          description: err?.message || 'No se pudo procesar la imagen.',
          variant: 'destructive',
        });
        setSaving(false);
        return;
      }
    }

    const response = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.trim(),
        category,
        image_url: finalImageUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      toast({
        title: 'Error',
        description: result.error || 'No se pudo guardar la imagen.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Imagen guardada',
        description: 'La foto se agregó a la galería.',
      });
      setTitle('');
      setCategory('Paisaje');
      setImageFile(null);
      setImageUrl('');
      setPreviewUrl('');
      loadGallery();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar la imagen "${title}"?`)) return;
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Imagen eliminada',
        description: title,
      });
      loadGallery();
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-dark mb-1">
            Galería
          </h1>
          <p className="text-brand-dark/50 text-sm">
            Sube fotos con título y categoría para mostrar en tu sitio.
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-brand-dark/70 text-sm">
            <FaImages />
            Usa el formulario para subir una imagen o pegar una URL directa.
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              Título de la imagen *
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-brand-primary transition-colors"
              placeholder="Ej. Atardecer en el Salar"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              Categoría *
            </label>
            <input
              type="text"
              list="gallery-categories"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-brand-primary transition-colors"
              placeholder="Escribe una categoría o elige una"
              required
            />
            <datalist id="gallery-categories">
              {categoryOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Subir imagen desde tu dispositivo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-primary transition-colors"
              />
              <p className="mt-2 text-xs text-brand-dark/50">
                Se comprime y sube automáticamente a Supabase Storage.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                O usar una URL de imagen
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-brand-primary transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full font-semibold shadow-lg shadow-brand-primary/25 hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            {saving ? <FaCircleNotch className="animate-spin" /> : <FaUpload />}
            {saving ? 'Guardando...' : 'Guardar Imagen'}
          </button>
        </div>

        <div className="rounded-3xl bg-brand-primary/5 border border-brand-primary/10 p-6">
          <h2 className="font-semibold text-lg text-brand-primary mb-4">
            Vista previa
          </h2>
          {previewUrl || imageUrl ? (
            <div className="rounded-3xl overflow-hidden bg-white border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl || imageUrl}
                alt="Vista previa de imagen"
                className="w-full h-72 object-cover"
              />
            </div>
          ) : (
            <div className="h-72 rounded-3xl border border-dashed border-brand-primary/30 flex items-center justify-center text-brand-dark/50">
              Selecciona un archivo o pega una URL para previsualizar
            </div>
          )}
        </div>
      </form>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-brand-dark">
              Imágenes de la galería
            </h2>
            <p className="text-brand-dark/50 text-sm">
              Administra las fotos ya cargadas.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-2 text-sm text-brand-primary">
            <FaImages /> {galleryItems.length} imágenes
          </span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="p-12 text-center text-brand-dark/40">
            No hay imágenes cargadas aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-brand-dark/50 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Imagen</th>
                  <th className="px-6 py-3 font-semibold">Título</th>
                  <th className="px-6 py-3 font-semibold">Categoría</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {galleryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-20 h-16 rounded-2xl overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-dark">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      {new Date(item.created_at).toLocaleDateString('es-BO')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
