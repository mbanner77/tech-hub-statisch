"use client"

import { useCmsText } from "@/hooks/use-cms-text"
import { Skeleton } from "@/components/ui/skeleton"

interface TextDisplayProps {
  textKey: string
  defaultValue?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export default function TextDisplay({
  textKey,
  defaultValue = "",
  className = "",
  as: Component = "span",
}: TextDisplayProps) {
  const { text, isLoading } = useCmsText(textKey, defaultValue)

  if (isLoading) {
    return <Skeleton className={`h-4 w-24 ${className}`} />
  }

  return <Component className={className}>{text}</Component>
}
