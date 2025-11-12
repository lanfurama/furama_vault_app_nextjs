export function encodeBase64(bytes: Uint8Array): string {
  let binary = ''
  const len = bytes.byteLength
  for (let index = 0; index < len; index += 1) {
    binary += String.fromCharCode(bytes[index])
  }
  return btoa(binary)
}

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let index = 0; index < len; index += 1) {
    bytes[index] = binaryString.charCodeAt(index)
  }
  return bytes
}

export async function decodePcmAudio({
  data,
  context,
  sampleRate,
  channels,
}: {
  data: Uint8Array
  context: AudioContext
  sampleRate: number
  channels: number
}): Promise<AudioBuffer> {
  const int16 = new Int16Array(data.buffer)
  const frameCount = int16.length / channels
  const buffer = context.createBuffer(channels, frameCount, sampleRate)

  for (let channel = 0; channel < channels; channel += 1) {
    const channelData = buffer.getChannelData(channel)
    for (let index = 0; index < frameCount; index += 1) {
      channelData[index] = int16[index * channels + channel] / 32768
    }
  }

  return buffer
}

