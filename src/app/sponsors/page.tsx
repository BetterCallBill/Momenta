import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-4xl px-6 pt-28 pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">Our Partners</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">Sponsors & Partners</h1>
        <p className="mt-3 text-neutral-400 max-w-xl">
          Momenta is powered by our amazing partners who share our vision of building an active, connected community.
        </p>

        {sponsors.length === 0 ? (
          <p className="mt-16 text-center text-neutral-500">No partners to display yet.</p>
        ) : (
          <div className="mt-12 space-y-4">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl ?? "#"}
                target={sponsor.websiteUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-gold-500/40 hover:bg-neutral-800/60 ${
                  !sponsor.websiteUrl ? "pointer-events-none" : ""
                }`}
              >
                {/* Logo */}
                <div className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-neutral-800 flex items-center justify-center">
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-white">{sponsor.name}</h2>
                  <p className="mt-1 text-sm text-neutral-400 leading-relaxed">{sponsor.description}</p>
                  {sponsor.websiteUrl && (
                    <p className="mt-2 text-xs text-gold-500">{sponsor.websiteUrl}</p>
                  )}
                </div>

                {sponsor.websiteUrl && (
                  <svg className="h-5 w-5 text-neutral-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
