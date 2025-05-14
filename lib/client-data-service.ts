"use client"

import { defaultServices, defaultWorkshops, defaultBestPractices, defaultResources } from "@/data/default-data"
// Importiere die Landingpage-Typen und Standarddaten
import { defaultLandingPage } from "@/data/landing-page-data"
import { defaultMailConfig } from "./mail-service"
import {
  db,
  initializeDatabase,
  resetDatabase,
  safePut,
  sanitizeService,
  sanitizeWorkshop,
  sanitizeBestPractice,
  sanitizeResource,
  sanitizeMailConfig,
  sanitizeLandingPage,
} from "./db"

// Debug-Funktion
function debug(message: string, ...args: any[]) {
  console.log(`[CLIENT-DATA-SERVICE] ${message}`, ...args)
}

// Initialisiere die Datenbank beim ersten Laden
if (typeof window !== "undefined") {
  initializeDatabase().then((success) => {
    if (success) {
      debug("Datenbank erfolgreich initialisiert")
    } else {
      debug("Fehler bei der Initialisierung der Datenbank")
    }
  })
}

// Hilfsfunktion zum Laden von Daten aus dem localStorage (als Fallback)
function loadFromLocalStorage<T>(key: string, defaultData: T[], sanitizeFn: (item: any) => any): T[] {
  if (typeof window === "undefined") {
    debug(`Server-Rendering, verwende Standarddaten für ${key}`)
    return defaultData.map(sanitizeFn)
  }

  try {
    const storedData = localStorage.getItem(`realcore-${key}`)
    if (!storedData) {
      debug(`Keine Daten im localStorage für ${key}, verwende Standarddaten`)
      return defaultData.map(sanitizeFn)
    }

    const parsedData = JSON.parse(storedData)
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      debug(`Ungültige Daten im localStorage für ${key}, verwende Standarddaten`)
      return defaultData.map(sanitizeFn)
    }

    debug(`${parsedData.length} Einträge für ${key} aus localStorage geladen`)
    return parsedData.map(sanitizeFn)
  } catch (error) {
    debug(`Fehler beim Laden von ${key} aus localStorage:`, error)
    return defaultData.map(sanitizeFn)
  }
}

// Hilfsfunktion zum Speichern von Daten im localStorage (als Fallback)
function saveToLocalStorage<T>(key: string, data: T[], sanitizeFn: (item: any) => any): boolean {
  if (typeof window === "undefined") {
    debug(`Server-Rendering, kann nicht in localStorage speichern für ${key}`)
    return false
  }

  try {
    if (!Array.isArray(data)) {
      debug(`Daten für ${key} sind kein Array, Speichern abgebrochen`)
      return false
    }

    // Bereinige die Daten vor dem Speichern
    const cleanData = data.map(sanitizeFn)
    localStorage.setItem(`realcore-${key}`, JSON.stringify(cleanData))
    debug(`${data.length} Einträge für ${key} in localStorage gespeichert`)
    return true
  } catch (error) {
    debug(`Fehler beim Speichern von ${key} in localStorage:`, error)
    return false
  }
}

// Services
export async function getClientServices() {
  debug("Lade Services aus der Datenbank...")
  try {
    // Versuche, die Daten vom Server zu laden
    const response = await fetch("/api/data/services")
    if (response.ok) {
      const services = await response.json()
      debug(`${services.length} Services vom Server geladen`)

      // Aktualisiere die lokale Datenbank mit den Serverdaten
      await saveClientServices(services)

      return services
    }

    // Wenn der Server-Aufruf fehlschlägt, versuche die Daten aus der Datenbank zu laden
    const services = await db.services.toArray()

    if (services && services.length > 0) {
      debug(`${services.length} Services aus der Datenbank geladen`)
      return services
    }

    debug("Keine Services in der Datenbank gefunden, versuche localStorage...")
    // Fallback auf localStorage
    return loadFromLocalStorage("services", defaultServices, sanitizeService)
  } catch (error) {
    debug("Fehler beim Laden der Services:", error)
    // Fallback auf localStorage
    return loadFromLocalStorage("services", defaultServices, sanitizeService)
  }
}

