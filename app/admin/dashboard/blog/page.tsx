'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaNewspaper } from 'react-icons/fa';
import { supabase, type BlogPost, compressImage } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  author: 'Traveling Heart',
  tags: [''],
  status: 'publicado',
};

export default function AdminBlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(form.image || '');
  }, [imageFile, form.image]);

  const openCreate = () => {
    setForm(emptyForm);
    setImageFile(null);
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      tags: post.tags.length ? post.tags : [''],
      status: post.status,
    });
    setImageFile(null);
    setPreviewUrl(post.image || '');
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalImageUrl = form.image;
    if (imageFile) {
      try {
        const compressed = await compressImage(imageFile, 1600, 0.78);
        const fileExt = (imageFile.name.split('.').pop() || 'jpg').replace(/\?.*$/, '');
        const fileName = `${Date.now()}_${form.title.replace(/\s+/g, '_')}.${fileExt}`;

        const formData = new FormData();
        formData.append('file', compressed);
        formData.append('bucket', 'gallery');
        formData.append('folder', 'blog');
        formData.append('fileName', fileName);

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok || uploadResult.error) {
          throw new Error(uploadResult.error || 'Error en la subida de la imagen.');
        }
        finalImageUrl = uploadResult.publicUrl;
      } catch (err: any) {
        toast({
          title: 'Error al subir imagen',
          description: err?.message || 'No se pudo subir la imagen.',
          variant: 'destructive',
        });
        setSaving(false);
        return;
      }
    }

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      image: finalImageUrl,
      author: form.author,
      tags: form.tags.filter((t) => t.trim()),
      status: form.status,
    };
    if (editingId) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingId);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
      else toast({ title: 'Artículo actualizado' });
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
      else toast({ title: 'Artículo creado' });
    }
    setSaving(false);
    setShowForm(false);
    loadPosts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar el artículo "${title}"?`)) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'Artículo eliminado' });
      loadPosts();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-dark mb-1">Blog</h1>
          <p className="text-brand-dark/50 text-sm">Gestiona los artículos del blog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-brand-primary text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-colors"
        >
          <FaPlus /> Nuevo Artículo
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
          ))
        ) : posts.length === 0 ? (
          <div className="col-span-full p-12 text-center">
            <FaNewspaper className="text-brand-dark/20 text-4xl mx-auto mb-3" />
            <p className="text-brand-dark/40">No hay artículos publicados.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {post.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5">
                <p className="text-brand-secondary text-xs mb-2">
                  {new Date(post.published_date).toLocaleDateString('es-BO')}
                </p>
                <h3 className="font-display font-bold text-lg text-brand-dark mb-2">
                  {post.title}
                </h3>
                <p className="text-brand-dark/50 text-sm line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(post)}
                    className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaEdit size={12} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="w-10 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowForm(false)}
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
                  {editingId ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Título *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Resumen</label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Contenido</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">Subir imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                      className="w-full text-sm"
                    />
                    <p className="mt-2 text-xs text-brand-dark/50">
                      Selecciona un archivo para subir o usa una URL en el campo abajo. Si subes un archivo, este tendrá prioridad.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">URL de imagen</label>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                {previewUrl ? (
                  <div className="rounded-3xl overflow-hidden border border-gray-200 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Vista previa" className="w-full h-56 object-cover" />
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Etiquetas (coma)</label>
                  <input
                    type="text"
                    value={form.tags.join(', ')}
                    onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-colors disabled:opacity-50"
                >
                  <FaSave /> {saving ? 'Guardando...' : 'Guardar Artículo'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
