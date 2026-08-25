'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import { supabase, type Tour, compressImage } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const emptyForm = {
  name: '',
  destination: '',
  category: 'Aventura',
  duration: '',
  description: '',
  itinerary: [''],
  includes: [''],
  excludes: [''],
  price: 0,
  images: [''],
  available_dates: [''],
  status: 'activo',
  featured: false,
};

const defaultCategories = ['Montaña', 'Full day', 'Treking', 'Aventura', 'Cultura', 'Naturaleza', 'Gastronomía'];

export default function AdminToursPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFilesMap, setImageFilesMap] = useState<Record<number, File | null>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>({});

  const categoryOptions = Array.from(
    new Set([...defaultCategories, ...tours.map((tour) => tour.category).filter(Boolean)]),
  );

  const loadTours = async () => {
    const { data } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });
    setTours((data as Tour[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadTours();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setInitialForm(emptyForm);
    setImageFilesMap({});
    setImagePreviews({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (tour: Tour) => {
    setForm({
      name: tour.name,
      destination: tour.destination,
      category: tour.category,
      duration: tour.duration,
      description: tour.description,
      itinerary: tour.itinerary.length ? tour.itinerary : [''],
      includes: tour.includes.length ? tour.includes : [''],
      excludes: tour.excludes?.length ? tour.excludes : [''],
      price: tour.price,
      images: tour.images.length ? tour.images : [''],
      available_dates: tour.available_dates.length ? tour.available_dates : [''],
      status: tour.status,
      featured: tour.featured,
    });
    setInitialForm({
      name: tour.name,
      destination: tour.destination,
      category: tour.category,
      duration: tour.duration,
      description: tour.description,
      itinerary: tour.itinerary.length ? tour.itinerary : [''],
      includes: tour.includes.length ? tour.includes : [''],
      excludes: tour.excludes?.length ? tour.excludes : [''],
      price: tour.price,
      images: tour.images.length ? tour.images : [''],
      available_dates: tour.available_dates.length ? tour.available_dates : [''],
      status: tour.status,
      featured: tour.featured,
    });
    setImageFilesMap({});
    setImagePreviews({});
    setEditingId(tour.id);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    const hasUnsavedChanges =
      JSON.stringify(form) !== JSON.stringify(initialForm) ||
      Object.values(imageFilesMap).some(Boolean);
    if (hasUnsavedChanges && !window.confirm('Hay cambios sin guardar. ¿Deseas cerrar la modal y descartarlos?')) {
      return;
    }

    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: 'Sesión requerida',
        description: 'Vuelve a iniciar sesión en el panel administrativo para guardar tours.',
        variant: 'destructive',
      });
      setSaving(false);
      router.push('/admin/login');
      return;
    }

    // Prepare images: if any file was selected for an image index, compress and upload it,
    // otherwise keep the text URL provided in the form.
    const images = [...form.images];
    for (let i = 0; i < images.length; i++) {
      const file = imageFilesMap[i];
      if (file) {
        try {
          const compressed = await compressImage(file, 1600, 0.78);
          const fileExt = (file.name.split('.').pop() || 'jpg').replace(/\?.*$/, '');
          const fileName = `${Date.now()}_${form.name.replace(/\s+/g, '_')}_${i}.${fileExt}`;

          const formData = new FormData();
          formData.append('file', compressed);
          formData.append('bucket', 'gallery');
          formData.append('folder', 'tours');
          formData.append('fileName', fileName);

          const uploadResponse = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          });

          const uploadResult = await uploadResponse.json();
          if (!uploadResponse.ok || uploadResult.error) {
            throw new Error(uploadResult.error || 'Error en la subida de la imagen.');
          }

          images[i] = uploadResult.publicUrl;
        } catch (err: any) {
          console.error('Error subiendo imagen de tour:', err);
          toast({
            title: 'Error al subir imagen',
            description: err?.message || 'No se pudo subir la imagen.',
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
      }
    }

    const payload = {
      name: form.name,
      destination: form.destination,
      category: form.category,
      duration: form.duration,
      description: form.description,
      itinerary: form.itinerary.filter((x) => x.trim()),
      includes: form.includes.filter((x) => x.trim()),
      excludes: form.excludes.filter((x) => x.trim()),
      price: Number(form.price),
      images: images.filter((x) => x.trim()),
      available_dates: form.available_dates.filter((x) => x.trim()),
      status: form.status,
      featured: form.featured,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('tours')
        .update(payload)
        .eq('id', editingId);
      if (error) {
        const isRls = error.message?.toLowerCase().includes('row-level security') || error.message?.toLowerCase().includes('violates');
        toast({
          title: 'Error al guardar',
          description: isRls
            ? 'La sesión de administrador no pudo actualizar el tour. Vuelve a iniciar sesión e inténtalo de nuevo.'
            : error.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Tour actualizado', description: form.name });
      }
    } else {
      const { error } = await supabase.from('tours').insert(payload);
      if (error) {
        const isRls = error.message?.toLowerCase().includes('row-level security') || error.message?.toLowerCase().includes('violates');
        toast({
          title: 'Error al guardar',
          description: isRls
            ? 'La sesión de administrador no pudo crear el tour. Vuelve a iniciar sesión e inténtalo de nuevo.'
            : error.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Tour creado', description: form.name });
      }
    }

    setSaving(false);
    setInitialForm(form);
    setShowForm(false);
    loadTours();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar el tour "${name}"?`)) return;

    const { data: tour, error: fetchError } = await supabase
      .from('tours')
      .select('images')
      .eq('id', id)
      .single();

    if (fetchError) {
      toast({ title: 'Error', description: fetchError.message, variant: 'destructive' });
      return;
    }

    const imageUrls: string[] = Array.isArray(tour?.images) ? tour.images.filter(Boolean) : [];
    if (imageUrls.length) {
      await fetch('/api/admin/storage/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: imageUrls }),
      });
    }

    const { error } = await supabase.from('tours').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Tour eliminado', description: name });
      loadTours();
    }
  };

  const updateListField = (
    field: 'itinerary' | 'includes' | 'excludes' | 'images' | 'available_dates',
    index: number,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addListItem = (field: 'itinerary' | 'includes' | 'excludes' | 'images' | 'available_dates') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field: 'itinerary' | 'includes' | 'excludes' | 'images' | 'available_dates', index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageFileChange = (index: number, file: File | null) => {
    setImageFilesMap((prev) => ({ ...prev, [index]: file }));
    if (!file) {
      setImagePreviews((p) => {
        const np = { ...p };
        delete np[index];
        return np;
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setImagePreviews((p) => ({ ...p, [index]: url }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-dark mb-1">
            Tours
          </h1>
          <p className="text-brand-dark/50 text-sm">
            Gestiona los tours de tu agencia
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-brand-primary text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-colors"
        >
          <FaPlus /> Crear Nuevo Tour
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="p-12 text-center">
            <FaMapMarkedAlt className="text-brand-dark/20 text-4xl mx-auto mb-3" />
            <p className="text-brand-dark/40">No hay tours creados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-brand-dark/50 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Nombre</th>
                  <th className="px-6 py-3 font-semibold">Destino</th>
                  <th className="px-6 py-3 font-semibold">Precio</th>
                  <th className="px-6 py-3 font-semibold">Duración</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tour.images[0] && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={tour.images[0]}
                            alt={tour.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-semibold text-sm text-brand-dark">
                          {tour.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      {tour.destination}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-primary">
                      {tour.price}$
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      {tour.duration}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tour.status === 'activo'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tour.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      {new Date(tour.created_at).toLocaleDateString('es-BO')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(tour)}
                          className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id, tour.name)}
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={closeForm}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                <h2 className="font-display font-bold text-xl text-brand-dark">
                  {editingId ? 'Editar Tour' : 'Crear Nuevo Tour'}
                </h2>
                <button
                  onClick={closeForm}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Nombre del tour *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Destino *
                    </label>
                    <input
                      type="text"
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Categoría
                    </label>
                    <input
                      type="text"
                      list="tour-categories"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Escribe una categoría o elige una"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                      required
                    />
                    <datalist id="tour-categories">
                      {categoryOptions.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Duración
                    </label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="Ej: 2 días / 1 noche"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Precio (BS)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary resize-none"
                  />
                </div>

                {/* List fields */}
                {([
                  { field: 'itinerary' as const, label: 'Itinerario', helper: 'Añade cada etapa del recorrido' },
                  { field: 'includes' as const, label: 'Qué incluye', helper: 'Lista lo que ya viene incluido' },
                  { field: 'excludes' as const, label: 'No incluye', helper: 'Lista los gastos o servicios no incluidos' },
                  { field: 'available_dates' as const, label: 'Fechas disponibles', helper: 'Ej: 2026-09-20' },
                ]).map(({ field, label, helper }) => (
                  <div key={field} className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-brand-dark">{label}</p>
                        <p className="text-xs text-brand-dark/50">{helper}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addListItem(field)}
                        className="px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold hover:bg-brand-primary/15 transition-colors"
                      >
                        + Añadir
                      </button>
                    </div>

                    <div className="space-y-2">
                      {form[field].map((item, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateListField(field, i, e.target.value)}
                            placeholder={field === 'available_dates' ? 'YYYY-MM-DD' : 'Escribe aquí'}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-brand-primary"
                          />

                          {form[field].length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeListItem(field, i)}
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center shrink-0"
                            >
                              <FaTimes size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-dark">Imágenes del tour</p>
                      <p className="text-xs text-brand-dark/50">Sube fotos o pega una URL. Se muestran en la galería del tour.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addListItem('images')}
                      className="px-3 py-1.5 rounded-full bg-brand-accent text-brand-dark text-xs font-semibold hover:brightness-95 transition-all"
                    >
                      + Agregar foto
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.images.map((item, i) => (
                      <div key={i} className="rounded-xl border border-orange-200 bg-white p-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark/60">
                            Foto {i + 1}
                          </span>
                          {form.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeListItem('images', i)}
                              className="text-xs text-red-600 hover:text-red-700 font-semibold"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-[1fr_160px] gap-3">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateListField('images', i, e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                          />

                          <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-brand-primary/60 bg-brand-primary/5 px-3 py-2.5 text-center text-xs font-semibold text-brand-primary hover:bg-brand-primary/10 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageFileChange(i, e.target.files?.[0] ?? null)}
                            />
                            {imagePreviews[i] ? 'Cambiar' : 'Subir archivo'}
                          </label>
                        </div>

                        {(imagePreviews[i] || item) && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imagePreviews[i] ?? item}
                              alt={`preview-${i}`}
                              className="h-28 w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 accent-brand-primary"
                    />
                    Destacado
                  </label>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Estado
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-colors disabled:opacity-50"
                >
                  <FaSave /> {saving ? 'Guardando...' : 'Guardar Tour'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
