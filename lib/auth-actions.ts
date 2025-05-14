"use server"

import { cookies } from "next/headers"

// Festes Admin-Passwort
const ADMIN_PASSWORD = "RealCore2025!"

// Session-Dauer in Sekunden (24 Stunden)
const SESSION_DURATION = 24 * 60 * 60

export async function loginAction(password: string): Promise<{ success: boolean }> {
  console.log("Login attempt with password:", password)

  if (password === ADMIN_PASSWORD) {
    // Erstelle einen einfachen Session-Token (in einer Produktionsumgebung sollte dieser sicherer sein)
    const sessionToken = Buffer.from(Date.now().toString()).toString("base64")

    // Speichere den Token in einem Cookie
    cookies().set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_DURATION,
      path: "/",
    })

    console.log("Login successful, session token set")
    return { success: true }
  }

  console.log("Login failed: incorrect password")
  return { success: false }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  cookies().delete("admin_session")
  return { success: true }
}

export async function checkAuthAction(): Promise<{ authenticated: boolean }> {
  const sessionCookie = cookies().get("admin_session")
  return { authenticated: !!sessionCookie }
}
