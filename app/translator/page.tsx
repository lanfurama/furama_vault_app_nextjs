'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles, Mic, Square } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import LanguageSelector from '@/components/translator/LanguageSelector'
import TranscriptPanel from '@/components/translator/TranscriptPanel'
import { TRANSLATOR_LANGUAGES } from '@/constants/translator-languages'
import type { TranscriptEntry } from '@/types/translator'
import {
  startLiveTranslatorSession,
  stopLiveTranslatorSession,
  type LiveSession,
} from '@/services/geminiTranslatorService'
import { decodeBase64, decodePcmAudio } from '@/utils/translatorAudio'

export default function TranslatorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const [receptionistLanguageCode, setReceptionistLanguageCode] = useState('en')
  const [guestLanguageCode, setGuestLanguageCode] = useState('es')
  const [status, setStatus] = useState('Ready to start a live session.')
  const [isActive, setIsActive] = useState(false)

  const [receptionistTranscripts, setReceptionistTranscripts] = useState<TranscriptEntry[]>([])
  const [guestTranscripts, setGuestTranscripts] = useState<TranscriptEntry[]>([])

  const sessionRef = useRef<LiveSession | null>(null)
  const currentTranscriptionRef = useRef('')
  const outputAudioContextRef = useRef<AudioContext | null>(null)
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set())
  const nextAudioStartTimeRef = useRef(0)

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

  const receptionistLanguage =
    TRANSLATOR_LANGUAGES.find(language => language.code === receptionistLanguageCode) ??
    TRANSLATOR_LANGUAGES[0]
  const guestLanguage =
    TRANSLATOR_LANGUAGES.find(language => language.code === guestLanguageCode) ??
    TRANSLATOR_LANGUAGES[1]

  const handleStopSession = useCallback(async () => {
    setStatus('Ending session…')

    if (sessionRef.current) {
      await stopLiveTranslatorSession(sessionRef.current)
      sessionRef.current = null
    }

    audioSourcesRef.current.forEach(source => {
      try {
        source.stop()
      } catch {
        // ignore
      }
    })
    audioSourcesRef.current.clear()

    if (outputAudioContextRef.current) {
      try {
        await outputAudioContextRef.current.close()
      } catch {
        // ignore
      }
      outputAudioContextRef.current = null
    }

    nextAudioStartTimeRef.current = 0
    setIsActive(false)
    setStatus('Session ended. Ready to start again.')
  }, [])

  const handleGeminiMessage = useCallback(
    async (message: Parameters<typeof startLiveTranslatorSession>[0]['onMessage']) => {
      if (message.serverContent?.outputTranscription) {
        currentTranscriptionRef.current += message.serverContent.outputTranscription.text
      }

      if (message.serverContent?.turnComplete) {
        const content = currentTranscriptionRef.current.trim()
        if (content) {
          try {
            const parsed = JSON.parse(content) as {
              speaker: 'receptionist' | 'customer'
              original: string
              translated: string
            }
            if (
              (parsed.speaker === 'receptionist' || parsed.speaker === 'customer') &&
              parsed.original &&
              parsed.translated
            ) {
              const entry: TranscriptEntry = {
                original: parsed.original,
                translated: parsed.translated,
              }
              if (parsed.speaker === 'receptionist') {
                setReceptionistTranscripts(previous => [...previous, entry])
              } else {
                setGuestTranscripts(previous => [...previous, entry])
              }
            }
          } catch (error) {
            console.error('Failed to parse translator JSON payload', error, content)
          }
        }
        currentTranscriptionRef.current = ''
      }

      const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data
      if (audioData && outputAudioContextRef.current) {
        const audioContext = outputAudioContextRef.current
        nextAudioStartTimeRef.current = Math.max(
          nextAudioStartTimeRef.current,
          audioContext.currentTime,
        )

        const audioBuffer = await decodePcmAudio({
          data: decodeBase64(audioData),
          context: audioContext,
          sampleRate: 24000,
          channels: 1,
        })

        const source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContext.destination)
        source.addEventListener('ended', () => {
          audioSourcesRef.current.delete(source)
        })
        source.start(nextAudioStartTimeRef.current)
        nextAudioStartTimeRef.current += audioBuffer.duration
        audioSourcesRef.current.add(source)
      }
    },
    [],
  )

  const handleGeminiError = useCallback(
    (event: ErrorEvent) => {
      console.error('Translator session error', event)
      setStatus('Connection error. Please try again.')
      handleStopSession()
    },
    [handleStopSession],
  )

  const handleGeminiClose = useCallback(
    (event: CloseEvent) => {
      console.log('Translator session closed', event)
      if (isActive) {
        setStatus('Session closed. Restart when ready.')
        handleStopSession()
      }
    },
    [handleStopSession, isActive],
  )

  const handleStartSession = async () => {
    setStatus('Requesting microphone permission…')
    setReceptionistTranscripts([])
    setGuestTranscripts([])

    try {
      outputAudioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)({ sampleRate: 24000 })

      setStatus('Connecting to Gemini…')
      const session = await startLiveTranslatorSession({
        receptionistLanguage,
        customerLanguage: guestLanguage,
        onMessage: handleGeminiMessage,
        onError: handleGeminiError,
        onClose: handleGeminiClose,
      })

      sessionRef.current = session
      setIsActive(true)
      setStatus('Listening…')
    } catch (error) {
      console.error('Failed to start translator session', error)
      setStatus(error instanceof Error ? error.message : 'Unable to start session.')
      setIsActive(false)
      if (outputAudioContextRef.current) {
        try {
          await outputAudioContextRef.current.close()
        } catch {
          // ignore
        }
        outputAudioContextRef.current = null
      }
    }
  }

  useEffect(() => {
    return () => {
      handleStopSession()
    }
  }, [handleStopSession])

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
          title="Gemini Live Translator"
          subtitle="Real-time multilingual concierge"
        />

        <main className="space-y-6 p-4 lg:p-6">
          <section className="rounded-3xl border border-secondary-200 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-4 text-white shadow-large lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary-50/80">
                  Furama Studio · Live AI
                </p>
                <h1 className="text-2xl font-semibold lg:text-3xl">
                  Translate concierge conversations in real time
                </h1>
                <p className="text-sm text-secondary-50/80">
                  Pair your receptionist with international guests and let Gemini handle instant
                  translations, transcripts, and audio hand-offs.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs font-medium lg:text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    <Sparkles className="h-4 w-4" />
                    Powered by Gemini 2.5 Native Audio
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    {isActive ? 'Session live' : 'Idle'}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 text-sm lg:text-xs">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary-50/70">
                    Status
                  </p>
                  <p className="mt-1.5 text-sm font-semibold lg:text-base">{status}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary-50/70">
                    Languages
                  </p>
                  <p className="mt-1.5 text-sm lg:text-base">
                    {receptionistLanguage.name} ↔ {guestLanguage.name}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-secondary-200 bg-white p-5 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-charcoal-400 dark:text-secondary-400">
                  Session controls
                </h2>
                <div className="mt-4 space-y-5">
                  <LanguageSelector
                    id="translator-receptionist"
                    label="Receptionist language"
                    languages={TRANSLATOR_LANGUAGES}
                    value={receptionistLanguageCode}
                    onChange={event => setReceptionistLanguageCode(event.target.value)}
                    disabled={isActive}
                  />
                  <LanguageSelector
                    id="translator-guest"
                    label="Guest language"
                    languages={TRANSLATOR_LANGUAGES}
                    value={guestLanguageCode}
                    onChange={event => setGuestLanguageCode(event.target.value)}
                    disabled={isActive}
                  />
                  <div className="space-y-3">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={handleStartSession}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-medium transition hover:bg-primary-800"
                      >
                        <Mic className="h-4 w-4" />
                        Start conversation
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopSession}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-danger-600 px-5 py-3 text-sm font-semibold text-white shadow-medium transition hover:bg-danger-700"
                      >
                        <Square className="h-4 w-4" />
                        Stop conversation
                      </button>
                    )}
                    <p className="text-xs text-charcoal-400 dark:text-secondary-400">
                      Starting a new conversation will clear active transcripts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-secondary-200 bg-white p-5 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-charcoal-400 dark:text-secondary-400">
                  Tips
                </h2>
                <ul className="mt-3 space-y-3 text-sm text-charcoal-500 dark:text-secondary-400">
                  <li>• Ensure clear microphone audio for the receptionist.</li>
                  <li>• Pause briefly between speakers for cleaner transcripts.</li>
                  <li>• Gemini responds with translated audio for the other party.</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TranscriptPanel
                title="Receptionist"
                language={receptionistLanguage.name}
                transcripts={receptionistTranscripts}
                isListening={isActive}
              />
              <TranscriptPanel
                title="Guest"
                language={guestLanguage.name}
                transcripts={guestTranscripts}
                isListening={isActive}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

