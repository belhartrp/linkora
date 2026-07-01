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
    .select("id, email, username, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Settings
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Account settings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Atur username dan identitas dasar akunmu. Perubahan ini akan dipakai di dashboard dan halaman publik.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Kembali ke dashboard
            </Link>
            <Link
              href="/dashboard/editor"
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Buka editor
            </Link>
          </div>
        </div>

        {params?.error ? (
          <div className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {params.error}
          </div>
        ) : null}

        {params?.saved ? (
          <div className="mb-6 rounded-2xl border border-emerald-900/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            Perubahan berhasil disimpan.
          </div>
        ) : null}

        <form
          action={updateAccountSettings}
          className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email ?? user.email ?? ""}
                disabled
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-500 outline-none"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Email biasanya mengikuti akun Supabase dan tidak diubah dari halaman ini.
              </p>
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={profile.username ?? ""}
                placeholder="belhartrp"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Ini dipakai untuk URL publik, misalnya /belhartrp.
              </p>
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Display name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                defaultValue={profile.display_name ?? ""}
                placeholder="Belhart Pasaribu"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Nama tampil ini dipakai untuk identitas akun di dashboard dan halaman publik.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Simpan perubahan
          </button>
        </form>
      </div>
    </main>
  );
}