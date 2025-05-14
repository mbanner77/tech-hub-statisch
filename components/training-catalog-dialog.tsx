"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Euro, Users, Download, Search } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

// Simplified training courses data
const trainingCourses = [
  {
    id: 1,
    title: "SAP BTP Grundlagen",
    description: "Dieser Kurs bietet eine umfassende Einführung in die SAP Business Technology Platform.",
    type: "Online-Kurs",
    duration: "4 Stunden",
    price: 490,
    category: "Grundlagen",
    level: "Anfänger",
    dates: ["15.06.2023", "22.07.2023", "10.08.2023"],
    participants: "Unbegrenzt",
    featured: true,
    image: "/images/btp-architecture.png",
  },
  {
    id: 2,
    title: "SAP CAP Entwicklung",
    description: "Hands-on Training zur Entwicklung mit dem SAP Cloud Application Programming Model.",
    type: "Workshop",
    duration: "2 Tage",
    price: 1490,
    category: "Entwicklung",
    level: "Fortgeschritten",
    dates: ["05.06.2023", "12.07.2023", "20.08.2023"],
    participants: "Max. 12",
    featured: true,
    image: "/images/cap-implementation.png",
  },
  {
    id: 3,
    title: "SAP Integration Suite",
    description: "Überblick über die Integrationsszenarien und -tools der SAP Integration Suite.",
    type: "Webinar",
    duration: "2 Stunden",
    price: 0,
    category: "Integration",
    level: "Anfänger",
    dates: ["10.06.2023", "17.07.2023", "15.08.2023"],
    participants: "Unbegrenzt",
    featured: true,
    image: "/images/integration-suite.png",
  },
  {
    id: 4,
    title: "SAP Fiori Elements",
    description: "Entwicklung von Fiori-Anwendungen mit Fiori Elements und OData-Services.",
    type: "Workshop",
    duration: "3 Tage",
    price: 1990,
    category: "Entwicklung",
    level: "Fortgeschritten",
    dates: ["20.06.2023", "25.07.2023", "22.08.2023"],
    participants: "Max. 10",
    featured: false,
    image: "/images/fiori-development.png",
  },
  {
    id: 5,
    title: "BTP Security & Compliance",
    description: "Sicherheitskonzepte und Best Practices für SAP BTP-Anwendungen.",
    type: "Workshop",
    duration: "2 Tage",
    price: 1490,
    category: "Sicherheit",
    level: "Fortgeschritten",
    dates: ["25.06.2023", "30.07.2023", "28.08.2023"],
    participants: "Max. 8",
    featured: false,
    image: "/images/btp-security.png",
  },
  {
    id: 6,
    title: "BTP Monitoring & Operations",
    description: "Überwachung und Betrieb von SAP BTP-Anwendungen.",
    type: "Online-Kurs",
    duration: "6 Stunden",
    price: 690,
    category: "Operations",
    level: "Fortgeschritten",
    dates: ["18.06.2023", "20.07.2023", "25.08.2023"],
    participants: "Max. 15",
    featured: false,
    image: "/images/btp-monitoring.png",
  },
]

