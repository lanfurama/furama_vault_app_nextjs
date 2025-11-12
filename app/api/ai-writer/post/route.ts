import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateBlogPost } from '@/lib/ai-writer'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, keywords, tone, mode = 'deep' } = body ?? {}

    if (!topic || !keywords) {
      return NextResponse.json(
        { error: 'Topic and keywords are required.' },
        { status: 400 },
      )
    }

    const post = await generateBlogPost({
      topic,
      keywords,
      tone: tone ?? 'Professional',
      mode,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('AI Writer post generation error:', error)

    const message =
      error instanceof Error ? error.message : 'Failed to generate blog post.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

