"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import ActionDialog from "./action-dialog"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { sendEmail } from "@/lib/mail-service"

interface SelectedServicesDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedServiceIds: string[]
  services: any[]
  onSuccess: () => void
}

export default function SelectedServicesDialog({
  isOpen,
  onClose,
  selectedServiceIds,
  services,
  onSuccess,
}: SelectedServicesDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Berechne den Gesamtpreis der ausgewählten Services
  const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id))
  const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    // Validierung
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Bitte füllen Sie alle Pflichtfelder aus",
        description: "Vorname, Nachname und E-Mail sind erforderlich.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Erstelle ein Anfrageobjekt mit allen relevanten Daten
      const requestData = {
        contact: formData,
        services: selectedServices.map((service) => ({
          id: service.id,
          title: service.title,
          price: service.price,
        })),
        totalPrice,
        timestamp: new Date().toISOString(),
      }

      // Sende eine E-Mail mit den Anfragedaten
      const emailResult = await sendEmail({
        to: "admin@realcore.de", // Diese E-Mail-Adresse sollte konfigurierbar sein
        subject: `Neue Serviceanfrage von ${formData.firstName} ${formData.lastName}`,
        html: `
        <h1>Neue Serviceanfrage</h1>
        <p><strong>Von:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>E-Mail:</strong> ${formData.email}</p>
        <p><strong>Unternehmen:</strong> ${formData.company || "Nicht angegeben"}</p>
        <p><strong>Telefon:</strong> ${formData.phone || "Nicht angegeben"}</p>
        <p><strong>Nachricht:</strong> ${formData.message || "Keine Nachricht"}</p>
        <h2>Ausgewählte Services:</h2>
        <ul>
          ${selectedServices
            .map((service) => `<li>${service.title} - ${service.price?.toLocaleString("de-DE")} €</li>`)
            .join("")}
        </ul>
        <p><strong>Gesamtpreis:</strong> ${totalPrice.toLocaleString("de-DE")} €</p>
      `,
      })

      // Hier könnte man die Daten an eine API senden
      console.log("Anfrage gesendet:", requestData)

      if (!emailResult.success) {
        console.warn("E-Mail konnte nicht gesendet werden:", emailResult.error)
      }

      toast({
        title: "Anfrage erfolgreich gesendet",
        description: "Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen melden.",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Fehler beim Senden der Anfrage:", error)
      toast({
        title: "Fehler beim Senden der Anfrage",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Anfrage für ausgewählte Services"
      description="Füllen Sie das Formular aus, um eine Anfrage für die ausgewählten Services zu senden."
      actionLabel={isSubmitting ? "Wird gesendet..." : "Anfrage senden"}
      onAction={handleSubmit}
      disabled={isSubmitting}
      icon={isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : undefined}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Ausgewählte Services:</h3>
          <ul className="space-y-2">
            {selectedServices.map((service) => (
              <li key={service.id} className="flex justify-between">
                <span>{service.title}</span>
                <span className="font-medium">{service.price?.toLocaleString("de-DE")} €</span>
              </li>
            ))}
            <li className="flex justify-between border-t pt-2 mt-2 font-bold">
              <span>Gesamtpreis:</span>
              <span>{totalPrice.toLocaleString("de-DE")} €</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              Vorname <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Vorname"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Nachname <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nachname"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
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
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Unternehmen</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Unternehmen"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+49 123 456789"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Ihre Nachricht (optional)</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Weitere Details oder Fragen zu Ihrer Anfrage"
            className="min-h-[100px]"
          />
        </div>

        <div className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Pflichtfelder
        </div>
      </div>
    </ActionDialog>
  )
}
