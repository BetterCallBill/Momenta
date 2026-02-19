"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gold-500">Oops</h1>
        <p className="mt-4 text-brand-white/60">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-brand-black hover:bg-gold-400"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
