"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ensureAdmin,
  getBoolean,
  getOptionalNumber,
  getOptionalText,
  getText,
  normalizeErrorMessage,
  rethrowIfRedirectError,
  sanitizeFileName
} from "@/actions/_helpers";

const BUCKET_NAME = "team-images";

function isMissingTableError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "42P01");
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}

async function uploadTeamPhoto(
  supabase: Awaited<ReturnType<typeof ensureAdmin>>["supabase"],
  memberId: string,
  file: File
) {
  const timestamp = Date.now();
  const fileName = sanitizeFileName(file.name || "profile.jpg");
  const path = `team/${memberId}/profile-${timestamp}-${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}

function revalidateTeamPaths() {
  revalidatePath("/about");
  revalidatePath("/admin/team");
}

export async function createTeamMemberAction(formData: FormData) {
  try {
    const { supabase } = await ensureAdmin();
    const memberId = crypto.randomUUID();

    const name = getText(formData, "name");
    if (!name) throw new Error("Team member name is required.");

    const role = getOptionalText(formData, "role");
    const bio = getOptionalText(formData, "bio");
    const displayOrder = getOptionalNumber(formData, "display_order") ?? 0;
    const manualPhotoUrl = getOptionalText(formData, "photo_url");
    const published = getBoolean(formData, "published");

    const file = getFile(formData, "photo");
    const uploadedPhotoUrl = file ? await uploadTeamPhoto(supabase, memberId, file) : null;

    const { error } = await supabase.from("team_members").insert({
      id: memberId,
      name,
      role,
      bio,
      display_order: displayOrder,
      photo_url: uploadedPhotoUrl ?? manualPhotoUrl,
      published
    });

    if (error) throw error;

    revalidateTeamPaths();
    redirect("/admin/team?message=Team%20member%20created");
  } catch (error) {
    rethrowIfRedirectError(error);
    const message = isMissingTableError(error)
      ? "Team members table missing. Run latest database migration."
      : normalizeErrorMessage(error, "Failed to create team member.");
    redirect(`/admin/team?message=${encodeURIComponent(message)}`);
  }
}

export async function updateTeamMemberAction(formData: FormData) {
  const id = getText(formData, "id");
  if (!id) {
    redirect("/admin/team?message=Missing%20team%20member%20id");
  }

  try {
    const { supabase } = await ensureAdmin();

    const name = getText(formData, "name");
    if (!name) throw new Error("Team member name is required.");

    const role = getOptionalText(formData, "role");
    const bio = getOptionalText(formData, "bio");
    const displayOrder = getOptionalNumber(formData, "display_order") ?? 0;
    const manualPhotoUrl = getOptionalText(formData, "photo_url");
    const existingPhotoUrl = getOptionalText(formData, "existing_photo_url");
    const published = getBoolean(formData, "published");

    const file = getFile(formData, "photo");
    const uploadedPhotoUrl = file ? await uploadTeamPhoto(supabase, id, file) : null;

    const { error } = await supabase
      .from("team_members")
      .update({
        name,
        role,
        bio,
        display_order: displayOrder,
        photo_url: uploadedPhotoUrl ?? manualPhotoUrl ?? existingPhotoUrl,
        published
      })
      .eq("id", id);

    if (error) throw error;

    revalidateTeamPaths();
    redirect("/admin/team?message=Team%20member%20updated");
  } catch (error) {
    rethrowIfRedirectError(error);
    const message = isMissingTableError(error)
      ? "Team members table missing. Run latest database migration."
      : normalizeErrorMessage(error, "Failed to delete team member.");
    redirect(`/admin/team?message=${encodeURIComponent(message)}`);
  }
}

export async function deleteTeamMemberAction(formData: FormData) {
  try {
    const id = getText(formData, "id");
    const { supabase } = await ensureAdmin();

    const { data: files } = await supabase.storage.from(BUCKET_NAME).list(`team/${id}`);
    if (files && files.length) {
      const paths = files.map((file) => `team/${id}/${file.name}`);
      await supabase.storage.from(BUCKET_NAME).remove(paths);
    }

    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) throw error;

    revalidateTeamPaths();
    redirect("/admin/team?message=Team%20member%20deleted");
  } catch (error) {
    rethrowIfRedirectError(error);
    const message = isMissingTableError(error)
      ? "Team members table missing. Run latest database migration."
      : normalizeErrorMessage(error, "Failed to update team member.");
    redirect(`/admin/team?message=${encodeURIComponent(message)}`);
  }
}
