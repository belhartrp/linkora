import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;
  const message = params?.message;

  return (
    <>
      <style>{`
        @keyframes authFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="w-full max-w-md [animation:authFloat_5.5s_ease-in-out_infinite]">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-xl font-bold text-white shadow-lg shadow-violet-200">
                L
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">
                Login
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
                Masuk ke Linkora
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Kelola halaman publik dan semua link pentingmu dari satu dashboard.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <form action={login} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="kamu@email.com"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                  >
                    Lupa password?
                  </Link>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-violet-600 px-7 font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:bg-violet-700 active:scale-[0.99]"
              >
                Masuk
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                href="/auth/sign-up"
                className="font-semibold text-violet-600 transition hover:text-violet-700"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}