import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Verbindung zur Datenbank herstellen
const sql = neon(process.env.DATABASE_URL!)

// GET-Anfrage zum Abrufen von Inhalten
export async function GET(request: Request) {
  try {
    console.log("GET /api/content - Starting request")

    // Datenbank-Verbindung testen
    try {
      const testResult = await sql`SELECT 1 as test`
      console.log("Database connection test:", testResult)
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          message: dbError instanceof Error ? dbError.message : "Unknown database error",
          details: "Could not connect to the database. Please check your database configuration.",
        },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const key = searchParams.get("key")
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    console.log("Search params:", { type, key, category, query, page, limit })

    // Abfrage aufbauen
    const queryParts = ["SELECT * FROM content WHERE 1=1"]
    const queryParams: any[] = []

    if (type) {
      queryParts.push(`AND type = $${queryParams.length + 1}`)
      queryParams.push(type)
    }

    if (key) {
      queryParts.push(`AND key ILIKE $${queryParams.length + 1}`)
      queryParams.push(`%${key}%`)
    }

    if (category) {
      queryParts.push(`AND category ILIKE $${queryParams.length + 1}`)
      queryParams.push(`%${category}%`)
    }

    if (query) {
      queryParts.push(`AND (
        key ILIKE $${queryParams.length + 1} OR
        value ILIKE $${queryParams.length + 1} OR
        description ILIKE $${queryParams.length + 1} OR
        category ILIKE $${queryParams.length + 1} OR
        CAST(fields AS TEXT) ILIKE $${queryParams.length + 1}
      )`)
      queryParams.push(`%${query}%`)
    }

    queryParts.push(`ORDER BY updated_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`)
    queryParams.push(limit, offset)

    const queryString = queryParts.join(" ")
    console.log("Query string:", queryString)
    console.log("Query params:", queryParams)

    // Abfrage ausführen
    let result
    try {
      result = await sql.query(queryString, queryParams)
      console.log(`Found ${result.rows?.length || 0} content items`)
    } catch (queryError) {
      console.error("Error executing query:", queryError)

      // Fallback: Einfache Abfrage ohne Filter
      console.log("Trying fallback query...")
      result = await sql`SELECT * FROM content LIMIT ${limit} OFFSET ${offset}`
      console.log(`Found ${result.rows?.length || 0} content items with fallback query`)
    }

    // Ergebnisse transformieren
    const contents = (result.rows || []).map((row: any) => {
      try {
        const content: any = {
          id: row.id,
          type: row.type || "unknown",
          key: row.key || "",
          category: row.category || "",
          createdAt: row.created_at || new Date().toISOString(),
          updatedAt: row.updated_at || new Date().toISOString(),
        }

        if (row.type === "text") {
          content.value = row.value || ""
          content.description = row.description || ""
        } else if (row.type === "structured") {
          content.fields = row.fields || {}
        }

        return content
      } catch (transformError) {
        console.error("Error transforming row:", transformError, row)
        // Rückgabe eines Platzhalters bei Transformationsfehlern
        return {
          id: row.id || "error",
          type: "error",
          key: "error-transforming-data",
          category: "error",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          error: transformError instanceof Error ? transformError.message : "Unknown transform error",
        }
      }
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch content",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// POST-Anfrage zum Speichern von Inhalten
export async function POST(request: Request) {
  try {
    console.log("POST /api/content - Starting request")

    // Datenbank-Verbindung testen
    try {
      await sql`SELECT 1 as test`
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          message: dbError instanceof Error ? dbError.message : "Unknown database error",
        },
        { status: 500 },
      )
    }

    let content
    try {
      content = await request.json()
      console.log("Received content:", content)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request body",
          message: parseError instanceof Error ? parseError.message : "Could not parse request body",
        },
        { status: 400 },
      )
    }

    // Validierung
    if (!content || !content.type || !content.key) {
      return NextResponse.json({ error: "Invalid content data", message: "Type and key are required" }, { status: 400 })
    }

    const id = content.id || crypto.randomUUID()
    const now = new Date().toISOString()

    try {
      if (content.type === "text") {
        // Textinhalt speichern
        await sql`
          INSERT INTO content (id, type, key, value, description, category, created_at, updated_at)
          VALUES (${id}, 'text', ${content.key}, ${content.value || ""}, ${content.description || ""}, 
                  ${content.category || ""}, ${now}, ${now})
          ON CONFLICT (type, key) DO UPDATE
          SET value = EXCLUDED.value, description = EXCLUDED.description, 
              category = EXCLUDED.category, updated_at = EXCLUDED.updated_at
        `
      } else if (content.type === "structured") {
        // Strukturierten Inhalt speichern
        const fields = content.fields || {}

        await sql`
          INSERT INTO content (id, type, key, fields, category, created_at, updated_at)
          VALUES (${id}, 'structured', ${content.key}, ${JSON.stringify(fields)}, 
                  ${content.category || ""}, ${now}, ${now})
          ON CONFLICT (type, key) DO UPDATE
          SET fields = EXCLUDED.fields, category = EXCLUDED.category, updated_at = EXCLUDED.updated_at
        `
      } else {
        return NextResponse.json(
          { error: "Unsupported content type", message: `Type '${content.type}' is not supported` },
          { status: 400 },
        )
      }
    } catch (insertError) {
      console.error("Error inserting/updating content:", insertError)
      return NextResponse.json(
        {
          error: "Failed to save content",
          message: insertError instanceof Error ? insertError.message : "Database operation failed",
        },
        { status: 500 },
      )
    }

    // Gespeicherten Inhalt zurückgeben
    try {
      const savedContent = await sql`SELECT * FROM content WHERE id = ${id}`

      if (!savedContent || savedContent.length === 0) {
        return NextResponse.json({ error: "Failed to retrieve saved content" }, { status: 500 })
      }

      const row = savedContent[0]
      const result: any = {
        id: row.id,
        type: row.type,
        key: row.key,
        category: row.category || "",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }

      if (row.type === "text") {
        result.value = row.value || ""
        result.description = row.description || ""
      } else if (row.type === "structured") {
        result.fields = row.fields || {}
      }

      return NextResponse.json(result)
    } catch (retrieveError) {
      console.error("Error retrieving saved content:", retrieveError)

      // Fallback: Gib zumindest die Eingabedaten zurück
      return NextResponse.json({
        ...content,
        id,
        createdAt: now,
        updatedAt: now,
        _warning: "Content was saved but could not be retrieved from the database",
      })
    }
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json(
      {
        error: "Failed to save content",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
