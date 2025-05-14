import type { ILandingPageData } from "@/types/landing-page"

export const defaultLandingPage: ILandingPageData = {
  hero: {
    title: "Ihr SAP Full-Stack Technologiepartner",
    subtitle:
      "Als SAP-Beratungshaus blicken wir technologisch weit über den Tellerrand und verbinden SAP, OpenSource und Microsoft-Technologien zu maßgeschneiderten Lösungen, die Ihr Unternehmen auf die nächste Stufe heben.",
    primaryButtonText: "Services entdecken",
    secondaryButtonText: "Lösungsbaukasten",
    backgroundImage: "/images/tech-hero-bg.png",
    heroImage: "/images/hero-illustration.png",
  },
  featureCards: [
    {
      id: "feature-1",
      icon: "Briefcase",
      title: "Technologieübergreifende Expertise",
      description:
        "SAP, OpenSource und Microsoft - wir beherrschen das gesamte Spektrum moderner Unternehmenstechnologien.",
    },
    {
      id: "feature-2",
      icon: "Code",
      title: "Ein Partner für alles",
      description:
        "Statt 2-3 verschiedener Dienstleister erhalten Sie alle Leistungen aus einer Hand - inklusive Integration.",
    },
    {
      id: "feature-3",
      icon: "Layers",
      title: "Nahtlose Integration",
      description: "Wir verbinden unterschiedliche Technologiewelten zu einem harmonischen Ganzen für Ihr Unternehmen.",
    },
    {
      id: "feature-4",
      icon: "Zap",
      title: "Zukunftssichere Architektur",
      description:
        "Unsere ganzheitlichen Architekturen sind modular, skalierbar und auf langfristigen Erfolg ausgerichtet.",
    },
  ],
  technologySection: {
    title: "Technologie ohne Grenzen",
    subtitle:
      "Wir vereinen das Beste aus allen Welten: SAP-Expertise, Open-Source-Innovation und Microsoft-Enterprise-Lösungen - perfekt integriert für Ihren Erfolg.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
    features: [
      {
        title: "SAP Business Technology Platform",
        description: "Modernste SAP-Technologien für Ihre Geschäftsprozesse",
      },
      {
        title: "Microsoft Azure & .NET",
        description: "Enterprise-Ready Cloud- und Entwicklungslösungen",
      },
      {
        title: "Open-Source-Ökosystem",
        description: "Innovative Technologien wie Node.js, React und Kubernetes",
      },
      {
        title: "Cross-Technology Integration",
        description: "Nahtlose Verbindung aller Systeme in einer harmonischen Architektur",
      },
    ],
    buttonText: "Mehr erfahren",
  },
  approachSection: {
    title: "StarterPackages: Risikofrei in neue Technologien einsteigen",
    subtitle:
      "Unsere StarterPackages ermöglichen Ihnen den risikofreien Einstieg in neue Technologien und Herausforderungen - von KI bis zu allen aktuellen Trends in SAP BTP, Microsoft und OpenSource - zu Festpreisen inkl. QuickWins und KnowHow-Transfer.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    features: [
      {
        title: "Festpreis-Garantie",
        description: "Kalkulierbare Kosten ohne versteckte Überraschungen",
      },
      {
        title: "Schnelle Erfolge",
        description: "Fokus auf Quick Wins für sofortige Mehrwerte",
      },
      {
        title: "Wissenstransfer",
        description: "Umfassender Know-how-Transfer an Ihr Team",
      },
      {
        title: "Risikominimierung",
        description: "Erprobte Vorgehensmodelle für maximalen Projekterfolg",
      },
    ],
    buttonText: "Unsere Services",
  },
  successStories: [
    {
      id: "story-1",
      title: "Hybride Fertigung mit SAP und Microsoft",
      industry: "Fertigungsindustrie",
      backgroundImage: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop",
      tags: ["SAP BTP", "Microsoft Azure", "Integration", "IoT"],
      description:
        "Integration von SAP S/4HANA mit Microsoft Azure IoT und Power Platform für eine durchgängige Digitalisierung der Fertigung.",
      achievement: {
        icon: "Zap",
        text: "30% höhere Produktivität",
      },
    },
    {
      id: "story-2",
      title: "Full-Stack Logistikplattform",
      industry: "Logistik",
      backgroundImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
      tags: ["SAP BTP", "OpenSource", "React", "Node.js"],
      description:
        "Entwicklung einer modernen Logistikplattform, die SAP-Backend mit React-Frontend und Node.js-Middleware verbindet.",
      achievement: {
        icon: "Clock",
        text: "40% schnellere Lieferzeiten",
      },
    },
    {
      id: "story-3",
      title: "Integriertes Finanz-Ökosystem",
      industry: "Finanzwesen",
      backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      tags: ["SAP BTP", "Microsoft", ".NET", "Power BI"],
      description:
        "Nahtlose Integration von SAP-Finanzprozessen mit Microsoft-.NET-Microservices und Power BI-Analysen.",
      achievement: {
        icon: "CheckCircle",
        text: "50% weniger manuelle Eingriffe",
      },
    },
  ],
  statsSection: {
    title: "Cross-Technology Erfolg in Zahlen",
    subtitle: "Unsere technologieübergreifende Expertise schafft messbaren Mehrwert für unsere Kunden.",
    stats: [
      {
        value: 50,
        label: "Integrierte Projekte",
        suffix: "+",
      },
      {
        value: 30,
        label: "Zufriedene Kunden",
        suffix: "+",
      },
      {
        value: 25,
        label: "StarterPackages",
        suffix: "+",
      },
      {
        value: 99,
        label: "Kundenzufriedenheit",
        suffix: "%",
      },
    ],
  },
  innovationSection: {
    title: "StarterPackages für aktuelle Technologietrends",
    subtitle:
      "Von KI und Machine Learning über Cloud-native Entwicklung bis hin zu Low-Code/No-Code - unsere StarterPackages bieten Ihnen einen schnellen, risikofreien Einstieg in die neuesten Technologietrends mit garantierten Ergebnissen.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    features: [
      {
        title: "KI & Machine Learning",
        description: "Implementierung intelligenter Lösungen mit SAP AI Core und Microsoft Azure AI",
      },
      {
        title: "Cloud-native Entwicklung",
        description: "Moderne Anwendungen mit SAP BTP, Kyma und Kubernetes",
      },
      {
        title: "Low-Code/No-Code",
        description: "Schnelle Lösungsentwicklung mit SAP AppGyver und Microsoft Power Platform",
      },
      {
        title: "Integration & API Management",
        description: "Nahtlose Verbindung aller Systeme mit SAP Integration Suite",
      },
    ],
    buttonText: "Workshop buchen",
  },
  ctaSection: {
    title: "Bereit für Ihren Technologie-Boost?",
    subtitle:
      "Starten Sie noch heute mit einem unserer StarterPackages und erleben Sie, wie wir gemeinsam Ihre digitale Transformation beschleunigen - mit festen Preisen, garantierten Ergebnissen und wertvollem Wissenstransfer.",
    primaryButtonText: "Kontakt aufnehmen",
    secondaryButtonText: "Services entdecken",
  },
}
