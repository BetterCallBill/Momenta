import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "./register/RegisterForm";
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
        {/* Poster banner */}
        <div className="relative w-full h-dvh">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )}

          {/* Gradient: transparent top → deep black bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/55 to-transparent" />
          {/* Subtle top vignette for header legibility */}
          <div className="absolute inset-0 bg-linear-to-b from-brand-black/40 to-transparent" />

          {/* Back link — top left */}
          <div className="absolute top-24 left-6 z-10 md:left-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Events
            </Link>
          </div>

          {/* Overlaid event identity — bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 md:px-10 md:pb-10">
            <div className="mx-auto max-w-3xl">
              {/* Sport badge row */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg leading-none" aria-hidden="true">
                  {SPORT_ICONS[event.sportType] ?? "🎯"}
                </span>
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                  {SPORT_LABELS[event.sportType] ?? event.sportType}
                </span>
                {event.isFeatured && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-medium border border-gold-500/30">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-extrabold text-white leading-tight md:text-5xl">
                {event.title}
              </h1>

              {/* Date / time / location strip */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">📅</span>
                  {formatDateLong(new Date(event.startAt))}{" · "}
                  {formatTime(new Date(event.startAt))} – {formatTime(new Date(event.endAt))}
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">📍</span>
                  {event.locationName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail body */}
        <div className="mx-auto max-w-3xl px-6 pt-10 pb-24 md:px-0">
          {/* Meta cards */}
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
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
              <p className="text-neutral-300 leading-relaxed whitespace-pre-line wrap-break-word">
                {event.description}
              </p>
            </div>
          )}

          {/* Registration */}
          <div className="mt-10">
            {isFull ? (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-5 text-center">
                <p className="font-semibold text-red-400">This event is fully booked.</p>
                <p className="text-sm text-neutral-400 mt-1">Check back later or browse other events.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Register</h2>
                <RegisterForm eventId={event.id} priceCents={event.priceCents} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
