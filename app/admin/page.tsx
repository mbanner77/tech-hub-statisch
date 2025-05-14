import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, FileText, Package, Mail, Users, LayoutDashboard } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Text-Management
            </CardTitle>
            <CardDescription>Verwalten Sie alle Texte der Anwendung</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bearbeiten, erstellen und löschen Sie Texte für verschiedene Bereiche der Anwendung.</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/texts" className="w-full">
              <Button className="w-full">Texte verwalten</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Services
            </CardTitle>
            <CardDescription>Verwalten Sie die angebotenen Services</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bearbeiten Sie die Liste der angebotenen Services und deren Details.</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/services" className="w-full">
              <Button className="w-full" variant="outline">
                Services verwalten
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Pathfinder Units
            </CardTitle>
            <CardDescription>Verwalten Sie die Pathfinder Units</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bearbeiten Sie die Informationen zu den verschiedenen Pathfinder Units.</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/pathfinder" className="w-full">
              <Button className="w-full" variant="outline">
                Units verwalten
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Datenbank
            </CardTitle>
            <CardDescription>Datenbank-Verwaltung</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Initialisieren Sie die Datenbank oder setzen Sie sie auf die Standardwerte zurück.</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/database" className="w-full">
              <Button className="w-full" variant="outline">
                Datenbank verwalten
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              E-Mail-Konfiguration
            </CardTitle>
            <CardDescription>E-Mail-Einstellungen verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Konfigurieren Sie die E-Mail-Einstellungen für Benachrichtigungen und Kontaktformulare.</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/mail-config" className="w-full">
              <Button className="w-full" variant="outline">
                E-Mail konfigurieren
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Landing Page
            </CardTitle>
            <CardDescription>Landing Page bearbeiten</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bearbeiten Sie die Inhalte der Landing Page.</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/landing-page" className="w-full">
              <Button className="w-full" variant="outline">
                Landing Page bearbeiten
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
