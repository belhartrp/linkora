import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CopyPublishUrlButton from "./copy-publish-url-button";

export default async function PublishPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, active_template")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/auth/login");
  }

  const publicUrl = profile.username ? `/${profile.username}` : null;

  let totalLinks = 0;
  let displayName = "";

  if (profile.active_template === "biolink") {
    const { data: biolinkProfile } = await supabase
      .from("biolink_profiles")
      .select("display_name")
      .eq("user_id", profile.id)
      .maybeSingle();

    displayName = biolinkProfile?.display_name ?? "";

    const { count } = await supabase
      .from("biolink_links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("is_active", true);

    totalLinks = count ?? 0;
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Publish
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Publish halaman publik
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Lihat alamat publikmu, salin link, dan pastikan konten sudah siap dibagikan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/editor"
              className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Edit konten
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Kembali ke dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Public URL</p>
            <h2 className="mt-2 text-2xl font-bold">
              {publicUrl ?? "Username belum tersedia"}
            </h2>

            <p className="mt-3 text-zinc-400">
              {publicUrl
                ? "Ini adalah URL yang bisa kamu bagikan ke orang lain."
                : "Atur username terlebih dahulu agar URL publik tersedia."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {publicUrl ? (
                <>
                  <CopyPublishUrlButton value={publicUrl} />
                  <Link
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    Buka halaman publik
                  </Link>
                </>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Publish status</p>
            <h2 className="mt-2 text-2xl font-bold">
              {profile.active_template === "biolink"
                ? "Siap dipublish"
                : "Belum ada template"}
            </h2>

            <div className="mt-6 space-y-4 text-sm text-zinc-300">
              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 px-4 py-3">
                <span>Template aktif</span>
                <span className="font-semibold">
                  {profile.active_template === "biolink"
                    ? "Bio Link"
                    : profile.active_template || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 px-4 py-3">
                <span>Nama tampilan</span>
                <span className="font-semibold">
                  {displayName || "Belum diisi"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 px-4 py-3">
                <span>Link aktif</span>
                <span className="font-semibold">{totalLinks}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 px-4 py-4 text-sm text-zinc-400">
              Kalau konten sudah sesuai, halaman publikmu sudah siap untuk dibagikan.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}