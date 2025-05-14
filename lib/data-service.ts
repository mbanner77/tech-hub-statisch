"use server"

import { defaultServices, defaultWorkshops, defaultBestPractices, defaultResources } from "@/data/default-data"
import { defaultMailConfig } from "./mail-service"
import { checkAuthAction } from "./auth-actions"
// Importiere die Landingpage-Standarddaten
import { defaultLandingPage } from "@/data/landing-page-data"
// Importiere die Server-Aktionen für die Dateisystem-Datenbank
import {
  getServicesFromFileSystem,
  saveServicesToFileSystem,
  getWorkshopsFromFileSystem,
  saveWorkshopsToFileFileSystem,
  getBestPracticesFromFileSystem,
  saveBestPracticesToFileFileSystem,
  getResourcesFromFileSystem,
  saveResourcesToFileSystem,
  getMailConfigFromFileSystem,
  saveMailConfigToFileFileSystem,
  getLandingPageFromFileSystem,
  saveLandingPageToFileFileSystem,
  initializeFileSystemDB,
  resetFileSystemDB,
} from "./fs-db-actions"

// In-Memory-Speicher für den Server
const initialMemoryStore = {
  services: [...defaultServices],
  workshops: [...defaultWorkshops],
  "best-practices": [...defaultBestPractices],
  resources: [...defaultResources],
  "mail-config": [defaultMailConfig],
}

// In-Memory-Speicher für alle Umgebungen
let memoryStore: Record<string, any[]> = { ...initialMemoryStore }

// Initialisiere den Memory-Store für die Landingpage
if (!memoryStore["landing-page"]) {
  memoryStore["landing-page"] = [defaultLandingPage]
}

// Initialisiere die Dateisystem-Datenbank
initializeFileSystemDB({
  services: defaultServices,
  workshops: defaultWorkshops,
  bestPractices: defaultBestPractices,
  resources: defaultResources,
  mailConfig: defaultMailConfig,
  landingPage: defaultLandingPage,
}).then((success) => {
  if (success) {
    console.log("[DATA-SERVICE] Dateisystem-Datenbank erfolgreich initialisiert")
  } else {
    console.error("[DATA-SERVICE] Fehler bei der Initialisierung der Dateisystem-Datenbank")
  }
})

// Prüfen, ob wir in einer Produktionsumgebung sind
const isProduction = process.env.NODE_ENV === "production"

// Debug-Funktion
function debug(message: string, ...args: any[]) {
  console.log(`[DATA-SERVICE] ${message}`, ...args)
}

// Hilfsfunktion zum Validieren von Daten
function validateData<T>(data: any, defaultData: T[]): T[] {
  if (!data || !Array.isArray(data) || data.length === 0) {
    debug("Daten sind ungültig, verwende Standarddaten")
    return [...defaultData]
  }
  return data as T[]
}

// Hilfsfunktion zum Bereinigen von Objekten für die Serialisierung
function sanitizeForServer(obj: any): any {
  if (obj === null || obj === undefined) {
    return null
  }

  if (typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForServer(item))
  }

  const result: Record<string, any> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      // Überspringe Funktionen und Symbol-Eigenschaften
      if (typeof value === "function" || typeof value === "symbol") {
        continue
      }

      // Rekursiv bereinigen
      result[key] = sanitizeForServer(value)
    }
  }

  return result
}

// Spezifische Funktionen für verschiedene Datentypen
export async function getServices() {
  debug(`getServices aufgerufen`)
  try {
    // Lade Daten aus der Dateisystem-Datenbank
    const services = await getServicesFromFileSystem(defaultServices)
    debug(`${services.length} Services aus der Dateisystem-Datenbank geladen`)
    return services
  } catch (error) {
    console.error("Fehler beim Laden der Services:", error)
    debug(`Fehler beim Laden der Services, verwende Standarddaten`)
    return [...defaultServices]
  }
}