export async function saveClientServices(services: any[]): Promise<boolean> {
  debug(`Speichere ${services.length} Services in der Datenbank...`)
  try {
    // Versuche, die Daten auf dem Server zu speichern
    const response = await fetch("/api/data/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(services),
    })

    if (response.ok) {
      debug(`Services erfolgreich auf dem Server gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Services auf dem Server: ${response.statusText}`)
    }

    // Lösche alle vorhandenen Services
    await db.services.clear()

    // Füge die Services einzeln hinzu
    let successCount = 0
    for (const service of services) {
      if (await safePut(db.services, service)) {
        successCount++
      }
    }

    debug(`${successCount} von ${services.length} Services erfolgreich in der Datenbank gespeichert`)

    // Speichere auch im localStorage als Backup
    saveToLocalStorage("services", services, sanitizeService)

    return successCount > 0
  } catch (error) {
    debug("Fehler beim Speichern der Services in der Datenbank:", error)
    // Fallback auf localStorage
    return saveToLocalStorage("services", services, sanitizeService)
  }
}

// Workshops
export async function getClientWorkshops() {
  debug("Lade Workshops aus der Datenbank...")
  try {
    // Versuche, die Daten vom Server zu laden
    const response = await fetch("/api/data/workshops")
    if (response.ok) {
      const workshops = await response.json()
      debug(`${workshops.length} Workshops vom Server geladen`)

      // Aktualisiere die lokale Datenbank mit den Serverdaten
      await saveClientWorkshops(workshops)

      return workshops
    }

    // Wenn der Server-Aufruf fehlschlägt, versuche die Daten aus der Datenbank zu laden
    const workshops = await db.workshops.toArray()

    if (workshops && workshops.length > 0) {
      debug(`${workshops.length} Workshops aus der Datenbank geladen`)
      return workshops
    }

    debug("Keine Workshops in der Datenbank gefunden, versuche localStorage...")
    // Fallback auf localStorage
    return loadFromLocalStorage("workshops", defaultWorkshops, sanitizeWorkshop)
  } catch (error) {
    debug("Fehler beim Laden der Workshops aus der Datenbank:", error)
    // Fallback auf localStorage
    return loadFromLocalStorage("workshops", defaultWorkshops, sanitizeWorkshop)
  }
}

export async function saveClientWorkshops(workshops: any[]): Promise<boolean> {
  debug(`Speichere ${workshops.length} Workshops in der Datenbank...`)
  try {
    // Versuche, die Daten auf dem Server zu speichern
    const response = await fetch("/api/data/workshops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workshops),
    })

    if (response.ok) {
      debug(`Workshops erfolgreich auf dem Server gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Workshops auf dem Server: ${response.statusText}`)
    }

    // Lösche alle vorhandenen Workshops
    await db.workshops.clear()

    // Füge die Workshops einzeln hinzu
    let successCount = 0
    for (const workshop of workshops) {
      if (await safePut(db.workshops, workshop)) {
        successCount++
      }
    }

    debug(`${successCount} von ${workshops.length} Workshops erfolgreich in der Datenbank gespeichert`)

    // Speichere auch im localStorage als Backup
    saveToLocalStorage("workshops", workshops, sanitizeWorkshop)

    return successCount > 0
  } catch (error) {
    debug("Fehler beim Speichern der Workshops in der Datenbank:", error)
    // Fallback auf localStorage
    return saveToLocalStorage("workshops", workshops, sanitizeWorkshop)
  }
}

// Best Practices
export async function getClientBestPractices() {
  debug("Lade Best Practices aus der Datenbank...")
  try {
    // Versuche, die Daten vom Server zu laden
    const response = await fetch("/api/data/best-practices")
    if (response.ok) {
      const bestPractices = await response.json()
      debug(`${bestPractices.length} Best Practices vom Server geladen`)

      // Aktualisiere die lokale Datenbank mit den Serverdaten
      await saveClientBestPractices(bestPractices)

      return bestPractices
    }

    // Wenn der Server-Aufruf fehlschlägt, versuche die Daten aus der Datenbank zu laden
    const bestPractices = await db.bestPractices.toArray()

    if (bestPractices && bestPractices.length > 0) {
      debug(`${bestPractices.length} Best Practices aus der Datenbank geladen`)
      return bestPractices
    }

    debug("Keine Best Practices in der Datenbank gefunden, versuche localStorage...")
    // Fallback auf localStorage
    return loadFromLocalStorage("best-practices", defaultBestPractices, sanitizeBestPractice)
  } catch (error) {
    debug("Fehler beim Laden der Best Practices aus der Datenbank:", error)
    // Fallback auf localStorage
    return loadFromLocalStorage("best-practices", defaultBestPractices, sanitizeBestPractice)
  }
}

