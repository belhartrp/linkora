import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps) {
  const { username } = await params;

  return {
    title: `${username} | Linkora`,
    description: `Bio online milik ${username} di Linkora`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, title, url, sort_order, is_active")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (linksError) {
    console.error("Links fetch error:", linksError.message);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4">
              {profile.avatar_url ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-800">
                  <Image
                    src={profile.avatar_url}
                    alt={`Avatar ${profile.display_name || profile.username}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-3xl font-bold uppercase text-zinc-300">
                  {profile.display_name?.charAt(0) ||
                    profile.username?.charAt(0) ||
                    "L"}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold">
              {profile.display_name || profile.username}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">@{profile.username}</p>

            <p className="mx-auto mt-4 max-w-md text-zinc-300">
              {profile.bio || "Bio pengguna ini belum diisi."}
            </p>
          </div>

          <div className="space-y-4">
            {links && links.length > 0 ? (
              links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-center font-medium text-white transition hover:bg-zinc-800"
                >
                  {link.title}
                </a>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-700 px-5 py-6 text-center text-zinc-500">
                Belum ada link yang ditampilkan.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}