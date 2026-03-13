import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { formatDateLong, formatTime } from "@/lib/dates";
import { SPORT_LABELS, SPORT_ICONS } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) notFound();

  const spotsLeft = event.capacity - event._count.registrations;
  const isFull = spotsLeft <= 0;

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Cover image */}
        <div className="relative h-64 md:h-96 w-full">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
        </div>

        <div className="mx-auto max-w-3xl px-6 pb-24 -mt-16 relative z-10">
          {/* Back link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm text-gold-500 hover:text-gold-400 mb-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl" aria-hidden="true">
              {SPORT_ICONS[event.sportType] ?? "🎯"}
            </span>
            <span className="text-sm font-semibold text-gold-500 uppercase tracking-wide">
              {SPORT_LABELS[event.sportType] ?? event.sportType}
            </span>
            {event.isFeatured && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-medium">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-white md:text-4xl">{event.title}</h1>

          {/* Meta */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="flex items-start gap-3 rounded-xl bg-neutral-900 border border-neutral-800 p-4">
              <span className="text-xl mt-0.5">📅</span>
              <div>
                <p className="font-medium text-white">{formatDateLong(new Date(event.startAt))}</p>
                <p className="text-neutral-400">
                  {formatTime(new Date(event.startAt))} – {formatTime(new Date(event.endAt))}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-neutral-900 border border-neutral-800 p-4">
              <span className="text-xl mt-0.5">📍</span>
              <div>
                <p className="font-medium text-white">{event.locationName}</p>
                <p className="text-neutral-400">{event.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-neutral-900 border border-neutral-800 p-4">
              <span className="text-xl mt-0.5">👥</span>
              <div>
                <p className="font-medium text-white">
                  {isFull ? "Event Full" : `${spotsLeft} spots left`}
                </p>
                <p className="text-neutral-400">{event._count.registrations} / {event.capacity} registered</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-neutral-900 border border-neutral-800 p-4">
              <span className="text-xl mt-0.5">💰</span>
              <div>
                <p className="font-medium text-white">
                  {event.priceCents === 0 ? "Free" : `$${(event.priceCents / 100).toFixed(2)}`}
                </p>
                {event.priceCents > 0 && (
                  <p className="text-neutral-400">Payment collected on the day</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-white mb-3">About this event</h2>
              <p className="text-neutral-300 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10">
            {isFull ? (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-5 text-center">
                <p className="font-semibold text-red-400">This event is fully booked.</p>
                <p className="text-sm text-neutral-400 mt-1">Check back later or browse other events.</p>
              </div>
            ) : (
              <Link
                href={`/events/${event.slug}/register`}
                className="btn-premium block rounded-full px-8 py-4 text-center text-base font-semibold"
              >
                Register Now{event.priceCents > 0 ? ` — $${(event.priceCents / 100).toFixed(2)}` : " — Free"}
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
