import { type NextRequest, NextResponse } from "next/server"
import { defaultBestPractices } from "@/data/default-data"
import { readBestPractices, writeBestPractices } from "@/lib/fs-db"

export async function GET() {
  try {
    const bestPractices = await readBestPractices(defaultBestPractices)
    return NextResponse.json(bestPractices)
  } catch (error) {
    console.error("Fehler beim Laden der Best Practices:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Best Practices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bestPractices = await request.json()
    const success = await writeBestPractices(bestPractices)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Fehler beim Speichern der Best Practices" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Best Practices:", error)
    return NextResponse.json({ error: "Fehler beim Speichern der Best Practices" }, { status: 500 })
  }
}
