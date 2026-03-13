"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatarUrl: string | null;
  sortOrder: number;
};

const EMPTY_FORM = {
  name: "",
  role: "",
  bio: "",
  avatarUrl: "",
  sortOrder: 0,
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/team");
    setMembers(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startEdit(m: TeamMember) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio ?? "",
      avatarUrl: m.avatarUrl ?? "",
      sortOrder: m.sortOrder,
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

    const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        bio: form.bio || null,
        avatarUrl: form.avatarUrl || null,
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

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Team</h1>
      <p className="text-sm text-neutral-400 mb-8">
        Manage team members shown on the About page.
      </p>

      {/* Member list */}
      <div className="space-y-3 mb-10">
        {members.length === 0 && (
          <p className="text-sm text-neutral-500">No team members yet.</p>
        )}
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-neutral-800 flex items-center justify-center">
              {m.avatarUrl ? (
                <Image
                  src={m.avatarUrl}
                  alt={m.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-lg text-neutral-500">
                  {m.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{m.name}</p>
              <p className="text-xs text-gold-400">{m.role}</p>
              {m.bio && (
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{m.bio}</p>
              )}
              <p className="text-xs text-neutral-700 mt-0.5">Order: {m.sortOrder}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(m)}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(m.id, m.name)}
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
          {editingId ? "Edit Member" : "Add Team Member"}
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
                placeholder="Jane Smith"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Role</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Head Coach"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Avatar URL <span className="text-neutral-600">(optional)</span>
              </label>
              <input
                type="text"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                placeholder="/images/team/jane.jpg or https://..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Bio <span className="text-neutral-600">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Short bio..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500 resize-none"
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
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? "Saving…" : editingId ? "Save Changes" : "Add Member"}
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
