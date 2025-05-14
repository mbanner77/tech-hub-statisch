"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, Code, CheckCircle2, Info } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TemplateDetailProps {
  id: string
  type: "template" | "bestpractice"
}

export default function TemplateDetail({ id, type }: TemplateDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isDownloading, setIsDownloading] = useState(false)

  // In einer realen Anwendung würden diese Daten aus einer API geladen
  const templateData = {
    id: "1",
    title: "SAP CAP Starter Template",
    description: "Ein vollständiges Starter-Projekt für SAP CAP mit Authentifizierung und Basismodellen.",
    detailedDescription:
      "Dieses Template bietet eine vollständige Grundlage für die Entwicklung von SAP Cloud Application Programming Model (CAP) Anwendungen. Es enthält vorkonfigurierte Authentifizierung, Basismodelle für typische Geschäftsobjekte und eine optimierte Projektstruktur nach Best Practices.",
    image: "/images/cap-template.png",
    category: "development",
    downloads: 1245,
    tags: ["SAP CAP", "Node.js", "HANA"],
    features: [
      "Vorkonfigurierte Authentifizierung mit SAP IAS",
      "Basismodelle für Geschäftsobjekte (Kunden, Produkte, Bestellungen)",
      "Optimierte Projektstruktur nach Best Practices",
      "Integrierte Testumgebung mit Jest",
      "CI/CD-Pipeline-Konfiguration für GitLab und GitHub",
    ],
    technicalSpecs: [
      "Node.js 18+",
      "SAP CAP 6.x",
      "HANA Cloud-kompatibel",
      "OData v4",
      "Unterstützung für Multi-Tenancy",
    ],
    requirements: ["SAP BTP-Konto", "Node.js 18 oder höher", "@sap/cds-dk global installiert"],
    version: "2.3.0",
    lastUpdated: "2023-11-15",
    author: "RealCore Solutions",
    previewUrl: "https://github.com/realcore/cap-starter-preview",
    downloadUrl: "/downloads/cap-starter-template-v2.3.0.zip",
    documentation:
      "# SAP CAP Starter Template\n\n## Einführung\nDieses Template bietet eine vollständige Grundlage für die Entwicklung von SAP Cloud Application Programming Model (CAP) Anwendungen.\n\n## Installation\n```bash\nnpm install\n```\n\n## Entwicklung\n```bash\ncds watch\n```\n\n## Deployment\n```bash\nmbt build\ncf deploy mta_archives/cap-starter_1.0.0.mtar\n```",
    codeSnippets: [
      {
        title: "Datenmodell (schema.cds)",
        language: "cds",
        code: "namespace com.realcore.capstarter;\n\nentity Products {\n  key ID : UUID;\n  name : String(100);\n  description : String(1000);\n  price : Decimal(10,2);\n  currency : String(3);\n  category : String(100);\n  supplier : Association to Suppliers;\n}\n\nentity Suppliers {\n  key ID : UUID;\n  name : String(100);\n  address : String(200);\n  contact : String(100);\n  products : Association to many Products on products.supplier = $self;\n}",
      },
      {
        title: "Service-Definition (service.cds)",
        language: "cds",
        code: "using { com.realcore.capstarter as db } from '../db/schema';\n\nservice CatalogService @(path:'/catalog') {\n  entity Products as projection on db.Products;\n  entity Suppliers as projection on db.Suppliers;\n}",
      },
      {
        title: "Service-Implementierung (catalog-service.js)",
        language: "javascript",
        code: "const cds = require('@sap/cds');\n\nmodule.exports = cds.service.impl(async function() {\n  const { Products } = this.entities;\n  \n  this.before('CREATE', 'Products', async (req) => {\n    if (!req.data.ID) {\n      req.data.ID = UUID.generate();\n    }\n  });\n  \n  this.on('getProductsByCategory', async (req) => {\n    const { category } = req.data;\n    return await SELECT.from(Products).where({ category });\n  });\n});",
      },
    ],
    relatedTemplates: [
      {
        id: "2",
        title: "Fiori Elements Template",
        description: "Vorkonfigurierte Fiori Elements App mit List-to-Detail Pattern und Annotationen.",
        image: "/images/fiori-template.png",
      },
      {
        id: "7",
        title: "SAP HANA Cloud Schema Template",
        description: "Optimierte Datenbankschemas für SAP HANA Cloud mit Performance-Optimierungen.",
        image: "/images/hana-template.png",
      },
    ],
  }

  const handleDownload = () => {
    setIsDownloading(true)

    // Simuliere Download
    setTimeout(() => {
      setIsDownloading(false)
      toast({
        title: "Download erfolgreich",
        description: `${templateData.title} wurde erfolgreich heruntergeladen.`,
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/3 h-64">
          <Image
            src={templateData.image || "/placeholder.svg?height=300&width=500&query=template"}
            alt={templateData.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-normal">
                {templateData.category}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal">
                v{templateData.version}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{templateData.title}</h1>
            <p className="text-gray-600 mt-2">{templateData.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {templateData.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Autor:</span> {templateData.author}
            </div>
            <div>
              <span className="font-semibold">Letzte Aktualisierung:</span> {templateData.lastUpdated}
            </div>
            <div>
              <span className="font-semibold">Downloads:</span> {templateData.downloads}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleDownload} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Wird heruntergeladen..." : "Download"}
            </Button>
            {templateData.previewUrl && (
              <Button variant="outline" onClick={() => window.open(templateData.previewUrl, "_blank")}>
                <Eye className="mr-2 h-4 w-4" />
                Live-Vorschau
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="documentation">Dokumentation</TabsTrigger>
          <TabsTrigger value="code">Code-Beispiele</TabsTrigger>
          <TabsTrigger value="related">Verwandte Templates</TabsTrigger>
        </TabsList>

        {/* Übersicht Tab */}
        <TabsContent value="overview" className="mt-6 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Beschreibung</h2>
            <p className="text-gray-700">{templateData.detailedDescription}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                Features
              </h3>
              <ul className="space-y-2">
                {templateData.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-600" />
                Technische Spezifikationen
              </h3>
              <ul className="space-y-2">
                {templateData.technicalSpecs.map((spec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 h-4 w-4 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Anforderungen</h3>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {templateData.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 h-4 w-4 rounded-full bg-gray-400 mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dokumentation Tab */}
        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap">{templateData.documentation}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code-Beispiele Tab */}
        <TabsContent value="code" className="mt-6 space-y-6">
          {templateData.codeSnippets.map((snippet, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Code className="mr-2 h-5 w-5" />
                {snippet.title}
              </h3>
              <Card>
                <CardContent className="p-0">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <code>{snippet.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          ))}
        </TabsContent>

        {/* Verwandte Templates Tab */}
        <TabsContent value="related" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateData.relatedTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={template.image || "/placeholder.svg?height=200&width=400&query=template"}
                    alt={template.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{template.title}</h3>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
