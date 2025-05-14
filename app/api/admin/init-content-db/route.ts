import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

// Verbindung zur Datenbank herstellen
const sql = neon(process.env.DATABASE_URL!)

// Funktion zum Erstellen der Tabelle
async function createContentTable() {
  try {
    console.log("Dropping content table if exists...")
    await sql`DROP TABLE IF EXISTS content`

    console.log("Creating content table...")
    await sql`
      CREATE TABLE content (
        id UUID PRIMARY KEY,
        type TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT,
        description TEXT,
        category TEXT,
        fields JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(type, key)
      )
    `
    console.log("Content table created successfully")
    return true
  } catch (error) {
    console.error("Error creating content table:", error)
    return false
  }
}

// Funktion zum Speichern eines Textinhalts
async function saveTextContent(key: string, value: string, category: string, description = "") {
  try {
    const id = uuidv4()
    const now = new Date().toISOString()

    await sql`
      INSERT INTO content (id, type, key, value, description, category, created_at, updated_at)
      VALUES (${id}, 'text', ${key}, ${value}, ${description}, ${category}, ${now}, ${now})
      ON CONFLICT (type, key) DO UPDATE
      SET value = EXCLUDED.value, description = EXCLUDED.description, 
          category = EXCLUDED.category, updated_at = EXCLUDED.updated_at
    `
    return id
  } catch (error) {
    console.error(`Error saving text content for key ${key}:`, error)
    throw error
  }
}

// Funktion zum Speichern eines strukturierten Inhalts
async function saveStructuredContent(key: string, fields: Record<string, any>, category: string) {
  try {
    const id = uuidv4()
    const now = new Date().toISOString()

    await sql`
      INSERT INTO content (id, type, key, fields, category, created_at, updated_at)
      VALUES (${id}, 'structured', ${key}, ${JSON.stringify(fields)}, ${category}, ${now}, ${now})
      ON CONFLICT (type, key) DO UPDATE
      SET fields = EXCLUDED.fields, category = EXCLUDED.category, updated_at = EXCLUDED.updated_at
    `
    return id
  } catch (error) {
    console.error(`Error saving structured content for key ${key}:`, error)
    throw error
  }
}

// Beispielinhalte erstellen
async function createSampleContent() {
  console.log("Creating sample content...")

  // BTP-bezogene Texte
  await saveTextContent("btp.title", "SAP Business Technology Platform", "btp", "Haupttitel für BTP-Seiten")

  await saveTextContent(
    "btp.description",
    "Die SAP Business Technology Platform (BTP) ist die Plattform für die digitale Transformation Ihres Unternehmens.",
    "btp",
    "Allgemeine Beschreibung der BTP",
  )

  await saveTextContent("btp.benefits.title", "Vorteile der SAP BTP", "btp", "Titel für den Vorteile-Abschnitt")

  await saveTextContent("btp.services.title", "BTP Services", "btp", "Titel für den Services-Abschnitt")

  await saveTextContent(
    "btp.services.description",
    "Entdecken Sie die vielfältigen Services der SAP Business Technology Platform.",
    "btp",
    "Beschreibung für den Services-Abschnitt",
  )

  // Strukturierte Inhalte für BTP-Services
  await saveStructuredContent(
    "btp.services.hana-cloud",
    {
      title: "SAP HANA Cloud",
      description: "Leistungsstarke In-Memory-Datenbank in der Cloud",
      icon: "/images/btp-services/hana-cloud.png",
      benefits: [
        "Hohe Performance durch In-Memory-Technologie",
        "Skalierbarkeit nach Bedarf",
        "Integrierte Analysefunktionen",
      ],
    },
    "btp-services",
  )

  await saveStructuredContent(
    "btp.services.integration-suite",
    {
      title: "SAP Integration Suite",
      description: "Umfassende Integrationsplattform für Ihre Anwendungen",
      icon: "/images/btp-services/integration-suite.png",
      benefits: [
        "Nahtlose Integration von SAP- und Nicht-SAP-Anwendungen",
        "Vordefinierte Integrationsszenarien",
        "API-Management",
      ],
    },
    "btp-services",
  )

  await saveStructuredContent(
    "btp.services.cap",
    {
      title: "SAP Cloud Application Programming Model",
      description: "Framework für die Entwicklung von Cloud-Anwendungen",
      icon: "/images/btp-services/cap.png",
      benefits: [
        "Schnelle Entwicklung von Geschäftsanwendungen",
        "Standardisierte Architektur",
        "Integrierte Best Practices",
      ],
    },
    "btp-services",
  )

  // Allgemeine Texte
  await saveTextContent("app.title", "Realcore BTP Portal", "general", "Titel der Anwendung")

  await saveTextContent(
    "app.description",
    "Ihr Portal für SAP BTP Services und Lösungen",
    "general",
    "Beschreibung der Anwendung",
  )

  // Navigation
  await saveTextContent("nav.home", "Startseite", "navigation", "Navigationspunkt Startseite")

  await saveTextContent("nav.services", "Services", "navigation", "Navigationspunkt Services")

  await saveTextContent("nav.templates", "Templates", "navigation", "Navigationspunkt Templates")

  await saveTextContent("nav.pathfinder", "Pathfinder", "navigation", "Navigationspunkt Pathfinder")

  await saveTextContent("nav.contact", "Kontakt", "navigation", "Navigationspunkt Kontakt")

  // Buttons
  await saveTextContent("button.submit", "Absenden", "buttons", "Text für Absenden-Button")

  await saveTextContent("button.cancel", "Abbrechen", "buttons", "Text für Abbrechen-Button")

  await saveTextContent("button.save", "Speichern", "buttons", "Text für Speichern-Button")

  await saveTextContent("button.delete", "Löschen", "buttons", "Text für Löschen-Button")

  console.log("Sample content created successfully")
  return true
}

export async function POST() {
  try {
    console.log("POST /api/admin/init-content-db - Starting request")

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

    // Tabelle erstellen
    const tableCreated = await createContentTable()
    if (!tableCreated) {
      return NextResponse.json(
        {
          error: "Failed to create content table",
          details: "Could not create the content table in the database.",
        },
        { status: 500 },
      )
    }

    // Beispielinhalte erstellen
    await createSampleContent()

    // Anzahl der erstellten Inhalte abrufen
    const contentCount = await sql`SELECT COUNT(*) FROM content`

    return NextResponse.json({
      success: true,
      message: "Content database initialized successfully",
      count: contentCount[0].count,
    })
  } catch (error) {
    console.error("Error initializing content database:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize content database",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
