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

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/auth/sign-up?error=Gagal membuat akun");
  }

  const user = data.user;
  const username = `${makeUsername(email)}_${user.id.slice(0, 6)}`;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    email,
    username,
    active_template: "biolink",
  });

  if (profileError) {
    console.error("Profile upsert error:", profileError.message);
    redirect("/auth/sign-up?error=Gagal membuat profile");
  }

  redirect("/dashboard");
}