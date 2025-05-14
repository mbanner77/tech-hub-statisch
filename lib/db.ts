import Dexie, { type Table } from "dexie"
import type { ILandingPageData } from "@/types/landing-page"

// Definiere die Typen für unsere Datenbanktabellen
export interface IService {
  id: string
  title: string
  description: string
  price: number
  duration: string
  category: string
  technologies: string[]
  image: string
  phase: number
  included: string[]
  notIncluded: string[]
  dependencies: string[]
  process: {
    title: string
    description: string
  }[]
  prerequisites: string
  outcomes: string
  rating: number
  technologyCategory?: string
  processCategory?: string
}

export interface IWorkshop {
  id: string
  title: string
  description: string
  duration: string
  price: number
  icon: string
  benefits?: string[]
}

export interface IBestPractice {
  id: string
  title: string
  description: string
  category: string
  image?: string
  featured?: boolean
  downloadUrl?: string
  externalUrl?: string
}

export interface IResource {
  id: string
  title: string
  type?: string
  category: string
  description?: string
  image?: string
  featured?: boolean
  downloadUrl?: string
  externalUrl?: string
}

export interface IMailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  senderEmail: string
  senderName: string
  enabled: boolean
}

// Spezifische Bereinigungsfunktionen für jeden Datentyp
export function sanitizeService(service: any): IService {
  return {
    id: String(service.id || ""),
    title: String(service.title || ""),
    description: String(service.description || ""),
    price: Number(service.price || 0),
    duration: String(service.duration || ""),
    category: String(service.category || ""),
    technologies: Array.isArray(service.technologies) ? service.technologies.map((t: any) => String(t || "")) : [],
    image: String(service.image || ""),
    phase: Number(service.phase || 0),
    included: Array.isArray(service.included) ? service.included.map((i: any) => String(i || "")) : [],
    notIncluded: Array.isArray(service.notIncluded) ? service.notIncluded.map((i: any) => String(i || "")) : [],
    dependencies: Array.isArray(service.dependencies) ? service.dependencies.map((d: any) => String(d || "")) : [],
    process: Array.isArray(service.process)
      ? service.process.map((p: any) => ({
          title: String(p?.title || ""),
          description: String(p?.description || ""),
        }))
      : [],
    prerequisites: String(service.prerequisites || ""),
    outcomes: String(service.outcomes || ""),
    rating: Number(service.rating || 0),
    // Neue Felder für zusätzliche Kategorisierung
    technologyCategory: service.technologyCategory ? String(service.technologyCategory) : undefined,
    processCategory: service.processCategory ? String(service.processCategory) : undefined,
  }
}

export function sanitizeWorkshop(workshop: any): IWorkshop {
  return {
    id: String(workshop.id || ""),
    title: String(workshop.title || ""),
    description: String(workshop.description || ""),
    duration: String(workshop.duration || ""),
    price: Number(workshop.price || 0),
    icon: String(workshop.icon || ""),
    benefits: Array.isArray(workshop.benefits) ? workshop.benefits.map((b: any) => String(b || "")) : [],
  }
}

export function sanitizeBestPractice(bp: any): IBestPractice {
  return {
    id: String(bp.id || ""),
    title: String(bp.title || ""),
    description: String(bp.description || ""),
    category: String(bp.category || ""),
    image: bp.image ? String(bp.image) : undefined,
    featured: Boolean(bp.featured),
    downloadUrl: bp.downloadUrl ? String(bp.downloadUrl) : undefined,
    externalUrl: bp.externalUrl ? String(bp.externalUrl) : undefined,
  }
}

export function sanitizeResource(resource: any): IResource {
  return {
    id: String(resource.id || ""),
    title: String(resource.title || ""),
    type: resource.type ? String(resource.type) : undefined,
    category: String(resource.category || ""),
    description: resource.description ? String(resource.description) : undefined,
    image: resource.image ? String(resource.image) : undefined,
    featured: Boolean(resource.featured),
    downloadUrl: resource.downloadUrl ? String(resource.downloadUrl) : undefined,
    externalUrl: resource.externalUrl ? String(resource.externalUrl) : undefined,
  }
}

export function sanitizeMailConfig(config: any): IMailConfig {
  return {
    smtpHost: String(config.smtpHost || ""),
    smtpPort: Number(config.smtpPort || 0),
    smtpUser: String(config.smtpUser || ""),
    smtpPassword: String(config.smtpPassword || ""),
    senderEmail: String(config.senderEmail || ""),
    senderName: String(config.senderName || ""),
    enabled: Boolean(config.enabled),
  }
}

