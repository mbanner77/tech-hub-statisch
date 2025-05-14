"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import SearchFilters from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Fügen Sie den Import für das Menu-Icon hinzu
import { MapPin, Phone, Mail, Linkedin, Twitter, Facebook, ArrowRight, BookOpen, Menu, XIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InnovationFactory from "@/components/innovation-factory"
import TemplateGallery from "@/components/template-gallery"
import DigitalMaturityAssessment from "@/components/digital-maturity-assessment"
import ChallengeForm from "@/components/challenge-form"
import { useRef, useState } from "react"
import AssessmentDialog from "@/components/assessment-dialog"
import WorkshopBookingDialog from "@/components/workshop-booking-dialog"
import PackageBuilderDialog from "@/components/package-builder-dialog"
import DownloadDialog from "@/components/download-dialog"
import LearnMoreDialog from "@/components/learn-more-dialog"
import TrainingCatalogDialog from "@/components/training-catalog-dialog"

import DynamicServiceGrid from "@/components/dynamic-service-grid"
import DynamicWorkshopGrid from "@/components/dynamic-workshop-grid"
import DynamicBestPractices from "@/components/dynamic-best-practices"
import DynamicResources from "@/components/dynamic-resources"

export default function Home() {
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)
  const [isWorkshopDialogOpen, setIsWorkshopDialogOpen] = useState(false)
  const [isPackageBuilderDialogOpen, setIsPackageBuilderDialogOpen] = useState(false)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
  const [isLearnMoreDialogOpen, setIsLearnMoreDialogOpen] = useState(false)
  const [isTrainingCatalogDialogOpen, setIsTrainingCatalogDialogOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState({
    title: "",
    duration: "",
    price: 0,
  })
  const [selectedResource, setSelectedResource] = useState({
    title: "",
    type: "whitepaper" as "template" | "bestpractice" | "whitepaper",
  })
  const [selectedBestPractice, setSelectedBestPractice] = useState({
    title: "",
    category: "",
  })
  // Fügen Sie den State für das mobile Menü hinzu
  // Fügen Sie diese Zeile zu den anderen useState-Deklarationen hinzu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Refs für die Scroll-Funktionalität
  const servicesRef = useRef<HTMLDivElement>(null)

  const handleWorkshopClick = (title: string, duration: string, price: number) => {
    setSelectedWorkshop({ title, duration, price })
    setIsWorkshopDialogOpen(true)
  }

  const handleDownloadClick = (title: string, type: "template" | "bestpractice" | "whitepaper") => {
    setSelectedResource({ title, type })
    setIsDownloadDialogOpen(true)
  }

  const handleLearnMoreClick = (title: string, category: string) => {
    setSelectedBestPractice({ title, category })
    setIsLearnMoreDialogOpen(true)
  }

  // Funktion zum Scrollen zu einem bestimmten Abschnitt
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ersetzen Sie den Header-Bereich mit dieser aktualisierten Version, die eine mobile Navigation enthält */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/rc-logo.png" alt="RealCore Logo" width={150} height={40} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/home" className="text-gray-800 font-medium hover:text-green-600">
              Home
            </Link>
            <Link href="#services" className="text-gray-800 font-medium hover:text-green-600">
              Beratungsangebote
            </Link>
            <Link href="#assessment" className="text-gray-800 font-medium hover:text-green-600">
              Standortbestimmung
            </Link>
            <Link href="#workshops" className="text-gray-800 font-medium hover:text-green-600">
              Workshops
            </Link>
            <Link href="#innovation" className="text-gray-800 font-medium hover:text-green-600">
              Innovation Factory
            </Link>
            <Link href="#templates" className="text-gray-800 font-medium hover:text-green-600">
              Templates
            </Link>
            <Link href="#knowledge" className="text-gray-800 font-medium hover:text-green-600">
              Knowledge Hub
            </Link>
            <Link href="#contact" className="text-gray-800 font-medium hover:text-green-600">
              Kontakt
            </Link>
            <Link href="/btp-services" className="text-gray-800 font-medium hover:text-green-600">
              BTP Services
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-2">
            <div className="container mx-auto px-4 space-y-2">
              <Link
                href="/home"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#services"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => {
                  setMobileMenuOpen(false)
                  scrollToSection(servicesRef)
                }}
              >
                Beratungsangebote
              </Link>
              <Link
                href="#assessment"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Standortbestimmung
              </Link>
              <Link
                href="#workshops"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Workshops
              </Link>
              <Link
                href="#innovation"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Innovation Factory
              </Link>
              <Link
                href="#templates"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                href="#knowledge"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Knowledge Hub
              </Link>
              <Link
                href="#contact"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
              <Link
                href="/btp-services"
                className="block py-2 text-gray-800 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                BTP Services
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">RealCore Tech Expertise</h1>
              <p className="text-xl mb-6">
                Ihr Beratungsbaukasten für SAP, OpenSource & Microsoft - alles aus einer Hand
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-gray-100"
                  onClick={() => scrollToSection(servicesRef)}
                >
                  Angebote entdecken
                </Button>
                <Button
                  size="lg"
                  className="bg-amber-500 text-white hover:bg-amber-600 border-2 border-amber-400 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => setIsAssessmentDialogOpen(true)}
                >
                  Standortbestimmung
                </Button>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex items-center space-x-2 text-xl font-semibold">
                  <span>Start Smart.</span>
                  <ArrowRight className="h-4 w-4" />
                  <span>Disrupt Fast.</span>
                  <ArrowRight className="h-4 w-4" />
                  <span>Evolve Always.</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <ChallengeForm />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div id="services" ref={servicesRef} className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            RealCore-Tech Beratungsangebote zu Festpreisen
          </h1>
          <p className="text-lg text-gray-600">
            Entdecken Sie unsere technischen Beratungsangebote zu SAP, OpenSource und Microsoft - alles aus einer Hand
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters />
        </div>

        <DynamicServiceGrid />

        <div id="assessment" className="mt-20 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Digitale Standortbestimmung</h2>
            <p className="text-lg text-gray-600">
              Ermitteln Sie den Digitalisierungsgrad Ihrer SAP-Landschaft mit unserer wissenschaftlich fundierten
              Methodik
            </p>
          </div>

          <DigitalMaturityAssessment />
        </div>

        <div id="workshops" className="mt-20 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Workshops & Beratungsansatz</h2>
            <p className="text-lg text-gray-600">
              Unser digital moderierter Beratungsansatz mit maßgeschneiderten Workshops
            </p>
          </div>

          <DynamicWorkshopGrid />

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Unser Beratungsbaukasten</h3>
            <p className="mb-6">
              Mit unserem modularen Beratungsbaukasten können Sie genau die Leistungen auswählen, die Sie benötigen.
              Kombinieren Sie Workshops, Beratungsleistungen und Implementierungspakete zu einer maßgeschneiderten
              Lösung.
            </p>

            <div className="relative">
              <div className="flex overflow-x-auto pb-4 space-x-4">
                <div className="flex-shrink-0 w-64 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Phase 1: Analyse</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Discovery Workshop
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      BTP Readiness Assessment
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Anforderungsanalyse
                    </li>
                  </ul>
                </div>

                <div className="flex-shrink-0 w-64 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Phase 2: Design</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Solution Design Workshop
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Architekturdesign
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Sicherheitskonzept
                    </li>
                  </ul>
                </div>

                <div className="flex-shrink-0 w-64 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Phase 3: Implementierung</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      CAP Entwicklung
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Fiori App-Entwicklung
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Integration Suite Setup
                    </li>
                  </ul>
                </div>

                <div className="flex-shrink-0 w-64 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Phase 4: Go-Live</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Deployment & Go-Live
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Monitoring Setup
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Schulung & Enablement
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsPackageBuilderDialogOpen(true)}>
                Individuelles Beratungspaket zusammenstellen
              </Button>
            </div>
          </div>
        </div>

        <div id="innovation" className="mt-20 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Innovation Factory</h2>
            <p className="text-lg text-gray-600">
              Die SAP BTP ist für uns die ideale Basis, um Ihre Use Cases in die Cloud zu bringen
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="mb-6">
              In Kombination mit unserem bewährten end-to-end Ansatz entstehen schnell und skalierbar Lösungen, die
              überzeugen. Denn wir hören dem Nutzer erstmal zu und stellen somit sicher, dass Sie auch wirklich Ihre
              größten Herausforderungen auf die richtige Art und Weise angehen.
            </p>
          </div>

          <InnovationFactory />
        </div>

        <div id="templates" className="mt-20 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Templates & Best Practices</h2>
            <p className="text-lg text-gray-600">
              Beschleunigen Sie Ihre Projekte mit unseren vorgefertigten Templates und bewährten Best Practices
            </p>
          </div>

          <TemplateGallery />
        </div>

        <div id="knowledge" className="mt-20 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Knowledge Hub</h2>
            <p className="text-lg text-gray-600">Schulungen, Best Practices und Know-How rund um die SAP BTP</p>
          </div>

          <Tabs defaultValue="schulungen" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schulungen">Schulungen</TabsTrigger>
              <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
              <TabsTrigger value="ressourcen">Ressourcen</TabsTrigger>
            </TabsList>

            <TabsContent value="schulungen" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-600">Online-Kurs</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">SAP BTP Grundlagen</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Einführung in die SAP Business Technology Platform und ihre Komponenten.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Dauer: 4 Stunden</span>
                      <span className="font-medium">490 €</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-600">Workshop</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">SAP CAP Entwicklung</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Hands-on Training zur Entwicklung mit dem SAP Cloud Application Programming Model.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Dauer: 2 Tage</span>
                      <span className="font-medium">1.490 €</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-600">Webinar</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">SAP Integration Suite</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Überblick über die Integrationsszenarien und -tools der SAP Integration Suite.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Dauer: 2 Stunden</span>
                      <span className="font-medium">Kostenlos</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline" className="mr-2" onClick={() => setIsTrainingCatalogDialogOpen(true)}>
                  Alle Schulungen anzeigen
                </Button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  onClick={() => {
                    setSelectedResource({
                      title: "Schulungskatalog",
                      type: "whitepaper",
                    })
                    setIsDownloadDialogOpen(true)
                  }}
                >
                  Schulungskatalog herunterladen
                </button>
              </div>
            </TabsContent>

            <TabsContent value="best-practices" className="mt-6">
              <DynamicBestPractices />
            </TabsContent>

            <TabsContent value="ressourcen" className="mt-6">
              <DynamicResources />
            </TabsContent>
          </Tabs>
        </div>

        <div id="contact" className="max-w-4xl mx-auto mt-20 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Kontaktieren Sie uns</h2>
          <p className="text-center mb-8">
            Haben Sie Fragen zu unseren Angeboten? Unser Expertenteam steht Ihnen gerne zur Verfügung.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">Vorname</Label>
                    <Input id="firstname" placeholder="Vorname" />
                  </div>
                  <div>
                    <Label htmlFor="lastname">Nachname</Label>
                    <Input id="lastname" placeholder="Nachname" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" placeholder="ihre-email@beispiel.de" />
                </div>
                <div>
                  <Label htmlFor="company">Unternehmen</Label>
                  <Input id="company" placeholder="Unternehmen" />
                </div>
                <div>
                  <Label htmlFor="message">Nachricht</Label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    placeholder="Wie können wir Ihnen helfen?"
                  ></textarea>
                </div>
                <Button className="w-full">Nachricht senden</Button>
              </form>
            </div>
            <div className="flex flex-col justify-center">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">RealCore GmbH</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-green-600 mt-0.5" />
                    <span>
                      Musterstraße 123
                      <br />
                      12345 Musterstadt
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-green-600" />
                    <span>+49 123 456789</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-green-600" />
                    <span>info@realcore.de</span>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Folgen Sie uns</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-green-600">
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-green-600">
                      <Twitter className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-green-600">
                      <Facebook className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image
                src="/images/rc-logo.png"
                alt="RealCore Logo"
                width={120}
                height={30}
                className="h-8 w-auto bg-white p-1 rounded"
              />
            </div>
            <div className="text-sm text-gray-400">© {new Date().getFullYear()} RealCore. Alle Rechte vorbehalten.</div>
          </div>
        </div>
      </footer>

      {/* Dialoge */}
      <AssessmentDialog isOpen={isAssessmentDialogOpen} onClose={() => setIsAssessmentDialogOpen(false)} />

      <WorkshopBookingDialog
        isOpen={isWorkshopDialogOpen}
        onClose={() => setIsWorkshopDialogOpen(false)}
        workshopTitle={selectedWorkshop.title}
        workshopDuration={selectedWorkshop.duration}
        workshopPrice={selectedWorkshop.price}
      />

      <PackageBuilderDialog isOpen={isPackageBuilderDialogOpen} onClose={() => setIsPackageBuilderDialogOpen(false)} />

      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => setIsDownloadDialogOpen(false)}
        resourceTitle={selectedResource.title}
        resourceType={selectedResource.type}
      />

      <LearnMoreDialog
        isOpen={isLearnMoreDialogOpen}
        onClose={() => setIsLearnMoreDialogOpen(false)}
        title={selectedBestPractice.title}
        category={selectedBestPractice.category}
        onDownload={() => {
          setIsLearnMoreDialogOpen(false)
          setTimeout(() => {
            handleDownloadClick(`${selectedBestPractice.title} Whitepaper`, "whitepaper")
          }, 100)
        }}
      />

      <TrainingCatalogDialog
        isOpen={isTrainingCatalogDialogOpen}
        onClose={() => setIsTrainingCatalogDialogOpen(false)}
      />
    </div>
  )
}
