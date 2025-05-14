import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Definiere den Pfad zum Datenverzeichnis
const DATA_DIR = path.join(process.cwd(), "data-store")
const MAIL_CONFIG_FILE = path.join(DATA_DIR, "mail-config.json")

// Standardkonfiguration für E-Mails
const defaultMailConfig = {
  senderName: "RealCore BTP Portal",
  senderEmail: "noreply@example.com",
  smtpHost: "smtp.example.com",
  smtpPort: 587,
  smtpUser: "user@example.com",
  smtpPass: "password",
  subjectPrefix: "[RealCore BTP Portal]",
  footerText: "© 2023 RealCore. Alle Rechte vorbehalten.",
  notificationRecipients: ["admin@example.com"],
  templates: {
    contact: {
      subject: "Neue Kontaktanfrage",
      body: "Sehr geehrte(r) {name},\n\nVielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen melden.\n\nMit freundlichen Grüßen,\nIhr RealCore Team",
    },
    workshop: {
      subject: "Workshop-Buchungsanfrage",
      body: "Sehr geehrte(r) {name},\n\nVielen Dank für Ihre Workshop-Buchungsanfrage. Wir werden uns in Kürze bei Ihnen melden, um die Details zu besprechen.\n\nMit freundlichen Grüßen,\nIhr RealCore Team",
    },
    challenge: {
      subject: "Neue Challenge-Anfrage",
      body: "Sehr geehrte(r) {name},\n\nVielen Dank für Ihre Challenge-Anfrage. Wir werden uns in Kürze bei Ihnen melden, um die Details zu besprechen.\n\nMit freundlichen Grüßen,\nIhr RealCore Team",
    },
  },
}

// Stelle sicher, dass das Datenverzeichnis existiert
async function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    return true
  } catch (error) {
    console.error("Fehler beim Erstellen des Datenverzeichnisses:", error)
    return false
  }
}

// Lese die Mail-Konfiguration aus der Datei
async function readMailConfigFromFile() {
  try {
    await ensureDataDir()

    if (!fs.existsSync(MAIL_CONFIG_FILE)) {
      // Wenn die Datei nicht existiert, erstelle sie mit den Standarddaten
      fs.writeFileSync(MAIL_CONFIG_FILE, JSON.stringify(defaultMailConfig, null, 2), "utf8")
      return defaultMailConfig
    }

    const data = fs.readFileSync(MAIL_CONFIG_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Fehler beim Lesen der Mail-Konfiguration:", error)
    return defaultMailConfig
  }
}

// Schreibe die Mail-Konfiguration in die Datei
async function writeMailConfigToFile(mailConfig: any) {
  try {
    await ensureDataDir()
    fs.writeFileSync(MAIL_CONFIG_FILE, JSON.stringify(mailConfig, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Fehler beim Schreiben der Mail-Konfiguration:", error)
    return false
  }
}

export async function GET() {
  try {
    const mailConfig = await readMailConfigFromFile()
    return NextResponse.json(mailConfig)
  } catch (error) {
    console.error("Fehler beim Laden der Mail-Konfiguration:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Mail-Konfiguration" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const mailConfig = await request.json()
    const success = await writeMailConfigToFile(mailConfig)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Fehler beim Speichern der Mail-Konfiguration" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Mail-Konfiguration:", error)
    return NextResponse.json({ error: "Fehler beim Speichern der Mail-Konfiguration" }, { status: 500 })
  }
}