interface TrainingCatalogDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function TrainingCatalogDialog({ isOpen, onClose }: TrainingCatalogDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    notes: "",
  })

  // Filter courses based on search term
  const filteredCourses = trainingCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle course selection
  const showCourseDetails = (course: any) => {
    setSelectedCourse(course)
  }

  // Handle course registration
  const startRegistration = () => {
    setIsRegistering(true)
  }

  // Close course details
  const closeCourseDetails = () => {
    setSelectedCourse(null)
    setIsRegistering(false)
    setRegistrationSuccess(false)
  }

  // Complete registration
  const completeRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setRegistrationSuccess(true)
      setRegistrationData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        notes: "",
      })
    }, 1000)
  }

  // Handle registration data changes
  const handleRegistrationDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle catalog download
  const downloadCatalog = () => {
    console.log("Katalog wird heruntergeladen...")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!selectedCourse ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Schulungskatalog</DialogTitle>
              <DialogDescription>
                Entdecken Sie unser umfangreiches Angebot an Schulungen und Workshops rund um die SAP Business
                Technology Platform.
              </DialogDescription>
            </DialogHeader>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-8"
                    placeholder="Nach Schulungen suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2" onClick={downloadCatalog}>
                  <Download className="h-4 w-4" />
                  Katalog herunterladen
                </Button>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Alle Kurse</TabsTrigger>
                  <TabsTrigger value="grundlagen">Grundlagen</TabsTrigger>
                  <TabsTrigger value="entwicklung">Entwicklung</TabsTrigger>
                  <TabsTrigger value="integration">Integration</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.map((course) => (
                      <Card
                        key={course.id}
                        className={`overflow-hidden ${course.featured ? "border-amber-400 border-2" : ""}`}
                      >
                        <div className="relative h-40 bg-gray-200">
                          {/* Replace icon with image */}
                          <Image
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">{course.title}</h3>
                          </div>

                          <div className="flex items-center mb-2">
                            <Badge variant="outline" className="bg-green-50 mr-2">
                              {course.type}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50">
                              {course.level}
                            </Badge>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
                              {course.participants}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              Nächster Termin: {course.dates[0]}
                            </div>
                            <div className="flex items-center text-sm font-medium">
                              <Euro className="h-4 w-4 mr-1" />
                              {course.price === 0 ? "Kostenlos" : `${course.price} €`}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Button size="sm" variant="outline" onClick={() => showCourseDetails(course)}>
                            Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              showCourseDetails(course)
                              startRegistration()
                            }}
                          >
                            Anmelden
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {filteredCourses.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Keine Schulungen gefunden. Bitte passen Sie Ihre Suchkriterien an.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Other tabs would have similar content */}
                <TabsContent value="grundlagen">
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Wählen Sie die Kategorie "Alle Kurse" um alle verfügbaren Kurse zu sehen.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="entwicklung">
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Wählen Sie die Kategorie "Alle Kurse" um alle verfügbaren Kurse zu sehen.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="integration">
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Wählen Sie die Kategorie "Alle Kurse" um alle verfügbaren Kurse zu sehen.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="sm" onClick={closeCourseDetails}>
                ← Zurück zur Übersicht
              </Button>
              {!isRegistering && !registrationSuccess && (
                <Button size="sm" onClick={startRegistration}>
                  Jetzt anmelden
                </Button>
              )}
            </div>

            {!isRegistering && !registrationSuccess ? (
              <div>
                <div className="relative h-48 mb-6 bg-gray-200">
                  {/* Replace icon with image */}
                  <Image
                    src={selectedCourse.image || "/placeholder.svg"}
                    alt={selectedCourse.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-50">
                    {selectedCourse.category}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    {selectedCourse.type}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50">
                    {selectedCourse.level}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Kursbeschreibung</h3>
                    <p className="text-gray-700">{selectedCourse.description}</p>
                  </div>

                  <div>
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Kursdetails</h3>

                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dauer:</span>
                            <span className="font-medium">{selectedCourse.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Teilnehmer:</span>
                            <span className="font-medium">{selectedCourse.participants}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Preis:</span>
                            <span className="font-medium">
                              {selectedCourse.price === 0 ? "Kostenlos" : `${selectedCourse.price} €`}
                            </span>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Verfügbare Termine:</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedCourse.dates.map((date: string, index: number) => (
                                <Badge key={index} variant="outline" className="bg-gray-50">
                                  {date}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button size="lg" onClick={startRegistration}>
                    Jetzt für diesen Kurs anmelden
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {!registrationSuccess ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Anmeldung für: {selectedCourse.title}</h2>

                    <form onSubmit={completeRegistration}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label htmlFor="firstName">Vorname *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={registrationData.firstName}
                            onChange={handleRegistrationDataChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nachname *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={registrationData.lastName}
                            onChange={handleRegistrationDataChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-Mail *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={registrationData.email}
                            onChange={handleRegistrationDataChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Unternehmen</Label>
                          <Input
                            id="company"
                            name="company"
                            value={registrationData.company}
                            onChange={handleRegistrationDataChange}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <Label htmlFor="notes">Anmerkungen</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={registrationData.notes}
                          onChange={handleRegistrationDataChange}
                          placeholder="Haben Sie besondere Anfragen oder Anmerkungen?"
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <h3 className="font-semibold mb-2">Kursdetails</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-500">Kurs:</span>
                            <span className="font-medium ml-2">{selectedCourse.title}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Typ:</span>
                            <span className="font-medium ml-2">{selectedCourse.type}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Dauer:</span>
                            <span className="font-medium ml-2">{selectedCourse.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Preis:</span>
                            <span className="font-medium ml-2">
                              {selectedCourse.price === 0 ? "Kostenlos" : `${selectedCourse.price} €`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={closeCourseDetails}>
                          Abbrechen
                        </Button>
                        <Button type="submit">Anmeldung absenden</Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Anmeldung erfolgreich!</h2>
                    <p className="text-gray-600 mb-6">
                      Vielen Dank für Ihre Anmeldung zum Kurs "{selectedCourse.title}". Wir haben Ihnen eine
                      Bestätigungs-E-Mail mit allen Details gesendet.
                    </p>
                    <Button onClick={closeCourseDetails}>Zurück zum Schulungskatalog</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
