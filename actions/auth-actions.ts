"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getText } from "@/actions/_helpers";

export async function signInAction(formData: FormData) {
  const email = getText(formData, "email");
  const password = getText(formData, "password");
  const nextPath = getText(formData, "next") || "/admin";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}

export async function signUpAction(formData: FormData) {
  const email = getText(formData, "email");
  const password = getText(formData, "password");
  const fullName = getText(formData, "full_name");
  const nextPath = getText(formData, "next") || "/admin";

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(`/login?message=${encodeURIComponent("Account created. Ask an admin to grant admin role before dashboard access.")}&next=${encodeURIComponent(nextPath)}`);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
