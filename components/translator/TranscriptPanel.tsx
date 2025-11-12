'use client'

import { useEffect, useRef } from 'react'
import type { TranscriptEntry } from '@/types/translator'

interface TranscriptPanelProps {
  title: string
  language: string
  transcripts: TranscriptEntry[]
  isListening: boolean
}

export default function TranscriptPanel({
  title,
  language,
  transcripts,
  isListening,
}: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcripts])

  return (
    <div className="flex h-full flex-col rounded-3xl border border-secondary-200 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-charcoal-700 dark:bg-charcoal-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-400 dark:text-secondary-400">
            {language}
          </p>
          <h2 className="text-lg font-semibold text-charcoal-700 dark:text-secondary-100">{title}</h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            isListening
              ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300'
              : 'bg-secondary-100 text-charcoal-500 dark:bg-charcoal-800 dark:text-secondary-300'
          }`}
        >
          {isListening ? 'Listening' : 'Idle'}
        </span>
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {transcripts.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-secondary-200 p-6 text-sm text-charcoal-400 dark:border-charcoal-700 dark:text-secondary-400">
            {isListening ? 'Waiting for speech…' : 'Conversation will appear here'}
          </div>
        ) : (
          transcripts.map((entry, index) => (
            <div
              key={`${entry.original}-${index}`}
              className="rounded-2xl border border-secondary-200 bg-white/80 p-4 text-sm shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900/70"
            >
              <p className="font-medium text-charcoal-600 dark:text-secondary-200">“{entry.original}”</p>
              <p className="mt-2 text-sm font-semibold text-primary-700 dark:text-primary-200">
                → “{entry.translated}”
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}


