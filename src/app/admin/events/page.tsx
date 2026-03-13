"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  title: string;
  slug: string;
  sportType: string;
  description: string;
  startAt: string;
  endAt: string;
  locationName: string;
  address: string;
  capacity: number;
  priceCents: number;
  isFeatured: boolean;
  coverImageUrl: string;
  _count: { registrations: number };
};

const SPORT_TYPES = [
  "RUNNING", "HIKING", "YOGA", "BJJ", "GOLF",
  "CROSSFIT", "MARTIAL_ARTS", "OTHER",
];

function toLocalDatetime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

const EMPTY_FORM = {
  title: "",
  slug: "",
  sportType: "OTHER",
  description: "",
  startAt: "",
  endAt: "",
  locationName: "",
  address: "",
  capacity: 20,
  priceCents: 0,
  isFeatured: false,
  coverImageUrl: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/events");
    setEvents(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function startEdit(ev: Event) {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      slug: ev.slug,
      sportType: ev.sportType,
      description: ev.description,
      startAt: toLocalDatetime(ev.startAt),
      endAt: toLocalDatetime(ev.endAt),
      locationName: ev.locationName,
      address: ev.address,
      capacity: ev.capacity,
      priceCents: ev.priceCents,
      isFeatured: ev.isFeatured,
      coverImageUrl: ev.coverImageUrl,
    });
    setError("");
    setShowForm(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(false);
  }

  function handleTitleChange(title: string) {
    const next = { ...form, title };
    if (!editingId) next.slug = slugify(title);
    setForm(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = editingId ? `/api/admin/events/${editingId}` : "/api/admin/events";
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

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This will also delete all registrations.`)) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    load();
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        {!showForm && (
          <button
            onClick={startAdd}
            className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold rounded-lg transition-colors"
          >
            + New Event
          </button>
        )}
      </div>
      <p className="text-sm text-neutral-400 mb-8">
        {events.length} event{events.length !== 1 ? "s" : ""} total
      </p>

      {/* Event list */}
      {!showForm && (
        <div className="space-y-3 mb-8">
          {events.length === 0 && (
            <p className="text-sm text-neutral-500">No events yet.</p>
          )}
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase tracking-wide">
                    {ev.sportType}
                  </span>
                  {ev.isFeatured && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {formatDate(ev.startAt)} · {ev.locationName}
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {ev._count.registrations} / {ev.capacity} registered ·{" "}
                  {ev.priceCents === 0 ? "Free" : `$${(ev.priceCents / 100).toFixed(2)}`}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(ev)}
                  className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ev.id, ev.title)}
                  className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">
            {editingId ? "Edit Event" : "New Event"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Blue Mountains Hiking Trip"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="blue-mountains-hiking-trip"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Sport Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Sport Type</label>
                <select
                  value={form.sportType}
                  onChange={(e) => setForm({ ...form, sportType: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                >
                  {SPORT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Start / End */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">End Time</label>
                <input
                  type="datetime-local"
                  required
                  value={form.endAt}
                  onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Location Name</label>
                <input
                  type="text"
                  required
                  value={form.locationName}
                  onChange={(e) => setForm({ ...form, locationName: e.target.value })}
                  placeholder="Rhodes Waterfront Park"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Rhodes NSW 2138"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Capacity / Price */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Capacity</label>
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Price <span className="text-neutral-600">(cents, 0 = free)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.priceCents}
                  onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Cover Image */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Cover Image URL</label>
                <input
                  type="text"
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  placeholder="/images/hike/photo.jpg or https://..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the event..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded accent-yellow-500"
                  />
                  <span className="text-sm text-neutral-300">Featured event</span>
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
                {loading ? "Saving…" : editingId ? "Save Changes" : "Create Event"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
