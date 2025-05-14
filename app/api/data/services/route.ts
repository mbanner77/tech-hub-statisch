import { type NextRequest, NextResponse } from "next/server"
import { defaultServices } from "@/data/default-data"
import { db, safePut } from "@/lib/db"

export async function GET() {
  try {
    // Lade Services aus der IndexedDB
    const services = await db.services.toArray()
    return NextResponse.json(services.length > 0 ? services : defaultServices)
  } catch (error) {
    console.error("Fehler beim Laden der Services:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const services = await request.json()

    // Lösche alle vorhandenen Services
    await db.services.clear()

    // Füge die neuen Services hinzu
    let successCount = 0
    for (const service of services) {
      if (await safePut(db.services, service)) {
        successCount++
      }
    }

    if (successCount > 0) {
      return NextResponse.json({ success: true, count: successCount })
    } else {
      return NextResponse.json({ error: "Fehler beim Speichern der Services" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Services:", error)
    return NextResponse.json({ error: "Fehler beim Speichern der Services" }, { status: 500 })
  }
}
