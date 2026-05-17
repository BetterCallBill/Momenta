import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventPosterBanner from "./EventPosterBanner";
import RegisterForm from "./register/RegisterForm";
import { prisma } from "@/lib/prisma";
import { formatDateLong, formatTime } from "@/lib/dates";

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
        <EventPosterBanner
          coverImageUrl={event.coverImageUrl}
          title={event.title}
          sportType={event.sportType}
          isFeatured={event.isFeatured}
          startAt={event.startAt.toISOString()}
          endAt={event.endAt.toISOString()}
          locationName={event.locationName}
        />

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
