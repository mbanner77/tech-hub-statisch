"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // Check if we're on the landing page
  const isLandingPage = pathname === "/landing" || pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center">
            <Image
              src={isScrolled || !isLandingPage ? "/images/rc-logo.png" : "/images/rc-logo.png"}
              alt="RealCore Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
            {!isLandingPage && (
              <span className={`ml-2 font-semibold text-lg ${isScrolled ? "text-gray-800" : "text-white"}`}>
                RealCore BTP Portal
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/home">
              <Button
                variant="ghost"
                className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
              >
                Home
              </Button>
            </Link>
            <Link href="/btp-services">
              <Button
                variant="ghost"
                className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
              >
                BTP Services
              </Button>
            </Link>
            <Link href="/architecture-templates">
              <Button
                variant="ghost"
                className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
              >
                Architektur
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                variant="ghost"
                className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
              >
                Templates
              </Button>
            </Link>
            <Link href="/starter-packages">
              <Button
                variant="ghost"
                className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
              >
                Starter Packages
              </Button>
            </Link>
            <Link href="/pathfinder">
              <Button
                variant="ghost"
                className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
              >
                Pathfinder
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`mr-2 ${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/home">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Button>
              </Link>
              <Link href="/btp-services">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  BTP Services
                </Button>
              </Link>
              <Link href="/architecture-templates">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Architektur
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Templates
                </Button>
              </Link>
              <Link href="/starter-packages">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Starter Packages
                </Button>
              </Link>
              <Link href="/pathfinder">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Pathfinder
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