export async function saveServices(services: any[]) {
  debug(`saveServices aufgerufen mit ${services?.length || 0} Services`)
  try {
    // Überprüfe die Authentifizierung in Produktion
    if (isProduction) {
      try {
        debug(`Produktionsmodus: Überprüfe Authentifizierung für Services`)
        const authResult = await checkAuthAction()
        if (!authResult.authenticated) {
          console.error("Nicht authentifiziert beim Speichern von Services")
          debug(`Nicht authentifiziert beim Speichern von Services`)
          throw new Error("Nicht authentifiziert")
        }
      } catch (authError) {
        console.error("Fehler bei der Authentifizierungsprüfung:", authError)
        debug(`Fehler bei der Authentifizierungsprüfung für Services`)
        throw authError
      }
    } else {
      debug(`Entwicklungsmodus: Überspringe Authentifizierung für Services`)
    }

    // Bereinige die Daten vor dem Speichern
    const sanitizedServices = services.map((service) => sanitizeForServer(service))

    // Speichere in der Dateisystem-Datenbank
    const success = await saveServicesToFileSystem(sanitizedServices)

    if (success) {
      debug(`${sanitizedServices.length} Services in der Dateisystem-Datenbank gespeichert`)

      // Aktualisiere auch den Memory-Store
      memoryStore["services"] = [...sanitizedServices]
      debug(`${sanitizedServices.length} Services im Memory-Store gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Services in der Dateisystem-Datenbank`)
    }

    return success
  } catch (error) {
    console.error("Fehler beim Speichern der Services:", error)
    debug(`Fehler beim Speichern der Services`)
    return false
  }
}

export async function getWorkshops() {
  debug(`getWorkshops aufgerufen`)
  try {
    // Lade Daten aus der Dateisystem-Datenbank
    const workshops = await getWorkshopsFromFileSystem(defaultWorkshops)
    debug(`${workshops.length} Workshops aus der Dateisystem-Datenbank geladen`)
    return workshops
  } catch (error) {
    console.error("Fehler beim Laden der Workshops:", error)
    debug(`Fehler beim Laden der Workshops, verwende Standarddaten`)
    return [...defaultWorkshops]
  }
}

