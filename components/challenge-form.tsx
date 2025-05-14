"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Check, Code, Zap } from "lucide-react"

export default function ChallengeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    challenge: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validierung
    if (!formData.name || !formData.email || !formData.challenge) {
      toast({
        title: "Bitte füllen Sie alle Pflichtfelder aus",
        description: "Name, E-Mail und Challenge-Beschreibung sind erforderlich.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simuliere API-Aufruf
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast({
        title: "Challenge erfolgreich gesendet!",
        description: "Wir werden Ihre Challenge innerhalb von 48 Stunden umsetzen.",
      })
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Challenge angenommen!</h3>
        <p className="text-gray-600 mb-4">
          Vielen Dank für Ihre Challenge. Unser Team wird sich sofort an die Arbeit machen und gemeinsam mit Ihnen
          innerhalb von 48 Stunden eine Lösung entwickeln.
        </p>
        <p className="text-sm text-gray-500">Wir haben eine Bestätigung an {formData.email} gesendet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-3">
          <Zap className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-2xl font-bold text-amber-600">Digitaler 48h Real-Hackathon</h3>
        <div className="w-16 h-1 bg-amber-500 mx-auto my-3"></div>
      </div>

      <p className="text-gray-700 mb-6 text-center">
        Haben Sie eine Herausforderung für uns? Beschreiben Sie uns Ihre Idee und wenn wir die Challenge annehmen,
        setzen wir diese digital gemeinsam mit Ihnen in 48h um!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ihr Name"
            required
            className="text-gray-900"
          />
        </div>

        <div>
          <Label htmlFor="email">
            E-Mail <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ihre-email@beispiel.de"
            required
            className="text-gray-900"
          />
        </div>

        <div>
          <Label htmlFor="company">Unternehmen</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Ihr Unternehmen"
            className="text-gray-900"
          />
        </div>

        <div>
          <Label htmlFor="challenge">
            Ihre Challenge <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="challenge"
            name="challenge"
            value={formData.challenge}
            onChange={handleChange}
            className="w-full min-h-[100px] p-2 border rounded-md text-gray-900 bg-white"
            placeholder="Beschreiben Sie Ihre technische Herausforderung oder Idee..."
            required
          />
        </div>

        <div className="flex items-center justify-center text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
          <Code className="h-4 w-4 mr-2 text-amber-600" />
          <span>Gemeinsame Umsetzung innerhalb von 48 Stunden</span>
          <Clock className="h-4 w-4 ml-2 text-amber-600" />
        </div>

        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Wird gesendet..." : "Challenge einreichen"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Durch das Absenden stimmen Sie zu, dass wir Ihre Daten zur Bearbeitung Ihrer Anfrage verwenden dürfen.
        </p>
      </form>
    </div>
  )
}
