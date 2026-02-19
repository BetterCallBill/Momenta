import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeHeroCarousel from "@/components/home/HomeHeroCarousel";
import HomeAbout from "@/components/home/HomeAbout";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import PreviousEventsWall from "@/components/home/PreviousEventsWall";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import HomeInstagramShowcase from "@/components/home/HomeInstagramShowcase";
import HomeContactForm from "@/components/home/HomeContactForm";
import { prisma } from "@/lib/prisma";
import { getThisWeekRange } from "@/lib/dates";
import { getInstagramPosts } from "@/lib/instagram";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { start, end } = getThisWeekRange();

  const events = await prisma.event.findMany({
    where: { startAt: { gte: start, lte: end } },
    include: { _count: { select: { registrations: true } } },
    orderBy: { startAt: "asc" },
  });

  const instaPosts = await getInstagramPosts();

  return (
    <>
      <Header />
      <main id="main-content">
        {/* 1. Hero Carousel */}
        <HomeHeroCarousel />

        {/* 2. About Us — dark */}
        <div className="dark:bg-brand-black bg-white">
          <HomeAbout />
        </div>

        {/* 3. Partners — light-dark */}
        <div className="dark:bg-neutral-900 bg-neutral-50">
          <PartnersCarousel />
        </div>

        {/* 4. Previous Events — dark */}
        <div className="dark:bg-brand-black bg-white">
          <PreviousEventsWall />
        </div>

        {/* 5. Upcoming Events Calendar — light-dark */}
        <div className="dark:bg-neutral-900 bg-neutral-50">
          <WeeklyCalendar events={events} />
        </div>

        {/* 6. Instagram — dark */}
        <div className="dark:bg-brand-black bg-white">
          <HomeInstagramShowcase posts={instaPosts} />
        </div>

        {/* 7. Contact Us — light-dark */}
        <div className="dark:bg-neutral-900 bg-neutral-50">
          <HomeContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
