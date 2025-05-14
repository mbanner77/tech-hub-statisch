import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Definiere den Pfad zum Datenverzeichnis
const DATA_DIR = path.join(process.cwd(), "data-store")

// Standarddaten für die Zurücksetzung
const defaultData = {
  services: [],
  workshops: [],
  bestPractices: [],
  resources: [],
  mailConfig: {
    host: "",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
    defaultFrom: "noreply@example.com",
    contactFormRecipient: "contact@example.com",
    templates: {
      contactForm: {
        subject: "Neue Kontaktanfrage",
        text: "Es wurde eine neue Kontaktanfrage eingereicht:\n\nName: {{name}}\nEmail: {{email}}\nNachricht: {{message}}",
        html: "<h1>Neue Kontaktanfrage</h1><p><strong>Name:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Nachricht:</strong> {{message}}</p>",
      },
    },
  },
  landingPage: {
    hero: {
      title: "Ihr Partner für SAP BTP Lösungen",
      subtitle: "Wir unterstützen Sie bei der digitalen Transformation mit maßgeschneiderten SAP BTP Lösungen",
      ctaText: "Kontakt aufnehmen",
    },
    features: [
      {
        title: "Expertise in allen BTP-Bereichen",
        description:
          "Von CAP über Integration Suite bis hin zu SAPUI5 und Fiori - wir decken alle Bereiche der SAP Business Technology Platform ab.",
      },
      {
        title: "Modulare Beratungsleistungen",
        description:
          "Unsere Beratungsleistungen sind modular aufgebaut und können flexibel an Ihre Bedürfnisse angepasst werden.",
      },
      {
        title: "Technologieübergreifende Lösungen",
        description: "Wir kombinieren SAP-Technologien mit anderen Plattformen und Frameworks für optimale Ergebnisse.",
      },
    ],
    successStories: [
      {
        title: "Fertigungsindustrie",
        description:
          "Implementierung einer CAP-basierten Lösung zur Optimierung der Produktionsplanung und -steuerung.",
        image: "/images/manufacturing-success.png",
      },
      {
        title: "Logistikbranche",
        description: "Integration von SAP S/4HANA mit externen Logistiksystemen über die SAP Integration Suite.",
        image: "/images/logistics-success.png",
      },
      {
        title: "Finanzdienstleister",
        description: "Entwicklung einer Fiori-basierten Anwendung für das Risikomanagement und Compliance-Reporting.",
        image: "/images/finance-success.png",
      },
    ],
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

// Funktion zum Zurücksetzen der Dateisystem-Datenbank
async function resetFileSystemDB(): Promise<boolean> {
  try {
    await ensureDataDir()

    // Überschreibe alle Dateien mit Standarddaten
    fs.writeFileSync(path.join(DATA_DIR, "services.json"), JSON.stringify(defaultData.services, null, 2), "utf8")
    fs.writeFileSync(path.join(DATA_DIR, "workshops.json"), JSON.stringify(defaultData.workshops, null, 2), "utf8")
    fs.writeFileSync(
      path.join(DATA_DIR, "best-practices.json"),
      JSON.stringify(defaultData.bestPractices, null, 2),
      "utf8",
    )
    fs.writeFileSync(path.join(DATA_DIR, "resources.json"), JSON.stringify(defaultData.resources, null, 2), "utf8")
    fs.writeFileSync(path.join(DATA_DIR, "mail-config.json"), JSON.stringify(defaultData.mailConfig, null, 2), "utf8")
    fs.writeFileSync(path.join(DATA_DIR, "landing-page.json"), JSON.stringify(defaultData.landingPage, null, 2), "utf8")

    return true
  } catch (error) {
    console.error("Fehler beim Zurücksetzen der Dateisystem-Datenbank:", error)
    return false
  }
}

export async function POST() {
  try {
    const success = await resetFileSystemDB()

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Fehler beim Zurücksetzen der Daten" }, { status: 500 })
    }
  } catch (error) {
    console.error("Fehler beim Zurücksetzen der Daten:", error)
    return NextResponse.json({ error: "Fehler beim Zurücksetzen der Daten" }, { status: 500 })
  }
}
