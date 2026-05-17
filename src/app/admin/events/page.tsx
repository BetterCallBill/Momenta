'use client';

import { useEffect, useState } from 'react';
import { TZ as SYDNEY_TZ } from '@/lib/dates';

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

const SPORT_TYPES = ['RUNNING', 'HIKING', 'YOGA', 'BJJ', 'GOLF', 'CROSSFIT', 'MARTIAL_ARTS', 'OTHER'];

// Convert a UTC ISO string to "YYYY-MM-DDTHH:MM" in Sydney time (for datetime-local inputs).
function toSydneyDatetime(iso: string): string {
    const parts = new Intl.DateTimeFormat('en-AU', {
        timeZone: SYDNEY_TZ,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
        hour12: false,
    }).formatToParts(new Date(iso));
    const get = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)!.value;
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

// Convert "YYYY-MM-DDTHH:MM" (entered as Sydney local time) to a UTC ISO string.
// Handles DST by computing the Sydney offset for that moment via Intl.
function sydneyLocalToISO(localDatetime: string): string {
    if (!localDatetime) return '';
    const asIfUtc = new Date(localDatetime + ':00.000Z');
    const parts = new Intl.DateTimeFormat('en-AU', {
        timeZone: SYDNEY_TZ,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
    }).formatToParts(asIfUtc);
    const get = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)!.value;
    const sydneyAsUtc = new Date(`${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}.000Z`);
    const offsetMs = sydneyAsUtc.getTime() - asIfUtc.getTime();
    return new Date(asIfUtc.getTime() - offsetMs).toISOString();
}

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60);
}

