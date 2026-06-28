import Link from "next/link";
import { signup } from "./actions";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <Link
        href="/"
        className="absolute left-6 top-6 text-sm text-zinc-500 transition hover:text-white"
      >
        ← Kembali ke beranda
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex w-fit items-center gap-2">
            <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-label="Linkora logo">
              <rect width="28" height="28" rx="8" fill="white" />
              <path
                d="M8 14h4m4 0h4M14 8v4m0 4v4"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-bold">Linkora</span>
          </div>

          <h1 className="mt-6 text-3xl font-bold">Buat akun Linkora</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="text-white underline underline-offset-4 hover:text-zinc-300"
            >
              Masuk
            </Link>
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="kamu@email.com"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Minimal 8 karakter"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <button
            formAction={signup}
            className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Buat akun gratis
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
          Dengan membuat akun, kamu bisa mulai membangun halaman portfolio online
          yang clean, profesional, dan mudah dibagikan.
        </p>
      </div>
    </div>
  );
}