export function sanitizeLandingPage(data: any): ILandingPageData {
  // Hero Section
  const hero = {
    title: String(data?.hero?.title || ""),
    subtitle: String(data?.hero?.subtitle || ""),
    primaryButtonText: String(data?.hero?.primaryButtonText || ""),
    secondaryButtonText: String(data?.hero?.secondaryButtonText || ""),
    backgroundImage: String(data?.hero?.backgroundImage || ""),
    heroImage: String(data?.hero?.heroImage || ""),
  }

  // Feature Cards
  const featureCards = Array.isArray(data?.featureCards)
    ? data.featureCards.map((card: any) => ({
        id: String(card?.id || `feature-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
        icon: String(card?.icon || ""),
        title: String(card?.title || ""),
        description: String(card?.description || ""),
      }))
    : []

  // Technology Section
  const technologySection = {
    title: String(data?.technologySection?.title || ""),
    subtitle: String(data?.technologySection?.subtitle || ""),
    image: String(data?.technologySection?.image || ""),
    features: Array.isArray(data?.technologySection?.features)
      ? data.technologySection.features.map((feature: any) => ({
          title: String(feature?.title || ""),
          description: String(feature?.description || ""),
        }))
      : [],
    buttonText: String(data?.technologySection?.buttonText || ""),
  }

  // Approach Section
  const approachSection = {
    title: String(data?.approachSection?.title || ""),
    subtitle: String(data?.approachSection?.subtitle || ""),
    image: String(data?.approachSection?.image || ""),
    features: Array.isArray(data?.approachSection?.features)
      ? data.approachSection.features.map((feature: any) => ({
          title: String(feature?.title || ""),
          description: String(feature?.description || ""),
        }))
      : [],
    buttonText: String(data?.approachSection?.buttonText || ""),
  }

  // Success Stories
  const successStories = Array.isArray(data?.successStories)
    ? data.successStories.map((story: any) => ({
        id: String(story?.id || `story-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
        title: String(story?.title || ""),
        industry: String(story?.industry || ""),
        backgroundImage: String(story?.backgroundImage || ""),
        tags: Array.isArray(story?.tags) ? story.tags.map((tag: any) => String(tag || "")) : [],
        description: String(story?.description || ""),
        achievement: {
          icon: String(story?.achievement?.icon || ""),
          text: String(story?.achievement?.text || ""),
        },
      }))
    : []

  // Stats Section
  const statsSection = {
    title: String(data?.statsSection?.title || ""),
    subtitle: String(data?.statsSection?.subtitle || ""),
    stats: Array.isArray(data?.statsSection?.stats)
      ? data.statsSection.stats.map((stat: any) => ({
          value: Number(stat?.value || 0),
          label: String(stat?.label || ""),
          suffix: stat?.suffix ? String(stat.suffix) : undefined,
        }))
      : [],
  }

  // Innovation Section
  const innovationSection = {
    title: String(data?.innovationSection?.title || ""),
    subtitle: String(data?.innovationSection?.subtitle || ""),
    image: String(data?.innovationSection?.image || ""),
    features: Array.isArray(data?.innovationSection?.features)
      ? data.innovationSection.features.map((feature: any) => ({
          title: String(feature?.title || ""),
          description: String(feature?.description || ""),
        }))
      : [],
    buttonText: String(data?.innovationSection?.buttonText || ""),
  }

  // CTA Section
  const ctaSection = {
    title: String(data?.ctaSection?.title || ""),
    subtitle: String(data?.ctaSection?.subtitle || ""),
    primaryButtonText: String(data?.ctaSection?.primaryButtonText || ""),
    secondaryButtonText: String(data?.ctaSection?.secondaryButtonText || ""),
  }

  return {
    hero,
    featureCards,
    technologySection,
    approachSection,
    successStories,
    statsSection,
    innovationSection,
    ctaSection,
  }
}

// Definiere die Datenbankklasse
class RealcoreDatabase extends Dexie {
  services!: Table<IService, string>
  workshops!: Table<IWorkshop, string>
  bestPractices!: Table<IBestPractice, string>
  resources!: Table<IResource, string>
  mailConfig!: Table<IMailConfig, number>
  landingPage!: Table<ILandingPageData, number>

  constructor() {
    super("RealcoreDatabase")

    // Definiere die Schemas für die Tabellen
    this.version(2).stores({
      services: "id, category, phase, technologyCategory, processCategory",
      workshops: "id, title",
      bestPractices: "id, category",
      resources: "id, category, type",
      mailConfig: "++id",
      landingPage: "++id",
    })
  }
}

// Erstelle eine Instanz der Datenbank
export const db = new RealcoreDatabase()

// Hilfsfunktion zum sicheren Speichern eines einzelnen Elements
async function safePut<T>(table: Table<T, any>, item: any): Promise<boolean> {
  try {
    // Bereinige das Element je nach Tabellentyp
    let cleanItem: any

    if (table === db.services) {
      cleanItem = sanitizeService(item)
    } else if (table === db.workshops) {
      cleanItem = sanitizeWorkshop(item)
    } else if (table === db.bestPractices) {
      cleanItem = sanitizeBestPractice(item)
    } else if (table === db.resources) {
      cleanItem = sanitizeResource(item)
    } else if (table === db.mailConfig) {
      cleanItem = sanitizeMailConfig(item)
    } else if (table === db.landingPage) {
      cleanItem = sanitizeLandingPage(item)
    } else {
      console.error("Unbekannte Tabelle, kann Element nicht bereinigen")
      return false
    }

    // Versuche, das Element zu speichern
    await table.put(cleanItem)
    return true
  } catch (error) {
    console.error(`Fehler beim Speichern eines Elements:`, error)
    return false
  }
}

// Hilfsfunktion zum Initialisieren der Datenbank mit Standarddaten
export async function initializeDatabase(forceReset = false) {
  console.log("[DB] Initialisiere Datenbank...")

  try {
    // Prüfe, ob die Datenbank bereits initialisiert wurde
    const serviceCount = await db.services.count()
    const workshopCount = await db.workshops.count()
    const bestPracticeCount = await db.bestPractices.count()
    const resourceCount = await db.resources.count()
    const mailConfigCount = await db.mailConfig.count()
    const landingPageCount = await db.landingPage.count()

    console.log(
      `[DB] Aktuelle Datenbankeinträge: Services=${serviceCount}, Workshops=${workshopCount}, BestPractices=${bestPracticeCount}, Resources=${resourceCount}, MailConfig=${mailConfigCount}, LandingPage=${landingPageCount}`,
    )

    // Wenn forceReset true ist oder die Datenbank leer ist, initialisiere mit Standarddaten
    if (
      forceReset ||
      serviceCount === 0 ||
      workshopCount === 0 ||
      bestPracticeCount === 0 ||
      resourceCount === 0 ||
      mailConfigCount === 0 ||
      landingPageCount === 0
    ) {
      console.log("[DB] Initialisiere Datenbank mit Standarddaten...")

      // Importiere die Standarddaten
      const { defaultServices, defaultWorkshops, defaultBestPractices, defaultResources } = await import(
        "@/data/default-data"
      )
      const { defaultLandingPage } = await import("@/data/landing-page-data")
      const { defaultMailConfig } = await import("@/lib/mail-service")

      // Wenn forceReset true ist, lösche alle vorhandenen Daten
      if (forceReset) {
        console.log("[DB] Lösche vorhandene Daten...")
        await db.services.clear()
        await db.workshops.clear()
        await db.bestPractices.clear()
        await db.resources.clear()
        await db.mailConfig.clear()
        await db.landingPage.clear()
      }

      // Füge die Standarddaten hinzu, wenn die entsprechenden Tabellen leer sind
      if (forceReset || serviceCount === 0) {
        console.log("[DB] Füge Standarddaten für Services hinzu...")
        let successCount = 0
        for (const service of defaultServices) {
          if (await safePut(db.services, service)) {
            successCount++
          }
        }
        console.log(`[DB] ${successCount} von ${defaultServices.length} Services erfolgreich hinzugefügt`)
      }

      if (forceReset || workshopCount === 0) {
        console.log("[DB] Füge Standarddaten für Workshops hinzu...")
        let successCount = 0
        for (const workshop of defaultWorkshops) {
          if (await safePut(db.workshops, workshop)) {
            successCount++
          }
        }
        console.log(`[DB] ${successCount} von ${defaultWorkshops.length} Workshops erfolgreich hinzugefügt`)
      }

      if (forceReset || bestPracticeCount === 0) {
        console.log("[DB] Füge Standarddaten für Best Practices hinzu...")
        let successCount = 0
        for (const bp of defaultBestPractices) {
          if (await safePut(db.bestPractices, bp)) {
            successCount++
          }
        }
        console.log(`[DB] ${successCount} von ${defaultBestPractices.length} Best Practices erfolgreich hinzugefügt`)
      }

      if (forceReset || resourceCount === 0) {
        console.log("[DB] Füge Standarddaten für Resources hinzu...")
        let successCount = 0
        for (const resource of defaultResources) {
          if (await safePut(db.resources, resource)) {
            successCount++
          }
        }
        console.log(`[DB] ${successCount} von ${defaultResources.length} Resources erfolgreich hinzugefügt`)
      }

      if (forceReset || mailConfigCount === 0) {
        console.log("[DB] Füge Standarddaten für Mail-Konfiguration hinzu...")
        if (await safePut(db.mailConfig, defaultMailConfig)) {
          console.log(`[DB] Mail-Konfiguration erfolgreich hinzugefügt`)
        } else {
          console.error(`[DB] Fehler beim Hinzufügen der Mail-Konfiguration`)
        }
      }

      if (forceReset || landingPageCount === 0) {
        console.log("[DB] Füge Standarddaten für Landing Page hinzu...")
        if (await safePut(db.landingPage, defaultLandingPage)) {
          console.log(`[DB] Landing Page Daten erfolgreich hinzugefügt`)
        } else {
          console.error(`[DB] Fehler beim Hinzufügen der Landing Page Daten`)
        }
      }

      console.log("[DB] Datenbank erfolgreich mit Standarddaten initialisiert")
    } else {
      console.log("[DB] Datenbank bereits initialisiert, keine Aktion erforderlich")
    }

    return true
  } catch (error) {
    console.error("[DB] Fehler bei der Initialisierung der Datenbank:", error)
    return false
  }
}

// Hilfsfunktion zum Zurücksetzen der Datenbank auf Standardwerte
export async function resetDatabase() {
  console.log("[DB] Setze Datenbank zurück...")
  try {
    return await initializeDatabase(true)
  } catch (error) {
    console.error("[DB] Fehler beim Zurücksetzen der Datenbank:", error)
    return false
  }
}

// Hilfsfunktion zum Aktualisieren der Datenbank mit neuen Standarddaten
export async function updateDatabaseWithDefaults() {
  console.log("[DB] Aktualisiere Datenbank mit neuen Standarddaten...")

  try {
    // Importiere die Standarddaten
    const { defaultServices, defaultWorkshops, defaultBestPractices, defaultResources } = await import(
      "@/data/default-data"
    )
    const { defaultLandingPage } = await import("@/data/landing-page-data")
    const { defaultMailConfig } = await import("@/lib/mail-service")

    // Hole die aktuellen Daten aus der Datenbank
    const currentServices = await db.services.toArray()
    const currentWorkshops = await db.workshops.toArray()
    const currentBestPractices = await db.bestPractices.toArray()
    const currentResources = await db.resources.toArray()
    const landingPageCount = await db.landingPage.count()

    // Erstelle Maps für schnellen Zugriff auf vorhandene Einträge
    const serviceMap = new Map(currentServices.map((s) => [s.id, s]))
    const workshopMap = new Map(currentWorkshops.map((w) => [w.id, w]))
    const bestPracticeMap = new Map(currentBestPractices.map((bp) => [bp.id, bp]))
    const resourceMap = new Map(currentResources.map((r) => [r.id, r]))

    // Aktualisiere Services
    let newServicesCount = 0
    for (const service of defaultServices) {
      if (!serviceMap.has(service.id)) {
        if (await safePut(db.services, service)) {
          newServicesCount++
          console.log(`[DB] Neuer Service hinzugefügt: ${service.title}`)
        }
      }
    }

    // Aktualisiere Workshops
    let newWorkshopsCount = 0
    for (const workshop of defaultWorkshops) {
      if (!workshopMap.has(workshop.id)) {
        if (await safePut(db.workshops, workshop)) {
          newWorkshopsCount++
          console.log(`[DB] Neuer Workshop hinzugefügt: ${workshop.title}`)
        }
      }
    }

    // Aktualisiere Best Practices
    let newBestPracticesCount = 0
    for (const bestPractice of defaultBestPractices) {
      if (!bestPracticeMap.has(bestPractice.id)) {
        if (await safePut(db.bestPractices, bestPractice)) {
          newBestPracticesCount++
          console.log(`[DB] Neue Best Practice hinzugefügt: ${bestPractice.title}`)
        }
      }
    }

    // Aktualisiere Resources
    let newResourcesCount = 0
    for (const resource of defaultResources) {
      if (!resourceMap.has(resource.id)) {
        if (await safePut(db.resources, resource)) {
          newResourcesCount++
          console.log(`[DB] Neue Resource hinzugefügt: ${resource.title}`)
        }
      }
    }

    // Aktualisiere Mail Config, wenn keine vorhanden ist
    const mailConfigCount = await db.mailConfig.count()
    if (mailConfigCount === 0) {
      if (await safePut(db.mailConfig, defaultMailConfig)) {
        console.log(`[DB] Mail-Konfiguration hinzugefügt`)
      }
    }

    // Aktualisiere Landing Page, wenn keine vorhanden ist
    if (landingPageCount === 0) {
      if (await safePut(db.landingPage, defaultLandingPage)) {
        console.log(`[DB] Landing Page Daten hinzugefügt`)
      }
    }

    console.log(
      `[DB] Datenbank aktualisiert: ${newServicesCount} neue Services, ${newWorkshopsCount} neue Workshops, ${newBestPracticesCount} neue Best Practices, ${newResourcesCount} neue Resources`,
    )
    return true
  } catch (error) {
    console.error("[DB] Fehler bei der Aktualisierung der Datenbank:", error)
    return false
  }
}

// Exportiere die safePut-Funktion für die Verwendung in anderen Modulen
export { safePut }
