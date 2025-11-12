'use client'

import type { ChangeEvent } from 'react'
import type { TranslatorLanguage } from '@/types/translator'

interface LanguageSelectorProps {
  id: string
  label: string
  languages: TranslatorLanguage[]
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
}

export default function LanguageSelector({
  id,
  label,
  languages,
  value,
  onChange,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.25em] text-charcoal-400 dark:text-secondary-500"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-2xl border border-secondary-200 bg-white px-3 py-3 text-sm font-medium text-charcoal-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-charcoal-700 dark:bg-charcoal-900 dark:text-secondary-100"
      >
        {languages.map(language => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  )
}

