import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PaymentCancelPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
            <svg className="h-8 w-8 text-brand-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment Cancelled</h1>
          <p className="mt-2 text-sm text-brand-white/60">
            No charge was made. You can try again whenever you&apos;re ready.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/events/${slug}/register`}
              className="rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400"
            >
              Try Again
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-neutral-700 px-8 py-3 text-sm font-semibold text-brand-white/70 transition-colors hover:border-neutral-600 hover:text-brand-white"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
