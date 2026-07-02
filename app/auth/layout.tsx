import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#faf7ff_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.08),transparent_28%)]" />

      <header className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <svg
              width="30"
              height="30"
              viewBox="0 0 28 28"
              fill="none"
              aria-label="Linkora logo"
            >
              <rect width="28" height="28" rx="8" fill="#7C3AED" />
              <path
                d="M8 14h4m4 0h4M14 8v4m0 4v4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              linkora
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-violet-200 hover:text-violet-700"
          >
            Kembali ke beranda
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl items-center justify-center px-6 py-10">
        {children}
      </section>
    </main>
  );
}