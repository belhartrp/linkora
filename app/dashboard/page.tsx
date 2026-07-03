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

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, active_template")
    .eq("id", user.id)
    .maybeSingle();

  const { data: biolinkProfile } = await supabase
    .from("biolink_profiles")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();

  const inferredTemplate =
    profile?.active_template || (biolinkProfile ? "biolink" : null);

  const username =
    profile?.username?.trim() || biolinkProfile?.username?.trim() || null;

  const hasTemplate = Boolean(inferredTemplate);

  const activeTemplateLabel =
    inferredTemplate === "biolink" ? "Bio Link" : "Belum dipilih";

  const welcomeName = username || user.email?.split("@")[0] || "Creator";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcfcfe_0%,#f6f2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">
            Dashboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Selamat datang, {welcomeName}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
            {hasTemplate
              ? "Template aktifmu sudah siap. Kamu bisa lanjut edit, melihat halaman publik, atau buka settings."
              : "Kamu belum memilih template. Pilih dulu supaya halaman publikmu siap dipakai."}
          </p>
        </div>

        {hasTemplate ? (
          <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M8 9h8M8 13h5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Template aktif
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {activeTemplateLabel}
                  </h2>
                  {username ? (
                    <p className="mt-1 text-sm text-slate-500">
                      Halaman publik:{" "}
                      <span className="font-medium text-slate-700">
                        /{username}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 sm:flex-col sm:items-stretch">
                <Link
                  href="/dashboard/editor"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.22)] transition hover:bg-violet-700"
                >
                  Lanjut edit
                </Link>

                {username ? (
                  <Link
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    Lihat halaman publik
                  </Link>
                ) : null}

                <Link
                  href="/dashboard/settings"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-6 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  Settings
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[28px] border border-dashed border-violet-200 bg-white/70 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Belum ada template aktif
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600">
              Pilih template dulu supaya kamu bisa mulai mengisi konten dan
              halaman publikmu siap dibagikan.
            </p>

            <div className="mt-6">
              <Link
                href="/dashboard/templates"
                className="inline-flex h-12 items-center justify-center rounded-full bg-violet-600 px-7 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)] transition hover:bg-violet-700"
              >
                Pilih template
              </Link>
            </div>

            {username ? (
              <p className="mt-6 text-xs text-slate-400">
                Username publikmu:{" "}
                <span className="font-medium text-slate-500">/{username}</span>
              </p>
            ) : (
              <p className="mt-6 text-xs text-rose-500">
                Kamu juga belum mengatur username. Atur dulu di{" "}
                <Link
                  href="/dashboard/settings"
                  className="font-semibold underline underline-offset-2"
                >
                  settings
                </Link>
                .
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}