export async function saveWorkshops(workshops: any[]) {
  debug(`saveWorkshops aufgerufen mit ${workshops?.length || 0} Workshops`)
  try {
    // Überprüfe die Authentifizierung in Produktion
    if (isProduction) {
      try {
        debug(`Produktionsmodus: Überprüfe Authentifizierung für Workshops`)
        const authResult = await checkAuthAction()
        if (!authResult.authenticated) {
          console.error("Nicht authentifiziert beim Speichern von Workshops")
          debug(`Nicht authentifiziert beim Speichern von Workshops`)
          throw new Error("Nicht authentifiziert")
        }
      } catch (authError) {
        console.error("Fehler bei der Authentifizierungsprüfung:", authError)
        debug(`Fehler bei der Authentifizierungsprüfung für Workshops`)
        throw authError
      }
    } else {
      debug(`Entwicklungsmodus: Überspringe Authentifizierung für Workshops`)
    }

    // Stelle sicher, dass jeder Workshop eine ID hat
    const validatedWorkshops = workshops.map((workshop) => {
      if (!workshop.id) {
        return {
          ...workshop,
          id: `workshop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
      }
      return workshop
    })

    // Bereinige die Daten vor dem Speichern
    const sanitizedWorkshops = validatedWorkshops.map((workshop) => sanitizeForServer(workshop))

    // Speichere in der Dateisystem-Datenbank
    const success = await saveWorkshopsToFileFileSystem(sanitizedWorkshops)

    if (success) {
      debug(`${sanitizedWorkshops.length} Workshops in der Dateisystem-Datenbank gespeichert`)

      // Aktualisiere auch den Memory-Store
      memoryStore["workshops"] = [...sanitizedWorkshops]
      debug(`${sanitizedWorkshops.length} Workshops im Memory-Store gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Workshops in der Dateisystem-Datenbank`)
    }

    return success
  } catch (error) {
    console.error("Fehler beim Speichern der Workshops:", error)
    debug(`Fehler beim Speichern der Workshops`)
    return false
  }
}

export async function getBestPractices() {
  debug(`getBestPractices aufgerufen`)
  try {
    // Lade Daten aus der Dateisystem-Datenbank
    const bestPractices = await getBestPracticesFromFileSystem(defaultBestPractices)
    debug(`${bestPractices.length} Best Practices aus der Dateisystem-Datenbank geladen`)
    return bestPractices
  } catch (error) {
    console.error("Fehler beim Laden der Best Practices:", error)
    debug(`Fehler beim Laden der Best Practices, verwende Standarddaten`)
    return [...defaultBestPractices]
  }
}

export async function saveBestPractices(bestPractices: any[]) {
  debug(`saveBestPractices aufgerufen mit ${bestPractices?.length || 0} Best Practices`)
  try {
    // Überprüfe die Authentifizierung in Produktion
    if (isProduction) {
      try {
        debug(`Produktionsmodus: Überprüfe Authentifizierung für Best Practices`)
        const authResult = await checkAuthAction()
        if (!authResult.authenticated) {
          console.error("Nicht authentifiziert beim Speichern von Best Practices")
          debug(`Nicht authentifiziert beim Speichern von Best Practices`)
          throw new Error("Nicht authentifiziert")
        }
      } catch (authError) {
        console.error("Fehler bei der Authentifizierungsprüfung:", authError)
        debug(`Fehler bei der Authentifizierungsprüfung für Best Practices`)
        throw authError
      }
    } else {
      debug(`Entwicklungsmodus: Überspringe Authentifizierung für Best Practices`)
    }

    // Bereinige die Daten vor dem Speichern
    const sanitizedBestPractices = bestPractices.map((bp) => sanitizeForServer(bp))

    // Speichere in der Dateisystem-Datenbank
    const success = await saveBestPracticesToFileFileSystem(sanitizedBestPractices)

    if (success) {
      debug(`${sanitizedBestPractices.length} Best Practices in der Dateisystem-Datenbank gespeichert`)

      // Aktualisiere auch den Memory-Store
      memoryStore["best-practices"] = [...sanitizedBestPractices]
      debug(`${sanitizedBestPractices.length} Best Practices im Memory-Store gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Best Practices in der Dateisystem-Datenbank`)
    }

    return success
  } catch (error) {
    console.error("Fehler beim Speichern der Best Practices:", error)
    debug(`Fehler beim Speichern der Best Practices`)
    return false
  }
}

export async function getResources() {
  debug(`getResources aufgerufen`)
  try {
    // Lade Daten aus der Dateisystem-Datenbank
    const resources = await getResourcesFromFileSystem(defaultResources)
    debug(`${resources.length} Resources aus der Dateisystem-Datenbank geladen`)
    return resources
  } catch (error) {
    console.error("Fehler beim Laden der Ressourcen:", error)
    debug(`Fehler beim Laden der Ressourcen, verwende Standarddaten`)
    return [...defaultResources]
  }
}

export async function saveResources(resources: any[]) {
  debug(`saveResources aufgerufen mit ${resources?.length || 0} Resources`)
  try {
    // Überprüfe die Authentifizierung in Produktion
    if (isProduction) {
      try {
        debug(`Produktionsmodus: Überprüfe Authentifizierung für Resources`)
        const authResult = await checkAuthAction()
        if (!authResult.authenticated) {
          console.error("Nicht authentifiziert beim Speichern von Resources")
          debug(`Nicht authentifiziert beim Speichern von Resources`)
          throw new Error("Nicht authentifiziert")
        }
      } catch (authError) {
        console.error("Fehler bei der Authentifizierungsprüfung:", authError)
        debug(`Fehler bei der Authentifizierungsprüfung für Resources`)
        throw authError
      }
    } else {
      debug(`Entwicklungsmodus: Überspringe Authentifizierung für Resources`)
    }

    // Bereinige die Daten vor dem Speichern
    const sanitizedResources = resources.map((resource) => sanitizeForServer(resource))

    // Speichere in der Dateisystem-Datenbank
    const success = await saveResourcesToFileSystem(sanitizedResources)

    if (success) {
      debug(`${sanitizedResources.length} Resources in der Dateisystem-Datenbank gespeichert`)

      // Aktualisiere auch den Memory-Store
      memoryStore["resources"] = [...sanitizedResources]
      debug(`${sanitizedResources.length} Resources im Memory-Store gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Resources in der Dateisystem-Datenbank`)
    }

    return success
  } catch (error) {
    console.error("Fehler beim Speichern der Ressourcen:", error)
    debug(`Fehler beim Speichern der Ressourcen`)
    return false
  }
}

// Füge die Funktion zum Laden der Landingpage-Daten hinzu
export async function getLandingPage() {
  debug(`getLandingPage aufgerufen`)
  try {
    // Lade Daten aus der Dateisystem-Datenbank
    const landingPage = await getLandingPageFromFileSystem(defaultLandingPage)
    debug(`Landing Page aus der Dateisystem-Datenbank geladen`)
    return landingPage
  } catch (error) {
    console.error("Fehler beim Laden der Landing Page:", error)
    debug(`Fehler beim Laden der Landing Page, verwende Standarddaten`)
    return JSON.parse(JSON.stringify(defaultLandingPage)) // Tiefe Kopie zurückgeben
  }
}

// Füge die Funktion zum Speichern der Landingpage-Daten hinzu
export async function saveLandingPage(landingPage: any) {
  debug(`saveLandingPage aufgerufen`)
  try {
    // Überprüfe die Authentifizierung in Produktion
    if (isProduction) {
      try {
        debug(`Produktionsmodus: Überprüfe Authentifizierung für Landing Page`)
        const authResult = await checkAuthAction()
        if (!authResult.authenticated) {
          console.error("Nicht authentifiziert beim Speichern der Landing Page")
          debug(`Nicht authentifiziert beim Speichern der Landing Page`)
          throw new Error("Nicht authentifiziert")
        }
      } catch (authError) {
        console.error("Fehler bei der Authentifizierungsprüfung:", authError)
        debug(`Fehler bei der Authentifizierungsprüfung für Landing Page`)
        throw authError
      }
    } else {
      debug(`Entwicklungsmodus: Überspringe Authentifizierung für Landing Page`)
    }

    // Bereinige die Daten vor dem Speichern
    const sanitizedLandingPage = sanitizeForServer(landingPage)

    // Speichere in der Dateisystem-Datenbank
    const success = await saveLandingPageToFileFileSystem(sanitizedLandingPage)

    if (success) {
      debug(`Landing Page in der Dateisystem-Datenbank gespeichert`)

      // Aktualisiere auch den Memory-Store
      memoryStore["landing-page"] = [sanitizedLandingPage]
      debug(`Landing Page im Memory-Store gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Landing Page in der Dateisystem-Datenbank`)
    }

    return success
  } catch (error) {
    console.error("Fehler beim Speichern der Landing Page:", error)
    debug(`Fehler beim Speichern der Landing Page`)
    return false
  }
}

// Füge die Funktion zum Laden der Mail-Konfiguration hinzu
export async function getMailConfig() {
  debug(`getMailConfig aufgerufen`)
  try {
    // Lade Daten aus der Dateisystem-Datenbank
    const mailConfig = await getMailConfigFromFileSystem(defaultMailConfig)
    debug(`Mail-Konfiguration aus der Dateisystem-Datenbank geladen`)
    return mailConfig
  } catch (error) {
    console.error("Fehler beim Laden der Mail-Konfiguration:", error)
    debug(`Fehler beim Laden der Mail-Konfiguration, verwende Standarddaten`)
    return JSON.parse(JSON.stringify(defaultMailConfig)) // Tiefe Kopie zurückgeben
  }
}

// Füge die Funktion zum Speichern der Mail-Konfiguration hinzu
export async function saveMailConfig(mailConfig: any) {
  debug(`saveMailConfig aufgerufen`)
  try {
    // Überprüfe die Authentifizierung in Produktion
    if (isProduction) {
      try {
        debug(`Produktionsmodus: Überprüfe Authentifizierung für Mail-Konfiguration`)
        const authResult = await checkAuthAction()
        if (!authResult.authenticated) {
          console.error("Nicht authentifiziert beim Speichern der Mail-Konfiguration")
          debug(`Nicht authentifiziert beim Speichern der Mail-Konfiguration`)
          throw new Error("Nicht authentifiziert")
        }
      } catch (authError) {
        console.error("Fehler bei der Authentifizierungsprüfung:", authError)
        debug(`Fehler bei der Authentifizierungsprüfung für Mail-Konfiguration`)
        throw authError
      }
    } else {
      debug(`Entwicklungsmodus: Überspringe Authentifizierung für Mail-Konfiguration`)
    }

    // Bereinige die Daten vor dem Speichern
    const sanitizedMailConfig = sanitizeForServer(mailConfig)

    // Speichere in der Dateisystem-Datenbank
    const success = await saveMailConfigToFileFileSystem(sanitizedMailConfig)

    if (success) {
      debug(`Mail-Konfiguration in der Dateisystem-Datenbank gespeichert`)

      // Aktualisiere auch den Memory-Store
      memoryStore["mail-config"] = [sanitizedMailConfig]
      debug(`Mail-Konfiguration im Memory-Store gespeichert`)
    } else {
      debug(`Fehler beim Speichern der Mail-Konfiguration in der Dateisystem-Datenbank`)
    }

    return success
  } catch (error) {
    console.error("Fehler beim Speichern der Mail-Konfiguration:", error)
    debug(`Fehler beim Speichern der Mail-Konfiguration`)
    return false
  }
}

// Funktion zum Zurücksetzen aller Daten auf die Standardwerte
export async function resetAllData(): Promise<boolean> {
  debug(`Setze alle Daten zurück`)

  try {
    // Überprüfe die Authentifizierung in Produktion
    if (isProduction) {
      try {
        debug(`Produktionsmodus: Überprüfe Authentifizierung für Reset`)
        const authResult = await checkAuthAction()
        if (!authResult.authenticated) {
          console.error("Nicht authentifiziert beim Zurücksetzen der Daten")
          debug(`Nicht authentifiziert beim Zurücksetzen der Daten`)
          throw new Error("Nicht authentifiziert")
        }
      } catch (authError) {
        console.error("Fehler bei der Authentifizierungsprüfung:", authError)
        debug(`Fehler bei der Authentifizierungsprüfung für Reset`)
        throw authError
      }
    } else {
      debug(`Entwicklungsmodus: Überspringe Authentifizierung für Reset`)
    }

    // Setze den Memory-Store zurück
    memoryStore = { ...initialMemoryStore }
    debug(`Memory-Store zurückgesetzt`)

    // Setze die Dateisystem-Datenbank zurück
    const success = await resetFileSystemDB({
      services: defaultServices,
      workshops: defaultWorkshops,
      bestPractices: defaultBestPractices,
      resources: defaultResources,
      mailConfig: defaultMailConfig,
      landingPage: defaultLandingPage,
    })

    if (success) {
      debug(`Dateisystem-Datenbank zurückgesetzt`)
    } else {
      debug(`Fehler beim Zurücksetzen der Dateisystem-Datenbank`)
    }

    return success
  } catch (error) {
    console.error("Fehler beim Zurücksetzen der Daten:", error)
    debug(`Fehler beim Zurücksetzen der Daten`)
    return false
  }
}
