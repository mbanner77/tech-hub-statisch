"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  Code,
  FileText,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PathfinderUnitNavigation } from "./pathfinder-unit-navigation"
import { ExpertDetailDialog } from "./expert-detail-dialog"
import { LearnMoreDialog } from "./learn-more-dialog"
import { ContactDialog } from "./contact-dialog"
import { WorkshopBookingDialog } from "./workshop-booking-dialog"
import { cn } from "@/lib/utils"

interface PathfinderUnitDetailProps {
  unit: any
  relatedUnits: any[]
}

export function PathfinderUnitDetail({ unit, relatedUnits }: PathfinderUnitDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    benefits: true,
    challenges: false,
    technologies: false,
    experts: true,
    caseStudies: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={unit.heroImage || `/images/pathfinder-${unit.id}.png`}
            alt={unit.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              Pathfinder Unit
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{unit.title}</h1>
            <p className="text-lg text-white/80 mb-6 max-w-3xl">{unit.description}</p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Button className="bg-white text-blue-900 hover:bg-white/90">
                <Calendar className="mr-2 h-4 w-4" />
                Workshop buchen
              </Button>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <FileText className="mr-2 h-4 w-4" />
                Whitepaper
              </Button>
              <ContactDialog>
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  Kontakt aufnehmen
                </Button>
              </ContactDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-8">
        <PathfinderUnitNavigation currentUnitId={unit.id} className="flex-1" />
        <Button variant="outline" size="sm" asChild>
          <Link href="/pathfinder">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Alle Units anzeigen
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="approach">Vorgehen</TabsTrigger>
            <TabsTrigger value="resources">Ressourcen</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Benefits Section */}
            <motion.section
              initial="hidden"
              animate={expandedSections.benefits ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("benefits")}
              >
                <h2 className="text-2xl font-semibold">Vorteile & Nutzen</h2>
                {expandedSections.benefits ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>

              {expandedSections.benefits && (
                <div className="grid md:grid-cols-2 gap-6">
                  {unit.benefits.map((benefit: any, index: number) => (
                    <Card
                      key={index}
                      className="overflow-hidden border-l-4"
                      style={{ borderLeftColor: unit.color || "#3b82f6" }}
                    >
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.section>

            <Separator />

            {/* Challenges Section */}
            <motion.section
              initial="hidden"
              animate={expandedSections.challenges ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("challenges")}
              >
                <h2 className="text-2xl font-semibold">Herausforderungen</h2>
                {expandedSections.challenges ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>

              {expandedSections.challenges && (
                <div className="space-y-4">
                  {unit.challenges.map((challenge: any, index: number) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <p className="text-gray-600">{challenge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            <Separator />

            {/* Technologies Section */}
            <motion.section
              initial="hidden"
              animate={expandedSections.technologies ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("technologies")}
              >
                <h2 className="text-2xl font-semibold">Relevante Technologien</h2>
                {expandedSections.technologies ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>

              {expandedSections.technologies && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unit.technologies.map((tech: any, index: number) => (
                    <Link href={`/btp-services#${tech.id}`} key={index} className="group">
                      <Card className="h-full transition-all group-hover:shadow-md group-hover:border-blue-300">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="w-12 h-12 relative mb-3">
                            <Image
                              src={tech.icon || `/images/btp-services/${tech.id}.png`}
                              alt={tech.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <h3 className="font-medium text-sm group-hover:text-blue-600">{tech.name}</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </motion.section>

            <Separator />

            {/* Experts Section */}
            <motion.section
              initial="hidden"
              animate={expandedSections.experts ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("experts")}
              >
                <h2 className="text-2xl font-semibold">Unsere Experten</h2>
                {expandedSections.experts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>

              {expandedSections.experts && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unit.experts.map((expert: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-[3/2] relative">
                        <Image
                          src={expert.image || `/professional-male-cloud-architect.png`}
                          alt={expert.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{expert.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{expert.role}</p>
                        <ExpertDetailDialog expert={expert}>
                          <Button variant="outline" size="sm" className="w-full">
                            Profil ansehen
                          </Button>
                        </ExpertDetailDialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.section>

            <Separator />

            {/* Case Studies Section */}
            <motion.section
              initial="hidden"
              animate={expandedSections.caseStudies ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("caseStudies")}
              >
                <h2 className="text-2xl font-semibold">Erfolgsgeschichten</h2>
                {expandedSections.caseStudies ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>

              {expandedSections.caseStudies && (
                <div className="space-y-6">
                  {unit.caseStudies.map((caseStudy: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 relative">
                          <div className="aspect-video md:h-full relative">
                            <Image
                              src={caseStudy.image || `/images/case-study-automotive.png`}
                              alt={caseStudy.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <CardContent className="p-6 md:w-2/3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 relative">
                              <Image
                                src={caseStudy.logo || `/images/logo-automotive-gmbh.png`}
                                alt={caseStudy.company}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-sm text-gray-600">{caseStudy.company}</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{caseStudy.title}</h3>
                          <p className="text-gray-600 mb-4">{caseStudy.summary}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {caseStudy.tags.map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <LearnMoreDialog title={caseStudy.title} content={caseStudy.details}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <span>Mehr erfahren</span>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </LearnMoreDialog>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.section>
          </TabsContent>

          {/* Approach Tab */}
          <TabsContent value="approach" className="space-y-8">
            <div className="prose max-w-none">
              <h2>Unser Vorgehen</h2>
              <p>
                {unit.approach?.description ||
                  "Unser strukturierter Ansatz hilft Ihnen, die Transformation erfolgreich zu gestalten und nachhaltige Ergebnisse zu erzielen."}
              </p>
            </div>

            <div className="space-y-12 my-8">
              {unit.approach?.phases.map((phase: any, index: number) => (
                <div
                  key={index}
                  className={cn("relative flex flex-col md:flex-row gap-8", index % 2 === 1 && "md:flex-row-reverse")}
                >
                  {/* Connecting line */}
                  {index < unit.approach?.phases.length - 1 && (
                    <div className="absolute left-6 md:left-1/2 top-24 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
                  )}

                  {/* Phase number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center z-10">
                    <span className="text-blue-600 font-semibold text-lg">{index + 1}</span>
                  </div>

                  {/* Phase content */}
                  <Card className={cn("flex-1", index % 2 === 1 ? "md:mr-6" : "md:ml-6")}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{phase.title}</h3>
                      <p className="text-gray-600 mb-4">{phase.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Code className="h-4 w-4 text-blue-600" />
                            Aktivitäten
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {phase.activities.map((activity: string, actIndex: number) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            Ergebnisse
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {phase.outcomes.map((outcome: string, outIndex: number) => (
                              <li key={outIndex}>{outcome}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-8">
            <div className="prose max-w-none">
              <h2>Ressourcen & Materialien</h2>
              <p>Entdecken Sie unsere Ressourcen, die Ihnen bei der Umsetzung Ihrer Projekte helfen.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {unit.resources?.map((resource: any, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-6 flex gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={resource.icon || `/images/resource-${resource.type || "whitepaper"}.png`}
                        alt={resource.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        {resource.type}
                      </Badge>
                      <h3 className="font-semibold mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                        <Link href={resource.url || "#"} target="_blank">
                          <span>Download</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Verwandte Pathfinder Units</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedUnits.map((relatedUnit, index) => (
                  <Link href={`/pathfinder/${relatedUnit.id}`} key={index} className="group">
                    <Card className="h-full transition-all group-hover:shadow-md group-hover:border-blue-300">
                      <CardContent className="p-4">
                        <div
                          className="w-full h-2 rounded-full mb-3"
                          style={{ backgroundColor: relatedUnit.color || "#3b82f6" }}
                        ></div>
                        <h3 className="font-medium group-hover:text-blue-600">{relatedUnit.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedUnit.shortDescription || relatedUnit.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Bereit für den nächsten Schritt?</h2>
          <p className="text-gray-600">Lassen Sie uns gemeinsam Ihre digitale Transformation gestalten.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <WorkshopBookingDialog>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="mr-2 h-4 w-4" />
              Workshop buchen
            </Button>
          </WorkshopBookingDialog>

          <ContactDialog>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Beratungsgespräch vereinbaren
            </Button>
          </ContactDialog>

          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Whitepaper herunterladen
          </Button>
        </div>
      </div>
    </div>
  )
}
