import type { FormState, GeneratedPost } from '@/types/ai-writer'
import type { GenerationMode } from '@/lib/ai-writer'

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json()

  if (!response.ok) {
    const message = typeof data?.error === 'string' ? data.error : 'Unexpected server error.'
    throw new Error(message)
  }

  return data as T
}

export const requestBlogPost = async (
  formState: FormState,
  mode: GenerationMode = 'deep',
): Promise<GeneratedPost> => {
  const response = await fetch('/api/ai-writer/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: formState.topic,
      keywords: formState.keywords,
      tone: formState.tone,
      mode,
    }),
  })

  return handleResponse<GeneratedPost>(response)
}
