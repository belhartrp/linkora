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

async function revalidatePublicPath(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();

  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/publish");

  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }
}

export async function updateBioLinkProfile(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const displayName = String(formData.get("displayName") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  const { error } = await supabase
    .from("biolink_profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
    })
    .eq("user_id", user.id);

  if (error) {
    redirect(`/dashboard/editor?error=${encodeURIComponent(error.message)}`);
  }

  await revalidatePublicPath(supabase, user.id);
  redirect("/dashboard/editor?saved=1");
}

export async function uploadBioLinkAvatar(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/dashboard/editor?error=File avatar wajib dipilih");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${user.id}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) {
    redirect(`/dashboard/editor?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const avatarUrl = publicUrlData.publicUrl;

  const { error: profileError } = await supabase
    .from("biolink_profiles")
    .update({
      avatar_url: avatarUrl,
    })
    .eq("user_id", user.id);

  if (profileError) {
    redirect(`/dashboard/editor?error=${encodeURIComponent(profileError.message)}`);
  }

  await revalidatePublicPath(supabase, user.id);
  redirect("/dashboard/editor?saved=1");
}

export async function addBioLink(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();

  if (!title || !url) {
    redirect("/dashboard/editor?error=Judul dan URL wajib diisi");
  }

  const { data: lastLink } = await supabase
    .from("biolink_links")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (lastLink?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("biolink_links").insert({
    user_id: user.id,
    title,
    url,
    is_active: true,
    sort_order: nextSortOrder,
  });

  if (error) {
    redirect(`/dashboard/editor?error=${encodeURIComponent(error.message)}`);
  }

  await revalidatePublicPath(supabase, user.id);
  redirect("/dashboard/editor?link=added");
}

export async function updateBioLink(formData: FormData) {
  const { supabase, user } = await getAuthedUser();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();
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

  await revalidatePublicPath(supabase, user.id);
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

  await revalidatePublicPath(supabase, user.id);
  redirect("/dashboard/editor?link=deleted");
}