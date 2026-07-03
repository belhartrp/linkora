import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { updateAccountSettings } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, username")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcfcfe_0%,#f6f2ff_100%)] px-6 py-12 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-violet-600">
              Settings
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Account settings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Atur username akunmu. Username ini dipakai untuk URL publik Linkora.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              Kembali ke dashboard
            </Link>
            <Link
              href="/dashboard/editor"
              className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.20)] transition hover:bg-violet-700"
            >
              Buka editor
            </Link>
          </div>
        </div>

        {params?.error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {params.error}
          </div>
        ) : null}

        {params?.saved ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Perubahan berhasil disimpan.
          </div>
        ) : null}

        <form
          action={updateAccountSettings}
          className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur"
        >
          <div className="space-y-5">
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
                value={profile?.email ?? user.email ?? ""}
                disabled
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
              />
              <p className="mt-2 text-xs text-slate-500">
                Email mengikuti akun Supabase dan tidak diubah dari halaman ini.
              </p>
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={profile?.username ?? ""}
                placeholder="belhartrp"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 placeholder-slate-400 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Ini dipakai untuk URL publik, misalnya /belhartrp.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.20)] transition hover:bg-violet-700"
          >
            Simpan perubahan
          </button>
        </form>
      </div>
    </main>
  );
}