export async function saveClientBestPractices(bestPractices: any[]): Promise<boolean> {
  debug(`Speichere ${bestPractices.length} Best Practices in der Datenbank...`)
  try {
    // Versuche, die Daten auf dem Server zu speichern
    const response = await fetch("/api/data/best-practices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bestPractices),
    })

    if (response.ok) {
      debug(`Best Practices erfolgreich auf dem Server gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Best Practices auf dem Server: ${response.statusText}`)
    }

    // Lösche alle vorhandenen Best Practices
    await db.bestPractices.clear()

    // Füge die Best Practices einzeln hinzu
    let successCount = 0
    for (const bp of bestPractices) {
      if (await safePut(db.bestPractices, bp)) {
        successCount++
      }
    }

    debug(`${successCount} von ${bestPractices.length} Best Practices erfolgreich in der Datenbank gespeichert`)

    // Speichere auch im localStorage als Backup
    saveToLocalStorage("best-practices", bestPractices, sanitizeBestPractice)

    return successCount > 0
  } catch (error) {
    debug("Fehler beim Speichern der Best Practices in der Datenbank:", error)
    // Fallback auf localStorage
    return saveToLocalStorage("best-practices", bestPractices, sanitizeBestPractice)
  }
}

// Resources
export async function getClientResources() {
  debug("Lade Resources aus der Datenbank...")
  try {
    // Versuche, die Daten vom Server zu laden
    const response = await fetch("/api/data/resources")
    if (response.ok) {
      const resources = await response.json()
      debug(`${resources.length} Resources vom Server geladen`)

      // Aktualisiere die lokale Datenbank mit den Serverdaten
      await saveClientResources(resources)

      return resources
    }

    // Wenn der Server-Aufruf fehlschlägt, versuche die Daten aus der Datenbank zu laden
    const resources = await db.resources.toArray()

    if (resources && resources.length > 0) {
      debug(`${resources.length} Resources aus der Datenbank geladen`)
      return resources
    }

    debug("Keine Resources in der Datenbank gefunden, versuche localStorage...")
    // Fallback auf localStorage
    return loadFromLocalStorage("resources", defaultResources, sanitizeResource)
  } catch (error) {
    debug("Fehler beim Laden der Resources aus der Datenbank:", error)
    // Fallback auf localStorage
    return loadFromLocalStorage("resources", defaultResources, sanitizeResource)
  }
}

export async function saveClientResources(resources: any[]): Promise<boolean> {
  debug(`Speichere ${resources.length} Resources in der Datenbank...`)
  try {
    // Versuche, die Daten auf dem Server zu speichern
    const response = await fetch("/api/data/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resources),
    })

    if (response.ok) {
      debug(`Resources erfolgreich auf dem Server gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Resources auf dem Server: ${response.statusText}`)
    }

    // Lösche alle vorhandenen Resources
    await db.resources.clear()

    // Füge die Resources einzeln hinzu
    let successCount = 0
    for (const resource of resources) {
      if (await safePut(db.resources, resource)) {
        successCount++
      }
    }

    debug(`${successCount} von ${resources.length} Resources erfolgreich in der Datenbank gespeichert`)

    // Speichere auch im localStorage als Backup
    saveToLocalStorage("resources", resources, sanitizeResource)

    return successCount > 0
  } catch (error) {
    debug("Fehler beim Speichern der Resources in der Datenbank:", error)
    // Fallback auf localStorage
    return saveToLocalStorage("resources", resources, sanitizeResource)
  }
}

// Mail Config
export async function getClientMailConfig() {
  debug("Lade Mail-Konfiguration aus der Datenbank...")
  try {
    // Versuche, die Daten vom Server zu laden
    const response = await fetch("/api/data/mail-config")
    if (response.ok) {
      const mailConfig = await response.json()
      debug(`Mail-Konfiguration vom Server geladen`)

      // Aktualisiere die lokale Datenbank mit den Serverdaten
      await saveClientMailConfig(mailConfig)

      return mailConfig
    }

    // Wenn der Server-Aufruf fehlschlägt, versuche die Daten aus der Datenbank zu laden
    const mailConfigs = await db.mailConfig.toArray()

    if (mailConfigs && mailConfigs.length > 0) {
      debug("Mail-Konfiguration aus der Datenbank geladen")
      return mailConfigs[0]
    }

    debug("Keine Mail-Konfiguration in der Datenbank gefunden, verwende Standardkonfiguration...")
    return sanitizeMailConfig(defaultMailConfig)
  } catch (error) {
    debug("Fehler beim Laden der Mail-Konfiguration aus der Datenbank:", error)
    return sanitizeMailConfig(defaultMailConfig)
  }
}

