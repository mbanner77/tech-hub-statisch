"use client"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, FileText, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Simplified template data
const templates = [
  {
    id: "1",
    title: "SAP CAP Starter Template",
    description: "Ein vollständiges Starter-Projekt für SAP CAP mit Authentifizierung und Basismodellen.",
    image: "/images/cap-template.png",
    category: "development",
    downloads: 1245,
    tags: ["SAP CAP", "Node.js", "HANA"],
  },
  {
    id: "2",
    title: "Fiori Elements Template",
    description: "Vorkonfigurierte Fiori Elements App mit List-to-Detail Pattern und Annotationen.",
    image: "/images/fiori-template.png",
    category: "development",
    downloads: 876,
    tags: ["Fiori", "OData", "UI5"],
  },
  {
    id: "3",
    title: "BTP Architektur-Blueprint",
    description: "Referenzarchitektur für eine moderne SAP BTP-Landschaft mit Best Practices.",
    image: "/images/architecture-template.png",
    category: "architecture",
    downloads: 543,
    tags: ["Architektur", "BTP", "Best Practice"],
  },
  {
    id: "4",
    title: "Integration Suite Setup",
    description: "Vorkonfigurierte Integration Suite mit typischen Integrationsszenarien.",
    image: "/images/integration-template.png",
    category: "integration",
    downloads: 321,
    tags: ["Integration", "API", "Event Mesh"],
  },
]

// Simplified best practices data
const bestPractices = [
  {
    id: "1",
    title: "BTP Kostenoptimierung",
    description: "Strategien zur Optimierung der BTP-Kosten und effizienten Ressourcennutzung.",
    image: "/images/cost-optimization.png",
    category: "management",
    downloads: 876,
    tags: ["Kosten", "Optimierung", "Cloud"],
  },
  {
    id: "2",
    title: "Multi-Tenant Architektur",
    description: "Best Practices für die Entwicklung mandantenfähiger BTP-Anwendungen.",
    image: "/images/multi-tenant.png",
    category: "architecture",
    downloads: 543,
    tags: ["Multi-Tenant", "SaaS", "Architektur"],
  },
  {
    id: "3",
    title: "BTP Security Guidelines",
    description: "Umfassende Sicherheitsrichtlinien für SAP BTP-Anwendungen.",
    image: "/images/security-guidelines.png",
    category: "security",
    downloads: 765,
    tags: ["Sicherheit", "Compliance", "Governance"],
  },
]

export default function TemplateGallery() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("templates")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Filter best practices based on search term
  const filteredBestPractices = bestPractices.filter(
    (bp) =>
      bp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bp.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Handle preview
  const handlePreview = (item: any) => {
    setSelectedItem(item)
    setIsPreviewOpen(true)
  }

  // Handle download
  const handleDownload = (item: any) => {
    toast({
      title: "Download gestartet",
      description: `${item.title} wird heruntergeladen...`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Suchen..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={template.image || "/placeholder.svg?height=200&width=400&query=template"}
                      alt={template.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{template.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">{template.downloads} Downloads</div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(template)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleDownload(template)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Keine Templates gefunden, die Ihren Filterkriterien entsprechen.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Best Practices Tab */}
        <TabsContent value="best-practices" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBestPractices.length > 0 ? (
              filteredBestPractices.map((bp) => (
                <Card key={bp.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={bp.image || "/placeholder.svg?height=200&width=400&query=best practice"}
                      alt={bp.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{bp.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{bp.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bp.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">{bp.downloads} Downloads</div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(bp)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Lesen
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleDownload(bp)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Keine Best Practices gefunden, die Ihren Filterkriterien entsprechen.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      {selectedItem && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <div className="relative h-64 mb-6 bg-gray-100 overflow-hidden rounded-md">
                <img
                  src={selectedItem.image || "/placeholder.svg?height=300&width=600&query=template detail"}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Beschreibung</h3>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleDownload(selectedItem)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
