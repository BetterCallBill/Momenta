"use client";

import { useEffect, useState } from "react";

type Event = { id: string; title: string; startAt: string };

type Registration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  createdAt: string;
  event: { title: string; startAt: string };
};

export default function AdminRegistrationsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url =
      selectedEventId === "all"
        ? "/api/admin/registrations"
        : `/api/admin/registrations?eventId=${selectedEventId}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setRegistrations(data); setLoading(false); });
  }, [selectedEventId]);

  function handleExport() {
    const url =
      selectedEventId === "all"
        ? "/api/admin/registrations/export"
        : `/api/admin/registrations/export?eventId=${selectedEventId}`;
    window.open(url, "_blank");
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric", month: "short", year: "numeric",
    });

  const formatDatetime = (iso: string) =>
    new Date(iso).toLocaleString("en-AU", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Registrations</h1>
      <p className="text-sm text-neutral-400 mb-8">View and export event sign-ups.</p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
        >
          <option value="all">All Events</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title} — {formatDate(ev.startAt)}
            </option>
          ))}
        </select>

        <button
          onClick={handleExport}
          disabled={registrations.length === 0}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-black text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          Export Excel
        </button>
      </div>

      {/* Summary */}
      <p className="text-xs text-neutral-500 mb-4">
        {loading ? "Loading…" : `${registrations.length} registration${registrations.length !== 1 ? "s" : ""}`}
      </p>

      {/* Table */}
      {!loading && registrations.length === 0 && (
        <p className="text-sm text-neutral-500">No registrations found.</p>
      )}

      {!loading && registrations.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Notes</th>
                {selectedEventId === "all" && (
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Event</th>
                )}
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b border-neutral-800 last:border-0 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="px-4 py-3 text-neutral-500">{i + 1}</td>
                  <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-neutral-300">{r.email}</td>
                  <td className="px-4 py-3 text-neutral-300">{r.phone}</td>
                  <td className="px-4 py-3 text-neutral-500 max-w-[160px] truncate">{r.notes ?? "—"}</td>
                  {selectedEventId === "all" && (
                    <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{r.event.title}</td>
                  )}
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{formatDatetime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
