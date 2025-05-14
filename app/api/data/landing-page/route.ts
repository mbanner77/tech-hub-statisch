import { type NextRequest, NextResponse } from "next/server"
import { defaultLandingPage } from "@/data/landing-page-data"
import { readLandingPage, writeLandingPage } from "@/lib/fs-db"

export async function GET() {
  try {
    const landingPage = await readLandingPage(defaultLandingPage)
    return NextResponse.json(landingPage)
  } catch (error) {
    console.error("Fehler beim Laden der Landing Page:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Landing Page" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const landingPage = await request.json()
    const success = await writeLandingPage(landingPage)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Fehler beim Speichern der Landing Page" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Landing Page:", error)
    return NextResponse.json({ error: "Fehler beim Speichern der Landing Page" }, { status: 500 })
  }
}
