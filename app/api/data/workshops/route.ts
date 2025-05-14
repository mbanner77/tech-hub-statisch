import { type NextRequest, NextResponse } from "next/server"
import { defaultWorkshops } from "@/data/default-data"
import { readWorkshops, writeWorkshops } from "@/lib/fs-db"

export async function GET() {
  try {
    const workshops = await readWorkshops(defaultWorkshops)
    return NextResponse.json(workshops)
  } catch (error) {
    console.error("Fehler beim Laden der Workshops:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Workshops" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const workshops = await request.json()
    const success = await writeWorkshops(workshops)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Fehler beim Speichern der Workshops" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Workshops:", error)
    return NextResponse.json({ error: "Fehler beim Speichern der Workshops" }, { status: 500 })
  }
}
