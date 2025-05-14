"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, ShoppingCart, Heart, Share2, Star, CalendarIcon, Users, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultServices } from "@/data/default-data"
import ProcessView from "@/components/process-view"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import SelectedServicesDialog from "./selected-services-dialog"
import { db } from "@/lib/db"

export default function DynamicServiceGrid() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTechnologyCategory, setSelectedTechnologyCategory] = useState<string | null>(null)
  const [selectedProcessCategory, setSelectedProcessCategory] = useState<string | null>(null)
  const [isStarterPackage, setIsStarterPackage] = useState<boolean>(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [showProcessView, setShowProcessView] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [date, setDate] = useState<Date>()
  const [isSelectedServicesDialogOpen, setIsSelectedServicesDialogOpen] = useState(false)

  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log("[DYNAMIC-SERVICE-GRID] Lade Services aus der Datenbank...")
        setIsLoading(true)

        // Lade direkt aus der IndexedDB
        const dbServices = await db.services.toArray()

        if (dbServices && dbServices.length > 0) {
          console.log("[DYNAMIC-SERVICE-GRID] Services aus der Datenbank geladen:", dbServices.length)
          setServices(dbServices)
          setError(null)
        } else {
          console.log("[DYNAMIC-SERVICE-GRID] Keine Services in der Datenbank gefunden, verwende Standarddaten")
          setServices(defaultServices)
        }
      } catch (err) {
        console.error("[DYNAMIC-SERVICE-GRID] Fehler beim Laden der Services:", err)
        setServices(defaultServices)
        setError("Fehler beim Laden der Services. Standarddaten werden verwendet.")
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  // Filtere Services nach allen ausgewählten Kategorien
  const filteredServices = services.filter((service) => {
    // Prüfe Hauptkategorie
    if (selectedCategory && service.category !== selectedCategory) {
      return false
    }

    // Prüfe Technologie-Kategorie
    if (selectedTechnologyCategory && service.technologyCategory !== selectedTechnologyCategory) {
      return false
    }

    // Prüfe Prozess-Kategorie
    if (selectedProcessCategory && service.processCategory !== selectedProcessCategory) {
      return false
    }

    // Prüfe StarterPackage
    if (isStarterPackage && !service.isStarterPackage) {
      return false
    }

    return true
  })

  // Extrahiere alle eindeutigen Kategorien
  const categories = Array.from(new Set(services.map((service) => service.category)))

  // Extrahiere alle eindeutigen Technologie-Kategorien
  const technologyCategories = Array.from(
    new Set(services.map((service) => service.technologyCategory).filter(Boolean)),
  )

  // Extrahiere alle eindeutigen Prozess-Kategorien
  const processCategories = Array.from(new Set(services.map((service) => service.processCategory).filter(Boolean)))

  // Verwende die Standarddaten, wenn keine Daten geladen werden konnten
  const displayServices = services && services.length > 0 ? services : defaultServices

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Lade Services...</p>
      </div>
    )
  }

  const toggleServiceSelection = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  const toggleFavorite = (serviceId: string) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter((id) => id !== serviceId))
      toast({
        title: "Aus Favoriten entfernt",
        description: "Das Angebot wurde aus Ihren Favoriten entfernt.",
      })
    } else {
      setFavorites([...favorites, serviceId])
      toast({
        title: "Zu Favoriten hinzugefügt",
        description: "Das Angebot wurde zu Ihren Favoriten hinzugefügt.",
      })
    }
  }

  const shareService = (service) => {
    // In einer echten Anwendung würde hier die Share-API verwendet werden
    toast({
      title: "Angebot geteilt",
      description: `Der Link zum Angebot "${service.title}" wurde kopiert.`,
    })
  }

  const scheduleConsultation = (service) => {
    if (!date) {
      toast({
        title: "Bitte wählen Sie ein Datum",
        description: "Wählen Sie ein Datum für Ihre Beratung aus.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Beratungstermin geplant",
      description: `Ihr Beratungstermin für "${service.title}" am ${format(date, "dd.MM.yyyy")} wurde angefragt.`,
    })
  }

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = displayServices.find((s) => s.id === id)
    return sum + (service?.price || 0)
  }, 0)

  // Füge Empfehlungen basierend auf ausgewählten Services hinzu
  const getRecommendations = () => {
    if (selectedServices.length === 0) return []

    // Finde Services, die oft mit den ausgewählten Services zusammen gebucht werden
    const recommendedIds = displayServices
      .filter((service) => !selectedServices.includes(service.id))
      .filter((service) => {
        // Prüfe, ob dieser Service von einem ausgewählten Service abhängt
        return selectedServices.some((selectedId) => {
          const selectedService = displayServices.find((s) => s.id === selectedId)
          return selectedService?.dependencies?.includes(service.id)
        })
      })
      .slice(0, 3)
      .map((service) => service.id)

    return recommendedIds
  }

  const recommendedServices = getRecommendations()

  const handleSendRequest = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "Keine Services ausgewählt",
        description: "Bitte wählen Sie mindestens einen Service aus.",
        variant: "destructive",
      })
      return
    }
    setIsSelectedServicesDialogOpen(true)
  }

  // Funktion zum Zurücksetzen aller Filter
  const resetFilters = () => {
    setSelectedCategory(null)
    setSelectedTechnologyCategory(null)
    setSelectedProcessCategory(null)
    setIsStarterPackage(false)
  }

  return (
    <div>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">{error}</div>}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Kategorien</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="mb-2"
          >
            Alle
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">Technologie</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedTechnologyCategory === null ? "default" : "outline"}
            onClick={() => setSelectedTechnologyCategory(null)}
            className="mb-2"
          >
            Alle
          </Button>
          {["SAP", "Microsoft", "OpenSource"].map((category) => (
            <Button
              key={category}
              variant={selectedTechnologyCategory === category ? "default" : "outline"}
              onClick={() => setSelectedTechnologyCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">Prozess</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedProcessCategory === null ? "default" : "outline"}
            onClick={() => setSelectedProcessCategory(null)}
            className="mb-2"
          >
            Alle
          </Button>
          {["Operate", "Innovate", "Ideate"].map((category) => (
            <Button
              key={category}
              variant={selectedProcessCategory === category ? "default" : "outline"}
              onClick={() => setSelectedProcessCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">Pakettyp</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={!isStarterPackage ? "default" : "outline"}
            onClick={() => setIsStarterPackage(false)}
            className="mb-2"
          >
            Alle
          </Button>
          <Button
            variant={isStarterPackage ? "default" : "outline"}
            onClick={() => setIsStarterPackage(true)}
            className="mb-2"
          >
            Nur StarterPackages
          </Button>
        </div>

        {(selectedCategory !== null ||
          selectedTechnologyCategory !== null ||
          selectedProcessCategory !== null ||
          isStarterPackage) && (
          <Button variant="outline" onClick={resetFilters} className="mt-2">
            Alle Filter zurücksetzen
          </Button>
        )}
      </div>

      {selectedServices.length > 0 && (
        <div className="sticky top-0 z-10 bg-white shadow-md p-4 mb-6 rounded-lg flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="font-medium">{selectedServices.length} Angebote ausgewählt</span>
            <span className="mx-2">|</span>
            <span className="font-bold">Gesamtpreis: {totalPrice.toLocaleString("de-DE")} €</span>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button variant="outline" onClick={() => setSelectedServices([])}>
              Zurücksetzen
            </Button>
            <Button onClick={() => setShowProcessView(true)} className="bg-green-600 hover:bg-green-700">
              Prozessansicht
            </Button>
          </div>
        </div>
      )}

      {recommendedServices.length > 0 && (
        <div className="mb-8 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-3">Empfohlene Ergänzungen:</h3>
          <div className="flex flex-wrap gap-2">
            {recommendedServices.map((id) => {
              const service = displayServices.find((s) => s.id === id)
              return (
                <Badge
                  key={id}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-100 py-1.5 px-3"
                  onClick={() => toggleServiceSelection(id)}
                >
                  {service?.title} (+{service?.price.toLocaleString("de-DE")} €)
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback für Bilder, die nicht geladen werden können
                  console.error(`Fehler beim Laden des Bildes für ${service.title}:`, e)
                  e.currentTarget.src = "/placeholder.svg?key=service"
                }}
              />
              {service.featured && <Badge className="absolute top-2 right-2 bg-amber-500">Empfohlen</Badge>}
              {selectedServices.includes(service.id) && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <Check size={16} />
                </div>
              )}
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
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
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
                <div className="flex items-center text-sm text-gray-500 ml-auto">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration}</span>
                </div>
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

                  <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="included">Leistungsumfang</TabsTrigger>
                      <TabsTrigger value="process">Ablauf</TabsTrigger>
                      <TabsTrigger value="reviews">Bewertungen</TabsTrigger>
                      <TabsTrigger value="booking">Beratung buchen</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="relative h-60 w-full rounded-lg overflow-hidden">
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback für Bilder, die nicht geladen werden können
                            console.error(`Fehler beim Laden des Bildes für ${service.title}:`, e)
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
                            {service.technologies.map((tech) => (
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
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {service.technologyCategory}
                              </Badge>
                            )}
                            {service.processCategory && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
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
                    </TabsContent>

                    <TabsContent value="included">
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Im Festpreis enthalten:</h3>
                        <ul className="space-y-2">
                          {service.included.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check size={18} className="text-green-500 mr-2 mt-1 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {service.notIncluded && service.notIncluded.length > 0 && (
                          <>
                            <h3 className="font-medium text-lg mt-6">Nicht enthalten:</h3>
                            <ul className="space-y-2">
                              {service.notIncluded.map((item, index) => (
                                <li key={index} className="flex items-start text-gray-600">
                                  <span className="mr-2">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="process">
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Projektablauf:</h3>
                        <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                          {service.process.map((step, index) => (
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
                    </TabsContent>

                    <TabsContent value="reviews">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600">{service.rating || "4.8"}</div>
                            <div className="flex text-yellow-500 justify-center">
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                            </div>
                            <div className="text-sm text-gray-600 mt-1">12 Bewertungen</div>
                          </div>
                          <div className="flex-1">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="text-sm w-16">5 Sterne</div>
                                <div className="h-2 bg-gray-200 rounded-full flex-1">
                                  <div className="h-2 bg-yellow-500 rounded-full w-[85%]"></div>
                                </div>
                                <div className="text-sm w-8">85%</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm w-16">4 Sterne</div>
                                <div className="h-2 bg-gray-200 rounded-full flex-1">
                                  <div className="h-2 bg-yellow-500 rounded-full w-[10%]"></div>
                                </div>
                                <div className="text-sm w-8">10%</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm w-16">3 Sterne</div>
                                <div className="h-2 bg-gray-200 rounded-full flex-1">
                                  <div className="h-2 bg-yellow-500 rounded-full w-[5%]"></div>
                                </div>
                                <div className="text-sm w-8">5%</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm w-16">2 Sterne</div>
                                <div className="h-2 bg-gray-200 rounded-full flex-1">
                                  <div className="h-2 bg-yellow-500 rounded-full w-[0%]"></div>
                                </div>
                                <div className="text-sm w-8">0%</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm w-16">1 Stern</div>
                                <div className="h-2 bg-gray-200 rounded-full flex-1">
                                  <div className="h-2 bg-yellow-500 rounded-full w-[0%]"></div>
                                </div>
                                <div className="text-sm w-8">0%</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="border-b pb-4">
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">Max Mustermann</div>
                              <div className="text-sm text-gray-500">vor 2 Wochen</div>
                            </div>
                            <div className="flex text-yellow-500 mb-2">
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                            </div>
                            <p className="text-gray-700">
                              Hervorragende Beratung und Umsetzung. Das Team hat unsere Anforderungen perfekt verstanden
                              und eine maßgeschneiderte Lösung geliefert.
                            </p>
                          </div>
                          <div className="border-b pb-4">
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">Anna Schmidt</div>
                              <div className="text-sm text-gray-500">vor 1 Monat</div>
                            </div>
                            <div className="flex text-yellow-500 mb-2">
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <Star className="w-4 h-4 fill-yellow-500" />
                            </div>
                            <p className="text-gray-700">
                              Wir sind sehr zufrieden mit dem Ergebnis. Die Zusammenarbeit war professionell und die
                              Kommunikation transparent.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="booking" className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-lg mb-4">Beratungstermin vereinbaren</h3>
                        <p className="text-gray-600 mb-4">
                          Vereinbaren Sie einen kostenlosen 30-minütigen Beratungstermin mit einem unserer Experten, um
                          mehr über dieses Angebot zu erfahren.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Wählen Sie ein Datum</h4>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? format(date, "PPP", { locale: de }) : <span>Datum auswählen</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={de} />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Verfügbare Zeiten</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" className="justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                09:00 - 09:30
                              </Button>
                              <Button variant="outline" className="justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                10:00 - 10:30
                              </Button>
                              <Button variant="outline" className="justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                11:00 - 11:30
                              </Button>
                              <Button variant="outline" className="justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                14:00 - 14:30
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full mt-4 bg-green-600 hover:bg-green-700"
                          onClick={() => scheduleConsultation(service)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Beratungstermin vereinbaren
                        </Button>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-medium text-lg mb-2">Oder kontaktieren Sie uns direkt</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" className="flex-1">
                            <Phone className="mr-2 h-4 w-4" />
                            +49 123 456789
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Mail className="mr-2 h-4 w-4" />
                            info@realcore.de
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between mt-6">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => toggleServiceSelection(service.id)}>
                        {selectedServices.includes(service.id) ? "Abwählen" : "Auswählen"}
                      </Button>
                      <Button variant="outline" onClick={() => toggleFavorite(service.id)}>
                        <Heart
                          className={`mr-2 h-4 w-4 ${favorites.includes(service.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {favorites.includes(service.id) ? "Favorisiert" : "Favorisieren"}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => shareService(service)}>Link kopieren</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareService(service)}>Per E-Mail teilen</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Anfragen
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(service.id)}
                  className={favorites.includes(service.id) ? "text-red-500" : ""}
                >
                  <Heart className={favorites.includes(service.id) ? "fill-red-500" : ""} size={18} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleServiceSelection(service.id)}>
                  {selectedServices.includes(service.id) ? "Abwählen" : "Auswählen"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Prozessansicht Dialog */}
      <Dialog open={showProcessView} onOpenChange={setShowProcessView}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prozessansicht</DialogTitle>
            <DialogDescription>Optimale Reihenfolge Ihrer ausgewählten Beratungsangebote</DialogDescription>
          </DialogHeader>

          <ProcessView selectedServiceIds={selectedServices} services={displayServices} />

          <div className="mt-6 flex justify-between items-center">
            <div className="font-bold text-lg">Gesamtpreis: {totalPrice.toLocaleString("de-DE")} €</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "PDF generiert",
                    description: "Das Angebot wurde als PDF heruntergeladen.",
                  })
                }}
              >
                Als PDF speichern
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSendRequest}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Anfrage senden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ausgewählte Services Zusammenfassung */}
      {selectedServices.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ausgewählte Beratungsangebote</h3>
          <ul className="mb-4">
            {selectedServices.map((id) => {
              const service = displayServices.find((s) => s.id === id)
              return service ? (
                <li key={id} className="flex justify-between items-center py-2 border-b border-green-100 last:border-0">
                  <span>{service.title}</span>
                  <span className="font-semibold">{service.price.toLocaleString("de-DE")} €</span>
                </li>
              ) : null
            })}
          </ul>
          <div className="flex justify-between items-center font-semibold">
            <span>Gesamtpreis:</span>
            <span>{totalPrice.toLocaleString("de-DE")} €</span>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSendRequest}>
              Anfrage senden
            </Button>
          </div>
        </div>
      )}

      {/* Dialog für die Anfrage der ausgewählten Services */}
      <SelectedServicesDialog
        isOpen={isSelectedServicesDialogOpen}
        onClose={() => setIsSelectedServicesDialogOpen(false)}
        selectedServiceIds={selectedServices}
        services={displayServices}
        onSuccess={() => setSelectedServices([])}
      />
    </div>
  )
}
