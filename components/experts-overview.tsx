"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Mail, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ExpertDetailDialog } from "@/components/expert-detail-dialog"

// Beispielhafte Expertendaten
const experts = [
  {
    id: "1",
    name: "Thomas Müller",
    role: "SAP BTP Architekt",
    image: "/images/expert-thomas-mueller.jpg",
    expertise: ["SAP BTP", "Cloud Architecture", "Integration"],
    experience: "15+ Jahre",
    certifications: "SAP Certified Development Associate - ABAP, SAP Certified Technology Associate - SAP HANA",
  },
  {
    id: "2",
    name: "Sarah Schmidt",
    role: "UX/UI Design Spezialistin",
    image: "/images/expert-sarah-schmidt.jpg",
    expertise: ["SAP Fiori", "UI5", "UX Design"],
    experience: "10+ Jahre",
    certifications: "SAP Certified Application Associate - SAP Fiori",
  },
  {
    id: "3",
    name: "Michael Weber",
    role: "SAP S/4HANA Berater",
    image: "/images/expert-michael-weber.jpg",
    expertise: ["SAP S/4HANA", "Business Process", "Migration"],
    experience: "12+ Jahre",
    certifications: "SAP Certified Application Associate - SAP S/4HANA",
  },
  {
    id: "4",
    name: "Andreas Hoffmann",
    role: "Integration Spezialist",
    image: "/images/expert-andreas-hoffmann.jpg",
    expertise: ["SAP Integration Suite", "API Management", "Event Mesh"],
    experience: "8+ Jahre",
    certifications: "SAP Certified Development Specialist - SAP Integration Suite",
  },
  {
    id: "5",
    name: "Julia Becker",
    role: "CAP Development Lead",
    image: "/professional-female-headshot.png",
    expertise: ["CAP", "Node.js", "HANA"],
    experience: "7+ Jahre",
    certifications: "SAP Certified Development Associate - SAP Cloud Application Programming Model",
  },
  {
    id: "6",
    name: "Markus Schneider",
    role: "DevOps Experte",
    image: "/professional-male-headshot.png",
    expertise: ["CI/CD", "Kubernetes", "Cloud Foundry"],
    experience: "9+ Jahre",
    certifications: "SAP Certified Development Associate - SAP Cloud Platform",
  },
]

// Alle Expertise-Bereiche für Filter
const allExpertiseAreas = Array.from(new Set(experts.flatMap((expert) => expert.expertise))).sort()

export default function ExpertsOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])
  const [selectedExpert, setSelectedExpert] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter-Logik
  const filteredExperts = experts.filter((expert) => {
    const matchesSearch =
      searchTerm === "" ||
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesExpertise =
      selectedExpertise.length === 0 || expert.expertise.some((skill) => selectedExpertise.includes(skill))

    return matchesSearch && matchesExpertise
  })

  // Toggle Expertise-Filter
  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise) ? prev.filter((item) => item !== expertise) : [...prev, expertise],
    )
  }

  // Experten-Detail anzeigen
  const showExpertDetail = (expert: any) => {
    setSelectedExpert(expert)
    setIsDetailOpen(true)
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Unsere Experten</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lernen Sie unsere erfahrenen Experten kennen, die Sie bei Ihren SAP BTP-Projekten unterstützen können. Jeder
            Experte bringt spezialisiertes Wissen und umfangreiche Erfahrung mit.
          </p>
        </div>

        {/* Filter und Suche */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Nach Namen, Rolle oder Expertise suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {selectedExpertise.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedExpertise.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Optionen</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <h3 className="text-sm font-medium mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {allExpertiseAreas.map((expertise) => (
                    <Badge
                      key={expertise}
                      variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleExpertise(expertise)}
                    >
                      {expertise}
                      {selectedExpertise.includes(expertise) && (
                        <X
                          className="ml-1 h-3 w-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpertise(expertise)
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedExpertise.length > 0 && (
                <Button variant="outline" className="mt-2" onClick={() => setSelectedExpertise([])}>
                  Filter zurücksetzen
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Experten-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={expert.image || "/placeholder.svg"}
                      alt={expert.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=400&width=400&query=professional+headshot`
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{expert.name}</h3>
                    <p className="text-gray-600 mb-3">{expert.role}</p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {expert.expertise.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Erfahrung:</span> {expert.experience}
                        </p>
                        <p>
                          <span className="font-medium">Zertifizierungen:</span> {expert.certifications}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        className="flex-1 bg-amber-500 hover:bg-amber-600"
                        onClick={() => showExpertDetail(expert)}
                      >
                        Profil ansehen
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <a href={`mailto:${expert.name.toLowerCase().replace(/\s+/g, ".")}@realcore.de`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Kontakt
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 mb-4">Keine Experten gefunden, die Ihren Filterkriterien entsprechen.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedExpertise([])
                }}
              >
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </div>

        {/* Experten-Detail-Dialog */}
        <ExpertDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} expert={selectedExpert} />
      </div>
    </section>
  )
}
