"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { defaultServices } from "@/data/default-data"
import { AlertCircle, Save, Trash, Plus, Download, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { db, sanitizeService } from "@/lib/db"

export default function ServiceEditor() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true)
      setSaveError(null)
      setSaveSuccess(null)
      try {
        console.log("[SERVICE-EDITOR] Lade Services aus der Datenbank...")
        const dbServices = await db.services.toArray()

        if (Array.isArray(dbServices) && dbServices.length > 0) {
          console.log("[SERVICE-EDITOR] Services aus der Datenbank geladen:", dbServices.length)
          setServices(dbServices)
          setError(null)
        } else {
          console.log("[SERVICE-EDITOR] Keine Services in der Datenbank gefunden, verwende Standarddaten")
          const sanitizedServices = defaultServices.map(sanitizeService)
          setServices(sanitizedServices)

          // Initialisiere die Datenbank mit Standarddaten
          try {
            await db.services.clear()
            await db.services.bulkPut(sanitizedServices)
            console.log("[SERVICE-EDITOR] Datenbank mit Standarddaten initialisiert")
          } catch (dbError) {
            console.error("[SERVICE-EDITOR] Fehler beim Initialisieren der Datenbank:", dbError)
            setError("Fehler beim Initialisieren der Datenbank. Standarddaten werden nur temporär verwendet.")
          }
        }
      } catch (err) {
        console.error("[SERVICE-EDITOR] Fehler beim Laden der Services:", err)
        setServices(defaultServices.map(sanitizeService))
        setError("Fehler beim Laden der Services. Standarddaten werden verwendet.")
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  const handleSave = async () => {
    setSaveError(null)
    setSaveSuccess(null)
    try {
      console.log("[SERVICE-EDITOR] Speichere Services in der Datenbank...")

      // Bereinige die Services vor dem Speichern
      const sanitizedServices = services.map(sanitizeService)

      // Lösche alle vorhandenen Services
      await db.services.clear()

      // Füge die Services einzeln hinzu
      await db.services.bulkPut(sanitizedServices)

      console.log("[SERVICE-EDITOR] Services erfolgreich in der Datenbank gespeichert")
      setSaveSuccess("Services erfolgreich in der Datenbank gespeichert.")
      toast({
        title: "Erfolg",
        description: "Services erfolgreich gespeichert.",
      })
    } catch (err) {
      console.error("[SERVICE-EDITOR] Fehler beim Speichern der Services:", err)
      setSaveError(`Fehler beim Speichern der Services: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`)
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern der Services.",
        variant: "destructive",
      })
    }
  }

  const handleAddService = () => {
    const newService = {
      id: `service-${Date.now()}`,
      title: "Neuer Service",
      description: "Service Beschreibung",
      category: "Allgemein",
      image: "/placeholder.svg",
      price: 0,
      duration: "1 Tag",
      featured: false,
      isStarterPackage: false,
      technologies: [],
      included: [],
      notIncluded: [],
      process: [],
      phase: 1,
      technologyCategory: "",
      processCategory: "",
    }
    setServices([...services, newService])
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const handleServiceChange = (id: string, field: string, value: any) => {
    setServices(
      services.map((service) => {
        if (service.id === id) {
          return { ...service, [field]: value }
        }
        return service
      }),
    )
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(services, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "services.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)

        if (Array.isArray(importedData)) {
          setServices(importedData)
          toast({
            title: "Import erfolgreich",
            description: `${importedData.length} Services importiert.`,
          })
        } else {
          toast({
            title: "Import fehlgeschlagen",
            description: "Die importierte Datei enthält keine gültige Service-Liste.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("[SERVICE-EDITOR] Import error:", error)
        toast({
          title: "Import fehlgeschlagen",
          description: "Die Datei konnte nicht verarbeitet werden.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  if (isLoading) {
    return <div className="text-center py-8">Lade Services...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service-Editor</h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Speicherfehler</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <AlertTitle>Erfolg</AlertTitle>
          <AlertDescription>{saveSuccess}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button onClick={handleAddService}>
            <Plus className="mr-2 h-4 w-4" /> Service hinzufügen
          </Button>
          <Button onClick={handleSave} variant="default">
            <Save className="mr-2 h-4 w-4" /> Speichern
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportieren
          </Button>
          <div className="relative">
            <input
              type="file"
              id="import-file"
              className="absolute inset-0 opacity-0 w-full cursor-pointer"
              onChange={handleImport}
              accept=".json"
            />
            <Button variant="outline" className="relative">
              <Upload className="mr-2 h-4 w-4" /> Importieren
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Service bearbeiten</CardTitle>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`title-${service.id}`}>Titel</Label>
                  <Input
                    id={`title-${service.id}`}
                    value={service.title}
                    onChange={(e) => handleServiceChange(service.id, "title", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`description-${service.id}`}>Beschreibung</Label>
                  <Textarea
                    id={`description-${service.id}`}
                    value={service.description}
                    onChange={(e) => handleServiceChange(service.id, "description", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`category-${service.id}`}>Kategorie</Label>
                  <Select
                    value={service.category}
                    onValueChange={(value) => handleServiceChange(service.id, "category", value)}
                  >
                    <SelectTrigger id={`category-${service.id}`}>
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Allgemein">Allgemein</SelectItem>
                      <SelectItem value="Beratung">Beratung</SelectItem>
                      <SelectItem value="Entwicklung">Entwicklung</SelectItem>
                      <SelectItem value="Integration">Integration</SelectItem>
                      <SelectItem value="Schulung">Schulung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Neue Technologie-Kategorie */}
                <div className="grid gap-2">
                  <Label htmlFor={`technologyCategory-${service.id}`}>Technologie-Kategorie</Label>
                  <Select
                    value={service.technologyCategory || ""}
                    onValueChange={(value) => handleServiceChange(service.id, "technologyCategory", value)}
                  >
                    <SelectTrigger id={`technologyCategory-${service.id}`}>
                      <SelectValue placeholder="Technologie-Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Keine">Keine</SelectItem>
                      <SelectItem value="SAP">SAP</SelectItem>
                      <SelectItem value="Microsoft">Microsoft</SelectItem>
                      <SelectItem value="OpenSource">OpenSource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Neue Prozess-Kategorie */}
                <div className="grid gap-2">
                  <Label htmlFor={`processCategory-${service.id}`}>Prozess-Kategorie</Label>
                  <Select
                    value={service.processCategory || ""}
                    onValueChange={(value) => handleServiceChange(service.id, "processCategory", value)}
                  >
                    <SelectTrigger id={`processCategory-${service.id}`}>
                      <SelectValue placeholder="Prozess-Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Keine">Keine</SelectItem>
                      <SelectItem value="Operate">Operate</SelectItem>
                      <SelectItem value="Innovate">Innovate</SelectItem>
                      <SelectItem value="Ideate">Ideate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`image-${service.id}`}>Bild-URL</Label>
                  <Input
                    id={`image-${service.id}`}
                    value={service.image}
                    onChange={(e) => handleServiceChange(service.id, "image", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`price-${service.id}`}>Preis (€)</Label>
                  <Input
                    id={`price-${service.id}`}
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(service.id, "price", Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`duration-${service.id}`}>Dauer</Label>
                  <Input
                    id={`duration-${service.id}`}
                    value={service.duration}
                    onChange={(e) => handleServiceChange(service.id, "duration", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`phase-${service.id}`}>Phase</Label>
                  <Input
                    id={`phase-${service.id}`}
                    type="number"
                    value={service.phase}
                    onChange={(e) => handleServiceChange(service.id, "phase", Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`featured-${service.id}`}
                    checked={service.featured}
                    onCheckedChange={(checked) => handleServiceChange(service.id, "featured", checked)}
                  />
                  <Label htmlFor={`featured-${service.id}`}>Empfohlen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`starter-package-${service.id}`}
                    checked={service.isStarterPackage}
                    onCheckedChange={(checked) => handleServiceChange(service.id, "isStarterPackage", checked)}
                  />
                  <Label htmlFor={`starter-package-${service.id}`}>StarterPackage</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
