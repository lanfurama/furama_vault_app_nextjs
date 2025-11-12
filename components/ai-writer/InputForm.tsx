import { type ChangeEvent, type FormEvent, type Dispatch, type SetStateAction } from 'react'
import type { FormState } from '@/types/ai-writer'
import { AI_WRITER_TONES } from '@/constants/ai-writer'

interface InputFormProps {
  formState: FormState
  setFormState: Dispatch<SetStateAction<FormState>>
  onGenerate: () => void
  onReset: () => void
  isGenerating: boolean
}

const SparkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l1.955 4.98 5.38.442-4.09 3.46 1.28 5.118L12 14.77l-4.525 2.23 1.28-5.118-4.09-3.46 5.38-.442L12 3z"
    />
  </svg>
)

export const InputForm = ({
  formState,
  setFormState,
  onGenerate,
  onReset,
  isGenerating,
}: InputFormProps) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onGenerate()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:space-y-5 sm:p-5"
    >
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500 dark:text-primary-300">
          Prompt
        </p>
        <h2 className="text-lg font-semibold text-charcoal-700 dark:text-secondary-100 sm:text-xl">
          Describe what the writer should produce
        </h2>
        <p className="text-xs text-charcoal-500 dark:text-secondary-400 sm:text-sm">
          Add a topic, a short list of keywords, and pick a tone. AI Writer will assemble the structure for you.
        </p>
      </header>

      <div className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-charcoal-500 dark:text-secondary-300 sm:text-sm">
            Topic
          </span>
          <input
            type="text"
            name="topic"
            id="topic"
            value={formState.topic}
            onChange={handleChange}
            disabled={isGenerating}
            placeholder="Luxury coastal retreats in Central Vietnam"
            className="w-full rounded-lg border border-secondary-200 bg-white px-3 py-2.5 text-sm text-charcoal-700 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:bg-secondary-100 dark:border-secondary-600 dark:bg-charcoal-900 dark:text-secondary-100"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-charcoal-500 dark:text-secondary-300 sm:text-sm">
            Keywords (comma-separated)
          </span>
          <textarea
            name="keywords"
            id="keywords"
            value={formState.keywords}
            onChange={handleChange}
            disabled={isGenerating}
            placeholder="beach villas, Danang travel, wellness experiences"
            rows={3}
            className="w-full rounded-lg border border-secondary-200 bg-white px-3 py-2.5 text-sm text-charcoal-700 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:bg-secondary-100 dark:border-secondary-600 dark:bg-charcoal-900 dark:text-secondary-100"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-charcoal-500 dark:text-secondary-300 sm:text-sm">
            Tone
          </span>
          <div className="relative">
            <select
              name="tone"
              id="tone"
              value={formState.tone}
              onChange={handleChange}
              disabled={isGenerating}
              className="w-full appearance-none rounded-lg border border-secondary-200 bg-white px-3 py-2.5 text-sm text-charcoal-700 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:bg-secondary-100 dark:border-secondary-600 dark:bg-charcoal-900 dark:text-secondary-100"
            >
              {AI_WRITER_TONES.map(tone => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute inset-y-0 right-3 h-4 w-4 translate-y-[1px] text-charcoal-300 dark:text-secondary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isGenerating || !formState.topic}
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-400 sm:w-auto sm:px-5"
        >
          <span>{isGenerating ? 'Generating…' : 'Generate draft'}</span>
          <SparkIcon className="h-4 w-4 transition group-hover:scale-105" />
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isGenerating}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-secondary-200 px-3 py-2.5 text-sm font-medium text-charcoal-500 transition hover:bg-secondary-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-charcoal-700 dark:text-secondary-200 dark:hover:bg-charcoal-800 sm:w-auto"
        >
          Reset
        </button>
      </div>
    </form>
  )
}

