import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { startAt: { gte: new Date() } },
    include: { _count: { select: { registrations: true } } },
    orderBy: { startAt: "asc" },
  });

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">Events</h1>
        <p className="mt-2 text-brand-white/60">Find your next adventure.</p>

        {events.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-brand-white/40">
              No upcoming events. Check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
