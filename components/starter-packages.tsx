"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Check, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultServices } from "@/data/default-data"
import { db } from "@/lib/db"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function StarterPackages() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log("[STARTER-PACKAGES] Lade Services aus der Datenbank...")
        setIsLoading(true)

        // Lade direkt aus der IndexedDB
        const dbServices = await db.services.toArray()

        if (dbServices && dbServices.length > 0) {
          console.log("[STARTER-PACKAGES] Services aus der Datenbank geladen:", dbServices.length)
          setServices(dbServices)
          setError(null)
        } else {
          console.log("[STARTER-PACKAGES] Keine Services in der Datenbank gefunden, verwende Standarddaten")
          setServices(defaultServices)
        }
      } catch (err) {
        console.error("[STARTER-PACKAGES] Fehler beim Laden der Services:", err)
        setServices(defaultServices)
        setError("Fehler beim Laden der Services. Standarddaten werden verwendet.")
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  // Filtere nur StarterPackages
  const starterPackages = services.filter((service) => service.isStarterPackage)

  // Gruppiere nach Prozess-Kategorie
  const ideatePackages = starterPackages.filter((service) => service.processCategory === "Ideate")
  const innovatePackages = starterPackages.filter((service) => service.processCategory === "Innovate")
  const operatePackages = starterPackages.filter((service) => service.processCategory === "Operate")
  const otherPackages = starterPackages.filter(
    (service) =>
      !service.processCategory ||
      (service.processCategory !== "Ideate" &&
        service.processCategory !== "Innovate" &&
        service.processCategory !== "Operate"),
  )

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Lade StarterPackages...</p>
      </div>
    )
  }

  if (starterPackages.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Keine StarterPackages verfügbar</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Derzeit sind keine StarterPackages konfiguriert. Bitte kontaktieren Sie den Administrator, um StarterPackages
          hinzuzufügen.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">StarterPackages: Ihr risikofreier Einstieg in neue Technologien</h2>
          <p className="text-lg opacity-90 mb-6">
            Unsere StarterPackages bieten Ihnen einen schnellen und risikofreien Einstieg in neue Technologien und
            Herausforderungen - zu Festpreisen, mit garantierten Ergebnissen und wertvollem Wissenstransfer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Festpreis-Garantie</h3>
              <p className="text-sm opacity-90">Kalkulierbare Kosten ohne versteckte Überraschungen</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Schnelle Erfolge</h3>
              <p className="text-sm opacity-90">Fokus auf Quick Wins für sofortige Mehrwerte</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Wissenstransfer</h3>
              <p className="text-sm opacity-90">Umfassender Know-how-Transfer an Ihr Team</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Verfügbare StarterPackages</h2>
          <TabsList>
            <TabsTrigger value="all">Alle Pakete</TabsTrigger>
            <TabsTrigger value="ideate" className="text-purple-600">
              Ideate
            </TabsTrigger>
            <TabsTrigger value="innovate" className="text-blue-600">
              Innovate
            </TabsTrigger>
            <TabsTrigger value="operate" className="text-green-600">
              Operate
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-8">
          {ideatePackages.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
                <h3 className="text-xl font-semibold">Ideate: Konzeption & Planung</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideatePackages.map(renderPackageCard)}
              </div>
            </div>
          )}

          {innovatePackages.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                <h3 className="text-xl font-semibold">Innovate: Entwicklung & Umsetzung</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {innovatePackages.map(renderPackageCard)}
              </div>
            </div>
          )}

          {operatePackages.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                <h3 className="text-xl font-semibold">Operate: Betrieb & Optimierung</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {operatePackages.map(renderPackageCard)}
              </div>
            </div>
          )}

          {otherPackages.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full bg-gray-600 mr-2"></div>
                <h3 className="text-xl font-semibold">Weitere StarterPackages</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPackages.map(renderPackageCard)}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ideate">
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Ideate: Konzeption & Planung</h3>
            <p className="text-gray-700">
              Unsere Ideate-Pakete unterstützen Sie bei der strategischen Planung und Konzeption Ihrer digitalen
              Initiativen. Von der ersten Idee bis zum detaillierten Konzept - wir helfen Ihnen, die richtigen Weichen
              zu stellen.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideatePackages.length > 0 ? (
              ideatePackages.map(renderPackageCard)
            ) : (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Keine Ideate-Pakete verfügbar</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="innovate">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Innovate: Entwicklung & Umsetzung</h3>
            <p className="text-gray-700">
              Mit unseren Innovate-Paketen setzen wir Ihre Konzepte in die Praxis um. Wir entwickeln maßgeschneiderte
              Lösungen, integrieren Technologien und sorgen für eine reibungslose Implementierung.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {innovatePackages.length > 0 ? (
              innovatePackages.map(renderPackageCard)
            ) : (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Keine Innovate-Pakete verfügbar</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="operate">
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Operate: Betrieb & Optimierung</h3>
            <p className="text-gray-700">
              Unsere Operate-Pakete sorgen für einen reibungslosen Betrieb und kontinuierliche Optimierung Ihrer
              Lösungen. Wir überwachen, warten und verbessern Ihre Systeme, damit Sie sich auf Ihr Kerngeschäft
              konzentrieren können.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operatePackages.length > 0 ? (
              operatePackages.map(renderPackageCard)
            ) : (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Keine Operate-Pakete verfügbar</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Wie funktionieren unsere StarterPackages?</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-semibold mb-2">Auswahl</h4>
            <p className="text-sm text-gray-600">Wählen Sie das passende StarterPackage für Ihre Anforderungen aus</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-semibold mb-2">Kickoff</h4>
            <p className="text-sm text-gray-600">Gemeinsamer Kickoff-Workshop zur Abstimmung der Details</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-semibold mb-2">Umsetzung</h4>
            <p className="text-sm text-gray-600">Schnelle und effiziente Umsetzung durch unsere Experten</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="font-semibold mb-2">Wissenstransfer</h4>
            <p className="text-sm text-gray-600">Umfassender Know-how-Transfer und Dokumentation</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Bereit für Ihren Technologie-Boost?</h3>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          Starten Sie noch heute mit einem unserer StarterPackages und erleben Sie, wie wir gemeinsam Ihre digitale
          Transformation beschleunigen.
        </p>
        <Button className="bg-white text-blue-800 hover:bg-gray-100">
          Kontakt aufnehmen
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  function renderPackageCard(service: any) {
    return (
      <Card
        key={service.id}
        className={`overflow-hidden hover:shadow-lg transition-shadow border-t-4 ${
          service.processCategory === "Ideate"
            ? "border-t-purple-500"
            : service.processCategory === "Innovate"
              ? "border-t-blue-500"
              : service.processCategory === "Operate"
                ? "border-t-green-500"
                : "border-t-gray-500"
        }`}
      >
        <div className="relative h-48">
          <Image
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?key=service"
            }}
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {service.rating && (
              <div className="bg-white bg-opacity-90 text-yellow-500 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                {service.rating}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 opacity-70"></div>
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline">{service.category}</Badge>
            <span className="font-bold text-lg">{service.price.toLocaleString("de-DE")} €</span>
          </div>
          <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
          <CardDescription className="line-clamp-3">{service.description}</CardDescription>
          <div className="flex flex-wrap gap-2 mt-4">
            {service.technologyCategory && (
              <Badge
                variant="secondary"
                className={`${
                  service.technologyCategory === "SAP"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : service.technologyCategory === "Microsoft"
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      : service.technologyCategory === "OpenSource"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {service.technologyCategory}
              </Badge>
            )}
            {service.processCategory && (
              <Badge
                variant="secondary"
                className={`${
                  service.processCategory === "Ideate"
                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    : service.processCategory === "Innovate"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : service.processCategory === "Operate"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {service.processCategory}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{service.title}</DialogTitle>
                <DialogDescription>Festpreis: {service.price.toLocaleString("de-DE")} €</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="relative h-60 w-full rounded-lg overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?key=details"
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Beschreibung</h3>
                  <p>{service.description}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Technologien</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech: string) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Kategorien</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{service.category}</Badge>
                      {service.technologyCategory && (
                        <Badge
                          variant="secondary"
                          className={`${
                            service.technologyCategory === "SAP"
                              ? "bg-blue-100 text-blue-800"
                              : service.technologyCategory === "Microsoft"
                                ? "bg-purple-100 text-purple-800"
                                : service.technologyCategory === "OpenSource"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.technologyCategory}
                        </Badge>
                      )}
                      {service.processCategory && (
                        <Badge
                          variant="secondary"
                          className={`${
                            service.processCategory === "Ideate"
                              ? "bg-purple-100 text-purple-800"
                              : service.processCategory === "Innovate"
                                ? "bg-blue-100 text-blue-800"
                                : service.processCategory === "Operate"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.processCategory}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Dauer</h3>
                  <p>{service.duration}</p>
                </div>

                <div>
                  <h3 className="font-medium text-lg">Im Festpreis enthalten:</h3>
                  <ul className="space-y-2 mt-2">
                    {service.included.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check size={18} className="text-green-500 mr-2 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.notIncluded && service.notIncluded.length > 0 && (
                  <div>
                    <h3 className="font-medium text-lg">Nicht enthalten:</h3>
                    <ul className="space-y-2 mt-2">
                      {service.notIncluded.map((item: string, index: number) => (
                        <li key={index} className="flex items-start text-gray-600">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-lg mb-2">Projektablauf:</h3>
                  <ol className="relative border-l border-gray-200 ml-3 space-y-6 mt-4">
                    {service.process.map((step: any, index: number) => (
                      <li key={index} className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        StarterPackage anfragen
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Anfrage für dieses StarterPackage senden</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="default" className="bg-green-600 hover:bg-green-700">
            Anfragen
          </Button>
        </CardFooter>
      </Card>
    )
  }
}
