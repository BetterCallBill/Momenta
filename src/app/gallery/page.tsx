import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryAccordion from "@/components/GalleryAccordion";
import type { GalleryGroup } from "@/components/GalleryAccordion";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Group images by eventName; unnamed images collected separately
  const namedMap = new Map<string, typeof images>();
  const unnamed: typeof images = [];

  for (const image of images) {
    if (image.eventName) {
      if (!namedMap.has(image.eventName)) namedMap.set(image.eventName, []);
      namedMap.get(image.eventName)!.push(image);
    } else {
      unnamed.push(image);
    }
  }

  const groups: GalleryGroup[] = [
    ...Array.from(namedMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, imgs]) => ({ name, images: imgs })),
    ...(unnamed.length > 0 ? [{ name: null, images: unnamed }] : []),
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
