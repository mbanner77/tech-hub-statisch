"use client"

import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ActionDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  cancelLabel?: string
}

export default function ActionDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  actionLabel = "Bestätigen",
  onAction,
  cancelLabel = "Abbrechen",
}: ActionDialogProps) {
  const handleAction = () => {
    if (onAction) {
      onAction()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onAction && (
            <Button onClick={handleAction} className="bg-green-600 hover:bg-green-700">
              {actionLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
