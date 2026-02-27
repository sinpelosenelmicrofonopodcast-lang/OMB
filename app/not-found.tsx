import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-28 text-center md:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-gold/70">404</p>
      <h1 className="mt-4 font-heading text-5xl text-softWhite">Page Not Found</h1>
      <p className="mt-4 text-softWhite/70">The page you requested is unavailable or has moved.</p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-2xl border border-gold/50 bg-gold/10 px-5 py-2 text-sm text-gold hover:bg-gold/20"
      >
        Return Home
      </Link>
    </section>
  );
}
