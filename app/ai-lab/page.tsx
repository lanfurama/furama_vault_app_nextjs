'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { PencilLine, Sparkles, BrainCircuit, FlaskConical } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

interface AiModule {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'active' | 'incubating'
  cta?: {
    label: string
    href: string
  }
  features: string[]
}

const AI_MODULES: AiModule[] = [
  {
    id: 'ai-writer',
    title: 'AI Writer',
    description: 'Create editorial-quality stories, itineraries, and hospitality campaigns in Furama’s signature voice.',
    icon: PencilLine,
    status: 'active',
    cta: {
      label: 'Launch AI Writer',
      href: '/ai-writer',
    },
    features: [
      'Gemini 2.5 deep-dive reasoning',
      'Markdown editing + rich preview',
      'Hospitality tone presets',
      'Copy-ready export in seconds',
    ],
  },
  {
    id: 'ai-insights',
    title: 'Experience Insights (Incubating)',
    description: 'Forthcoming module to surface guest sentiment, campaign performance, and proactive recommendations.',
    icon: Sparkles,
    status: 'incubating',
    features: [
      'Guest sentiment heatmaps',
      'Campaign performance summaries',
      'Automated opportunity spotting',
      'Actionable executive briefs',
    ],
  },
  {
    id: 'ai-concierge',
    title: 'Concierge Copilot (Incubating)',
    description: 'AI-assisted concierge responses and itinerary generation tailored to guest preferences.',
    icon: BrainCircuit,
    status: 'incubating',
    features: [
      'Preference-aware suggestions',
      'Upsell prompts by loyalty tier',
      'Response drafting in multiple languages',
      'Seamless PMS context sync',
    ],
  },
]

export default function AiLabPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const activeModules = useMemo(() => AI_MODULES.filter(module => module.status === 'active'), [])
  const incubatingModules = useMemo(() => AI_MODULES.filter(module => module.status === 'incubating'), [])

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const next = !darkMode
    const html = document.documentElement
    html.classList.add('theme-transitioning')
    if (next) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    void html.offsetHeight
    setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, 50)
    setDarkMode(next)
    localStorage.setItem('darkMode', next.toString())
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-charcoal-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="main-content">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          title="AI Lab"
          subtitle="Innovation workspace for Furama intelligence add-ons"
        />

        <main className="space-y-6 px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
          <section className="rounded-3xl border border-secondary-200 bg-gradient-to-br from-accent-50 via-white to-secondary-50 p-4 shadow-soft dark:border-charcoal-700 dark:from-accent-900/20 dark:via-charcoal-900 dark:to-charcoal-900/70 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-600 dark:text-accent-300">
                  Furama Studio · AI Lab
                </p>
                <h1 className="text-3xl font-semibold text-charcoal-700 dark:text-secondary-100 lg:text-4xl">
                  Prototype, launch, and scale AI copilots for luxury hospitality
                </h1>
                <p className="text-sm text-charcoal-500 dark:text-secondary-400 lg:text-base">
                  AI Lab gathers Furama’s intelligence add-ons—from the Gemini-powered AI Writer to upcoming analytics and concierge copilots.
                  Experiment, iterate, and deploy innovations across the resort network.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link
                    href="/ai-writer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent-700 hover:shadow-lg"
                  >
                    Launch AI Writer
                    <PencilLine className="h-4 w-4" />
                  </Link>
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.4em] text-accent-700 dark:border-accent-900/30 dark:text-accent-200">
                    Roadmap-led
                  </span>
                </div>
              </div>
              <div className="grid gap-2 text-sm text-accent-700 dark:text-accent-200 sm:grid-cols-2 sm:gap-3">
                <div className="rounded-2xl border border-accent-100 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-accent-900/30 dark:bg-charcoal-800/60 sm:p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-500 dark:text-accent-300">
                    Active copilots
                  </h3>
                  <p className="mt-2 text-2xl font-semibold">{activeModules.length}</p>
                  <p className="text-xs text-accent-600 dark:text-accent-200/80">Ready for production use</p>
                </div>
                <div className="rounded-2xl border border-accent-100 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-accent-900/30 dark:bg-charcoal-800/60 sm:p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-500 dark:text-accent-300">
                    In incubation
                  </h3>
                  <p className="mt-2 text-2xl font-semibold">{incubatingModules.length}</p>
                  <p className="text-xs text-accent-600 dark:text-accent-200/80">On the near-term roadmap</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5 sm:space-y-6">
            <div className="rounded-3xl border border-secondary-200 bg-white p-4 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal-400 dark:text-secondary-400">
                    Active module
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-charcoal-700 dark:text-secondary-100">
                    AI Writer
                  </h2>
                  <p className="mt-3 text-sm text-charcoal-500 dark:text-secondary-400">
                    Craft publication-ready narratives with Gemini 2.5. Designed for Furama’s marketing, sales, and guest experience teams.
                  </p>
                </div>
                <span className="hidden rounded-2xl border border-accent-200 bg-accent-50 p-3 text-accent-600 dark:border-accent-900/30 dark:bg-accent-900/20 dark:text-accent-200 sm:block">
                  <PencilLine className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {activeModules[0].features.map(feature => (
                  <div
                    key={feature}
                    className="rounded-2xl border border-secondary-200 bg-secondary-50 p-3 text-sm text-charcoal-600 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900/40 dark:text-secondary-300"
                  >
                    {feature}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/ai-writer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
                >
                  Launch AI Writer
                  <PencilLine className="h-4 w-4" />
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-secondary-500 dark:border-charcoal-700 dark:text-secondary-400">
                  Active
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-secondary-200 bg-white p-4 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-6">
              <div className="flex items-start gap-3">
                <FlaskConical className="mt-1 h-5 w-5 text-accent-600 dark:text-accent-300" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal-400 dark:text-secondary-400">
                    Incubation slate
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-charcoal-700 dark:text-secondary-100">
                    Next-generation copilots in the lab
                  </h2>
                  <p className="mt-2 text-sm text-charcoal-500 dark:text-secondary-400">
                    These modules are undergoing prototyping and internal pilots. Stakeholders can register interest to join beta programs.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {incubatingModules.map(module => {
                  const Icon = module.icon
                  return (
                    <div
                      key={module.id}
                      className="rounded-2xl border border-secondary-200 bg-secondary-50 p-4 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900/40"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-charcoal-700 dark:text-secondary-100">
                            {module.title}
                          </p>
                          <p className="mt-1 text-xs text-charcoal-500 dark:text-secondary-400">
                            {module.description}
                          </p>
                        </div>
                        <span className="rounded-xl border border-secondary-200 bg-white p-2 text-accent-600 dark:border-charcoal-700 dark:bg-charcoal-800 dark:text-accent-300">
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1 text-xs text-charcoal-500 dark:text-secondary-400">
                        {module.features.map(feature => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

