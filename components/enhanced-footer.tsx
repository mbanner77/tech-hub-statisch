import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Unternehmen */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Über RealCore</h3>
            <div className="mb-4">
              <Image
                src="/images/rc-logo.png"
                alt="RealCore Logo"
                width={120}
                height={30}
                className="h-8 w-auto bg-white p-1 rounded"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Ihr SAP Full-Stack Technologiepartner mit Expertise in SAP, OpenSource und Microsoft-Technologien.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Schnelllinks */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Schnelllinks</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                  Lösungsbaukasten
                </Link>
              </li>
              <li>
                <Link href="/home#assessment" className="text-gray-400 hover:text-white transition-colors">
                  Standortbestimmung
                </Link>
              </li>
              <li>
                <Link href="/home#workshops" className="text-gray-400 hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/btp-services" className="text-gray-400 hover:text-white transition-colors">
                  BTP Services
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-400 hover:text-white transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/home#contact" className="text-gray-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Unsere Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/btp-services" className="text-gray-400 hover:text-white transition-colors">
                  SAP BTP Services
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                  SAP S/4HANA
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                  Cloud Integration
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                  Fiori Development
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                  CAP Development
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                  DevOps & CI/CD
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Musterstraße 123, 12345 Musterstadt, Deutschland</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <a href="tel:+491234567890" className="text-gray-400 hover:text-white transition-colors">
                  +49 123 456 7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <a href="mailto:info@realcore.de" className="text-gray-400 hover:text-white transition-colors">
                  info@realcore.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700 text-center md:flex md:justify-between md:items-center">
          <div className="text-xs sm:text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} RealCore. Alle Rechte vorbehalten.
          </div>
          <div className="flex justify-center space-x-4 text-xs sm:text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">
              Datenschutz
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Impressum
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
