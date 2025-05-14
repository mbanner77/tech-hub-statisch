import { notFound } from "next/navigation"
import { pathfinderUnits } from "../pathfinder-units"
import PathfinderUnitPageClient from "./PathfinderUnitPageClient"

export async function generateMetadata({ params }: { params: { unitId: string } }) {
  const unit = pathfinderUnits.find((unit) => unit.id === "platform-elevation")

  if (!unit) {
    return {
      title: "Pathfinder Unit nicht gefunden",
    }
  }

  return {
    title: `${unit.title} | Realcore BTP Portal`,
    description: unit.description,
  }
}

export default function PlatformElevationPage() {
  const unit = pathfinderUnits.find((unit) => unit.id === "platform-elevation")

  if (!unit) {
    notFound()
  }

  return <PathfinderUnitPageClient />
}
