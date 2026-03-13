"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  type: string;
  videoUrl: string | null;
  tags: string;
  createdAt: string;
};

const EMPTY_FORM = {
  type: "image",
  url: "",
  videoUrl: "",
  alt: "",
  tags: "",
};

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function tagsToJson(input: string): string {
  const tags = input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return JSON.stringify(tags);
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/gallery");
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: form.url,
        alt: form.alt,
        type: form.type,
        videoUrl: form.type === "video" ? form.videoUrl || null : null,
        tags: tagsToJson(form.tags),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      return;
    }

    setForm(EMPTY_FORM);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Gallery</h1>
      <p className="text-sm text-neutral-400 mb-8">
        Manage gallery images and videos. Images tagged{" "}
        <span className="text-gold-400 font-medium">featured</span> appear on the homepage.
      </p>

      {/* Image list */}
      <div className="space-y-3 mb-10">
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No gallery items yet.</p>
        )}
        {items.map((item) => {
          const tags = parseTags(item.tags);
          const isFeatured = tags.includes("featured");

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-800 flex items-center justify-center">
                {item.type === "video" ? (
                  <>
                    {item.url ? (
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        className="object-cover opacity-70"
                        unoptimized
                      />
                    ) : null}
                    <span className="absolute text-xl">🎬</span>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-white truncate">{item.alt}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase tracking-wide">
                    {item.type}
                  </span>
                  {isFeatured && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 font-medium">
                      首页展示
                    </span>
                  )}
                </div>
                {tags.length > 0 && (
                  <p className="text-xs text-neutral-500 mt-0.5">{tags.join(", ")}</p>
                )}
                <p className="text-xs text-neutral-700 mt-0.5 truncate">{item.url}</p>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors shrink-0"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Add New Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Type</label>
            <div className="flex gap-3">
              {["image", "video"].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={() => setForm({ ...form, type: t })}
                    className="accent-yellow-500"
                  />
                  <span className="text-sm text-neutral-300 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={form.type === "video" ? "" : "sm:col-span-2"}>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                {form.type === "video" ? "Cover Image URL" : "Image URL"}
              </label>
              <input
                type="text"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="/images/yoga/_DSC0249.JPG or https://..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            {form.type === "video" && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Video URL
                </label>
                <input
                  type="text"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://... or /videos/..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Alt Text
              </label>
              <input
                type="text"
                required
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Group yoga session at Hyde Park"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Tags{" "}
                <span className="text-neutral-600">(comma separated)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="yoga, featured"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
              <p className="text-xs text-neutral-600 mt-1">
                Add <span className="text-gold-500">featured</span> to show on homepage
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? "Saving…" : "Add to Gallery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
