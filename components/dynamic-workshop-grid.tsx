"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Lightbulb, BookOpen, Code, Settings, Users } from "lucide-react"
import { db, type IWorkshop } from "@/lib/db"
import { defaultWorkshops } from "@/data/default-data"
import WorkshopBookingDialog from "@/components/workshop-booking-dialog" // Fixed import

const iconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar className="h-8 w-8 mb-2" />,
  Lightbulb: <Lightbulb className="h-8 w-8 mb-2" />,
  BookOpen: <BookOpen className="h-8 w-8 mb-2" />,
  Code: <Code className="h-8 w-8 mb-2" />,
  Settings: <Settings className="h-8 w-8 mb-2" />,
  Users: <Users className="h-8 w-8 mb-2" />,
}

export default function DynamicWorkshopGrid() {
  const [workshops, setWorkshops] = useState<IWorkshop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWorkshop, setSelectedWorkshop] = useState<IWorkshop | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Updated to match the prop name in WorkshopBookingDialog

  useEffect(() => {
    const loadWorkshops = async () => {
      setIsLoading(true)
      try {
        console.log("DynamicWorkshopGrid: Lade Workshops aus der Datenbank...")

        // Lade aus der IndexedDB
        const dbWorkshops = await db.workshops.toArray()

        if (dbWorkshops && dbWorkshops.length > 0) {
          console.log("DynamicWorkshopGrid: Workshops aus der Datenbank geladen:", dbWorkshops.length)
          setWorkshops(dbWorkshops)
        } else {
          console.log("DynamicWorkshopGrid: Keine Workshops in der Datenbank gefunden, verwende Standarddaten")
          // Verwende Standarddaten
          setWorkshops(defaultWorkshops)
        }
      } catch (error) {
        console.error("Fehler beim Laden der Workshops:", error)
        // Fallback auf Standarddaten
        setWorkshops(defaultWorkshops)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkshops()
  }, [])

  const handleBookWorkshop = (workshop: IWorkshop) => {
    setSelectedWorkshop(workshop)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Lade Workshops...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center">
                {iconMap[workshop.icon] || <Users className="h-8 w-8 mb-2" />}
                <CardTitle className="ml-2">{workshop.title}</CardTitle>
              </div>
              <CardDescription>
                {workshop.duration} | {workshop.price} €
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-700">{workshop.description}</p>
              {workshop.benefits && workshop.benefits.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Vorteile:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {workshop.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleBookWorkshop(workshop)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Workshop buchen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedWorkshop && (
        <WorkshopBookingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          workshop={selectedWorkshop}
        />
      )}
    </div>
  )
}
