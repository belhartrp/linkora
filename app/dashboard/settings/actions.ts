"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateAccountSettings(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();

  if (!username) {
    redirect("/dashboard/settings?error=Username wajib diisi");
  }

  const usernameRegex = /^[a-z0-9_]+$/;

  if (!usernameRegex.test(username)) {
    redirect(
      "/dashboard/settings?error=Username hanya boleh huruf kecil, angka, dan underscore"
    );
  }

  if (username.length < 3) {
    redirect("/dashboard/settings?error=Username minimal 3 karakter");
  }

  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle();

  if (existingUser) {
    redirect("/dashboard/settings?error=Username sudah dipakai");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
    })
    .eq("id", user.id);

  if (error) {
    redirect("/dashboard/settings?error=Gagal menyimpan perubahan");
  }

  const { data: biolinkProfile } = await supabase
    .from("biolink_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (biolinkProfile) {
    await supabase
      .from("biolink_profiles")
      .update({ username })
      .eq("user_id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/editor");
  revalidatePath(`/${username}`);

  redirect("/dashboard/settings?saved=1");
}