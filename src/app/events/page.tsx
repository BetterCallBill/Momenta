import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsBrowser from "@/components/EventsBrowser";
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
        <EventsBrowser events={events} />
      </main>
      <Footer />
    </>
  );
}
