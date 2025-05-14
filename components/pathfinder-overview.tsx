"use client"

import { useState, useEffect } from "react"
import { Layers, Database, BarChart2, Cloud, Map, ArrowRight } from "lucide-react"
import { pathfinderUnits } from "@/app/pathfinder/pathfinder-units"
import Link from "next/link"
import Image from "next/image"

export function PathfinderOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredUnits, setFilteredUnits] = useState(pathfinderUnits)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Alle verfügbaren Technologien aus den Units extrahieren
  const allTechnologies = Array.from(new Set(pathfinderUnits.flatMap((unit) => unit.technologies))).sort()

  // Kategorien für die Units
  const categories = [
    { id: "core", name: "Core Systems", icon: <Database className="h-4 w-4 mr-2" /> },
    { id: "integration", name: "Integration", icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: "data", name: "Data & Analytics", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { id: "cloud", name: "Cloud & Platform", icon: <Cloud className="h-4 w-4 mr-2" /> },
    { id: "transformation", name: "Transformation", icon: <Map className="h-4 w-4 mr-2" /> },
  ]

  // Function to get unit abbreviation (first 2 letters)
  const getUnitAbbreviation = (title: string) => {
    return title.substring(0, 2).toUpperCase()
  }

  // Function to get background color based on gradient
  const getBackgroundColor = (gradient: string) => {
    if (gradient.includes("blue")) return "bg-blue-600"
    if (gradient.includes("green")) return "bg-green-600"
    if (gradient.includes("orange")) return "bg-orange-600"
    if (gradient.includes("purple")) return "bg-purple-600"
    if (gradient.includes("cyan")) return "bg-cyan-600"
    if (gradient.includes("red")) return "bg-red-600"
    return "bg-gray-600"
  }

  // Function to get text color based on gradient
  const getTextColor = (gradient: string) => {
    if (gradient.includes("blue")) return "text-blue-600"
    if (gradient.includes("green")) return "text-green-600"
    if (gradient.includes("orange")) return "text-orange-600"
    if (gradient.includes("purple")) return "text-purple-600"
    if (gradient.includes("cyan")) return "text-cyan-600"
    if (gradient.includes("red")) return "text-red-600"
    return "text-gray-600"
  }

  // Filter anwenden
  useEffect(() => {
    const filtered = pathfinderUnits.filter((unit) => {
      const matchesSearch =
        searchTerm === "" ||
        unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTech =
        selectedTechnologies.length === 0 || unit.technologies.some((tech) => selectedTechnologies.includes(tech))

      return matchesSearch && matchesTech && (activeCategory === null || unit.category === activeCategory)
    })
    setFilteredUnits(filtered)
  }, [searchTerm, selectedTechnologies, activeCategory])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Pathfinder Units</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
        <input
          type="text"
          placeholder="Search units..."
          className="shadow appearance-none border rounded w-full md:w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {allTechnologies.map((tech) => (
            <button
              key={tech}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedTechnologies.includes(tech) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white transition-colors duration-200`}
              onClick={() => {
                if (selectedTechnologies.includes(tech)) {
                  setSelectedTechnologies(selectedTechnologies.filter((t) => t !== tech))
                } else {
                  setSelectedTechnologies([...selectedTechnologies, tech])
                }
              }}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === category.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-blue-500 hover:text-white transition-colors duration-200`}
            onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          } hover:bg-blue-500 hover:text-white transition-colors duration-200`}
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          Switch to {viewMode === "grid" ? "List" : "Grid"} View
        </button>
      </div>

      {/* Units Display */}
      {isLoaded ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className={`rounded-lg shadow-md overflow-hidden ${
                viewMode === "grid" ? "" : "flex items-center space-x-4"
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  <div className={`relative ${getBackgroundColor(unit.gradient)} text-white p-0 h-48 overflow-hidden`}>
                    {unit.heroImage ? (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                        <Image
                          src={unit.heroImage || "/placeholder.svg"}
                          alt={unit.title}
                          fill
                          className="object-cover mix-blend-overlay"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                        <span className="text-5xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          {getUnitAbbreviation(unit.title)}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <h3 className="text-lg font-bold text-white mb-1">{unit.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 mb-4">
                      {unit.shortDescription || unit.description.substring(0, 100)}...
                    </p>
                    <Link
                      href={`/pathfinder/${unit.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mehr erfahren
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`relative w-24 h-24 ${getBackgroundColor(unit.gradient)} text-white flex items-center justify-center overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                      {unit.heroImage ? (
                        <Image
                          src={unit.heroImage || "/placeholder.svg"}
                          alt={unit.title}
                          fill
                          className="object-cover mix-blend-overlay"
                          sizes="96px"
                        />
                      ) : (
                        <span className="text-3xl font-bold z-10">{getUnitAbbreviation(unit.title)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="text-lg font-semibold mb-2">{unit.title}</h3>
                    <p className="text-gray-600">{unit.description.substring(0, 100)}...</p>
                  </div>
                  <Link
                    href={`/pathfinder/${unit.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">Loading...</div>
      )}
    </div>
  )
}
