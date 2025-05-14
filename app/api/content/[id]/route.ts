import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Verbindung zur Datenbank herstellen
const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`DELETE /api/content/${params.id} - Starting request`)

    // Inhalt löschen
    const result = await sql`
      DELETE FROM content
      WHERE id = ${params.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json(
      { error: "Failed to delete content", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
