"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    redirect("/auth/login?error=Email dan password wajib diisi");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    const message =
      error.message.toLowerCase().includes("rate limit")
        ? "Terlalu banyak percobaan. Coba lagi beberapa menit lagi."
        : error.message;

    redirect(`/auth/login?error=${encodeURIComponent(message)}`);
  }

  if (!data.user) {
    redirect("/auth/login?error=Signup gagal");
  }

  redirect("/dashboard");
}