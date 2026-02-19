import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

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
            <GalleryGrid images={images} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
