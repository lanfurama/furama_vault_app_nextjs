'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PenSquare, Building2, Sparkles, ArrowRight, ExternalLink, Languages } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

const addons = [
  {
    title: 'Furama PMS',
    description: 'Centralize guest profiles, reservations, and operations in a hospitality-first workspace.',
    href: '/furama-pms',
    cta: 'Open PMS',
    icon: Building2,
    tone: 'primary',
    status: 'Active add-on',
  },
  {
    title: 'AI Lab',
    description: 'Experiment with Gemini-powered copilots, starting with AI Writer and future intelligence add-ons.',
    href: '/ai-lab',
    cta: 'Enter AI Lab',
    icon: PenSquare,
    tone: 'accent',
    status: 'Active add-on',
  },
  {
    title: 'Gemini Live Translator',
    description: 'Bridge concierge conversations with real-time audio and text translation.',
    href: '/translator',
    cta: 'Open Translator',
    icon: Languages,
    tone: 'primary',
    status: 'Active add-on',
  },
]

const upcoming = [
  {
    title: 'Analytics Studio',
    description: 'Translate PMS signals into curated dashboards for leadership and marketing teams.',
  },
  {
    title: 'Experience Marketplace',
    description: 'Bundle spa rituals, dining, and excursions into guest-ready upsell journeys.',
  },
  {
    title: 'Campaign Orchestrator',
    description: 'Coordinate email, push, and partner touchpoints from one hospitality command centre.',
  },
]

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    const html = document.documentElement

    html.classList.add('theme-transitioning')

    if (newDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    void html.offsetHeight

    setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, 50)

    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-charcoal-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="main-content">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Furama Studio"
          subtitle="Digital add-on hub"
        />

        <main className="space-y-10 p-4 lg:p-6">
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-4 py-6 text-white shadow-large lg:px-5 lg:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_55%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-secondary-50/80">
                  Welcome to Furama Studio
                </p>
                <h1 className="text-[2.2rem] font-semibold leading-snug lg:text-[2.5rem]">
                  The digital atelier for Furama&apos;s signature experiences
                </h1>
                <p className="text-sm text-secondary-50/80">
                  Orchestrate guest journeys, empower teams, and craft compelling stories in one brand-led workplace. Add PMS, AI storytelling, and more whenever you&apos;re ready.
                </p>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  <Link
                    href="/furama-pms"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-secondary-100"
                  >
                    Enter Furama PMS
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/ai-lab"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                  >
                    Enter AI Lab
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="grid gap-2 text-xs lg:text-sm">
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
                  <p className="text-xl font-semibold lg:text-2xl">{addons.length} active add-ons</p>
                  <p className="text-secondary-50/70">Studio evolves with each new module</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-secondary-50/70">Roadmap</p>
                  <div className="mt-1 flex items-center gap-2 text-secondary-50/80">
                    <Sparkles className="h-4 w-4" />
                    Next up: Experience Marketplace
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-charcoal-700 dark:text-secondary-100">Active add-ons</h2>
                <p className="text-sm text-charcoal-400 dark:text-secondary-400">
                  Choose a workspace to open. Each module inherits Furama Studio&apos;s design language.
                </p>
              </div>
          <Link
            href="/furama-pms?panel=settings"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100"
              >
                Configure PMS API
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {addons.map(addon => {
                const Icon = addon.icon
                const cardTone =
                  addon.tone === 'primary'
                    ? 'from-primary-50 to-white border-primary-100 dark:border-primary-900/40 dark:from-charcoal-900/60 dark:to-charcoal-900/20'
                    : addon.tone === 'accent'
                      ? 'from-accent-50 to-white border-accent-100 dark:border-accent-900/30 dark:from-charcoal-900/60 dark:to-charcoal-900/20'
                      : 'from-secondary-50 to-white border-secondary-100 dark:border-secondary-900/30 dark:from-charcoal-900/60 dark:to-charcoal-900/20'
                const textTone =
                  addon.tone === 'primary'
                    ? 'text-primary-700'
                    : addon.tone === 'accent'
                      ? 'text-accent-700'
                      : 'text-charcoal-600'
                const iconTone =
                  addon.tone === 'primary'
                    ? 'border-primary-100 bg-white text-primary-700 dark:border-primary-900/40 dark:bg-charcoal-900/40 dark:text-primary-200'
                    : addon.tone === 'accent'
                      ? 'border-accent-100 bg-white text-accent-700 dark:border-accent-900/30 dark:bg-charcoal-900/40 dark:text-accent-200'
                      : 'border-secondary-100 bg-white text-charcoal-600 dark:border-secondary-900/30 dark:bg-charcoal-900/40 dark:text-secondary-200'

                return (
                  <Link
                    key={addon.title}
                    href={addon.href}
                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-medium ${cardTone}`}
                  >
                    <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                          addon.tone === 'primary'
                            ? 'from-primary-100/40 via-white/0 to-primary-200/30'
                            : addon.tone === 'accent'
                              ? 'from-accent-100/40 via-white/0 to-accent-200/30'
                              : 'from-secondary-100/40 via-white/0 to-secondary-200/30'
                        }`}
                      />
                    </div>
                    <div className="relative space-y-4">
                      <div className={`inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] ${textTone} dark:bg-white/10 dark:text-secondary-200`}>
                        <span>{addon.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl ${iconTone}`}>
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-charcoal-700 dark:text-secondary-100">{addon.title}</h3>
                          <p className="text-sm text-charcoal-400 dark:text-secondary-400">{addon.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex items-center justify-between text-sm font-semibold text-primary-700 transition group-hover:text-primary-800 dark:text-primary-200 dark:group-hover:text-primary-100">
                      <span>{addon.cta}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-700 dark:text-secondary-100">Roadmap spotlight</h3>
                  <p className="text-sm text-charcoal-400 dark:text-secondary-400">
                    Add-ons in incubation—crafted with Furama&apos;s guest signature in mind.
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-200" />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {upcoming.map(item => (
                  <div key={item.title} className="rounded-2xl border border-secondary-100 bg-secondary-50 p-4 dark:border-charcoal-700 dark:bg-charcoal-900/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-400 dark:text-secondary-400">
                      Coming soon
                    </p>
                    <h4 className="mt-2 text-base font-semibold text-charcoal-700 dark:text-secondary-100">{item.title}</h4>
                    <p className="mt-1 text-sm text-charcoal-400 dark:text-secondary-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800">
                <h3 className="text-base font-semibold text-charcoal-700 dark:text-secondary-100">Studio pulse</h3>
                <ul className="mt-4 space-y-3 text-sm text-charcoal-400 dark:text-secondary-400">
                  <li>• AI Writer released a refreshed visual experience aligned with Studio branding</li>
                  <li>• PMS integration syncing nightly with central reservations</li>
                  <li>• Analytics Studio entering executive preview</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800">
                <h3 className="text-base font-semibold text-charcoal-700 dark:text-secondary-100">Need to onboard a team?</h3>
                <p className="mt-2 text-sm text-charcoal-400 dark:text-secondary-400">
                  Grant add-on access, curate bespoke dashboards, and publish onboarding playbooks.
                </p>
            <Link
              href="/furama-pms?panel=settings"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100"
                >
                  Configure PMS API
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
