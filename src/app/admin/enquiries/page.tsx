"use client";

import { useEffect, useState } from "react";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string | null;
  message: string;
  createdAt: string;
};

const formatDatetime = (iso: string) =>
  new Date(iso).toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/enquiries")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        setEnquiries(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load enquiries. Please refresh and try again.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Enquiries</h1>
      <p className="text-sm text-neutral-400 mb-8">
        Contact form submissions from the website.
      </p>

      <p className="text-xs text-neutral-500 mb-4">
        {loading
          ? "Loading…"
          : `${enquiries.length} enquir${enquiries.length !== 1 ? "ies" : "y"}`}
      </p>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {!loading && !error && enquiries.length === 0 && (
        <p className="text-sm text-neutral-500">No enquiries yet.</p>
      )}

      {!loading && !error && enquiries.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Message</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e, i) => (
                <tr
                  key={e.id}
                  className="border-b border-neutral-800 last:border-0 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="px-4 py-3 text-neutral-500">{i + 1}</td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{e.name}</td>
                  <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{e.email}</td>
                  <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{e.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{e.inquiryType ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-500 max-w-xs truncate">{e.message}</td>
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{formatDatetime(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
