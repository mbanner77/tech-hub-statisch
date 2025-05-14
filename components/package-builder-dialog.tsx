"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import ActionDialog from "./action-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Check, Mail, Phone } from "lucide-react"

interface PackageBuilderDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface ServiceOption {
  id: string
  name: string
  description: string
  price: number
  category: string
  phase: number
}

export default function PackageBuilderDialog({ isOpen, onClose }: PackageBuilderDialogProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  })
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const serviceOptions: ServiceOption[] = [
    // Phase 1: Analyse
    {
      id: "discovery",
      name: "Discovery Workshop",
      description: "Gemeinsame Analyse Ihrer Anforderungen und Identifikation von Optimierungspotentialen",
      price: 2500,
      category: "Workshop",
      phase: 1,
    },
    {
      id: "assessment",
      name: "BTP Readiness Assessment",
      description: "Bewertung Ihrer IT-Landschaft für die SAP BTP-Migration",
      price: 4900,
      category: "Assessment",
      phase: 1,
    },
    {
      id: "requirements",
      name: "Anforderungsanalyse",
      description: "Detaillierte Erfassung und Dokumentation Ihrer funktionalen und nicht-funktionalen Anforderungen",
      price: 3800,
      category: "Analyse",
      phase: 1,
    },

    // Phase 2: Design
    {
      id: "solution-design",
      name: "Solution Design Workshop",
      description: "Entwicklung einer maßgeschneiderten BTP-Lösung mit Architekturdesign",
      price: 4800,
      category: "Workshop",
      phase: 2,
    },
    {
      id: "architecture",
      name: "Architekturdesign",
      description: "Erstellung einer detaillierten technischen Architektur für Ihre BTP-Lösung",
      price: 7500,
      category: "Design",
      phase: 2,
    },
    {
      id: "security",
      name: "Sicherheitskonzept",
      description: "Entwicklung eines umfassenden Sicherheitskonzepts für Ihre BTP-Landschaft",
      price: 6500,
      category: "Sicherheit",
      phase: 2,
    },

    // Phase 3: Implementierung
    {
      id: "cap-dev",
      name: "CAP Entwicklung",
      description: "Entwicklung von Anwendungen mit dem SAP Cloud Application Programming Model",
      price: 12500,
      category: "Entwicklung",
      phase: 3,
    },
    {
      id: "fiori-dev",
      name: "Fiori App-Entwicklung",
      description: "Entwicklung von benutzerfreundlichen Fiori-Anwendungen",
      price: 8500,
      category: "Entwicklung",
      phase: 3,
    },
    {
      id: "integration",
      name: "Integration Suite Setup",
      description: "Implementierung der SAP Integration Suite für nahtlose Systemintegration",
      price: 9800,
      category: "Integration",
      phase: 3,
    },

    // Phase 4: Go-Live
    {
      id: "deployment",
      name: "Deployment & Go-Live",
      description: "Professionelle Unterstützung bei der Bereitstellung und dem Go-Live",
      price: 7200,
      category: "Deployment",
      phase: 4,
    },
    {
      id: "monitoring",
      name: "Monitoring Setup",
      description: "Einrichtung eines umfassenden Monitoring- und Betriebskonzepts",
      price: 5800,
      category: "Operations",
      phase: 4,
    },
    {
      id: "training",
      name: "Schulung & Enablement",
      description: "Maßgeschneiderte Schulungen für Ihr Team zur effektiven Nutzung der BTP",
      price: 4200,
      category: "Schulung",
      phase: 4,
    },
  ]

  const handleToggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = async () => {
    if (step === 1 && selectedServices.length === 0) {
      toast({
        title: "Bitte wählen Sie mindestens einen Service",
        description: "Um fortzufahren, müssen Sie mindestens einen Service auswählen.",
        variant: "destructive",
      })
      return
    }

    if (step === 2) {
      if (!contactInfo.name || !contactInfo.email) {
        toast({
          title: "Bitte füllen Sie die Pflichtfelder aus",
          description: "Name und E-Mail sind erforderlich.",
          variant: "destructive",
        })
        return
      }

      // Setze den Ladezustand
      setIsSubmitting(true)

      try {
        // Hier würde normalerweise ein API-Aufruf stattfinden
        // Simuliere einen API-Aufruf mit setTimeout
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Sammle die ausgewählten Services für die Anfrage
        const selectedServiceDetails = selectedServices.map((serviceId) => {
          const service = serviceOptions.find((s) => s.id === serviceId)
          return {
            id: service?.id,
            name: service?.name,
            price: service?.price,
          }
        })

        // Erstelle das Anfrageobjekt
        const requestData = {
          contact: contactInfo,
          services: selectedServiceDetails,
          totalPrice: calculateTotalPrice(),
          requestDate: new Date().toISOString(),
        }

        // Hier könnte die Anfrage an einen Server gesendet werden
        console.log("Anfrage wird gesendet:", requestData)

        // Erfolgreiche Anfrage
        toast({
          title: "Anfrage erfolgreich gesendet",
          description: "Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen melden.",
        })

        // Zurücksetzen und Dialog schließen
        resetForm()
        onClose()
      } catch (error) {
        console.error("Fehler beim Senden der Anfrage:", error)
        toast({
          title: "Fehler beim Senden der Anfrage",
          description: "Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = serviceOptions.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const renderServiceSelection = () => {
    // Gruppiere Services nach Phase
    const servicesByPhase: Record<number, ServiceOption[]> = {}
    serviceOptions.forEach((service) => {
      if (!servicesByPhase[service.phase]) {
        servicesByPhase[service.phase] = []
      }
      servicesByPhase[service.phase].push(service)
    })

    const phases = Object.keys(servicesByPhase).map(Number).sort()

    return (
      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase} className="space-y-3">
            <h3 className="font-medium">
              Phase {phase}:{" "}
              {phase === 1 ? "Analyse" : phase === 2 ? "Design" : phase === 3 ? "Implementierung" : "Go-Live"}
            </h3>
            <div className="space-y-2">
              {servicesByPhase[phase].map((service) => (
                <Card
                  key={service.id}
                  className={`transition-colors ${selectedServices.includes(service.id) ? "border-green-500 bg-green-50" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleToggleService(service.id)}
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <Label htmlFor={service.id} className="font-medium cursor-pointer">
                          {service.name}
                        </Label>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{service.category}</span>
                          <span className="font-medium">{service.price.toLocaleString("de-DE")} €</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Ausgewählte Services:</span>
            <span>{selectedServices.length}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium">Gesamtpreis:</span>
            <span className="text-lg font-bold">{calculateTotalPrice().toLocaleString("de-DE")} €</span>
          </div>
        </div>
      </div>
    )
  }

  const renderContactForm = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Ihre Auswahl</h3>
          <ul className="space-y-1 text-sm">
            {selectedServices.map((serviceId) => {
              const service = serviceOptions.find((s) => s.id === serviceId)
              return service ? (
                <li key={serviceId} className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>{service.name}</span>
                </li>
              ) : null
            })}
          </ul>
          <div className="flex justify-between items-center mt-4 font-medium">
            <span>Gesamtpreis:</span>
            <span>{calculateTotalPrice().toLocaleString("de-DE")} €</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={contactInfo.name}
              onChange={handleInputChange}
              placeholder="Ihr Name"
              required
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
              value={contactInfo.email}
              onChange={handleInputChange}
              placeholder="ihre-email@beispiel.de"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleInputChange}
              placeholder="+49 123 456789"
            />
          </div>
          <div>
            <Label htmlFor="company">Unternehmen</Label>
            <Input
              id="company"
              name="company"
              value={contactInfo.company}
              onChange={handleInputChange}
              placeholder="Ihr Unternehmen"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Anmerkungen</Label>
          <textarea
            id="notes"
            name="notes"
            value={contactInfo.notes}
            onChange={handleInputChange}
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="Weitere Informationen oder Anforderungen..."
          />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+49 123 456789</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>info@realcore.de</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const resetForm = () => {
    setSelectedServices([])
    setContactInfo({
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    })
    setStep(1)
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? "Individuelles Beratungspaket zusammenstellen" : "Kontaktinformationen"}
      description={
        step === 1
          ? "Wählen Sie die gewünschten Services für Ihr maßgeschneidertes Beratungspaket."
          : "Bitte geben Sie Ihre Kontaktdaten an, damit wir Ihnen ein Angebot erstellen können."
      }
    >
      <div className="space-y-6">
        {step === 1 ? renderServiceSelection() : renderContactForm()}

        <div className="flex justify-between pt-4">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevious}>
              Zurück
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
          )}
          <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
            {step === 2 ? (
              isSubmitting ? (
                <>
                  <span className="mr-2">Wird gesendet...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Anfrage senden"
              )
            ) : (
              <>
                Weiter
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </ActionDialog>
  )
}
