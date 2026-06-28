"use server";

export async function signup(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Sign up:", { email, password });

  // nanti di sini baru sambungkan ke Supabase / auth provider kamu
}