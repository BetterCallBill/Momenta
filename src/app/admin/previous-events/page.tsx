"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  type: string;
  tags: string;
  createdAt: string;
};

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function addFeatured(raw: string): string {
  const tags = parseTags(raw);
  if (!tags.includes("featured")) tags.push("featured");
  return JSON.stringify(tags);
}

function removeFeatured(raw: string): string {
  const tags = parseTags(raw).filter((t) => t !== "featured");
  return JSON.stringify(tags);
}

const EMPTY_FORM = { url: "", alt: "", tags: "" };

export default function AdminPreviousEventsPage() {
  const [featured, setFeatured] = useState<GalleryItem[]>([]);
  const [all, setAll] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/gallery");
    const data: GalleryItem[] = await res.json();
    setFeatured(data.filter((d) => parseTags(d.tags).includes("featured")));
    setAll(data.filter((d) => !parseTags(d.tags).includes("featured")));
  }

  useEffect(() => { load(); }, []);

  async function handleRemove(item: GalleryItem) {
    await fetch(`/api/admin/gallery/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: removeFeatured(item.tags) }),
    });
    load();
  }

  async function handleAdd(item: GalleryItem) {
    await fetch(`/api/admin/gallery/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: addFeatured(item.tags) }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image permanently?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const extraTags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!extraTags.includes("featured")) extraTags.push("featured");

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: form.url,
        alt: form.alt,
        type: "image",
        tags: JSON.stringify(extraTags),
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Previous Events Wall</h1>
      <p className="text-sm text-neutral-400 mb-8">
        Images displayed here appear in the <span className="text-gold-400 font-medium">Previous Events</span> section on the homepage. Up to 8 images are shown (newest first).
      </p>

      {/* Current wall — featured images */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-4">
          Currently on Wall ({featured.length})
        </h2>

        {featured.length === 0 && (
          <p className="text-sm text-neutral-500">No images on the wall yet.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {featured.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-[3/2] bg-neutral-900 border border-neutral-800">
              <Image
                src={item.url}
                alt={item.alt}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/70 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <p className="text-xs text-white font-medium px-2 text-center leading-snug">{item.alt}</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleRemove(item)}
                    className="px-2 py-1 text-xs bg-neutral-800 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 text-xs bg-neutral-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add new image directly to wall */}
      <section className="mb-10 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Upload New Image to Wall</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Image URL</label>
              <input
                type="text"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="/images/events/photo.jpg or https://..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Caption / Alt Text</label>
              <input
                type="text"
                required
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Sunday morning run at Centennial Park"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Extra Tags <span className="text-neutral-600">(comma separated, optional)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="running, outdoor"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
              <p className="text-xs text-neutral-600 mt-1">
                <span className="text-gold-500">featured</span> is added automatically
              </p>
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors"
          >
            {loading ? "Adding…" : "Add to Wall"}
          </button>
        </form>
      </section>

      {/* Other gallery images — add to wall */}
      {all.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-4">
            Other Gallery Images — Add to Wall
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {all.map((item) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-[3/2] bg-neutral-900 border border-neutral-800">
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  unoptimized
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white font-medium px-2 text-center leading-snug">{item.alt}</p>
                  <button
                    onClick={() => handleAdd(item)}
                    className="px-3 py-1 text-xs bg-gold-500 hover:bg-gold-400 text-black font-semibold rounded-lg transition-colors"
                  >
                    + Add to Wall
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
