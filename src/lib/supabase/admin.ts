"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = "RiseWithSense2026!";
const COOKIE_NAME = "admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

export async function adminLogin(password: string) {
  // Simple check
  if (password === "RiseWithSense2026!") {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "true", {
      httpOnly: true,
      secure: false, // Localhost ke liye false
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "true";
}

export async function requireAdmin() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect("/admin/login");
}