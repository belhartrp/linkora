"use server";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login:", { email, password });

  // nanti di sini baru sambungkan ke Supabase / auth provider kamu
}