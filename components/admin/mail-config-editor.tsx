"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Mail, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getMailConfigAction, saveMailConfigAction, testMailConfigAction } from "@/lib/mail-config-actions"
import type { MailConfig } from "@/types/mail-config"

export default function MailConfigEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [config, setConfig] = useState<MailConfig>({
    host: "",
    port: "587",
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
    defaultFrom: "",
    enabled: false,
  })
  const [testEmail, setTestEmail] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await getMailConfigAction()
        if (data) {
          setConfig(data)
        }
      } catch (error) {
        console.error("Fehler beim Laden der Mail-Konfiguration:", error)
        toast({
          title: "Fehler beim Laden",
          description: "Die Mail-Konfiguration konnte nicht geladen werden.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [toast])

  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setConfig((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveMailConfigAction(config)
      toast({
        title: "Konfiguration gespeichert",
        description: "Die Mail-Konfiguration wurde erfolgreich gespeichert.",
      })
    } catch (error) {
      console.error("Fehler beim Speichern der Mail-Konfiguration:", error)
      toast({
        title: "Fehler beim Speichern",
        description: "Die Mail-Konfiguration konnte nicht gespeichert werden.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    if (!testEmail) {
      toast({
        title: "Test-E-Mail fehlt",
        description: "Bitte geben Sie eine E-Mail-Adresse für den Test ein.",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    try {
      const result = await testMailConfigAction(config, testEmail)
      if (result.success) {
        toast({
          title: "Test erfolgreich",
          description: `Eine Test-E-Mail wurde an ${testEmail} gesendet.`,
        })
      } else {
        throw new Error(result.error || "Unbekannter Fehler")
      }
    } catch (error) {
      console.error("Fehler beim Testen der Mail-Konfiguration:", error)
      toast({
        title: "Test fehlgeschlagen",
        description: `Die Test-E-Mail konnte nicht gesendet werden: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mail-Server Konfiguration</CardTitle>
        <CardDescription>
          Konfigurieren Sie den SMTP-Server für den Versand von E-Mails aus der Anwendung.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>E-Mail-Funktion aktivieren</Label>
            <p className="text-sm text-gray-500">Aktivieren Sie diese Option, um E-Mails zu versenden.</p>
          </div>
          <Switch checked={config.enabled} onCheckedChange={(checked) => handleChange("enabled", checked)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">SMTP-Server</Label>
            <Input
              id="host"
              value={config.host}
              onChange={(e) => handleChange("host", e.target.value)}
              placeholder="z.B. smtp.gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Select value={config.port} onValueChange={(value) => handleChange("port", value)}>
              <SelectTrigger id="port">
                <SelectValue placeholder="Port wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 (SMTP)</SelectItem>
                <SelectItem value="465">465 (SMTPS)</SelectItem>
                <SelectItem value="587">587 (SMTP mit STARTTLS)</SelectItem>
                <SelectItem value="2525">2525 (Alternativer Port)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="secure">Sichere Verbindung (SSL/TLS)</Label>
            <Switch
              id="secure"
              checked={config.secure}
              onCheckedChange={(checked) => handleChange("secure", checked)}
            />
          </div>
          <p className="text-xs text-gray-500">
            Aktivieren Sie diese Option für SSL/TLS (Port 465). Für STARTTLS (Port 587) deaktivieren.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Authentifizierung</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                value={config.auth.user}
                onChange={(e) => handleChange("auth.user", e.target.value)}
                placeholder="E-Mail oder Benutzername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={config.auth.pass}
                onChange={(e) => handleChange("auth.pass", e.target.value)}
                placeholder="Passwort oder App-Passwort"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultFrom">Standard-Absender</Label>
          <Input
            id="defaultFrom"
            value={config.defaultFrom}
            onChange={(e) => handleChange("defaultFrom", e.target.value)}
            placeholder="name@beispiel.de"
          />
          <p className="text-xs text-gray-500">
            Diese E-Mail-Adresse wird als Absender für alle ausgehenden E-Mails verwendet.
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Test-E-Mail senden</h3>
          <div className="flex space-x-2">
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@beispiel.de"
              className="flex-1"
            />
            <Button onClick={handleTest} disabled={isTesting || !config.enabled} className="whitespace-nowrap">
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Test senden
                </>
              )}
            </Button>
          </div>
          {!config.enabled && (
            <p className="text-xs text-amber-600 mt-1">
              Die E-Mail-Funktion ist deaktiviert. Aktivieren Sie sie, um Tests durchzuführen.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Konfiguration speichern
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
