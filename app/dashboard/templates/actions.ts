"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const ALLOWED_TEMPLATES = ["biolink", "portfolio", "resume"] as const;
type TemplateType = (typeof ALLOWED_TEMPLATES)[number];

function isValidTemplate(value: string): value is TemplateType {
  return ALLOWED_TEMPLATES.includes(value as TemplateType);
}

async function deleteOldTemplateData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  oldTemplate: TemplateType
) {
  if (oldTemplate === "biolink") {
    await supabase.from("biolink_links").delete().eq("user_id", userId);
    await supabase.from("biolink_profiles").delete().eq("user_id", userId);
    return;
  }

  if (oldTemplate === "portfolio") {
    await supabase.from("portfolio_projects").delete().eq("user_id", userId);
    await supabase.from("portfolio_skills").delete().eq("user_id", userId);
    await supabase.from("portfolio_profiles").delete().eq("user_id", userId);
    return;
  }

  if (oldTemplate === "resume") {
    await supabase.from("resume_experience").delete().eq("user_id", userId);
    await supabase.from("resume_contacts").delete().eq("user_id", userId);
    await supabase.from("resume_profiles").delete().eq("user_id", userId);
    return;
  }
}

export async function switchTemplate(formData: FormData) {
  const nextTemplateRaw = String(formData.get("nextTemplate") || "");
  const currentTemplateRaw = String(formData.get("currentTemplate") || "");

  if (!isValidTemplate(nextTemplateRaw) || !isValidTemplate(currentTemplateRaw)) {
    redirect("/dashboard/templates?error=Template tidak valid");
  }

  const nextTemplate = nextTemplateRaw as TemplateType;
  const currentTemplate = currentTemplateRaw as TemplateType;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  if (nextTemplate === currentTemplate) {
    redirect("/dashboard/templates");
  }

  await deleteOldTemplateData(supabase, user.id, currentTemplate);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ active_template: nextTemplate })
    .eq("id", user.id);

  if (updateError) {
    redirect("/dashboard/templates?error=Gagal mengganti template");
  }

  redirect("/dashboard/editor");
}