const EMPTY_FORM = {
    title: '',
    slug: '',
    sportType: 'OTHER',
    description: '',
    startAt: '',
    endAt: '',
    locationName: '',
    address: '',
    capacity: 20,
    priceCents: 0,
    isFeatured: false,
    coverImageUrl: '',
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    async function load() {
        const res = await fetch('/api/admin/events');
        setEvents(await res.json());
    }

    useEffect(() => {
        load();
    }, []);

    function startAdd() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
        setShowForm(true);
    }

    function startEdit(ev: Event) {
        setEditingId(ev.id);
        setForm({
            title: ev.title,
            slug: ev.slug,
            sportType: ev.sportType,
            description: ev.description,
            startAt: toSydneyDatetime(ev.startAt),
            endAt: toSydneyDatetime(ev.endAt),
            locationName: ev.locationName,
            address: ev.address,
            capacity: ev.capacity,
            priceCents: ev.priceCents,
            isFeatured: ev.isFeatured,
            coverImageUrl: ev.coverImageUrl,
        });
        setError('');
        setShowForm(true);
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
        setShowForm(false);
    }

    function handleTitleChange(title: string) {
        const next = { ...form, title };
        if (!editingId) next.slug = slugify(title);
        setForm(next);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const url = editingId ? `/api/admin/events/${editingId}` : '/api/admin/events';
        const method = editingId ? 'PUT' : 'POST';

        const payload = {
            ...form,
            startAt: sydneyLocalToISO(form.startAt),
            endAt: sydneyLocalToISO(form.endAt),
        };

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setLoading(false);

        if (!res.ok) {
            const data = await res.json();
            setError(data.error ?? 'Failed to save');
            return;
        }

        cancelEdit();
        load();
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Delete "${title}"? This will also delete all registrations.`)) return;
        await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
        load();
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-AU', {
            timeZone: SYDNEY_TZ,
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <div>
            <div className='flex items-center justify-between mb-1'>
                <h1 className='text-2xl font-bold text-white'>Events</h1>
                {!showForm && (
                    <button
                        onClick={startAdd}
                        className='px-4 py-2 bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold rounded-lg transition-colors'>
                        + New Event
                    </button>
                )}
            </div>
            <p className='text-sm text-neutral-400 mb-8'>
                {events.length} event{events.length !== 1 ? 's' : ''} total
            </p>

            {/* Event list */}
            {!showForm && (
                <div className='mb-8'>
                    {events.length === 0 ? (
                        <p className='text-sm text-neutral-500'>No events yet.</p>
                    ) : (
                        <div className='overflow-x-auto rounded-xl border border-neutral-800'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='bg-neutral-900 border-b border-neutral-800'>
                                        <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide'>
                                            Title
                                        </th>
                                        <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide'>
                                            Type
                                        </th>
                                        <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide'>
                                            When / Where
                                        </th>
                                        <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide'>
                                            Capacity
                                        </th>
                                        <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide'>
                                            Price
                                        </th>
                                        <th className='text-right px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(ev => (
                                        <tr
                                            key={ev.id}
                                            className='border-b border-neutral-800 last:border-0 hover:bg-neutral-900/50 transition-colors'>
                                            <td className='px-4 py-3 text-white font-medium'>
                                                <div className='flex items-center gap-2 flex-wrap'>
                                                    <span>{ev.title}</span>
                                                    {ev.isFeatured && (
                                                        <span className='text-[10px] px-2 py-1 rounded-full bg-gold-500/20 text-gold-300 uppercase tracking-wide'>
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='px-4 py-3 text-neutral-400 uppercase tracking-wide'>
                                                {ev.sportType}
                                            </td>
                                            <td className='px-4 py-3 text-neutral-500'>
                                                <div>{formatDate(ev.startAt)}</div>
                                                <div className='text-neutral-400'>{ev.locationName}</div>
                                            </td>
                                            <td className='px-4 py-3 text-neutral-500 whitespace-nowrap'>
                                                {ev._count.registrations} / {ev.capacity}
                                            </td>
                                            <td className='px-4 py-3 text-neutral-500 whitespace-nowrap'>
                                                {ev.priceCents === 0 ? 'Free' : `$${(ev.priceCents / 100).toFixed(2)}`}
                                            </td>
                                            <td className='px-4 py-3 text-right'>
                                                <div className='inline-flex gap-2'>
                                                    <button
                                                        onClick={() => startEdit(ev)}
                                                        className='px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors'>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ev.id, ev.title)}
                                                        className='px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors'>
                                                        Delete
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
            )}

            {/* Form */}
            {showForm && (
                <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-6'>
                    <h2 className='text-base font-semibold text-white mb-5'>
                        {editingId ? 'Edit Event' : 'New Event'}
                    </h2>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Title */}
                            <div className='sm:col-span-2'>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>Title</label>
                                <input
                                    type='text'
                                    required
                                    value={form.title}
                                    onChange={e => handleTitleChange(e.target.value)}
                                    placeholder='Blue Mountains Hiking Trip'
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>Slug</label>
                                <input
                                    type='text'
                                    required
                                    value={form.slug}
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                    placeholder='blue-mountains-hiking-trip'
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            {/* Sport Type */}
                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>Sport Type</label>
                                <select
                                    value={form.sportType}
                                    onChange={e => setForm({ ...form, sportType: e.target.value })}
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500'>
                                    {SPORT_TYPES.map(t => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start / End */}
                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>Start Time</label>
                                <input
                                    type='datetime-local'
                                    required
                                    value={form.startAt}
                                    onChange={e => setForm({ ...form, startAt: e.target.value })}
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>End Time</label>
                                <input
                                    type='datetime-local'
                                    required
                                    value={form.endAt}
                                    onChange={e => setForm({ ...form, endAt: e.target.value })}
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>
                                    Location Name
                                </label>
                                <input
                                    type='text'
                                    required
                                    value={form.locationName}
                                    onChange={e => setForm({ ...form, locationName: e.target.value })}
                                    placeholder='Rhodes Waterfront Park'
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>Address</label>
                                <input
                                    type='text'
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    placeholder='Rhodes NSW 2138'
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            {/* Capacity / Price */}
                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>Capacity</label>
                                <input
                                    type='number'
                                    min={1}
                                    value={form.capacity}
                                    onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>
                                    Price <span className='text-neutral-600'>(cents, 0 = free)</span>
                                </label>
                                <input
                                    type='number'
                                    min={0}
                                    value={form.priceCents}
                                    onChange={e => setForm({ ...form, priceCents: Number(e.target.value) })}
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            {/* Cover Image */}
                            <div className='sm:col-span-2'>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>
                                    Cover Image URL
                                </label>
                                <input
                                    type='text'
                                    value={form.coverImageUrl}
                                    onChange={e => setForm({ ...form, coverImageUrl: e.target.value })}
                                    placeholder='/images/hike/photo.jpg or https://...'
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500'
                                />
                            </div>

                            {/* Description */}
                            <div className='sm:col-span-2'>
                                <label className='block text-xs font-medium text-neutral-400 mb-1.5'>Description</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder='Describe the event...'
                                    className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500 resize-none'
                                />
                            </div>

                            {/* Featured */}
                            <div className='flex items-center pb-1'>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        checked={form.isFeatured}
                                        onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                                        className='w-4 h-4 rounded accent-yellow-500'
                                    />
                                    <span className='text-sm text-neutral-300'>Featured event</span>
                                </label>
                            </div>
                        </div>

                        {error && <p className='text-sm text-red-400'>{error}</p>}

                        <div className='flex gap-3 pt-1'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='px-5 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors'>
                                {loading ? 'Saving…' : editingId ? 'Save Changes' : 'Create Event'}
                            </button>
                            <button
                                type='button'
                                onClick={cancelEdit}
                                className='px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors'>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
