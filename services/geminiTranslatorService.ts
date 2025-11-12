'use client'

import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai'
import { encodeBase64 } from '@/utils/translatorAudio'
import type { TranslatorLanguage } from '@/types/translator'

const TYPE_HELPER = new GoogleGenAI({ apiKey: 'placeholder' })
export type LiveSession = Awaited<ReturnType<typeof TYPE_HELPER.live.connect>>

let inputAudioContext: AudioContext | null = null
let scriptProcessor: ScriptProcessorNode | null = null
let mediaStream: MediaStream | null = null
let mediaStreamSource: MediaStreamAudioSourceNode | null = null

const createPcmBlob = (data: Float32Array) => {
  const int16 = new Int16Array(data.length)
  for (let index = 0; index < data.length; index += 1) {
    int16[index] = data[index] * 32768
  }
  return {
    data: encodeBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  }
}

const resampleTo16kHz = (buffer: Float32Array, inputRate: number): Float32Array => {
  if (inputRate === 16000) {
    return buffer
  }

  const ratio = inputRate / 16000
  const newLength = Math.round(buffer.length / ratio)
  const result = new Float32Array(newLength)

  let offsetResult = 0
  let offsetBuffer = 0

  while (offsetResult < newLength) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio)
    let sum = 0
    let count = 0
    for (let index = offsetBuffer; index < nextOffsetBuffer && index < buffer.length; index += 1) {
      sum += buffer[index]
      count += 1
    }
    result[offsetResult] = sum / (count || 1)
    offsetResult += 1
    offsetBuffer = nextOffsetBuffer
  }

  return result
}

export const createLiveTranslatorSession = async ({
  sourceLanguage,
  targetLanguage,
  onMessage,
  onError,
  onClose,
}: {
  sourceLanguage: TranslatorLanguage
  targetLanguage: TranslatorLanguage
  onMessage: (message: LiveServerMessage) => void
  onError: (error: ErrorEvent) => void
  onClose: (event: CloseEvent) => void
}): Promise<LiveSession> => {
  const apiKey =
    process.env.GOOGLE_GENAI_API_KEY ??
    process.env.GEMINI_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY ??
    process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Missing GOOGLE_GENAI_API_KEY environment variable')
  }

  const ai = new GoogleGenAI({ apiKey })

  const systemInstruction = `You are an expert real-time translator for a conversation between a Receptionist speaking ${sourceLanguage.name} and a Customer speaking ${targetLanguage.name}. Your task is to listen to the user audio and perform two actions: 1. As audio output, you MUST speak the translation in the other person's language. 2. As text output ("outputTranscription"), you MUST provide a single, valid JSON object with the following structure: {"speaker": "receptionist" | "customer", "original": "the original text spoken by the user", "translated": "your translated text"}. You must determine the speaker based on the language they are using.`

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: async () => {
        inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamSource = inputAudioContext.createMediaStreamSource(mediaStream)
        scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1)

        scriptProcessor.onaudioprocess = event => {
          const inputBuffer = event.inputBuffer
          const resampled = resampleTo16kHz(
            inputBuffer.getChannelData(0),
            inputBuffer.sampleRate,
          )

          const pcmBlob = createPcmBlob(resampled)
          sessionPromise.then(session => {
            session.sendRealtimeInput({ media: pcmBlob })
          })
        }

        mediaStreamSource.connect(scriptProcessor)
        scriptProcessor.connect(inputAudioContext.destination)
      },
      onmessage: onMessage,
      onerror: onError,
      onclose: onClose,
    },
    config: {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction,
    },
  })

  return sessionPromise
}

export const stopLiveTranslatorSession = async (session: LiveSession | null) => {
  if (session) {
    session.close()
  }

  if (scriptProcessor) {
    scriptProcessor.disconnect()
    scriptProcessor = null
  }

  if (mediaStreamSource) {
    mediaStreamSource.disconnect()
    mediaStreamSource = null
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }

  if (inputAudioContext && inputAudioContext.state !== 'closed') {
    await inputAudioContext.close()
  }
  inputAudioContext = null
}

