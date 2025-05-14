import { type NextRequest, NextResponse } from "next/server"
import { initContentTables } from "@/lib/content-db"

export async function POST(request: NextRequest) {
  try {
    await initContentTables()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      { error: "Failed to initialize database", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
