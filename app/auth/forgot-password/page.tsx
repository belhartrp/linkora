"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="border-b border-slate-100 px-6 py-5 text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-xl font-bold text-white shadow-lg shadow-violet-200">
                ↺
              </div>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">
              Forgot password
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
              Reset password
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Masukkan email akunmu untuk menerima link reset password.
            </p>
          </div>

          <div className="p-6 sm:p-7">
            {!success ? (
              <>
                {error ? (
                  <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kamu@email.com"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-violet-600 px-7 font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Mengirim..." : "Kirim link reset"}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                  Kembali ke{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-violet-600 transition hover:text-violet-700"
                  >
                    login
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                  ✓
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Cek email kamu
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Link reset password sudah dikirim. Buka email terbaru lalu lanjutkan ke halaman ganti password.
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-violet-600 px-6 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                >
                  Kembali ke login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}