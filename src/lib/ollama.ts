const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2'
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text'

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Ollama'ya streaming chat isteği gönderir.
 * Her token için onToken callback'ini çağırır.
 */
export async function streamChat(
  messages: OllamaMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: true,
    }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Ollama HTTP hatası: ${response.status} ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Response body okunamadı')

  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((l) => l.trim())

    for (const line of lines) {
      try {
        const json = JSON.parse(line) as {
          message?: { content: string }
          done?: boolean
        }
        if (json.message?.content) {
          onToken(json.message.content)
          fullText += json.message.content
        }
      } catch {
        // JSON parse hatası — satırı atla
      }
    }
  }

  return fullText
}

/**
 * Ollama ile metin vektörleştirme (embedding).
 * Hata durumunda null döner (fallback için).
 */
export async function embedText(text: string): Promise<number[] | null> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: EMBED_MODEL,
        prompt: text,
      }),
    })

    if (!response.ok) return null

    const data = (await response.json()) as { embedding?: number[] }
    return data.embedding ?? null
  } catch {
    return null
  }
}

/**
 * Ollama'nın çalışıp çalışmadığını VE istenen modelin yüklü olduğunu kontrol eder.
 * Sadece Ollama ayakta olsa bile model yoksa false döner → temiz fallback.
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    })
    if (!response.ok) return false

    const data = (await response.json()) as {
      models?: { name: string }[]
    }

    const models = data.models ?? []
    // Model adı tam eşleşme veya "llama3.2:latest" gibi tag'lı versiyonu kabul et
    return models.some((m) => m.name === OLLAMA_MODEL || m.name.startsWith(`${OLLAMA_MODEL}:`))
  } catch {
    return false
  }
}

/**
 * Basit (streaming olmayan) chat tamamlama — bot yanıtı için.
 */
export async function chatCompletion(messages: OllamaMessage[]): Promise<string> {
  let result = ''
  await streamChat(messages, (token) => {
    result += token
  })
  return result
}
