import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, username, active_template")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/auth/login");
  }

  let displayName = "";
  let bio = "";
  let activeLinksCount = 0;

  if (profile.active_template === "biolink") {
    const { data: biolinkProfile } = await supabase
      .from("biolink_profiles")
      .select("display_name, bio")
      .eq("user_id", profile.id)
      .maybeSingle();

    displayName = biolinkProfile?.display_name ?? "";
    bio = biolinkProfile?.bio ?? "";

    const { count } = await supabase
      .from("biolink_links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("is_active", true);

    activeLinksCount = count ?? 0;
  }

  const publicUrl = profile.username
    ? `/${profile.username}`
    : null;

  const contentStatus =
    profile.active_template === "biolink"
      ? displayName || bio || activeLinksCount > 0
        ? "Sudah ada isi"
        : "Masih kosong"
      : "Belum tersedia";

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Selamat datang di Linkora
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Kelola template aktif, lanjut edit halaman publikmu, dan pantau status konten dari satu tempat.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/editor"
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Lanjut edit
            </Link>
            <Link
              href="/dashboard/templates"
              className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Pilih template
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Template aktif</p>
            <h2 className="mt-2 text-3xl font-bold">
              {profile.active_template === "biolink"
                ? "Bio Link"
                : profile.active_template || "Belum dipilih"}
            </h2>

            <p className="mt-3 max-w-xl text-zinc-400">
              {profile.active_template === "biolink"
                ? "Template sederhana untuk menampilkan avatar, bio singkat, dan kumpulan link utama kamu."
                : "Pilih template yang ingin kamu pakai untuk mulai membangun halaman publik."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/editor"
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Edit konten
              </Link>

              <Link
                href="/dashboard/publish"
                className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
              >
                Halaman publish
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">URL publik</p>
            <h2 className="mt-2 text-xl font-semibold">
              {publicUrl ? publicUrl : "Username belum tersedia"}
            </h2>

            <p className="mt-3 text-zinc-400">
              {publicUrl
                ? "Ini adalah alamat publik yang bisa kamu bagikan ke orang lain."
                : "Atur username lebih dulu supaya halaman publik bisa diakses."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {publicUrl ? (
                <Link
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Lihat halaman publik
                </Link>
              ) : null}

              <Link
                href="/dashboard/settings"
                className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
              >
                Buka settings
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Status konten</p>
            <h3 className="mt-2 text-2xl font-bold">{contentStatus}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Ringkasan sederhana untuk melihat apakah halaman publikmu sudah mulai terisi.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Link aktif</p>
            <h3 className="mt-2 text-2xl font-bold">{activeLinksCount}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Jumlah link yang aktif dan ditampilkan di halaman publikmu saat ini.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Aksi cepat</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/dashboard/editor"
                className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
              >
                Lanjut edit
              </Link>
              <Link
                href="/dashboard/templates"
                className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
              >
                Ganti template
              </Link>
              <Link
                href="/dashboard/publish"
                className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
              >
                Buka publish
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}