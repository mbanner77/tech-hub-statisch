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
import { defaultBestPractices } from "@/data/default-data"
import { AlertCircle, Save, Trash, Plus, Download, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { db, sanitizeBestPractice } from "@/lib/db"

export default function BestPracticeEditor() {
  const [bestPractices, setBestPractices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadBestPractices = async () => {
      setIsLoading(true)
      setSaveError(null)
      setSaveSuccess(null)
      try {
        console.log("[BEST-PRACTICE-EDITOR] Lade Best Practices aus der Datenbank...")
        const dbBestPractices = await db.bestPractices.toArray()

        if (Array.isArray(dbBestPractices) && dbBestPractices.length > 0) {
          console.log("[BEST-PRACTICE-EDITOR] Best Practices aus der Datenbank geladen:", dbBestPractices.length)
          setBestPractices(dbBestPractices)
          setError(null)
        } else {
          console.log("[BEST-PRACTICE-EDITOR] Keine Best Practices in der Datenbank gefunden, verwende Standarddaten")
          const sanitizedBestPractices = defaultBestPractices.map(sanitizeBestPractice)
          setBestPractices(sanitizedBestPractices)

          // Initialisiere die Datenbank mit Standarddaten
          try {
            await db.bestPractices.clear()
            await db.bestPractices.bulkPut(sanitizedBestPractices)
            console.log("[BEST-PRACTICE-EDITOR] Datenbank mit Standarddaten initialisiert")
          } catch (dbError) {
            console.error("[BEST-PRACTICE-EDITOR] Fehler beim Initialisieren der Datenbank:", dbError)
            setError("Fehler beim Initialisieren der Datenbank. Standarddaten werden nur temporär verwendet.")
          }
        }
      } catch (err) {
        console.error("[BEST-PRACTICE-EDITOR] Fehler beim Laden der Best Practices:", err)
        setBestPractices(defaultBestPractices.map(sanitizeBestPractice))
        setError("Fehler beim Laden der Best Practices. Standarddaten werden verwendet.")
      } finally {
        setIsLoading(false)
      }
    }

    loadBestPractices()
  }, [])

  const handleSave = async () => {
    setSaveError(null)
    setSaveSuccess(null)
    try {
      console.log("[BEST-PRACTICE-EDITOR] Speichere Best Practices in der Datenbank...")

      // Bereinige die Best Practices vor dem Speichern
      const sanitizedBestPractices = bestPractices.map(sanitizeBestPractice)

      // Lösche alle vorhandenen Best Practices
      await db.bestPractices.clear()

      // Füge die Best Practices einzeln hinzu
      await db.bestPractices.bulkPut(sanitizedBestPractices)

      console.log("[BEST-PRACTICE-EDITOR] Best Practices erfolgreich in der Datenbank gespeichert")
      setSaveSuccess("Best Practices erfolgreich in der Datenbank gespeichert.")
      toast({
        title: "Erfolg",
        description: "Best Practices erfolgreich gespeichert.",
      })
    } catch (err) {
      console.error("[BEST-PRACTICE-EDITOR] Fehler beim Speichern der Best Practices:", err)
      setSaveError(
        `Fehler beim Speichern der Best Practices: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`,
      )
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern der Best Practices.",
        variant: "destructive",
      })
    }
  }

  const handleAddBestPractice = () => {
    const newBestPractice = {
      id: `best-practice-${Date.now()}`,
      title: "Neue Best Practice",
      description: "Best Practice Beschreibung",
      category: "Allgemein",
      image: "/placeholder.svg",
      featured: false,
      downloadUrl: "",
      externalUrl: "",
    }
    setBestPractices([...bestPractices, newBestPractice])
  }

  const handleDeleteBestPractice = (id: string) => {
    setBestPractices(bestPractices.filter((bestPractice) => bestPractice.id !== id))
  }

  const handleBestPracticeChange = (id: string, field: string, value: any) => {
    setBestPractices(
      bestPractices.map((bestPractice) => {
        if (bestPractice.id === id) {
          return { ...bestPractice, [field]: value }
        }
        return bestPractice
      }),
    )
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(bestPractices, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "best-practices.json"

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
          setBestPractices(importedData)
          toast({
            title: "Import erfolgreich",
            description: `${importedData.length} Best Practices importiert.`,
          })
        } else {
          toast({
            title: "Import fehlgeschlagen",
            description: "Die importierte Datei enthält keine gültige Best Practice-Liste.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("[BEST-PRACTICE-EDITOR] Import error:", error)
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
    return <div className="text-center py-8">Lade Best Practices...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Best Practice-Editor</h2>
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
          <Button onClick={handleAddBestPractice}>
            <Plus className="mr-2 h-4 w-4" /> Best Practice hinzufügen
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
        {bestPractices.map((bestPractice) => (
          <Card key={bestPractice.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Best Practice bearbeiten</CardTitle>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteBestPractice(bestPractice.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`title-${bestPractice.id}`}>Titel</Label>
                  <Input
                    id={`title-${bestPractice.id}`}
                    value={bestPractice.title}
                    onChange={(e) => handleBestPracticeChange(bestPractice.id, "title", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`description-${bestPractice.id}`}>Beschreibung</Label>
                  <Textarea
                    id={`description-${bestPractice.id}`}
                    value={bestPractice.description}
                    onChange={(e) => handleBestPracticeChange(bestPractice.id, "description", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`category-${bestPractice.id}`}>Kategorie</Label>
                  <Select
                    value={bestPractice.category}
                    onValueChange={(value) => handleBestPracticeChange(bestPractice.id, "category", value)}
                  >
                    <SelectTrigger id={`category-${bestPractice.id}`}>
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Allgemein">Allgemein</SelectItem>
                      <SelectItem value="Architektur">Architektur</SelectItem>
                      <SelectItem value="Entwicklung">Entwicklung</SelectItem>
                      <SelectItem value="Integration">Integration</SelectItem>
                      <SelectItem value="Sicherheit">Sicherheit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`image-${bestPractice.id}`}>Bild-URL</Label>
                  <Input
                    id={`image-${bestPractice.id}`}
                    value={bestPractice.image}
                    onChange={(e) => handleBestPracticeChange(bestPractice.id, "image", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`featured-${bestPractice.id}`}
                    checked={bestPractice.featured}
                    onCheckedChange={(checked) => handleBestPracticeChange(bestPractice.id, "featured", checked)}
                  />
                  <Label htmlFor={`featured-${bestPractice.id}`}>Empfohlen</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`downloadUrl-${bestPractice.id}`}>Download-URL</Label>
                  <Input
                    id={`downloadUrl-${bestPractice.id}`}
                    value={bestPractice.downloadUrl}
                    onChange={(e) => handleBestPracticeChange(bestPractice.id, "downloadUrl", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`externalUrl-${bestPractice.id}`}>Externe URL</Label>
                  <Input
                    id={`externalUrl-${bestPractice.id}`}
                    value={bestPractice.externalUrl}
                    onChange={(e) => handleBestPracticeChange(bestPractice.id, "externalUrl", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
