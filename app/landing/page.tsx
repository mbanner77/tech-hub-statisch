"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ChevronRight, Briefcase, Code, Layers, Zap, Award, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getClientLandingPage } from "@/lib/client-data-service"
import { defaultLandingPage } from "@/data/landing-page-data"
import type { ILandingPageData } from "@/types/landing-page"
import { StickyHeader } from "@/components/sticky-header"
import { BackToTop } from "@/components/back-to-top"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { PathfinderUnits } from "@/components/pathfinder-units"

// Hilfsfunktion zum Rendern von Icons basierend auf dem Namen
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Briefcase: <Briefcase className={className} />,
    Code: <Code className={className} />,
    Layers: <Layers className={className} />,
    Zap: <Zap className={className} />,
    Award: <Award className={className} />,
    Clock: <Clock className={className} />,
    CheckCircle: <CheckCircle className={className} />,
    ArrowRight: <ArrowRight className={className} />,
    ChevronRight: <ChevronRight className={className} />,
  }

  return <>{iconMap[name] || <Briefcase className={className} />}</>
}

export default function LandingPage() {
  const [landingPage, setLandingPage] = useState<ILandingPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const loadLandingPage = async () => {
      try {
        const data = await getClientLandingPage()
        setLandingPage(data)
      } catch (error) {
        console.error("Fehler beim Laden der Landing Page:", error)
        setLandingPage(defaultLandingPage)
      } finally {
        setIsLoading(false)
      }
    }

    loadLandingPage()
  }, [])

  if (isLoading || !landingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-2xl">Lade Inhalte...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden bg-gradient-to-r from-green-800 to-green-700 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/tech-hero-bg.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{landingPage.hero.title}</h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100">{landingPage.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/home">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-white text-green-700 hover:bg-gray-100 h-10 sm:h-12">
                    {landingPage.hero.primaryButtonText}
                  </button>
                </Link>
                <Link href="/home">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-orange-500 hover:bg-orange-600 text-white h-10 sm:h-12 border-2 border-orange-500 hover:border-orange-600">
                    {landingPage.hero.secondaryButtonText}
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/hero-illustration.png"
                alt="Hero Illustration"
                width={600}
                height={400}
                className="max-w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 md:h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Feature Cards */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Warum RealCore Ihr optimaler Technologiepartner ist
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Mit über 15 Jahren Erfahrung in der Entwicklung und Integration von Unternehmenslösungen bieten wir
              technologieübergreifende Expertise, die messbare Ergebnisse liefert.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {landingPage.featureCards.map((feature) => (
              <Card key={feature.id} className="border-t-4 border-t-green-600 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="bg-green-100 text-green-600 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                    <DynamicIcon name={feature.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{landingPage.technologySection.title}</h2>
              <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg">
                {landingPage.technologySection.subtitle}
              </p>
              <div className="space-y-3 sm:space-y-4">
                {landingPage.technologySection.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/home">
                <button className="mt-6 sm:mt-8 inline-flex items-center justify-center rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white h-8 sm:h-10">
                  {landingPage.technologySection.buttonText}
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/all-technologies.png"
                alt="Technology Expertise"
                width={500}
                height={400}
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{landingPage.approachSection.title}</h2>
              <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg">{landingPage.approachSection.subtitle}</p>
              <div className="space-y-3 sm:space-y-4">
                {landingPage.approachSection.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/home">
                <button className="mt-6 sm:mt-8 inline-flex items-center justify-center rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white h-8 sm:h-10">
                  {landingPage.approachSection.buttonText}
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative rounded-lg overflow-hidden shadow-xl w-full max-w-md">
                <Image
                  src="/images/modular-consulting.png"
                  alt="Our Approach"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 sm:p-6 text-white">
                    <p className="text-base sm:text-lg font-semibold">"Start Smart. Disrupt Fast. Evolve Always."</p>
                    <p className="text-xs sm:text-sm opacity-80">
                      Unser Motto für erfolgreiche digitale Transformation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Erfolgsgeschichten unserer Kunden</h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Sehen Sie, wie wir Unternehmen dabei geholfen haben, ihre technologischen Herausforderungen zu meistern
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {landingPage.successStories.map((story) => (
              <div
                key={story.id}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full"
              >
                <div className="h-36 sm:h-40 md:h-48 bg-gradient-to-r from-green-600 to-green-800 relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url('/images/${story.id}.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl sm:text-2xl font-bold px-4 text-center">{story.title}</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="mb-3 sm:mb-4">
                    {story.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{story.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DynamicIcon
                        name={story.achievement.icon}
                        className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mr-1"
                      />
                      <span className="text-xs sm:text-sm font-medium">{story.achievement.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{landingPage.statsSection.title}</h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90">{landingPage.statsSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {landingPage.statsSection.stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 text-amber-400">
                  {stat.value}
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-base sm:text-lg opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src="/images/innovation-workshop.png"
                alt="Innovation Factory"
                width={500}
                height={400}
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{landingPage.innovationSection.title}</h2>
              <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg">
                {landingPage.innovationSection.subtitle}
              </p>
              <div className="space-y-3 sm:space-y-4">
                {landingPage.innovationSection.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/home#workshops">
                <button className="mt-6 sm:mt-8 inline-flex items-center justify-center rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white h-8 sm:h-10">
                  {landingPage.innovationSection.buttonText}
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-green-100 rounded-lg sm:rounded-xl p-6 sm:p-8 md:p-12 shadow-md sm:shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{landingPage.ctaSection.title}</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700">{landingPage.ctaSection.subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/home#contact">
                <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-orange-500 hover:bg-orange-600 text-white h-10 sm:h-12">
                  {landingPage.ctaSection.primaryButtonText}
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </Link>
              <Link href="/home">
                <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border-2 border-green-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-green-700 hover:bg-green-50 h-10 sm:h-12">
                  {landingPage.ctaSection.secondaryButtonText}
                </button>
              </Link>
              <Link href="/btp-services">
                <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-12">
                  BTP Services entdecken
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pathfinder Units */}
      <PathfinderUnits />

      {/* Footer */}
      <EnhancedFooter />
      <BackToTop />
    </div>
  )
}
