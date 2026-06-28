"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Signup error:", error.message);
    redirect("/auth/sign-up?error=Gagal membuat akun");
  }

  const user = data.user;

  if (user) {
    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      email,
      username,
    });

    if (profileError) {
      console.error("Profile insert error:", profileError.message);
      redirect("/auth/sign-up?error=Gagal membuat profile");
    }
  }

  redirect("/dashboard");
}