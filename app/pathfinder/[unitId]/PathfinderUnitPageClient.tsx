"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { StickyHeader } from "@/components/sticky-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Mail,
  Phone,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Layers,
  BookOpen,
  Briefcase,
  LayoutGrid,
  MapPin,
  Clock,
  Share2,
  GraduationCap,
  Award,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { pathfinderUnits } from "../pathfinder-units"

export default function PathfinderUnitPageClient() {
  const router = useRouter()
  const { unitId } = useParams() as { unitId: string }
  const [activeTab, setActiveTab] = useState("overview")
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState<any>(null)
  const [isExpertDetailOpen, setIsExpertDetailOpen] = useState(false)
  const [unit, setUnit] = useState<any>(null)

  useEffect(() => {
    const currentUnit = pathfinderUnits.find((u) => u.id === unitId)
    if (currentUnit) {
      setUnit(currentUnit)
    } else {
      router.push("/pathfinder")
    }
  }, [unitId, router])

  if (!unit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-2xl">Lade Inhalte...</div>
      </div>
    )
  }

  const nextUnit = pathfinderUnits[(pathfinderUnits.findIndex((u) => u.id === unitId) + 1) % pathfinderUnits.length]
  const prevUnit =
    pathfinderUnits[
      (pathfinderUnits.findIndex((u) => u.id === unitId) - 1 + pathfinderUnits.length) % pathfinderUnits.length
    ]

  const handleUnitChange = (value: string) => {
    router.push(`/pathfinder/${value}`)
  }

  const handleExpertClick = (expert: any) => {
    setSelectedExpert(expert)
    setIsExpertDetailOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StickyHeader />

      <main className="flex-grow pt-24">
        {/* Unit Navigation */}
        <div className="container mx-auto px-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/pathfinder" className="text-sm text-gray-500 hover:text-gray-700">
                Pathfinder
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{unit.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/pathfinder">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Alle Units anzeigen
                </Link>
              </Button>
              <div className="w-full sm:w-auto">
                <Select value={unitId} onValueChange={handleUnitChange}>
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Wähle eine Pathfinder Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {pathfinderUnits.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className={`bg-gradient-to-r ${unit.gradient} text-white py-12 md:py-16 relative overflow-hidden`}>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('${unit.backgroundPattern}')`,
              backgroundSize: "cover",
              backgroundRepeat: "repeat",
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{unit.title}</h1>
                  <p className="text-xl md:text-2xl opacity-90">{unit.shortDescription || unit.subtitle}</p>
                </div>
                <p className="text-lg opacity-80">{unit.description}</p>
                <div className="flex flex-wrap gap-2">
                  {unit.technologies &&
                    unit.technologies.slice(0, 4).map((tech: any) => (
                      <Badge
                        key={typeof tech === "string" ? tech : tech.id}
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        {typeof tech === "string" ? tech : tech.name}
                      </Badge>
                    ))}
                  {unit.technologies && unit.technologies.length > 4 && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white">
                      +{unit.technologies.length - 4} weitere
                    </Badge>
                  )}
                </div>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Button onClick={() => setIsContactOpen(true)} className="bg-white text-gray-900 hover:bg-gray-100">
                    Kontakt aufnehmen
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    Workshop buchen
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="relative w-full h-[300px] md:h-[400px]">
                  <Image
                    src={unit.heroImage || `/images/pathfinder-${unit.id}.png`}
                    alt={unit.title}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(unit.title)}`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        {unit.quote && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <blockquote className="text-center">
                <p className="text-xl md:text-2xl font-medium italic text-gray-700 max-w-4xl mx-auto">"{unit.quote}"</p>
              </blockquote>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="approach">Vorgehen</TabsTrigger>
                <TabsTrigger value="case-studies">Fallstudien</TabsTrigger>
                <TabsTrigger value="resources">Ressourcen</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-12 animate-in fade-in-50 duration-300">
                {/* Benefits and Challenges */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Benefits */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
                      Ihre Vorteile
                    </h2>
                    <div className="space-y-4">
                      {unit.benefits &&
                        unit.benefits.map((benefit: any, index: number) => (
                          <Card key={index} className="overflow-hidden">
                            <div className={`h-1 ${benefit.colorClass}`} />
                            <CardContent className="p-5">
                              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                              <p className="text-gray-600 mb-3">{benefit.description}</p>
                              {benefit.outcome && (
                                <div
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${benefit.colorClass}`}
                                >
                                  {benefit.outcome}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <AlertCircle className="mr-2 h-6 w-6 text-amber-500" />
                      Herausforderungen
                    </h2>
                    <div className="space-y-4">
                      {unit.challenges &&
                        unit.challenges.map((challenge: any, index: number) => (
                          <Card key={index}>
                            <CardContent className="p-5">
                              <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                              <p className="text-gray-600">{challenge.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Expertise Areas */}
                {unit.expertiseAreas && unit.expertiseAreas.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Lightbulb className="mr-2 h-6 w-6 text-blue-500" />
                      Unsere Expertise
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {unit.expertiseAreas.map((area: any, index: number) => (
                        <Card key={index} className="overflow-hidden">
                          <div className={`h-1 ${area.colorClass}`} />
                          <CardContent className="p-5">
                            <h3 className="text-lg font-semibold mb-2">{area.name}</h3>
                            <p className="text-gray-600">{area.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application Areas */}
                {unit.applicationAreas && unit.applicationAreas.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Layers className="mr-2 h-6 w-6 text-indigo-500" />
                      Anwendungsbereiche
                    </h2>
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <ul className="space-y-3">
                              {unit.applicationAreas
                                .slice(0, Math.ceil(unit.applicationAreas.length / 2))
                                .map((area: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <div
                                      className={`h-5 w-5 rounded-full ${unit.gradient.split(" ")[0]} flex-shrink-0 mt-1 mr-3`}
                                    />
                                    <span>{area}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                          <div>
                            <ul className="space-y-3">
                              {unit.applicationAreas
                                .slice(Math.ceil(unit.applicationAreas.length / 2))
                                .map((area: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <div
                                      className={`h-5 w-5 rounded-full ${unit.gradient.split(" ")[1]} flex-shrink-0 mt-1 mr-3`}
                                    />
                                    <span>{area}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Key Technologies */}
                {unit.keyTechnologies && unit.keyTechnologies.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <BookOpen className="mr-2 h-6 w-6 text-purple-500" />
                      Schlüsseltechnologien
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {unit.keyTechnologies.map((tech: any, index: number) => (
                        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-5 flex flex-col items-center text-center">
                            <div
                              className={`w-16 h-16 rounded-full ${tech.bgClass} flex items-center justify-center mb-4`}
                            >
                              {tech.icon ? (
                                <Image
                                  src={tech.icon || "/placeholder.svg"}
                                  alt={tech.name}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(tech.name)}`
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                              )}
                            </div>
                            <h3 className="font-semibold">{tech.name}</h3>
                            <p className="text-sm text-gray-500">{tech.category}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experts */}
                {unit.experts && unit.experts.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Users className="mr-2 h-6 w-6 text-cyan-500" />
                      Unsere Experten
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {unit.experts.map((expert: any, index: number) => (
                        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-64">
                            {expert.image ? (
                              <Image
                                src={expert.image || "/placeholder.svg"}
                                alt={expert.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `/placeholder.svg?height=300&width=300&query=professional+portrait`
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Kein Bild verfügbar</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-5">
                            <h3 className="text-xl font-bold mb-1">{expert.name}</h3>
                            <p className="text-gray-600 mb-3">{expert.role}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {expert.expertise &&
                                expert.expertise.slice(0, 3).map((item: string) => (
                                  <Badge key={item} variant="outline">
                                    {item}
                                  </Badge>
                                ))}
                              {expert.expertise && expert.expertise.length > 3 && (
                                <Badge variant="outline">+{expert.expertise.length - 3}</Badge>
                              )}
                            </div>
                            {(expert.experience || expert.certifications) && (
                              <div className="space-y-2 mb-4">
                                {expert.experience && (
                                  <p className="text-sm">
                                    <span className="font-medium">Erfahrung:</span> {expert.experience}
                                  </p>
                                )}
                                {expert.certifications && (
                                  <p className="text-sm">
                                    <span className="font-medium">Zertifizierungen:</span> {expert.certifications}
                                  </p>
                                )}
                              </div>
                            )}
                            <Button
                              onClick={() => handleExpertClick(expert)}
                              className={`w-full bg-gradient-to-r ${unit.gradient} text-white hover:opacity-90`}
                            >
                              Profil anzeigen
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workshops, Events und Schulungen */}
                {(unit.workshops?.length > 0 || unit.events?.length > 0 || unit.trainings?.length > 0) && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Calendar className="mr-2 h-6 w-6 text-emerald-500" />
                      Workshops, Events & Schulungen
                    </h2>

                    {/* Workshops */}
                    {unit.workshops && unit.workshops.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Workshops</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          {unit.workshops.map((workshop: any, index: number) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="text-lg font-semibold">{workshop.title}</h4>
                                  {workshop.isNew && <Badge className="bg-green-500 hover:bg-green-600">Neu</Badge>}
                                </div>
                                <div className="space-y-2 text-gray-600 mb-4">
                                  <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Dauer:</span> {workshop.duration}
                                  </p>
                                  <p className="flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Zielgruppe:</span> {workshop.audience}
                                  </p>
                                  {workshop.nextDate && (
                                    <p className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="font-medium">Nächster Termin:</span> {workshop.nextDate}
                                    </p>
                                  )}
                                  {workshop.location && (
                                    <p className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="font-medium">Ort:</span> {workshop.location}
                                    </p>
                                  )}
                                </div>
                                <Button variant="outline" className="w-full">
                                  Workshop buchen
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Events */}
                    {unit.events && unit.events.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Events</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {unit.events.map((event: any, index: number) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="text-lg font-semibold">{event.title}</h4>
                                  {event.isUpcoming && (
                                    <Badge className="bg-blue-500 hover:bg-blue-600">Demnächst</Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{event.description}</p>
                                <div className="space-y-2 text-gray-600 mb-4">
                                  <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Datum:</span> {event.date}
                                  </p>
                                  <p className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Uhrzeit:</span> {event.time}
                                  </p>
                                  <p className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Ort:</span> {event.location}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" className="flex-1">
                                    Anmelden
                                  </Button>
                                  <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Schulungen */}
                    {unit.trainings && unit.trainings.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Schulungen</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {unit.trainings.map((training: any, index: number) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-5">
                                <h4 className="text-lg font-semibold mb-2">{training.title}</h4>
                                <p className="text-gray-600 mb-3">{training.description}</p>
                                <div className="space-y-2 text-gray-600 mb-4">
                                  <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Dauer:</span> {training.duration}
                                  </p>
                                  <p className="flex items-center">
                                    <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Level:</span> {training.level}
                                  </p>
                                  <p className="flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Zielgruppe:</span> {training.audience}
                                  </p>
                                  {training.certification && (
                                    <p className="flex items-center">
                                      <Award className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="font-medium">Zertifizierung:</span>{" "}
                                      {training.certification ? "Ja" : "Nein"}
                                    </p>
                                  )}
                                </div>
                                <Button variant="outline" className="w-full">
                                  Mehr erfahren
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Value Creation */}
                {unit.valueCreation && unit.valueCreation.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Briefcase className="mr-2 h-6 w-6 text-blue-500" />
                      Unser Wertschöpfungsprozess
                    </h2>
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 hidden md:block" />
                      <div className="grid md:grid-cols-3 gap-6 relative z-10">
                        {unit.valueCreation.map((step: any, index: number) => (
                          <Card key={index} className="overflow-hidden">
                            <div className={`h-1 ${step.bgClass}`} />
                            <CardContent className="p-5">
                              <div
                                className={`w-10 h-10 rounded-full ${step.bgClass} text-white flex items-center justify-center font-bold mb-4`}
                              >
                                {index + 1}
                              </div>
                              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                              <p className="text-gray-600">{step.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Services */}
                {unit.relatedServices && unit.relatedServices.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Verwandte Services</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                      {unit.relatedServices.map((service: any, index: number) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5 flex flex-col items-center text-center">
                            <div
                              className={`w-16 h-16 rounded-full ${service.bgClass} flex items-center justify-center mb-4`}
                            >
                              {service.icon ? (
                                <Image
                                  src={service.icon || "/placeholder.svg"}
                                  alt={service.name}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(service.name)}`
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                              )}
                            </div>
                            <h3 className="font-semibold mb-2">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Approach Tab */}
              <TabsContent value="approach" className="space-y-12 animate-in fade-in-50 duration-300">
                {unit.approach && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Unser Vorgehen</h2>
                      <p className="text-lg text-gray-700 mb-8">{unit.approach.description}</p>

                      <div className="space-y-8">
                        {unit.approach.phases &&
                          unit.approach.phases.map((phase: any, index: number) => (
                            <Card key={index} className="overflow-hidden">
                              <div className={`h-1 bg-gradient-to-r ${unit.gradient}`} />
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                  <div className="md:w-1/3">
                                    <div
                                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${unit.gradient} text-white flex items-center justify-center font-bold text-xl mb-4`}
                                    >
                                      {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                                    <p className="text-gray-600">{phase.description}</p>
                                  </div>
                                  <div className="md:w-2/3 grid md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-semibold mb-3 flex items-center">
                                        <Layers className="mr-2 h-5 w-5 text-blue-500" />
                                        Aktivitäten
                                      </h4>
                                      <ul className="space-y-2">
                                        {phase.activities &&
                                          phase.activities.map((activity: string, i: number) => (
                                            <li key={i} className="flex items-start">
                                              <div
                                                className={`h-5 w-5 rounded-full bg-gradient-to-r ${unit.gradient} flex-shrink-0 mt-0.5 mr-2 flex items-center justify-center`}
                                              >
                                                <span className="text-white text-xs font-bold">{i + 1}</span>
                                              </div>
                                              <span>{activity}</span>
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-3 flex items-center">
                                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                                        Ergebnisse
                                      </h4>
                                      <ul className="space-y-2">
                                        {phase.outcomes &&
                                          phase.outcomes.map((outcome: string, i: number) => (
                                            <li key={i} className="flex items-start">
                                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                                              <span>{outcome}</span>
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Möchten Sie mehr über unser Vorgehen erfahren?</h3>
                      <p className="text-gray-600 mb-6">
                        Wir bieten kostenlose Beratungsgespräche an, in denen wir Ihnen unser Vorgehen im Detail
                        erläutern und auf Ihre spezifischen Anforderungen eingehen.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button className={`bg-gradient-to-r ${unit.gradient} text-white hover:opacity-90`}>
                          Beratungsgespräch vereinbaren
                        </Button>
                        <Button variant="outline">Weitere Informationen anfordern</Button>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Case Studies Tab */}
              <TabsContent value="case-studies" className="space-y-12 animate-in fade-in-50 duration-300">
                {unit.caseStudies && unit.caseStudies.length > 0 ? (
                  <div className="space-y-12">
                    {unit.caseStudies.map((caseStudy: any, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="grid md:grid-cols-2">
                          <div className="relative h-64 md:h-auto">
                            {caseStudy.image ? (
                              <Image
                                src={caseStudy.image || "/placeholder.svg"}
                                alt={caseStudy.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(caseStudy.title)}`
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Kein Bild verfügbar</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6 md:p-8">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline">{caseStudy.industry}</Badge>
                              {caseStudy.tags &&
                                caseStudy.tags.map((tag: string) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{caseStudy.title}</h3>
                            <div className="flex items-center mb-4">
                              <div className="flex items-center">
                                {caseStudy.clientLogo ? (
                                  <div className="relative w-8 h-8 mr-2">
                                    <Image
                                      src={caseStudy.clientLogo || "/placeholder.svg"}
                                      alt={caseStudy.client}
                                      fill
                                      className="object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(caseStudy.client)}`
                                      }}
                                    />
                                  </div>
                                ) : null}
                                <span className="font-medium">{caseStudy.client}</span>
                              </div>
                              <span className="mx-2">•</span>
                              <span>{caseStudy.location}</span>
                            </div>
                            <p className="text-gray-600 mb-6">{caseStudy.summary}</p>
                            <div className="space-y-4 mb-6">
                              <div>
                                <h4 className="font-semibold text-gray-900">Herausforderung:</h4>
                                <p className="text-gray-600">{caseStudy.challenge}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Lösung:</h4>
                                <p className="text-gray-600">{caseStudy.solution}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Ergebnisse:</h4>
                                <p className="text-gray-600">{caseStudy.results}</p>
                              </div>
                            </div>
                            <Button className={`bg-gradient-to-r ${unit.gradient} text-white hover:opacity-90`}>
                              Fallstudie lesen
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Keine Fallstudien verfügbar</p>
                  </div>
                )}
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-12 animate-in fade-in-50 duration-300">
                {unit.resources && unit.resources.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <FileText className="mr-2 h-6 w-6 text-blue-500" />
                      Ressourcen & Downloads
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {unit.resources.map((resource: any, index: number) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start">
                              <div
                                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${unit.gradient} text-white flex items-center justify-center mr-4 flex-shrink-0`}
                              >
                                <FileText className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={() => window.open(resource.url, "_blank")}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Keine Ressourcen verfügbar</p>
                  </div>
                )}

                {/* Downloads */}
                {unit.downloads && unit.downloads.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Weitere Downloads</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {unit.downloads.map((download: any, index: number) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold mb-1">{download.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {download.format} • {download.size}
                                </p>
                              </div>
                              <Button size="icon" variant="ghost">
                                <Download className="h-5 w-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Navigation to other units */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Entdecken Sie weitere Pathfinder Units</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Link href={`/pathfinder/${prevUnit.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow cursor-pointer">
                  <div className={`h-2 bg-gradient-to-r ${prevUnit.gradient}`} />
                  <CardContent className="p-6 flex items-center">
                    <ChevronLeft className="h-6 w-6 mr-4" />
                    <div>
                      <h3 className="font-semibold">{prevUnit.title}</h3>
                      <p className="text-sm text-gray-600">{prevUnit.shortDescription || prevUnit.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href={`/pathfinder/${nextUnit.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow cursor-pointer">
                  <div className={`h-2 bg-gradient-to-r ${nextUnit.gradient}`} />
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{nextUnit.title}</h3>
                      <p className="text-sm text-gray-600">{nextUnit.shortDescription || nextUnit.subtitle}</p>
                    </div>
                    <ChevronRight className="h-6 w-6 ml-4" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-16 bg-gradient-to-r ${unit.gradient} text-white`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Bereit für den nächsten Schritt?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und erfahren Sie, wie wir Ihnen helfen
              können.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => setIsContactOpen(true)}
                className="bg-white text-gray-900 hover:bg-gray-100"
                size="lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Kontakt aufnehmen
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20" size="lg">
                <Phone className="mr-2 h-5 w-5" />
                +49 123 456789
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
