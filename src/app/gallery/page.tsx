import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryAccordion from "@/components/GalleryAccordion";
import type { GalleryGroup } from "@/components/GalleryAccordion";
import { prisma } from "@/lib/prisma";
import { SPORT_TYPES, SPORT_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Group by sport type (stored in the tags field)
  const sportMap = new Map<string, typeof images>();
  const untyped: typeof images = [];

  for (const image of images) {
    const key = image.tags;
    if (key && SPORT_LABELS[key]) {
      if (!sportMap.has(key)) sportMap.set(key, []);
      sportMap.get(key)!.push(image);
    } else {
      untyped.push(image);
    }
  }

  const groups: GalleryGroup[] = [
    ...SPORT_TYPES
      .filter((st) => sportMap.has(st))
      .map((st) => ({ sportType: st, images: sportMap.get(st)! })),
    ...(untyped.length > 0 ? [{ sportType: null, images: untyped }] : []),
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">Gallery</h1>
        <p className="mt-2 text-brand-white/60">
          Moments from our community events.
        </p>

        <div className="mt-10">
          {images.length === 0 ? (
            <p className="text-center text-brand-white/40">
              No images yet. Check back after our next event!
            </p>
          ) : (
            <GalleryAccordion groups={groups} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
