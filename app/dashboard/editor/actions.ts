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

async function revalidateEditorPaths(userId: string) {
  const username = await getUsernameByUserId(userId);

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");
  if (username) revalidatePath(`/${username}`);
}

async function getOrderedLinks(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("biolink_links")
    .select("id, user_id, sort_order, created_at")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Gagal mengambil urutan link: ${error.message}`);
  }

  return data ?? [];
}

async function rewriteSortOrders(
  userId: string,
  links: Array<{
    id: string;
    user_id: string;
    sort_order: number | null;
    created_at?: string | null;
  }>
) {
  const supabase = await createClient();

  for (let index = 0; index < links.length; index++) {
    const link = links[index];
    const tempSortOrder = 1000 + index;

    const { error } = await supabase
      .from("biolink_links")
      .update({ sort_order: tempSortOrder })
      .eq("id", link.id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Gagal menyimpan urutan link (fase 1): ${error.message}`);
    }
  }

  for (let index = 0; index < links.length; index++) {
    const link = links[index];

    const { error } = await supabase
      .from("biolink_links")
      .update({ sort_order: index })
      .eq("id", link.id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Gagal menyimpan urutan link (fase 2): ${error.message}`);
    }
  }
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
    redirect(`/dashboard/editor?error=${encodeURIComponent(error.message)}`);
  }

  await revalidateEditorPaths(user.id);
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
    redirect(
      `/dashboard/editor?error=${encodeURIComponent(uploadError.message)}`
    );
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
    redirect(
      `/dashboard/editor?error=${encodeURIComponent(profileError.message)}`
    );
  }

  await revalidateEditorPaths(user.id);
  redirect("/dashboard/editor?saved=1");
}

export async function addBioLink(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const title = String(formData.get("title") || "").trim();
  const url = normalizeUrl(String(formData.get("url") || ""));

  if (!title || !url) {
    redirect("/dashboard/editor?error=Judul dan URL wajib diisi");
  }

  const links = await getOrderedLinks(user.id);

  const { error } = await supabase.from("biolink_links").insert({
    user_id: user.id,
    title,
    url,
    is_active: true,
    sort_order: links.length,
  });

  if (error) {
    redirect(`/dashboard/editor?error=${encodeURIComponent(error.message)}`);
  }

  await revalidateEditorPaths(user.id);
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
    redirect(`/dashboard/editor?error=${encodeURIComponent(error.message)}`);
  }

  await revalidateEditorPaths(user.id);
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
    redirect(`/dashboard/editor?error=${encodeURIComponent(error.message)}`);
  }

  const remainingLinks = await getOrderedLinks(user.id);
  await rewriteSortOrders(user.id, remainingLinks);

  await revalidateEditorPaths(user.id);
  redirect("/dashboard/editor?link=deleted");
}

export async function moveBioLinkUp(formData: FormData) {
  const { user } = await getAuthedUser();

  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/dashboard/editor?error=ID link tidak valid");
  }

  const links = await getOrderedLinks(user.id);
  const currentIndex = links.findIndex((link) => link.id === id);

  if (currentIndex === -1) {
    redirect("/dashboard/editor?error=Link tidak ditemukan");
  }

  if (currentIndex === 0) {
    redirect("/dashboard/editor?saved=1");
  }

  const reordered = [...links];
  [reordered[currentIndex - 1], reordered[currentIndex]] = [
    reordered[currentIndex],
    reordered[currentIndex - 1],
  ];

  await rewriteSortOrders(user.id, reordered);

  await revalidateEditorPaths(user.id);
  redirect("/dashboard/editor?saved=1");
}

export async function moveBioLinkDown(formData: FormData) {
  const { user } = await getAuthedUser();

  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/dashboard/editor?error=ID link tidak valid");
  }

  const links = await getOrderedLinks(user.id);
  const currentIndex = links.findIndex((link) => link.id === id);

  if (currentIndex === -1) {
    redirect("/dashboard/editor?error=Link tidak ditemukan");
  }

  if (currentIndex >= links.length - 1) {
    redirect("/dashboard/editor?saved=1");
  }

  const reordered = [...links];
  [reordered[currentIndex], reordered[currentIndex + 1]] = [
    reordered[currentIndex + 1],
    reordered[currentIndex],
  ];

  await rewriteSortOrders(user.id, reordered);

  await revalidateEditorPaths(user.id);
  redirect("/dashboard/editor?saved=1");
}