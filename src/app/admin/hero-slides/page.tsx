"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroSlide = {
  id: string;
  src: string;
  headline: string;
  accent: string;
  subtitle: string;
  sortOrder: number;
  isActive: boolean;
};

const EMPTY_FORM = {
  src: "",
  headline: "",
  accent: "",
  subtitle: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/hero-slides");
    setSlides(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startEdit(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm({
      src: slide.src,
      headline: slide.headline,
      accent: slide.accent,
      subtitle: slide.subtitle,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = editingId
      ? `/api/admin/hero-slides/${editingId}`
      : "/api/admin/hero-slides";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      return;
    }

    cancelEdit();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Hero Slides</h1>
      <p className="text-sm text-neutral-400 mb-8">Manage the homepage hero carousel images.</p>

      {/* Slide list */}
      <div className="space-y-3 mb-10">
        {slides.length === 0 && (
          <p className="text-sm text-neutral-500">No slides yet.</p>
        )}
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
              <Image
                src={slide.src}
                alt={slide.headline}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {slide.headline}{" "}
                <span className="text-gold-400">{slide.accent}</span>
              </p>
              <p className="text-xs text-neutral-500 truncate">{slide.subtitle}</p>
              <p className="text-xs text-neutral-600 mt-0.5">
                Order: {slide.sortOrder} ·{" "}
                <span className={slide.isActive ? "text-green-400" : "text-red-400"}>
                  {slide.isActive ? "Active" : "Hidden"}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(slide)}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">
          {editingId ? "Edit Slide" : "Add New Slide"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Image URL
              </label>
              <input
                type="text"
                required
                value={form.src}
                onChange={(e) => setForm({ ...form, src: e.target.value })}
                placeholder="/images/photo.jpg or https://..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Headline
              </label>
              <input
                type="text"
                required
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="Move Together."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Accent <span className="text-gold-500">(gold text)</span>
              </label>
              <input
                type="text"
                required
                value={form.accent}
                onChange={(e) => setForm({ ...form, accent: e.target.value })}
                placeholder="Grow Together."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                required
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Sydney's Chinese outdoor community..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded accent-yellow-500"
                />
                <span className="text-sm text-neutral-300">Active (show on homepage)</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? "Saving…" : editingId ? "Save Changes" : "Add Slide"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
