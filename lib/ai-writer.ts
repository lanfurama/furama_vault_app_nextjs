import { GoogleGenAI } from '@google/genai'
import type { GeneratedPost, GroundingChunk } from '@/types/ai-writer'

let cachedClient: GoogleGenAI | null = null

const getClient = () => {
  if (cachedClient) {
    return cachedClient
  }

  const apiKey = process.env.GOOGLE_GENAI_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_GENAI_API_KEY environment variable is not set.')
  }

  cachedClient = new GoogleGenAI({ apiKey })
  return cachedClient
}

const extractTitleAndContent = (markdown: string): { title: string; content: string } => {
  const lines = markdown.split('\n')
  let title = 'Untitled Post'
  let contentStartIndex = 0

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith('# ')) {
      title = lines[i].substring(2).trim()
      contentStartIndex = i + 1
      break
    }
  }

  const content = lines.slice(contentStartIndex).join('\n').trim()
  return { title, content }
}

export type GenerationMode = 'standard' | 'deep'

interface GeneratePostArgs {
  topic: string
  keywords: string
  tone: string
  mode?: GenerationMode
}

const STANDARD_MODEL_ID = 'gemini-2.5-flash'
const DEEP_MODEL_ID = 'gemini-2.5-pro'
const IMAGE_MODEL_ID = 'imagen-4.0-generate-001'

export const generateBlogPost = async ({
  topic,
  keywords,
  tone,
  mode = 'deep',
}: GeneratePostArgs): Promise<GeneratedPost> => {
  const ai = getClient()
  const isDeep = mode === 'deep'

  const prompt = isDeep
    ? `
    You are a world-class thought leader, researcher, and writer.
    Your task is to write a comprehensive, insightful, and deeply analytical blog post on a complex topic.
    The output MUST be in Markdown format and MUST start with a title using a single hash (e.g., "# My Blog Post Title").

    Topic: "${topic}"
    Keywords to weave in naturally: "${keywords}"
    Tone: "${tone}"

    Instructions:
    1.  Provide a nuanced and thought-provoking introduction.
    2.  Develop a detailed body with multiple sections and sub-sections (using "##" and "###"). Explore the topic from various angles, including counterarguments or different perspectives.
    3.  Use markdown for clarity: lists, blockquotes, bold text.
    4.  Conclude with a powerful summary that offers a final perspective or call to action.

    Generate the deep-dive blog post now.
  `
    : `
    You are an expert content creator and SEO specialist.
    Your task is to write a high-quality, engaging, and well-structured blog post.
    The output MUST be in Markdown format and MUST start with a title using a single hash (e.g., "# My Blog Post Title").

    Topic: "${topic}"
    Keywords to include: "${keywords}"
    Tone: "${tone}"

    Structure:
    1.  An engaging introduction that hooks the reader.
    2.  A detailed body with several subheadings (using "##").
    3.  Use lists, bold text, and other markdown features to improve readability.
    4.  A concluding summary.

    Generate the blog post now.
  `

  const response = await ai.models.generateContent({
    model: isDeep ? DEEP_MODEL_ID : STANDARD_MODEL_ID,
    contents: prompt,
    config: isDeep
      ? {
          thinkingConfig: { thinkingBudget: 32768 },
          temperature: 0.8,
        }
      : {
          tools: [{ googleSearch: {} }],
          temperature: 0.7,
        },
  })

  const markdown = response.text
  const { title, content } = extractTitleAndContent(markdown)
  const sources =
    (!isDeep
      ? ((response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) ?? [])
      : []) || []

  return { title, content, sources }
}

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getClient()

  const response = await ai.models.generateImages({
    model: IMAGE_MODEL_ID,
    prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  })

  const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes

  if (!base64ImageBytes) {
    throw new Error('Image generation failed, no image bytes returned.')
  }

  return `data:image/jpeg;base64,${base64ImageBytes}`
}

