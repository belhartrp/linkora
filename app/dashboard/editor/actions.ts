"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function getAuthedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return { supabase, user };
}

async function getUsernameByUserId(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();

  return data?.username ?? null;
}

function normalizeUrl(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export async function updateBioLinkProfile(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const displayName = String(formData.get("displayName") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  const { error } = await supabase.from("biolink_profiles").upsert(
    {
      user_id: user.id,
      display_name: displayName || null,
      bio: bio || null,
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    redirect("/dashboard/editor?error=Gagal menyimpan profil");
  }

  const username = await getUsernameByUserId(user.id);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);

  redirect("/dashboard/editor?saved=1");
}

export async function uploadBioLinkAvatar(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const file = formData.get("avatar") as File | null;

  if (!file || file.size === 0) {
    redirect("/dashboard/editor?error=Pilih file foto terlebih dahulu");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    redirect("/dashboard/editor?error=Format file harus JPG, PNG, atau WEBP");
  }

  if (file.size > 6 * 1024 * 1024) {
    redirect("/dashboard/editor?error=Ukuran file maksimal 6MB");
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const filePath = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    redirect("/dashboard/editor?error=Gagal upload avatar");
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

  const { error: profileError } = await supabase.from("biolink_profiles").upsert(
    {
      user_id: user.id,
      avatar_url: avatarUrl,
    },
    {
      onConflict: "user_id",
    }
  );

  if (profileError) {
    redirect("/dashboard/editor?error=Gagal menyimpan avatar profil");
  }

  const username = await getUsernameByUserId(user.id);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);

  redirect("/dashboard/editor?saved=1");
}

export async function addBioLink(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const title = String(formData.get("title") || "").trim();
  const url = normalizeUrl(String(formData.get("url") || ""));

  if (!title || !url) {
    redirect("/dashboard/editor?error=Judul dan URL wajib diisi");
  }

  const { data: latestLink } = await supabase
    .from("biolink_links")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder =
    typeof latestLink?.sort_order === "number" ? latestLink.sort_order + 1 : 0;

  const { error } = await supabase.from("biolink_links").insert({
    user_id: user.id,
    title,
    url,
    is_active: true,
    sort_order: nextSortOrder,
  });

  if (error) {
    redirect("/dashboard/editor?error=Gagal menambah link");
  }

  const username = await getUsernameByUserId(user.id);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);

  redirect("/dashboard/editor?link=added");
}

export async function updateBioLink(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const url = normalizeUrl(String(formData.get("url") || ""));
  const isActive = String(formData.get("is_active") || "off") === "on";

  if (!id || !title || !url) {
    redirect("/dashboard/editor?error=Data link tidak lengkap");
  }

  const { error } = await supabase
    .from("biolink_links")
    .update({
      title,
      url,
      is_active: isActive,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect("/dashboard/editor?error=Gagal update link");
  }

  const username = await getUsernameByUserId(user.id);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);

  redirect("/dashboard/editor?link=updated");
}

export async function deleteBioLink(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/dashboard/editor?error=ID link tidak valid");
  }

  const { error } = await supabase
    .from("biolink_links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect("/dashboard/editor?error=Gagal menghapus link");
  }

  const username = await getUsernameByUserId(user.id);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);

  redirect("/dashboard/editor?link=deleted");
}

export async function moveBioLinkUp(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const id = String(formData.get("id") || "");
  const currentSort = Number(formData.get("sort_order"));

  if (!id || Number.isNaN(currentSort)) {
    redirect("/dashboard/editor?error=Data urutan link tidak valid");
  }

  const { data: prevLink } = await supabase
    .from("biolink_links")
    .select("id, sort_order")
    .eq("user_id", user.id)
    .lt("sort_order", currentSort)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!prevLink) {
    redirect("/dashboard/editor");
  }

  await supabase
    .from("biolink_links")
    .update({ sort_order: prevLink.sort_order })
    .eq("id", id)
    .eq("user_id", user.id);

  await supabase
    .from("biolink_links")
    .update({ sort_order: currentSort })
    .eq("id", prevLink.id)
    .eq("user_id", user.id);

  const username = await getUsernameByUserId(user.id);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);

  redirect("/dashboard/editor?saved=1");
}

export async function moveBioLinkDown(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const id = String(formData.get("id") || "");
  const currentSort = Number(formData.get("sort_order"));

  if (!id || Number.isNaN(currentSort)) {
    redirect("/dashboard/editor?error=Data urutan link tidak valid");
  }

  const { data: nextLink } = await supabase
    .from("biolink_links")
    .select("id, sort_order")
    .eq("user_id", user.id)
    .gt("sort_order", currentSort)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!nextLink) {
    redirect("/dashboard/editor");
  }

  await supabase
    .from("biolink_links")
    .update({ sort_order: nextLink.sort_order })
    .eq("id", id)
    .eq("user_id", user.id);

  await supabase
    .from("biolink_links")
    .update({ sort_order: currentSort })
    .eq("id", nextLink.id)
    .eq("user_id", user.id);

  const username = await getUsernameByUserId(user.id);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);

  redirect("/dashboard/editor?saved=1");
}