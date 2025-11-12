'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import type { FormState, GeneratedPost } from '@/types/ai-writer'
import { InputForm } from '@/components/ai-writer/InputForm'
import { PostDisplay } from '@/components/ai-writer/PostDisplay'
import { WelcomeSplash } from '@/components/ai-writer/WelcomeSplash'
import { Loader } from '@/components/ai-writer/Loader'
import { requestBlogPost } from '@/services/aiWriterService'

const initialFormState: FormState = {
  topic: '',
  keywords: '',
  tone: 'Professional',
}

export default function AiWriterPage() {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const [isLoadingText, setIsLoadingText] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    const nextDarkMode = !darkMode
    const html = document.documentElement

    html.classList.add('theme-transitioning')

    if (nextDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    void html.offsetHeight

    setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, 50)

    setDarkMode(nextDarkMode)
    localStorage.setItem('darkMode', nextDarkMode.toString())
  }

  const handleGenerate = useCallback(async () => {
    setIsLoadingText(true)
    setError(null)
    setGeneratedPost(null)

    try {
      const post = await requestBlogPost(formState, 'deep')
      setGeneratedPost(post)
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Failed to generate blog post.'
      setError(message)
    } finally {
      setIsLoadingText(false)
    }
  }, [formState])
  const isGenerating = isLoadingText

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
          title="AI Writer"
          subtitle="Gemini 2.5 deep-dive storytelling for hospitality"
        />

        <main className="space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
          <section className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Link
                  href="/ai-lab"
                  className="inline-flex items-center gap-2 rounded-full border border-secondary-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-500 transition hover:bg-secondary-100 dark:border-charcoal-700 dark:text-secondary-300 dark:hover:bg-charcoal-800"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  AI Lab
                </Link>
                <h2 className="text-2xl font-semibold text-charcoal-700 dark:text-secondary-100 sm:text-3xl">
                  AI Writer workspace
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-secondary-400 sm:text-base">
                  Provide the brief, choose a tone, and let Gemini craft the draft. Edit or copy the results instantly.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600 dark:bg-primary-900/20 dark:text-primary-200 sm:text-sm">
                Powered by Gemini 2.5
              </span>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr] xl:grid-cols-[360px_1fr]">
            <section>
              <InputForm
                formState={formState}
                setFormState={setFormState}
                onGenerate={handleGenerate}
                onReset={() => {
                  setFormState(initialFormState)
                  setGeneratedPost(null)
                  setError(null)
                }}
                isGenerating={isGenerating}
              />
            </section>

            <section>
              {isGenerating && (
                <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-secondary-200 bg-white p-6 text-center shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:min-h-[45vh]">
                  <Loader />
                  <p className="mt-3 text-base font-semibold text-primary-600 dark:text-primary-300">
                    Writing draft…
                  </p>
                  <p className="mt-2 max-w-sm text-xs text-charcoal-500 dark:text-secondary-400 sm:text-sm">
                    Stay on this tab—the draft will load automatically.
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-danger-200 bg-danger-50/80 p-4 text-sm text-danger-700 shadow-sm dark:border-danger-500/30 dark:bg-danger-900/20 dark:text-danger-200">
                  <p className="font-semibold">We couldn’t finish the request.</p>
                  <p className="mt-1 text-xs sm:text-sm">{error}</p>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-danger-200 px-4 py-1.5 text-xs font-semibold text-danger-700 transition hover:bg-danger-100 dark:border-danger-500/40 dark:text-danger-200 dark:hover:bg-danger-900/30 sm:text-sm"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!isGenerating && !generatedPost && !error && <WelcomeSplash />}

              {generatedPost && <PostDisplay post={generatedPost} />}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

