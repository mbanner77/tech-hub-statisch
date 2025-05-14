import { type NextRequest, NextResponse } from "next/server"
import { defaultServices } from "@/data/default-data"
import { readServices, writeServices } from "@/lib/fs-db"

export async function GET() {
  try {
    const services = await readServices(defaultServices)
    return NextResponse.json(services)
  } catch (error) {
    console.error("Fehler beim Laden der Services:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const services = await request.json()
    const success = await writeServices(services)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Fehler beim Speichern der Services" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Services:", error)
    return NextResponse.json({ error: "Fehler beim Speichern der Services" }, { status: 500 })
  }
}
