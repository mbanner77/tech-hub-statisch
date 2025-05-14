import { notFound } from "next/navigation"
import { pathfinderUnits } from "../pathfinder-units"
import PathfinderUnitPageClient from "./PathfinderUnitPageClient"

export async function generateMetadata({ params }: { params: { unitId: string } }) {
  const unit = pathfinderUnits.find((unit) => unit.id === "data-driven-decisions")

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

export default function DataDrivenDecisionsPage() {
  const unit = pathfinderUnits.find((unit) => unit.id === "data-driven-decisions")

  if (!unit) {
    notFound()
  }

  return <PathfinderUnitPageClient />
}
