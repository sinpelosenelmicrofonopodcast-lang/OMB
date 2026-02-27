"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ensureAdmin,
  getBoolean,
  getOptionalNumber,
  getText,
  normalizeErrorMessage,
  rethrowIfRedirectError
} from "@/actions/_helpers";

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonialAction(formData: FormData) {
  try {
    const { supabase } = await ensureAdmin();

    const name = getText(formData, "name");
    const quote = getText(formData, "quote");
    const rating = getOptionalNumber(formData, "rating") ?? 5;
    const published = getBoolean(formData, "published");

    if (!name || !quote) {
      redirect("/admin/testimonials?message=Name%20and%20quote%20required");
    }

    const { error } = await supabase.from("testimonials").insert({
      name,
      quote,
      rating: Math.max(1, Math.min(5, rating)),
      published
    });

    if (error) throw error;

    revalidateTestimonials();
    redirect("/admin/testimonials?message=Testimonial%20created");
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(
      `/admin/testimonials?message=${encodeURIComponent(normalizeErrorMessage(error, "Failed to create testimonial."))}`
    );
  }
}

export async function updateTestimonialAction(formData: FormData) {
  const id = getText(formData, "id");

  try {
    const { supabase } = await ensureAdmin();
    const name = getText(formData, "name");
    const quote = getText(formData, "quote");
    const rating = getOptionalNumber(formData, "rating") ?? 5;
    const published = getBoolean(formData, "published");

    const { error } = await supabase
      .from("testimonials")
      .update({
        name,
        quote,
        rating: Math.max(1, Math.min(5, rating)),
        published
      })
      .eq("id", id);

    if (error) throw error;

    revalidateTestimonials();
    redirect("/admin/testimonials?message=Testimonial%20updated");
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(
      `/admin/testimonials?message=${encodeURIComponent(normalizeErrorMessage(error, "Failed to update testimonial."))}`
    );
  }
}

export async function toggleTestimonialPublishedAction(formData: FormData) {
  const id = getText(formData, "id");
  const nextValue = getBoolean(formData, "next_published");

  const { supabase } = await ensureAdmin();
  const { error } = await supabase.from("testimonials").update({ published: nextValue }).eq("id", id);
  if (error) throw error;

  revalidateTestimonials();
  redirect("/admin/testimonials?message=Publish%20status%20updated");
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = getText(formData, "id");

  const { supabase } = await ensureAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;

  revalidateTestimonials();
  redirect("/admin/testimonials?message=Testimonial%20deleted");
}
