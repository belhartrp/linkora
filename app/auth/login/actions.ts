"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function makeUsername(email: string) {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

async function ensureProfile(userId: string, email: string) {
  const supabase = await createClient();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existingProfile) {
    const baseUsername = makeUsername(email);

    const { error } = await supabase.from("profiles").insert({
      id: userId,
      email,
      username: `${baseUsername}_${userId.slice(0, 6)}`,
      active_template: "biolink",
    });

    if (error) {
      console.error("Ensure profile error:", error.message);
      redirect("/auth/login?error=Gagal menyiapkan profile");
    }
  }
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/auth/login?error=Email atau password salah");
  }

  await ensureProfile(data.user.id, data.user.email || email);
  redirect("/dashboard");
}