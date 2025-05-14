"use server"

import { cookies } from "next/headers"
import { encrypt } from "./crypto"

// Festes Admin-Passwort
const ADMIN_PASSWORD = "RealCore2025!"

// Session-Dauer in Sekunden (24 Stunden)
const SESSION_DURATION = 24 * 60 * 60

export async function login(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    // Erstelle einen Session-Token
    const sessionData = {
      authenticated: true,
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION,
    }

    // Verschlüssele den Token
    const encryptedSession = await encrypt(JSON.stringify(sessionData))

    // Speichere den Token in einem Cookie
    cookies().set("admin_session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_DURATION,
      path: "/",
    })

    return true
  }

  return false
}

export async function logout(): Promise<void> {
  cookies().delete("admin_session")
}

import { checkAuthAction } from "./auth-actions"

export async function checkAuth(): Promise<boolean> {
  try {
    const result = await checkAuthAction()
    return result.authenticated
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}
