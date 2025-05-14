"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ResetDataButtonProps {
  onReset: () => Promise<boolean>
}

export default function ResetDataButton({ onReset }: ResetDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { toast } = useToast()

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const success = await onReset()
      if (success) {
        toast({
          title: "Daten zurückgesetzt",
          description: "Alle Daten wurden erfolgreich auf die Standardwerte zurückgesetzt.",
        })
        // Seite neu laden, um die Änderungen zu sehen
        window.location.reload()
      } else {
        toast({
          title: "Fehler",
          description: "Die Daten konnten nicht zurückgesetzt werden.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Fehler beim Zurücksetzen der Daten:", error)
      toast({
        title: "Fehler",
        description: "Die Daten konnten nicht zurückgesetzt werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Daten zurücksetzen
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Daten zurücksetzen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie alle Daten auf die Standardwerte zurücksetzen möchten? Diese Aktion kann nicht
              rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} disabled={isResetting}>
              {isResetting ? "Wird zurückgesetzt..." : "Zurücksetzen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
