"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Linkedin, FileText, LucideAward, BookOpen, Clock, MapPin, Phone } from "lucide-react"

interface ExpertDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  expert: Expert | null
}

interface Expert {
  name: string
  role: string
  image: string
  expertise: string[]
  experience: string
  certifications: string
  bio?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  languages?: string[]
  education?: Education[]
  projects?: Project[]
  publications?: Publication[]
  speakingEngagements?: SpeakingEngagement[]
  awards?: Award[]
}

interface Education {
  degree: string
  institution: string
  year: string
}

interface Project {
  title: string
  client: string
  description: string
  technologies: string[]
  year: string
}

interface Publication {
  title: string
  publisher: string
  year: string
  link?: string
}

interface SpeakingEngagement {
  title: string
  event: string
  location: string
  date: string
}

interface Award {
  title: string
  organization: string
  year: string
}

export function ExpertDetailDialog({ isOpen, onClose, expert }: ExpertDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("about")

  if (!expert) return null

  // Beispielhafte Erweiterung der Expertendaten für die Detailansicht
  const extendedExpert: Expert = {
    ...expert,
    bio:
      expert.bio ||
      `${expert.name} ist ein erfahrener Experte im Bereich ${
        expert.expertise[0]
      } mit umfassender Erfahrung in der Beratung und Implementierung von Lösungen für Unternehmen verschiedener Größen und Branchen. Mit ${
        expert.experience.split("+")[0]
      }+ Jahren Erfahrung hat ${expert.name.split(" ")[0]} zahlreiche Projekte erfolgreich geleitet und Kunden bei der digitalen Transformation unterstützt.`,
    email: expert.email || `${expert.name.toLowerCase().replace(/\s+/g, ".")}@realcore.de`,
    phone: expert.phone || "+49 (0) 123 456789",
    location: expert.location || "München, Deutschland",
    linkedin: expert.linkedin || `https://www.linkedin.com/in/${expert.name.toLowerCase().replace(/\s+/g, "-")}/`,
    languages: expert.languages || ["Deutsch (Muttersprache)", "Englisch (Fließend)", "Französisch (Grundkenntnisse)"],
    education: expert.education || [
      {
        degree: "Master of Science in Wirtschaftsinformatik",
        institution: "Technische Universität München",
        year: "2008",
      },
      {
        degree: "Bachelor of Science in Informatik",
        institution: "Ludwig-Maximilians-Universität München",
        year: "2006",
      },
    ],
    projects: expert.projects || [
      {
        title: "S/4HANA Transformation",
        client: "Automobilhersteller",
        description:
          "Leitung der S/4HANA Migration mit Clean Core Ansatz und Implementierung von BTP-Erweiterungen für spezifische Anforderungen.",
        technologies: ["SAP S/4HANA", "SAP BTP", "SAP Fiori", "ABAP"],
        year: "2022",
      },
      {
        title: "Digitale Plattform für IoT-Daten",
        client: "Maschinenbauunternehmen",
        description:
          "Konzeption und Implementierung einer Plattform zur Erfassung und Analyse von IoT-Daten aus Produktionsanlagen.",
        technologies: ["SAP BTP", "SAP HANA", "SAP Analytics Cloud", "IoT"],
        year: "2021",
      },
      {
        title: "API-Management-Strategie",
        client: "Logistikunternehmen",
        description:
          "Entwicklung einer API-First-Strategie und Implementierung einer zentralen API-Plattform für die Integration mit Kunden und Partnern.",
        technologies: ["SAP Integration Suite", "SAP API Management", "REST APIs", "OAuth"],
        year: "2020",
      },
    ],
    publications: expert.publications || [
      {
        title: "Clean Core: Der Weg zu einem zukunftssicheren SAP S/4HANA",
        publisher: "SAP PRESS",
        year: "2022",
        link: "#",
      },
      {
        title: "Best Practices für die BTP-Integration in SAP-Landschaften",
        publisher: "Computerwoche",
        year: "2021",
        link: "#",
      },
    ],
    speakingEngagements: expert.speakingEngagements || [
      {
        title: "Die Zukunft der SAP-Landschaft: Clean Core und BTP",
        event: "DSAG Technologietage",
        location: "Bonn, Deutschland",
        date: "Mai 2023",
      },
      {
        title: "API-First: Der Schlüssel zur digitalen Transformation",
        event: "SAP TechEd",
        location: "Barcelona, Spanien",
        date: "November 2022",
      },
    ],
    awards: expert.awards || [
      {
        title: "SAP Mentor",
        organization: "SAP",
        year: "2021",
      },
      {
        title: "Digital Transformation Leader",
        organization: "IDG",
        year: "2020",
      },
    ],
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Experten-Profil</DialogTitle>
          <DialogDescription>Detaillierte Informationen zu unserem Experten</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Linke Spalte - Profilbild und Kontaktdaten */}
          <div className="space-y-4">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={extendedExpert.image || "/placeholder.svg"}
                alt={extendedExpert.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=400&width=400&query=professional+headshot`
                }}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">{extendedExpert.name}</h2>
              <p className="text-gray-600">{extendedExpert.role}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <a href={`mailto:${extendedExpert.email}`} className="text-blue-600 hover:underline">
                  {extendedExpert.email}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{extendedExpert.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{extendedExpert.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Linkedin className="h-4 w-4 mr-2 text-gray-500" />
                <a
                  href={extendedExpert.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn Profil
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Sprachen</h3>
              <div className="flex flex-wrap gap-2">
                {extendedExpert.languages?.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {extendedExpert.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full bg-amber-500 hover:bg-amber-600">
              <Calendar className="h-4 w-4 mr-2" />
              Termin vereinbaren
            </Button>
          </div>

          {/* Rechte Spalte - Tabs mit Details */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="about">Über mich</TabsTrigger>
                <TabsTrigger value="projects">Projekte</TabsTrigger>
                <TabsTrigger value="publications">Publikationen</TabsTrigger>
                <TabsTrigger value="speaking">Vorträge</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Biografie</h3>
                  <p className="text-gray-700">{extendedExpert.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Erfahrung</h3>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-500" />
                    <span>{extendedExpert.experience}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Zertifizierungen</h3>
                  <div className="flex items-center">
                    <LucideAward className="h-5 w-5 mr-2 text-amber-500" />
                    <span>{extendedExpert.certifications}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Ausbildung</h3>
                  <div className="space-y-2">
                    {extendedExpert.education?.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <BookOpen className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-gray-600">
                            {edu.institution}, {edu.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Auszeichnungen</h3>
                  <div className="space-y-2">
                    {extendedExpert.awards?.map((award, index) => (
                      <div key={index} className="flex items-start">
                        <LucideAward className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{award.title}</p>
                          <p className="text-sm text-gray-600">
                            {award.organization}, {award.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Ausgewählte Projekte</h3>
                <div className="grid grid-cols-1 gap-4">
                  {extendedExpert.projects?.map((project, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{project.title}</h4>
                          <Badge variant="outline">{project.year}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Kunde:</span> {project.client}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="publications" className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Publikationen</h3>
                <div className="grid grid-cols-1 gap-4">
                  {extendedExpert.publications?.map((pub, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{pub.title}</h4>
                          <Badge variant="outline">{pub.year}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Veröffentlicht bei:</span> {pub.publisher}
                        </p>
                        {pub.link && (
                          <Button variant="link" className="p-0 h-auto text-blue-600" asChild>
                            <a href={pub.link} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-1" />
                              Publikation lesen
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="speaking" className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Vorträge & Konferenzen</h3>
                <div className="grid grid-cols-1 gap-4">
                  {extendedExpert.speakingEngagements?.map((engagement, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{engagement.title}</h4>
                          <Badge variant="outline">{engagement.date}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Event:</span> {engagement.event}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Ort:</span> {engagement.location}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Mail className="h-4 w-4 mr-2" />
            Kontakt aufnehmen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Füge einen benannten Export hinzu
export { ExpertDetailDialog as default }
