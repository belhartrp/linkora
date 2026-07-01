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

  const username = String(formData.get("username") || "").trim();
  const displayName = String(formData.get("displayName") || "").trim();

  if (!username) {
    redirect("/dashboard/settings?error=Username wajib diisi");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      display_name: displayName || null,
    })
    .eq("id", user.id);

  if (error) {
    redirect("/dashboard/settings?error=Gagal menyimpan perubahan");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/publish");
  revalidatePath(`/${username}`);
  redirect("/dashboard/settings?saved=1");
}