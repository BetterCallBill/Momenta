import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gold-500">404</h1>
        <p className="mt-4 text-lg text-brand-white/60">Page not found</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-brand-black hover:bg-gold-400"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
