import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { switchTemplate } from "./actions";

const templates = [
  {
    id: "biolink",
    name: "Bio Link",
    description: "Halaman simpel untuk menampilkan link-link utama kamu.",
    sections: ["Avatar", "Name", "Bio", "Links"],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Cocok untuk menampilkan intro, project, dan skill.",
    sections: ["Hero", "About", "Projects", "Skills"],
  },
  {
    id: "resume",
    name: "Resume",
    description: "Profil profesional dengan summary, pengalaman, dan kontak.",
    sections: ["Header", "Summary", "Experience", "Contacts"],
  },
] as const;

type TemplateId = (typeof templates)[number]["id"];

export default async function DashboardTemplatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
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
    .select("username, active_template")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/dashboard?error=Profile tidak ditemukan");
  }

  const activeTemplate = profile.active_template as TemplateId;
  const publicUrl = `/${profile.username}`;

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Choose your template
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Pilih satu template aktif untuk halaman publik Linkora kamu. Kalau
              kamu mengganti template, data dari template sebelumnya akan dihapus.
            </p>
          </div>

          <div className="flex gap-3">
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

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-zinc-500">Current template</p>
              <h2 className="mt-2 text-2xl font-semibold capitalize">
                {activeTemplate}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Public URL:{" "}
                <span className="text-white">
                  https://linkora-eight-kappa.vercel.app{publicUrl}
                </span>
              </p>
            </div>

            <Link
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl border border-zinc-800 px-4 py-3 text-center text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white md:w-auto"
            >
              Lihat halaman publik
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {templates.map((template) => {
            const isActive = template.id === activeTemplate;

            return (
              <div
                key={template.id}
                className={`rounded-3xl border p-6 transition ${
                  isActive
                    ? "border-white bg-white text-black"
                    : "border-zinc-800 bg-zinc-950 text-white"
                }`}
              >
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold">{template.name}</h3>
                    <p
                      className={`mt-3 text-sm leading-6 ${
                        isActive ? "text-zinc-700" : "text-zinc-400"
                      }`}
                    >
                      {template.description}
                    </p>
                  </div>

                  {isActive ? (
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      Current
                    </span>
                  ) : (
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400">
                      Available
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <p
                    className={`mb-3 text-xs uppercase tracking-[0.2em] ${
                      isActive ? "text-zinc-500" : "text-zinc-500"
                    }`}
                  >
                    Sections
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {template.sections.map((section) => (
                      <span
                        key={section}
                        className={`rounded-full px-3 py-1 text-xs ${
                          isActive
                            ? "bg-black/10 text-zinc-800"
                            : "bg-zinc-900 text-zinc-300"
                        }`}
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>

                {isActive ? (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white opacity-80"
                  >
                    Current template
                  </button>
                ) : (
                  <details className="group">
                    <summary className="list-none">
                      <div className="w-full rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:opacity-90">
                        Use this template
                      </div>
                    </summary>

                    <div className="mt-4 rounded-2xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
                      <p className="font-medium text-white">Switch template?</p>
                      <p className="mt-2 leading-6 text-zinc-400">
                        Mengganti template akan menghapus data dari template kamu
                        yang sekarang. Aksi ini tidak bisa dibatalkan.
                      </p>

                      <form action={switchTemplate} className="mt-4">
                        <input
                          type="hidden"
                          name="currentTemplate"
                          value={activeTemplate}
                        />
                        <input
                          type="hidden"
                          name="nextTemplate"
                          value={template.id}
                        />

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                          >
                            Yes, switch template
                          </button>
                        </div>
                      </form>
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}