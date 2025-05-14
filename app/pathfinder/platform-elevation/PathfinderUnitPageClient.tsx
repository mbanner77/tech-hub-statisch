"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { pathfinderUnits } from "../pathfinder-units"
import { StickyHeader } from "@/components/sticky-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExpertDetailDialog } from "@/components/expert-detail-dialog"
import { LearnMoreDialog } from "@/components/learn-more-dialog"
import { WorkshopBookingDialog } from "@/components/workshop-booking-dialog"
import { ContactDialog } from "@/components/contact-dialog"
import { PathfinderUnitNavigation } from "@/components/pathfinder-unit-navigation"
import { ArrowLeft, Calendar, Download, FileText, MessageSquare } from "lucide-react"

export default function PathfinderUnitPageClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [expertDialogOpen, setExpertDialogOpen] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState<any>(null)
  const [learnMoreDialogOpen, setLearnMoreDialogOpen] = useState(false)
  const [workshopDialogOpen, setWorkshopDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)

  // Finde die aktuelle Unit
  const currentUnit = pathfinderUnits.find((unit) => unit.id === "platform-elevation")

  // Finde verwandte Units (hier: 3 zufällige andere Units)
  const relatedUnits = pathfinderUnits
    .filter((unit) => unit.id !== "platform-elevation")
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  if (!currentUnit) {
    return <div>Unit nicht gefunden</div>
  }

  const handleExpertClick = (expert: any) => {
    setSelectedExpert(expert)
    setExpertDialogOpen(true)
  }

  // Prüfen, ob approach ein Array ist
  const hasApproachArray = Array.isArray(currentUnit.approach)

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb und Zurück-Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="flex items-center text-gray-600 hover:text-gray-900"
              onClick={() => router.push("/pathfinder")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Button>
          </div>

          {/* Unit Navigation */}
          <div className="mb-8">
            <PathfinderUnitNavigation currentUnitId="platform-elevation" />
          </div>

          {/* Hero-Bereich */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-1/2">
              <div className="mb-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-2">
                  {currentUnit.category || "Platform"}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">{currentUnit.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{currentUnit.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <Button onClick={() => setLearnMoreDialogOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Mehr erfahren
                </Button>
                <Button variant="outline" onClick={() => setWorkshopDialogOpen(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Workshop buchen
                </Button>
                <Button variant="outline" onClick={() => setContactDialogOpen(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Kontakt
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 relative min-h-[300px]">
              <Image
                src={currentUnit.heroImage || "/images/pathfinder-platform-elevation.png"}
                alt={currentUnit.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="benefits">Vorteile</TabsTrigger>
              <TabsTrigger value="approach">Vorgehen</TabsTrigger>
              <TabsTrigger value="experts">Experten</TabsTrigger>
            </TabsList>

            {/* Übersicht Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Über Platform Elevation</h2>
                  <p className="text-gray-700 mb-4">
                    Platform Elevation ist unser Ansatz, um Ihre bestehenden IT-Systeme auf die nächste Stufe zu heben.
                    Durch den Einsatz von SAP BTP, Microsoft Cloud Services und innovativen OpenSource-Tools entwickeln
                    wir digitale Services und Anwendungen, die Ihrem Unternehmen eine neue Dimension der Flexibilität
                    und Skalierbarkeit eröffnen.
                  </p>
                  <p className="text-gray-700">
                    Wir helfen Ihnen, Ihre Plattformstrategie zu definieren, die richtige Technologieauswahl zu treffen
                    und eine zukunftssichere Architektur zu implementieren, die Ihre Geschäftsziele unterstützt.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Schlüsselelemente</h2>
                  <ul className="space-y-2">
                    {currentUnit.keyElements?.map((element, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                        <span>{element}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start">
                          <div className="mr-2 h-5 w-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                          <span>Cloud-native Architektur und Entwicklung</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 h-5 w-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                          <span>API-First Strategie und Microservices</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 h-5 w-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                          <span>Hybride Cloud-Lösungen mit SAP BTP und Microsoft Azure</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 h-5 w-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                          <span>DevOps und Continuous Integration/Deployment</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 h-5 w-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                          <span>Skalierbare und resiliente Infrastruktur</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Fallstudien */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Erfolgsgeschichten</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentUnit.caseStudies?.map((caseStudy, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={caseStudy.image || "/placeholder.svg?height=200&width=400&query=case study"}
                          alt={caseStudy.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{caseStudy.title}</h3>
                        <p className="text-gray-600 mb-4">{caseStudy.description || caseStudy.summary}</p>
                        <div className="flex items-center">
                          <Image
                            src={
                              caseStudy.logoSrc ||
                              caseStudy.clientLogo ||
                              "/placeholder.svg?height=40&width=40&query=logo"
                            }
                            alt={`${caseStudy.company || caseStudy.client} Logo`}
                            width={40}
                            height={40}
                            className="rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium">{caseStudy.company || caseStudy.client}</p>
                            <p className="text-sm text-gray-500">{caseStudy.industry}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <>
                      <Card className="overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src="/images/case-study-automotive.png"
                            alt="Automotive GmbH Case Study"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Cloud-Transformation</h3>
                          <p className="text-gray-600 mb-4">
                            Migration von Legacy-Systemen zu einer modernen Cloud-Architektur mit SAP BTP und Azure.
                          </p>
                          <div className="flex items-center">
                            <Image
                              src="/images/logo-automotive-gmbh.png"
                              alt="Automotive GmbH Logo"
                              width={40}
                              height={40}
                              className="rounded-full mr-3"
                            />
                            <div>
                              <p className="font-medium">Automotive GmbH</p>
                              <p className="text-sm text-gray-500">Automobilindustrie</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src="/images/case-study-machinery.png"
                            alt="Maschinen AG Case Study"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">API-First Strategie</h3>
                          <p className="text-gray-600 mb-4">
                            Implementierung einer API-First Strategie für die Integration von Maschinen und Systemen.
                          </p>
                          <div className="flex items-center">
                            <Image
                              src="/images/logo-maschinen-ag.png"
                              alt="Maschinen AG Logo"
                              width={40}
                              height={40}
                              className="rounded-full mr-3"
                            />
                            <div>
                              <p className="font-medium">Maschinen AG</p>
                              <p className="text-sm text-gray-500">Maschinenbau</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src="/finance-company-logo.png"
                            alt="Finance AG Case Study"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Microservices-Architektur</h3>
                          <p className="text-gray-600 mb-4">
                            Entwicklung einer skalierbaren Microservices-Architektur für Finanzdienstleistungen.
                          </p>
                          <div className="flex items-center">
                            <Image
                              src="/finance-company-logo.png"
                              alt="Finance AG Logo"
                              width={40}
                              height={40}
                              className="rounded-full mr-3"
                            />
                            <div>
                              <p className="font-medium">Finance AG</p>
                              <p className="text-sm text-gray-500">Finanzdienstleistungen</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>

              {/* Downloads */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Downloads & Ressourcen</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentUnit.downloads?.map((download, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{download.title}</h3>
                        <p className="text-gray-600 mb-4">{download.description}</p>
                        <Button className="w-full" onClick={() => window.open(download.url || "#", "_blank")}>
                          <Download className="mr-2 h-4 w-4" />
                          Herunterladen
                        </Button>
                      </CardContent>
                    </Card>
                  )) || (
                    <>
                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Platform Elevation Whitepaper</h3>
                          <p className="text-gray-600 mb-4">
                            Detaillierte Informationen zu unserer Platform Elevation Methodik und Best Practices.
                          </p>
                          <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Herunterladen
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Cloud-Architektur Referenz</h3>
                          <p className="text-gray-600 mb-4">
                            Referenzarchitektur für hybride Cloud-Lösungen mit SAP BTP und Microsoft Azure.
                          </p>
                          <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Herunterladen
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">API-First Checkliste</h3>
                          <p className="text-gray-600 mb-4">
                            Checkliste für die Implementierung einer erfolgreichen API-First Strategie.
                          </p>
                          <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Herunterladen
                          </Button>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Vorteile Tab */}
            <TabsContent value="benefits" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Geschäftliche Vorteile</h2>
                  <ul className="space-y-4">
                    {currentUnit.businessBenefits?.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 h-6 w-6 rounded-full bg-green-500 mt-1 flex-shrink-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{benefit.title}</h3>
                          <p className="text-gray-600">{benefit.description}</p>
                        </div>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-green-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Höhere Agilität</h3>
                            <p className="text-gray-600">
                              Schnellere Markteinführung neuer Funktionen und Anwendungen durch moderne
                              Entwicklungsmethoden.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-green-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Kosteneffizienz</h3>
                            <p className="text-gray-600">
                              Reduzierung der Betriebskosten durch Cloud-native Architekturen und Pay-as-you-go Modelle.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-green-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Skalierbarkeit</h3>
                            <p className="text-gray-600">
                              Flexible Anpassung der Ressourcen an wechselnde Geschäftsanforderungen ohne große
                              Vorabinvestitionen.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-green-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Innovationsfähigkeit</h3>
                            <p className="text-gray-600">
                              Schnellere Umsetzung innovativer Ideen durch moderne Entwicklungsplattformen und
                              -werkzeuge.
                            </p>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Technische Vorteile</h2>
                  <ul className="space-y-4">
                    {currentUnit.technicalBenefits?.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 h-6 w-6 rounded-full bg-blue-500 mt-1 flex-shrink-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{benefit.title}</h3>
                          <p className="text-gray-600">{benefit.description}</p>
                        </div>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-blue-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Verbesserte Interoperabilität</h3>
                            <p className="text-gray-600">
                              Nahtlose Integration zwischen SAP- und Nicht-SAP-Systemen durch standardisierte APIs.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-blue-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Höhere Resilienz</h3>
                            <p className="text-gray-600">
                              Verbesserte Ausfallsicherheit und Disaster Recovery durch Cloud-native Architekturen.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-blue-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Beschleunigte Entwicklung</h3>
                            <p className="text-gray-600">
                              Schnellere Entwicklungszyklen durch DevOps-Praktiken und Continuous
                              Integration/Deployment.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 h-6 w-6 rounded-full bg-blue-500 mt-1 flex-shrink-0 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Zukunftssicherheit</h3>
                            <p className="text-gray-600">
                              Moderne Architekturen, die flexibel an neue Technologien und Anforderungen angepasst
                              werden können.
                            </p>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Technologien */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Eingesetzte Technologien</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentUnit.technologies?.map((tech, index) => (
                    <Card key={index} className="text-center p-6">
                      <div className="flex justify-center mb-4">
                        <Image
                          src={tech.icon || "/placeholder.svg?height=64&width=64&query=tech icon"}
                          alt={tech.name}
                          width={64}
                          height={64}
                        />
                      </div>
                      <h3 className="font-medium">{tech.name}</h3>
                    </Card>
                  )) || (
                    <>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/images/icon-btp.png" alt="SAP BTP" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">SAP BTP</h3>
                      </Card>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/api-icon.png" alt="API Management" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">API Management</h3>
                      </Card>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/images/icon-cloud.png" alt="Microsoft Azure" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">Microsoft Azure</h3>
                      </Card>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/event-icon.png" alt="Event Mesh" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">Event Mesh</h3>
                      </Card>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/images/icon-cap.png" alt="CAP" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">CAP</h3>
                      </Card>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/images/icon-database.png" alt="HANA Cloud" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">HANA Cloud</h3>
                      </Card>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/images/icon-layers.png" alt="Kubernetes" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">Kubernetes</h3>
                      </Card>
                      <Card className="text-center p-6">
                        <div className="flex justify-center mb-4">
                          <Image src="/images/icon-compass.png" alt="CI/CD" width={64} height={64} />
                        </div>
                        <h3 className="font-medium">CI/CD</h3>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Vorgehen Tab */}
            <TabsContent value="approach" className="mt-6">
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Unser Vorgehen</h2>
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-0 md:left-1/2 h-full w-1 bg-blue-200 transform md:translate-x-0 translate-x-4"></div>

                  {/* Timeline Items */}
                  <div className="space-y-12">
                    {/* Prüfen, ob approach ein Array ist und darüber iterieren */}
                    {hasApproachArray && currentUnit.approach.map ? (
                      currentUnit.approach.map((step, index) => (
                        <div
                          key={index}
                          className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                        >
                          <div className="md:w-1/2 mb-8 md:mb-0">
                            <div
                              className={`bg-white p-6 rounded-lg shadow-md ${
                                index % 2 === 0 ? "md:ml-12" : "md:mr-12"
                              }`}
                            >
                              <div className="flex items-center mb-4">
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                              </div>
                              <p className="text-gray-700">{step.description}</p>
                              <ul className="mt-4 space-y-2">
                                {step.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="flex items-start">
                                    <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="absolute left-0 md:left-1/2 w-9 h-9 bg-blue-500 rounded-full transform md:translate-x-[-18px] translate-x-0 flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Fallback, wenn approach kein Array ist oder nicht existiert
                      <>
                        <div className="relative flex flex-col md:flex-row md:flex-row-reverse">
                          <div className="md:w-1/2 mb-8 md:mb-0">
                            <div className="bg-white p-6 rounded-lg shadow-md md:ml-12">
                              <div className="flex items-center mb-4">
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  1
                                </div>
                                <h3 className="text-xl font-semibold">Assessment & Strategie</h3>
                              </div>
                              <p className="text-gray-700">
                                Analyse der bestehenden IT-Landschaft und Entwicklung einer maßgeschneiderten
                                Plattformstrategie.
                              </p>
                              <ul className="mt-4 space-y-2">
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Technische Bestandsaufnahme</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Anforderungsanalyse</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Strategieentwicklung</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="absolute left-0 md:left-1/2 w-9 h-9 bg-blue-500 rounded-full transform md:translate-x-[-18px] translate-x-0 flex items-center justify-center">
                            <span className="text-white font-bold">1</span>
                          </div>
                        </div>

                        <div className="relative flex flex-col md:flex-row">
                          <div className="md:w-1/2 mb-8 md:mb-0">
                            <div className="bg-white p-6 rounded-lg shadow-md md:mr-12">
                              <div className="flex items-center mb-4">
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  2
                                </div>
                                <h3 className="text-xl font-semibold">Architektur & Design</h3>
                              </div>
                              <p className="text-gray-700">
                                Entwicklung einer zukunftssicheren Architektur basierend auf Cloud-nativen Prinzipien.
                              </p>
                              <ul className="mt-4 space-y-2">
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Architekturkonzeption</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Technologieauswahl</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Proof of Concept</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="absolute left-0 md:left-1/2 w-9 h-9 bg-blue-500 rounded-full transform md:translate-x-[-18px] translate-x-0 flex items-center justify-center">
                            <span className="text-white font-bold">2</span>
                          </div>
                        </div>

                        <div className="relative flex flex-col md:flex-row md:flex-row-reverse">
                          <div className="md:w-1/2 mb-8 md:mb-0">
                            <div className="bg-white p-6 rounded-lg shadow-md md:ml-12">
                              <div className="flex items-center mb-4">
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  3
                                </div>
                                <h3 className="text-xl font-semibold">Implementierung</h3>
                              </div>
                              <p className="text-gray-700">
                                Agile Umsetzung der Plattform mit kontinuierlicher Integration und Deployment.
                              </p>
                              <ul className="mt-4 space-y-2">
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Agile Entwicklung</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>CI/CD-Pipeline-Aufbau</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Infrastruktur-as-Code</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="absolute left-0 md:left-1/2 w-9 h-9 bg-blue-500 rounded-full transform md:translate-x-[-18px] translate-x-0 flex items-center justify-center">
                            <span className="text-white font-bold">3</span>
                          </div>
                        </div>

                        <div className="relative flex flex-col md:flex-row">
                          <div className="md:w-1/2 mb-8 md:mb-0">
                            <div className="bg-white p-6 rounded-lg shadow-md md:mr-12">
                              <div className="flex items-center mb-4">
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  4
                                </div>
                                <h3 className="text-xl font-semibold">Betrieb & Optimierung</h3>
                              </div>
                              <p className="text-gray-700">
                                Kontinuierliche Überwachung, Optimierung und Weiterentwicklung der Plattform.
                              </p>
                              <ul className="mt-4 space-y-2">
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Monitoring & Alerting</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Performance-Optimierung</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span>Kontinuierliche Verbesserung</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="absolute left-0 md:left-1/2 w-9 h-9 bg-blue-500 rounded-full transform md:translate-x-[-18px] translate-x-0 flex items-center justify-center">
                            <span className="text-white font-bold">4</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Deliverables</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentUnit.deliverables?.map((deliverable, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{deliverable.title}</h3>
                        <p className="text-gray-600">{deliverable.description}</p>
                      </CardContent>
                    </Card>
                  )) || (
                    <>
                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Plattformstrategie</h3>
                          <p className="text-gray-600">
                            Detaillierte Strategie für die Entwicklung und den Betrieb Ihrer Cloud-Plattform.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Referenzarchitektur</h3>
                          <p className="text-gray-600">
                            Dokumentierte Architektur mit Best Practices für Cloud-native Anwendungen.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">CI/CD-Pipeline</h3>
                          <p className="text-gray-600">
                            Automatisierte Pipeline für kontinuierliche Integration und Deployment.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">API-Katalog</h3>
                          <p className="text-gray-600">
                            Dokumentierter Katalog aller APIs mit Nutzungsrichtlinien und Beispielen.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Monitoring-Dashboard</h3>
                          <p className="text-gray-600">
                            Echtzeit-Dashboard für die Überwachung der Plattform-Performance und -Gesundheit.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">Betriebshandbuch</h3>
                          <p className="text-gray-600">
                            Umfassendes Handbuch für den Betrieb und die Wartung der Plattform.
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Experten Tab */}
            <TabsContent value="experts" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentUnit.experts?.map((expert, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={expert.image || "/placeholder.svg?height=300&width=300&query=expert"}
                        alt={expert.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-1">{expert.name}</h3>
                      <p className="text-gray-600 mb-4">{expert.role}</p>
                      <p className="text-gray-700 mb-4">{expert.bio}</p>
                      <Button onClick={() => handleExpertClick(expert)}>Profil anzeigen</Button>
                    </CardContent>
                  </Card>
                )) || (
                  <>
                    <Card className="overflow-hidden">
                      <div className="relative h-64">
                        <Image
                          src="/images/expert-thomas-mueller.jpg"
                          alt="Thomas Müller"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-1">Thomas Müller</h3>
                        <p className="text-gray-600 mb-4">Cloud Architect</p>
                        <p className="text-gray-700 mb-4">
                          Experte für hybride Cloud-Architekturen mit über 15 Jahren Erfahrung in der Entwicklung
                          skalierbarer Unternehmensanwendungen.
                        </p>
                        <Button
                          onClick={() =>
                            handleExpertClick({
                              name: "Thomas Müller",
                              role: "Cloud Architect",
                              image: "/images/expert-thomas-mueller.jpg",
                              bio: "Experte für hybride Cloud-Architekturen mit über 15 Jahren Erfahrung in der Entwicklung skalierbarer Unternehmensanwendungen.",
                              expertise: [
                                "SAP BTP",
                                "Microsoft Azure",
                                "Kubernetes",
                                "Microservices",
                                "API Management",
                              ],
                              projects: [
                                "Cloud-Transformation für Automotive GmbH",
                                "Hybride Architektur für Maschinen AG",
                                "API-First Strategie für Finance AG",
                              ],
                              contact: {
                                email: "thomas.mueller@realcore.de",
                                phone: "+49 123 456789",
                              },
                            })
                          }
                        >
                          Profil anzeigen
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div className="relative h-64">
                        <Image
                          src="/images/expert-sarah-schmidt.jpg"
                          alt="Sarah Schmidt"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-1">Sarah Schmidt</h3>
                        <p className="text-gray-600 mb-4">DevOps Engineer</p>
                        <p className="text-gray-700 mb-4">
                          Spezialistin für CI/CD-Pipelines und automatisierte Deployment-Prozesse mit Fokus auf
                          Container-Technologien.
                        </p>
                        <Button
                          onClick={() =>
                            handleExpertClick({
                              name: "Sarah Schmidt",
                              role: "DevOps Engineer",
                              image: "/images/expert-sarah-schmidt.jpg",
                              bio: "Spezialistin für CI/CD-Pipelines und automatisierte Deployment-Prozesse mit Fokus auf Container-Technologien.",
                              expertise: [
                                "CI/CD",
                                "Docker",
                                "Kubernetes",
                                "Infrastructure as Code",
                                "Cloud-native Development",
                              ],
                              projects: [
                                "DevOps-Transformation für Automotive GmbH",
                                "Aufbau einer CI/CD-Pipeline für Maschinen AG",
                                "Container-Orchestrierung für Finance AG",
                              ],
                              contact: {
                                email: "sarah.schmidt@realcore.de",
                                phone: "+49 123 456789",
                              },
                            })
                          }
                        >
                          Profil anzeigen
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div className="relative h-64">
                        <Image
                          src="/images/expert-michael-weber.jpg"
                          alt="Michael Weber"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-1">Michael Weber</h3>
                        <p className="text-gray-600 mb-4">API & Integration Specialist</p>
                        <p className="text-gray-700 mb-4">
                          Experte für API-Design und -Management sowie die Integration von SAP- und Nicht-SAP-Systemen.
                        </p>
                        <Button
                          onClick={() =>
                            handleExpertClick({
                              name: "Michael Weber",
                              role: "API & Integration Specialist",
                              image: "/images/expert-michael-weber.jpg",
                              bio: "Experte für API-Design und -Management sowie die Integration von SAP- und Nicht-SAP-Systemen.",
                              expertise: [
                                "API Design",
                                "SAP Integration Suite",
                                "Event Mesh",
                                "REST/OData",
                                "Microservices",
                              ],
                              projects: [
                                "API-First Strategie für Automotive GmbH",
                                "Event-driven Architecture für Maschinen AG",
                                "SAP S/4HANA Integration für Finance AG",
                              ],
                              contact: {
                                email: "michael.weber@realcore.de",
                                phone: "+49 123 456789",
                              },
                            })
                          }
                        >
                          Profil anzeigen
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Verwandte Units */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Verwandte Pathfinder Units</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedUnits.map((unit) => (
                <Card key={unit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={unit.heroImage || "/placeholder.svg?height=200&width=400&query=pathfinder unit"}
                      alt={unit.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-2">
                      {unit.category || "Pathfinder"}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2">{unit.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{unit.description}</p>
                    <Button variant="outline" className="w-full" onClick={() => router.push(`/pathfinder/${unit.id}`)}>
                      Mehr erfahren
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Dialoge */}
      {selectedExpert && (
        <ExpertDetailDialog expert={selectedExpert} open={expertDialogOpen} onOpenChange={setExpertDialogOpen} />
      )}

      <LearnMoreDialog
        title={currentUnit.title}
        description={currentUnit.description}
        content={currentUnit.detailedContent || "Detaillierte Informationen zu Platform Elevation..."}
        open={learnMoreDialogOpen}
        onOpenChange={setLearnMoreDialogOpen}
      />

      <WorkshopBookingDialog
        title={`Workshop zu ${currentUnit.title}`}
        open={workshopDialogOpen}
        onOpenChange={setWorkshopDialogOpen}
      />

      <ContactDialog
        title={`Kontakt zu ${currentUnit.title}`}
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />

      <EnhancedFooter />
      <BackToTop />
    </div>
  )
}
