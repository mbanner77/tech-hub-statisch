"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Define the pathfinder units directly in this component
const pathfinderUnits = [
  {
    id: "digital-core",
    title: "Digital Core",
    subtitle: "Modernisierung Ihrer SAP-Landschaft mit S/4HANA und BTP",
    description:
      "End-to-End Beratung für die Transformation zu S/4HANA und Integration mit der SAP Business Technology Platform.",
    gradient: "from-blue-500 to-blue-700",
    icon: "/images/icon-database.png",
    image: "/images/pathfinder-digital-core.png",
  },
  {
    id: "adaptive-integration",
    title: "Adaptive Integration",
    subtitle: "Nahtlose Integration von SAP und Non-SAP Systemen",
    description: "Implementierung moderner Integrationsarchitekturen mit SAP Integration Suite und API Management.",
    gradient: "from-green-500 to-green-700",
    icon: "/images/icon-layers.png",
    image: "/images/pathfinder-adaptive-integration.png",
  },
  {
    id: "business-simplified",
    title: "Business Simplified",
    subtitle: "Optimierung und Automatisierung von Geschäftsprozessen",
    description: "Neugestaltung und Automatisierung von Geschäftsprozessen mit SAP Build Process Automation.",
    gradient: "from-orange-500 to-orange-700",
    icon: "/images/icon-compass.png",
    image: "/images/pathfinder-business-simplified.png",
  },
  {
    id: "data-driven-decisions",
    title: "Data-Driven Decisions",
    subtitle: "Datengestützte Entscheidungsfindung mit SAP Analytics",
    description:
      "Implementierung von Analytics-Lösungen mit SAP Analytics Cloud, SAP Data Warehouse Cloud und SAP HANA.",
    gradient: "from-purple-500 to-purple-700",
    icon: "/images/icon-chart.png",
    image: "/images/pathfinder-data-driven-decisions.png",
  },
  {
    id: "platform-elevation",
    title: "Platform Elevation",
    subtitle: "Cloud-native Anwendungen und Microservices",
    description: "Entwicklung skalierbarer Cloud-Anwendungen mit SAP BTP, Microsoft Azure und modernen Technologien.",
    gradient: "from-cyan-500 to-cyan-700",
    icon: "/images/icon-cloud.png",
    image: "/images/pathfinder-platform-elevation.png",
  },
  {
    id: "xaas-transformation",
    title: "XaaS Transformation",
    subtitle: "Entwicklung neuer digitaler Geschäftsmodelle",
    description: "Unterstützung bei der Transformation zu Everything-as-a-Service (XaaS) Geschäftsmodellen.",
    gradient: "from-red-500 to-red-700",
    icon: "/images/icon-map.png",
    image: "/images/pathfinder-xaas-transformation.png",
  },
]

export function PathfinderUnits() {
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Unsere Pathfinder Units</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Spezialisierte Teams mit tiefgreifender Expertise in den wichtigsten Bereichen der digitalen Transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathfinderUnits.map((unit) => (
            <Link
              href={`/pathfinder/${unit.id}`}
              key={unit.id}
              className="block h-full"
              onMouseEnter={() => setHoveredUnit(unit.id)}
              onMouseLeave={() => setHoveredUnit(null)}
            >
              <Card
                className={`overflow-hidden h-full transition-all duration-300 ${
                  hoveredUnit === unit.id ? "shadow-xl transform -translate-y-1" : "shadow-md"
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${unit.gradient}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gradient-to-br ${unit.gradient}`}
                    >
                      <Image
                        src={unit.icon || `/placeholder.svg?height=24&width=24&query=${unit.title}`}
                        alt={unit.title}
                        width={24}
                        height={24}
                        className="text-white"
                      />
                    </div>
                    <h3 className="text-xl font-bold">{unit.title}</h3>
                  </div>

                  <p className="text-gray-600 mb-4">{unit.subtitle}</p>

                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={
                        unit.image || `/placeholder.svg?height=300&width=500&query=${unit.title}+digital+transformation`
                      }
                      alt={unit.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                  </div>

                  <p className="text-gray-600 mb-4">{unit.description}</p>

                  <Button
                    variant="link"
                    className={`p-0 h-auto transition-colors duration-300 ${
                      hoveredUnit === unit.id ? "text-amber-600" : "text-gray-600"
                    }`}
                  >
                    Mehr erfahren
                    <ArrowRight
                      className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                        hoveredUnit === unit.id ? "transform translate-x-1" : ""
                      }`}
                    />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
