import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { TextContent, TextSearchParams } from "@/types/simple-cms"

// Pfad zur Datendatei
const DATA_DIR = path.join(process.cwd(), "data")
const TEXT_FILE = path.join(DATA_DIR, "cms-texts.json")

// Stellt sicher, dass das Datenverzeichnis existiert
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Texte aus Datei laden
export function loadTexts(): TextContent[] {
  ensureDataDir()

  if (!fs.existsSync(TEXT_FILE)) {
    return []
  }

  try {
    const data = fs.readFileSync(TEXT_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error loading texts:", error)
    return []
  }
}

// CMS-Tabelle initialisieren
export async function initCmsTable(): Promise<boolean> {
  ensureDataDir()

  try {
    // Prüfen, ob die Datei bereits existiert
    if (!fs.existsSync(TEXT_FILE)) {
      // Erstelle eine leere Textdatei
      fs.writeFileSync(TEXT_FILE, JSON.stringify([], null, 2), "utf8")
    }
    return true
  } catch (error) {
    console.error("Error initializing CMS table:", error)
    return false
  }
}

// Texte in Datei speichern
export function saveTexts(texts: TextContent[]): boolean {
  ensureDataDir()

  try {
    fs.writeFileSync(TEXT_FILE, JSON.stringify(texts, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error saving texts:", error)
    return false
  }
}

// Text speichern oder aktualisieren
export function saveText(text: TextContent): TextContent {
  const texts = loadTexts()
  const now = new Date().toISOString()

  // Wenn der Text eine ID hat, aktualisieren wir ihn
  if (text.id) {
    const index = texts.findIndex((t) => t.id === text.id)
    if (index >= 0) {
      texts[index] = {
        ...text,
        lastUpdated: now,
      }
    } else {
      // Text mit dieser ID nicht gefunden, fügen wir ihn hinzu
      texts.push({
        ...text,
        lastUpdated: now,
      })
    }
  } else {
    // Neuer Text ohne ID, generieren wir eine
    texts.push({
      ...text,
      id: uuidv4(),
      lastUpdated: now,
    })
  }

  // Texte speichern
  saveTexts(texts)

  // Aktualisierte Texte laden und den gespeicherten Text zurückgeben
  const updatedTexts = loadTexts()
  return updatedTexts.find((t) => t.key === text.key && t.category === text.category) || text
}

// Text löschen
export function deleteText(id: string): boolean {
  const texts = loadTexts()
  const filteredTexts = texts.filter((text) => text.id !== id)

  // Wenn sich die Anzahl nicht geändert hat, wurde nichts gelöscht
  if (filteredTexts.length === texts.length) {
    return false
  }

  return saveTexts(filteredTexts)
}

// Texte suchen
export function searchTexts(params: TextSearchParams): TextContent[] {
  const texts = loadTexts()

  return texts.filter((text) => {
    // Nach Schlüssel filtern
    if (params.key && !text.key.toLowerCase().includes(params.key.toLowerCase())) {
      return false
    }

    // Nach Kategorie filtern
    if (params.category && text.category !== params.category) {
      return false
    }

    // Nach Suchbegriff filtern
    if (params.query) {
      const query = params.query.toLowerCase()
      return (
        text.key.toLowerCase().includes(query) ||
        text.value.toLowerCase().includes(query) ||
        (text.description && text.description.toLowerCase().includes(query))
      )
    }

    return true
  })
}

// CMS initialisieren mit Beispieldaten
export function initializeCms(): boolean {
  ensureDataDir()

  // Beispieltexte erstellen
  const sampleTexts: TextContent[] = [
    {
      id: uuidv4(),
      key: "landing.hero.title",
      value: "Willkommen bei RealCore BTP Portal",
      category: "landing",
      description: "Titel für den Hero-Bereich der Startseite",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "landing.hero.subtitle",
      value: "Ihr Partner für SAP Business Technology Platform",
      category: "landing",
      description: "Untertitel für den Hero-Bereich der Startseite",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "landing.about.title",
      value: "Über uns",
      category: "landing",
      description: "Titel für den Über-uns-Bereich",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "landing.about.description",
      value: "RealCore ist Ihr zuverlässiger Partner für die Implementierung und Optimierung von SAP BTP-Lösungen.",
      category: "landing",
      description: "Beschreibung für den Über-uns-Bereich",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "btp.services.title",
      value: "BTP Services",
      category: "btp",
      description: "Titel für die BTP-Services-Seite",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "btp.services.description",
      value: "Entdecken Sie die vielfältigen Möglichkeiten der SAP Business Technology Platform.",
      category: "btp",
      description: "Beschreibung für die BTP-Services-Seite",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "pathfinder.title",
      value: "Pathfinder Units",
      category: "pathfinder",
      description: "Titel für die Pathfinder-Units-Seite",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "pathfinder.description",
      value: "Unsere spezialisierten Teams führen Sie durch die digitale Transformation.",
      category: "pathfinder",
      description: "Beschreibung für die Pathfinder-Units-Seite",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "pathfinder.overview.title",
      value: "Übersicht aller Pathfinder Units",
      category: "pathfinder",
      description: "Titel für die Übersichtsseite der Pathfinder Units",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "pathfinder.overview.description",
      value: "Entdecken Sie unsere spezialisierten Teams für verschiedene Bereiche der digitalen Transformation.",
      category: "pathfinder",
      description: "Beschreibung für die Übersichtsseite der Pathfinder Units",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "contact.title",
      value: "Kontakt",
      category: "contact",
      description: "Titel für die Kontaktseite",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      key: "contact.description",
      value: "Nehmen Sie Kontakt mit uns auf. Wir freuen uns auf Ihre Anfrage.",
      category: "contact",
      description: "Beschreibung für die Kontaktseite",
      lastUpdated: new Date().toISOString(),
    },
  ]

  return saveTexts(sampleTexts)
}

// Standardtexte in die CMS-Tabelle einfügen
export async function seedDefaultTexts(): Promise<boolean> {
  try {
    // Prüfen, ob bereits Texte vorhanden sind
    const existingTexts = loadTexts()
    if (existingTexts.length > 0) {
      console.log("CMS already contains texts. Skipping seeding.")
      return true
    }

    // Wenn keine Texte vorhanden sind, initialisiere mit Standardtexten
    return initializeCms()
  } catch (error) {
    console.error("Error seeding default texts:", error)
    return false
  }
}
