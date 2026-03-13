"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

const EMPTY_FORM = {
  name: "",
  logoUrl: "",
  description: "",
  websiteUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/sponsors");
    setSponsors(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startEdit(sponsor: Sponsor) {
    setEditingId(sponsor.id);
    setForm({
      name: sponsor.name,
      logoUrl: sponsor.logoUrl,
      description: sponsor.description,
      websiteUrl: sponsor.websiteUrl ?? "",
      sortOrder: sponsor.sortOrder,
      isActive: sponsor.isActive,
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
      ? `/api/admin/sponsors/${editingId}`
      : "/api/admin/sponsors";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        websiteUrl: form.websiteUrl || null,
      }),
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
    if (!confirm("Delete this sponsor?")) return;
    await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Sponsors</h1>
      <p className="text-sm text-neutral-400 mb-8">Manage partner organisations shown on the website.</p>

      {/* Sponsor list */}
      <div className="space-y-3 mb-10">
        {sponsors.length === 0 && (
          <p className="text-sm text-neutral-500">No sponsors yet.</p>
        )}
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            {/* Logo */}
            <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-800 flex items-center justify-center">
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{sponsor.name}</p>
              <p className="text-xs text-neutral-500 truncate">{sponsor.description}</p>
              <p className="text-xs text-neutral-600 mt-0.5">
                Order: {sponsor.sortOrder} ·{" "}
                <span className={sponsor.isActive ? "text-green-400" : "text-red-400"}>
                  {sponsor.isActive ? "Active" : "Hidden"}
                </span>
                {sponsor.websiteUrl && (
                  <> · <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline">{sponsor.websiteUrl}</a></>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(sponsor)}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sponsor.id)}
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
          {editingId ? "Edit Sponsor" : "Add New Sponsor"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Company Name"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Logo URL</label>
              <input
                type="text"
                required
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="/images/partner/logo.png or https://..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description of the company..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Website URL <span className="text-neutral-600">(optional)</span>
              </label>
              <input
                type="url"
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Sort Order</label>
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
                <span className="text-sm text-neutral-300">Active (show on website)</span>
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
              {loading ? "Saving…" : editingId ? "Save Changes" : "Add Sponsor"}
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
