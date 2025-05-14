import type { Metadata } from "next"
import { pathfinderUnits } from "@/app/pathfinder/pathfinder-units"
import { StickyHeader } from "@/components/sticky-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { BackToTop } from "@/components/back-to-top"
import { PathfinderUnitDetail } from "@/components/pathfinder-unit-detail"

export const metadata: Metadata = {
  title: "Platform Elevation | Realcore BTP Portal",
  description:
    "Durch den Einsatz von SAP BTP, Microsoft Cloud Services und innovativen OpenSource-Tools entwickeln wir digitale Services und Anwendungen, die Ihrem Unternehmen eine neue Dimension der Flexibilität und Skalierbarkeit eröffnen.",
}

export default function PlatformElevationPage() {
  // Finde die aktuelle Unit
  const currentUnit = pathfinderUnits.find((unit) => unit.id === "platform-elevation")

  // Finde verwandte Units (hier: 3 zufällige andere Units)
  const relatedUnits = pathfinderUnits
    .filter((unit) => unit.id !== "platform-elevation")
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  if (!currentUnit) {
    return <div>Unit nicht gefunden</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PathfinderUnitDetail unit={currentUnit} relatedUnits={relatedUnits} />
        </div>
      </main>

      <EnhancedFooter />
      <BackToTop />
    </div>
  )
}