export async function saveClientMailConfig(mailConfig: any): Promise<boolean> {
  debug("Speichere Mail-Konfiguration in der Datenbank...")
  try {
    // Versuche, die Daten auf dem Server zu speichern
    const response = await fetch("/api/data/mail-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailConfig),
    })

    if (response.ok) {
      debug(`Mail-Konfiguration erfolgreich auf dem Server gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Mail-Konfiguration auf dem Server: ${response.statusText}`)
    }

    // Lösche alle vorhandenen Mail-Konfigurationen
    await db.mailConfig.clear()

    // Füge die neue Mail-Konfiguration hinzu
    const success = await safePut(db.mailConfig, mailConfig)

    if (success) {
      debug("Mail-Konfiguration erfolgreich in der Datenbank gespeichert")
    } else {
      debug("Fehler beim Speichern der Mail-Konfiguration in der Datenbank")
    }

    return success
  } catch (error) {
    debug("Fehler beim Speichern der Mail-Konfiguration in der Datenbank:", error)
    return false
  }
}

// Füge die Funktion zum Laden der Landingpage-Daten hinzu
export async function getClientLandingPage() {
  debug("Lade Landing Page aus der Datenbank...")
  try {
    // Versuche, die Daten vom Server zu laden
    const response = await fetch("/api/data/landing-page")
    if (response.ok) {
      const landingPage = await response.json()
      debug(`Landing Page vom Server geladen`)

      // Aktualisiere die lokale Datenbank mit den Serverdaten
      await saveClientLandingPage(landingPage)

      return landingPage
    }

    // Wenn der Server-Aufruf fehlschlägt, versuche die Daten aus der Datenbank zu laden
    const landingPages = await db.landingPage.toArray()

    if (landingPages && landingPages.length > 0) {
      debug(`Landing Page aus der Datenbank geladen`)
      return landingPages[0]
    }

    debug("Keine Landing Page in der Datenbank gefunden, verwende Standarddaten...")
    return sanitizeLandingPage(defaultLandingPage)
  } catch (error) {
    debug("Fehler beim Laden der Landing Page aus der Datenbank:", error)
    return sanitizeLandingPage(defaultLandingPage)
  }
}

// Füge die Funktion zum Speichern der Landingpage-Daten hinzu
export async function saveClientLandingPage(landingPage: any): Promise<boolean> {
  debug("Speichere Landing Page in der Datenbank...")
  try {
    // Versuche, die Daten auf dem Server zu speichern
    const response = await fetch("/api/data/landing-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(landingPage),
    })

    if (response.ok) {
      debug(`Landing Page erfolgreich auf dem Server gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Landing Page auf dem Server: ${response.statusText}`)
    }

    // Lösche alle vorhandenen Landing Pages
    await db.landingPage.clear()

    // Füge die neue Landing Page hinzu
    const success = await safePut(db.landingPage, landingPage)

    if (success) {
      debug("Landing Page erfolgreich in der Datenbank gespeichert")
    } else {
      debug("Fehler beim Speichern der Landing Page in der Datenbank")
    }

    return success
  } catch (error) {
    debug("Fehler beim Speichern der Landing Page in der Datenbank:", error)
    return false
  }
}

// Funktion zum Zurücksetzen aller Daten auf die Standardwerte
export async function resetAllClientData(): Promise<boolean> {
  debug("Setze alle Daten zurück...")
  try {
    // Versuche, die Daten auf dem Server zurückzusetzen
    const response = await fetch("/api/data/reset", {
      method: "POST",
    })

    if (response.ok) {
      debug(`Daten erfolgreich auf dem Server zurückgesetzt`)
    } else {
      debug(`Fehler beim Zurücksetzen der Daten auf dem Server: ${response.statusText}`)
    }

    const success = await resetDatabase()

    if (success) {
      debug("Alle Daten erfolgreich zurückgesetzt")

      // Lösche auch die Daten im localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("realcore-services")
        localStorage.removeItem("realcore-workshops")
        localStorage.removeItem("realcore-best-practices")
        localStorage.removeItem("realcore-resources")
        localStorage.removeItem("realcore-mail-config")
        debug("Alle Daten im localStorage gelöscht")
      }

      return true
    } else {
      debug("Fehler beim Zurücksetzen der Daten")
      return false
    }
  } catch (error) {
    debug("Fehler beim Zurücksetzen aller Daten:", error)
    return false
  }
}
