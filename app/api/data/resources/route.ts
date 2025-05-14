import { type NextRequest, NextResponse } from "next/server"
import { defaultResources } from "@/data/default-data"
import { readResources, writeResources } from "@/lib/fs-db"

export async function GET() {
  try {
    const resources = await readResources(defaultResources)
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Fehler beim Laden der Ressourcen:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Ressourcen" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const resources = await request.json()
    const success = await writeResources(resources)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Fehler beim Speichern der Ressourcen" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Ressourcen:", error)
    return NextResponse.json({ error: "Fehler beim Speichern der Ressourcen" }, { status: 500 })
  }
}
