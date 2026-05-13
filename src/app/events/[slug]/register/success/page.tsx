import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment Successful!</h1>
          <p className="mt-2 text-sm text-brand-white/60">
            Your registration is confirmed. We&apos;ll send a confirmation to your email shortly.
          </p>
          <Link
            href="/events"
            className="mt-8 inline-block rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400"
          >
            Browse More Events
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
