import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardProfileForm from "./profile-form";
import DashboardLinksManager from "./links-manager";

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
    .select("id, email, username, display_name, bio")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/auth/login");
  }

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, title, url, sort_order, is_active")
    .eq("user_id", profile.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (linksError) {
    console.error("Links fetch error:", linksError.message);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <p className="text-sm text-zinc-400">Linkora Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold">Edit profil bio kamu</h1>
          <p className="mt-2 text-zinc-400">
            Lengkapi data dasar akunmu dan tambahkan link yang ingin ditampilkan.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <DashboardProfileForm
            initialProfile={{
              email: profile.email ?? user.email ?? "",
              username: profile.username ?? "",
              display_name: profile.display_name ?? "",
              bio: profile.bio ?? "",
            }}
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <DashboardLinksManager initialLinks={links ?? []} />
        </div>
      </div>
    </main>
  );
}