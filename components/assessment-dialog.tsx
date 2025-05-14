"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, ChevronRight, Download, Mail, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ActionDialog from "./action-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js"

// Register the required chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend)

interface AssessmentDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function AssessmentDialog({ isOpen, onClose }: AssessmentDialogProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  const questions = [
    {
      id: "process",
      question: "Wie hoch ist der Automatisierungsgrad Ihrer Geschäftsprozesse?",
      options: [
        { value: 1, label: "Hauptsächlich manuelle Prozesse" },
        { value: 2, label: "Teilweise automatisierte Prozesse" },
        { value: 3, label: "Mehrheitlich automatisierte Prozesse" },
        { value: 4, label: "Hochgradig automatisierte Prozesse" },
        { value: 5, label: "Vollständig automatisierte und selbstoptimierende Prozesse" },
      ],
    },
    {
      id: "integration",
      question: "Wie gut sind Ihre SAP- und Nicht-SAP-Systeme integriert?",
      options: [
        { value: 1, label: "Isolierte Systeme ohne Integration" },
        { value: 2, label: "Punktuelle Integration einzelner Systeme" },
        { value: 3, label: "Teilweise integrierte Systemlandschaft" },
        { value: 4, label: "Weitgehend integrierte Systemlandschaft" },
        { value: 5, label: "Vollständig integrierte Systemlandschaft" },
      ],
    },
    {
      id: "data",
      question: "Wie bewerten Sie Ihr Datenmanagement?",
      options: [
        { value: 1, label: "Daten in Silos, keine zentrale Datenhaltung" },
        { value: 2, label: "Teilweise zentralisierte Datenhaltung" },
        { value: 3, label: "Zentrale Datenhaltung, aber begrenzte Datenqualität" },
        { value: 4, label: "Hohe Datenqualität und -verfügbarkeit" },
        { value: 5, label: "Vollständig datengetriebene Organisation" },
      ],
    },
    {
      id: "innovation",
      question: "Wie schnell können Sie neue Technologien adaptieren?",
      options: [
        { value: 1, label: "Sehr langsam, hoher Widerstand gegen Veränderungen" },
        { value: 2, label: "Langsam, mit erheblichem Aufwand" },
        { value: 3, label: "Moderat, bei klarem Nutzen" },
        { value: 4, label: "Schnell, mit etablierten Prozessen" },
        { value: 5, label: "Sehr schnell, kontinuierliche Innovation" },
      ],
    },
    {
      id: "user",
      question: "Wie bewerten Sie die Benutzerfreundlichkeit Ihrer SAP-Systeme?",
      options: [
        { value: 1, label: "Veraltete Benutzeroberflächen, geringe Akzeptanz" },
        { value: 2, label: "Teilweise modernisierte Oberflächen" },
        { value: 3, label: "Moderne Oberflächen für Hauptprozesse" },
        { value: 4, label: "Durchgängig moderne, benutzerfreundliche Oberflächen" },
        { value: 5, label: "Exzellente User Experience mit hoher Personalisierung" },
      ],
    },
    {
      id: "cloud",
      question: "Wie weit ist Ihre Cloud-Strategie für SAP-Systeme fortgeschritten?",
      options: [
        { value: 1, label: "Keine Cloud-Nutzung" },
        { value: 2, label: "Erste Cloud-Pilotprojekte" },
        { value: 3, label: "Hybride Cloud-Strategie in Umsetzung" },
        { value: 4, label: "Cloud-First-Strategie" },
        { value: 5, label: "Vollständige Cloud-native Architektur" },
      ],
    },
  ]

  const currentQuestion = questions[step - 1]

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast({
        title: "Bitte wählen Sie eine Option",
        description: "Um fortzufahren, müssen Sie eine Antwort auswählen.",
        variant: "destructive",
      })
      return
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: Number.parseInt(value),
    })
  }

  const handleSendReport = () => {
    if (!email) {
      toast({
        title: "Bitte geben Sie Ihre E-Mail-Adresse ein",
        description: "Um den Bericht zu erhalten, benötigen wir Ihre E-Mail-Adresse.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Bericht gesendet",
      description: `Ein detaillierter Bericht wurde an ${email} gesendet.`,
    })

    onClose()
  }

  const calculateAverageScore = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0)
    return totalScore / Object.values(answers).length
  }

  const getMaturityLevel = (score: number) => {
    if (score < 1.5)
      return {
        level: 1,
        name: "Initial",
        description: "Grundlegende SAP-Systeme ohne Integration, manuelle Prozesse dominieren",
      }
    if (score < 2.5)
      return {
        level: 2,
        name: "Managed",
        description: "Standardisierte Prozesse, beginnende Systemintegration, erste Cloud-Ansätze",
      }
    if (score < 3.5)
      return {
        level: 3,
        name: "Defined",
        description: "Integrierte Systeme, teilweise automatisierte Prozesse, hybride Cloud-Nutzung",
      }
    if (score < 4.5)
      return {
        level: 4,
        name: "Quantitatively Managed",
        description: "Datengetriebene Entscheidungen, weitgehend automatisierte Prozesse, Cloud-First-Strategie",
      }
    return {
      level: 5,
      name: "Optimizing",
      description: "KI-gestützte Prozesse, vollständige Integration, innovative Cloud-native Lösungen",
    }
  }

  const renderRadarChart = () => {
    const data = {
      labels: questions.map((q) =>
        q.id === "process"
          ? "Prozessautomatisierung"
          : q.id === "integration"
            ? "Systemintegration"
            : q.id === "data"
              ? "Datenmanagement"
              : q.id === "innovation"
                ? "Innovationsfähigkeit"
                : q.id === "user"
                  ? "User Experience"
                  : "Cloud-Nutzung",
      ),
      datasets: [
        {
          label: "Ihr Ergebnis",
          data: questions.map((q) => answers[q.id] || 0),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(75, 192, 192)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(75, 192, 192)",
        },
        {
          label: "Branchendurchschnitt",
          data: [3, 3.5, 3, 2.5, 3, 3.5],
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgb(255, 159, 64)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(255, 159, 64)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 159, 64)",
        },
      ],
    }

    const options = {
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
          },
        },
      },
      maintainAspectRatio: false,
    }

    return (
      <div className="h-[300px]">
        <Radar data={data} options={options} />
      </div>
    )
  }

  const renderResults = () => {
    const averageScore = calculateAverageScore()
    const maturityLevel = getMaturityLevel(averageScore)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Ihr digitaler Reifegrad</h3>
          <div className="text-4xl font-bold text-green-600 mb-2">{averageScore.toFixed(1)} / 5.0</div>
          <div className="text-lg font-medium">
            Stufe {maturityLevel.level}: {maturityLevel.name}
          </div>
          <p className="text-gray-600 mt-2">{maturityLevel.description}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">{renderRadarChart()}</div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Stärken</h4>
              <ul className="space-y-1 text-sm">
                {Object.entries(answers)
                  .filter(([_, value]) => value >= 4)
                  .map(([key, _]) => {
                    const dimension =
                      key === "process"
                        ? "Prozessautomatisierung"
                        : key === "integration"
                          ? "Systemintegration"
                          : key === "data"
                            ? "Datenmanagement"
                            : key === "innovation"
                              ? "Innovationsfähigkeit"
                              : key === "user"
                                ? "User Experience"
                                : "Cloud-Nutzung"
                    return (
                      <li key={key} className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>{dimension}</span>
                      </li>
                    )
                  })}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Handlungsfelder</h4>
              <ul className="space-y-1 text-sm">
                {Object.entries(answers)
                  .filter(([_, value]) => value <= 2)
                  .map(([key, _]) => {
                    const dimension =
                      key === "process"
                        ? "Prozessautomatisierung"
                        : key === "integration"
                          ? "Systemintegration"
                          : key === "data"
                            ? "Datenmanagement"
                            : key === "innovation"
                              ? "Innovationsfähigkeit"
                              : key === "user"
                                ? "User Experience"
                                : "Cloud-Nutzung"
                    return (
                      <li key={key} className="flex items-start">
                        <div className="w-4 h-4 rounded-full bg-amber-500 mr-2 mt-0.5 flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <span>{dimension}</span>
                      </li>
                    )
                  })}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Erhalten Sie Ihren detaillierten Bericht</h4>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Ihre E-Mail-Adresse"
              className="flex-1 p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSendReport} className="bg-green-600 hover:bg-green-700">
              <Mail className="mr-2 h-4 w-4" />
              Bericht senden
            </Button>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Als PDF herunterladen
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              Ergebnis teilen
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      title={showResults ? "Ihr Ergebnis der digitalen Standortbestimmung" : "Digitale Standortbestimmung"}
      description={
        showResults ? "" : "Beantworten Sie die folgenden Fragen, um Ihren digitalen Reifegrad zu ermitteln."
      }
    >
      {!showResults ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Schritt {step} von {totalSteps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
            <RadioGroup value={answers[currentQuestion.id]?.toString()} onValueChange={handleAnswerChange}>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-grow">
                      {option.label}
                    </Label>
                    {answers[currentQuestion.id] === option.value && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
              Zurück
            </Button>
            <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
              {step === totalSteps ? "Auswertung anzeigen" : "Weiter"}
              {step !== totalSteps && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        renderResults()
      )}
    </ActionDialog>
  )
}
