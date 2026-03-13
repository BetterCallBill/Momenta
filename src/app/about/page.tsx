import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";
import { prisma } from "@/lib/prisma";

const VALUES = [
  {
    title: "Movement",
    description:
      "We believe in the power of physical activity to transform lives. From casual walks to intense training sessions, every step counts.",
  },
  {
    title: "Community",
    description:
      "Built by and for Sydney's Chinese community, we create spaces where cultural connection meets outdoor adventure.",
  },
  {
    title: "Inclusivity",
    description:
      "All levels, all ages, all backgrounds. Whether you're a seasoned athlete or trying something for the first time, you belong here.",
  },
  {
    title: "Wellness",
    description:
      "Physical fitness is just the beginning. We care about mental health, social wellbeing, and building meaningful friendships.",
  },
];

export default async function AboutPage() {
  const team = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop"
            alt="Group hiking together"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-black/70" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl">
              About <span className="text-gold-500">Momenta</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-white/70">
              We started as a small group of friends who loved the outdoors. Today, we&apos;re
              Sydney&apos;s fastest-growing Chinese outdoor community.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-bold md:text-3xl">Our Story</h2>
            <div className="mt-6 space-y-4 text-brand-white/70 leading-relaxed">
              <p>
                Momenta was born in 2023 from a simple idea: what if we could bring
                Sydney&apos;s Chinese community together through outdoor activities? Too
                many of us were stuck behind screens, disconnected from nature and
                from each other.
              </p>
              <p>
                We started with a Saturday morning run along the harbour. Five people
                showed up. The next week, it was twelve. Within a month, we had hikers,
                golfers, yoga enthusiasts, and martial artists all asking the same
                question: &quot;When&apos;s the next one?&quot;
              </p>
              <p>
                Today, Momenta hosts multiple events every week across running, hiking,
                golf, BJJ, yoga, and community socials. We&apos;ve grown into a movement —
                literally. And we&apos;re just getting started.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-neutral-900 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              What We Stand For
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="rounded-xl border border-neutral-800 bg-brand-black p-6"
                >
                  <h3 className="text-lg font-bold text-gold-500">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-white/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              The Team
            </h2>
            {team.length === 0 ? (
              <p className="mt-10 text-center text-brand-white/40">Coming soon.</p>
            ) : (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {team.map((member) => (
                  <div key={member.id} className="text-center">
                    <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-gold-500/30 bg-neutral-800 flex items-center justify-center">
                      {member.avatarUrl ? (
                        <Image
                          src={member.avatarUrl}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-3xl font-bold text-neutral-500">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-semibold">{member.name}</h3>
                    <p className="text-sm text-gold-400">{member.role}</p>
                    {member.bio && (
                      <p className="mt-1 text-xs text-brand-white/40 leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <CTABanner
          heading="Ready to join?"
          subtitle="Your first event is on us. Come see what Momenta is all about."
          ctaLabel="Browse Events"
          ctaHref="/events"
        />
      </main>
      <Footer />
    </>
  );
}
