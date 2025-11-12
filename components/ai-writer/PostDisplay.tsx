import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { GeneratedPost } from '@/types/ai-writer'

interface PostDisplayProps {
  post: GeneratedPost
}

const SourceLinks = ({ sources }: { sources: GeneratedPost['sources'] }) => {
  if (!sources || sources.length === 0) return null

  const validSources = sources.filter(source => source.web?.uri && source.web?.title)
  if (validSources.length === 0) return null

  return (
    <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-4 dark:border-charcoal-700 dark:bg-charcoal-800/70">
      <h3 className="text-sm font-semibold text-charcoal-600 dark:text-secondary-100">Sources</h3>
      <ul className="mt-2 space-y-1 text-xs sm:text-sm">
        {validSources.map((source, index) => (
          <li key={source.web?.uri ?? index}>
            <a
              href={source.web!.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-medium text-primary-600 underline-offset-4 hover:text-primary-500 hover:underline dark:text-primary-300"
            >
              {source.web!.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const PostDisplay = ({ post }: PostDisplayProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`# ${post.title}\n\n${post.content}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy draft', err)
    }
  }

  return (
    <article className="animate-fade-in rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500 dark:text-primary-300">
            Draft output
          </p>
          <h1 className="mt-1 text-xl font-semibold text-charcoal-700 dark:text-secondary-100 sm:text-2xl">
            {post.title}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-secondary-200 px-3 py-1.5 text-xs font-medium text-charcoal-500 transition hover:bg-secondary-100 dark:border-charcoal-700 dark:text-secondary-200 dark:hover:bg-charcoal-700 sm:text-sm"
        >
          {copied ? 'Copied!' : 'Copy draft'}
        </button>
      </div>

      <div className="prose max-w-none text-sm leading-relaxed prose-headings:font-semibold prose-headings:text-charcoal-700 prose-strong:text-charcoal-700 dark:prose-invert sm:text-base">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <SourceLinks sources={post.sources} />
    </article>
  )
}

