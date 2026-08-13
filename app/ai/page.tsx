"use client"

import { useEffect, useRef, useState } from 'react'
import { AI_WORKER_URL } from '@/lib/ai-config'

interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  text: string
}

const replies: Array<[RegExp, string | ((input: string, ...args: string[]) => string)]> = [
  [/eğitim/i, 'Eğitimler sayfamızda yazılım ve mekanik için küratörlü kaynaklar var: WPILib, YAGSL, AdvantageScope, Fusion 360 ve daha fazlası. Ana sayfadaki Eğitimler bölümünden ulaşabilirsin.'],
  [/sponsor|destek/i, 'EAL Robotik; İl Milli Eğitim Müdürlüğü, okulumuz, mezunlar derneğimiz ve birçok özel sektör kuruluşu tarafından destekleniyor. Ana sayfadaki sponsor şeridinde tüm destekçilerimizi görebilirsin.'],
  [/performans|kupa|başarı/i, '2021 kuruluşundan bu yana 4 kez play-off gördük; 2026 sezonunda 21. sıradan 5. ittifakın ilk tercihi olarak play-off\'a geçtik. Detaylar Performans tablosunda.'],
  [/iletişim|instagram|ulaş/i, 'Bize Instagram adresimizden ulaşabilirsin: @ealrobotik_8828. Ana sayfanın İletişim bölümünde de mevcut.'],
  [/araştır|hakkında bilgi|bilgi ver|kimdir|neler yap/i, 'İnternet araştırmam şu an çevrimdışı görünüyor. Sayfayı yenileyip tekrar dene; asistan çevrimiçiyken takım numarasıyla istediğin FRC takımını araştırabilir.'],
  [/takımımız|takımınız|takımımızdan|takımımızda|kaç kişi|üye sayısı|katıl/i, 'Takımımız Eskişehir Anadolu Lisesi öğrencilerinden oluşuyor; kuruluşumuzda 23 öğrenci ve 3 mentor vardı. Katılım ve etkinliklerimiz için Instagram üzerinden yazabilirsin.'],
  [/merhaba|selam|hi/i, 'Merhaba! EAL Robotik AI asistanına hoş geldin. Takımımız, eğitimlerimiz veya başka herhangi bir konuda soru sorabilirsin.'],
  [/(\d+)\s*(artı|eksi|çarpı|bölü|\+|-|\*|\/)\s*(\d+)/, (_m, a, op, b) => {
    const x = Number(a)
    const y = Number(b)
    const res = op === 'artı' || op === '+' ? x + y : op === 'eksi' || op === '-' ? x - y : op === 'çarpı' || op === '*' ? x * y : x / y
    return `${x} ${op} ${y} = ${res}. Başka nasıl yardımcı olabilirim?`
  }]
]

const fallback = 'Bu konuda sana en iyi nasıl yardımcı olabileceğimi düşünüyorum. Takım, eğitimler veya performans hakkında sorabilirsin. Detaylı bilgi için ana sayfaya veya Instagram hesabımıza göz atabilirsin.'

const THINKING_MESSAGES = [
  'düşünüyorum...',
  'doğru cevabı arıyorum...',
  'fikirler geliyor...',
  'analiz ediyorum...',
  'beynim çalışıyor...',
  'cevabı hazırlıyorum...'
]

function answer(input: string): string {
  for (const [pattern, text] of replies) {
    const m = pattern.exec(input)
    if (m) return typeof text === 'function' ? text(input, ...m.slice(1)) : text
  }
  return fallback
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMarkdown(text: string): string {
  let s = escapeHtml(text)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  s = s.replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  return s
}

export default function AiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'ai', text: 'Merhaba! EAL Robotik AI asistanına hoş geldin. Ne öğrenmek istersin?' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [think, setThink] = useState({ visible: true, index: 0 })
  const endRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(2)

  useEffect(() => {
    if (!typing) return
    const t = setInterval(() => {
      setThink(s =>
        s.visible ? { visible: false, index: s.index } : { visible: true, index: (s.index + 1) % THINKING_MESSAGES.length }
      )
    }, 900)
    return () => clearInterval(t)
  }, [typing])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text || typing) return
    const userId = idRef.current++
    const id = idRef.current++
    const history = [...messages, { id: userId, role: 'user' as const, text }]
    setMessages(history)
    setInput('')
    setTyping(true)
    setThinking(true)

    const chat: Array<{ role: string; content: string }> = history
      .slice(-20)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text.slice(0, 1900) }))

    let reply = ''
    let streamed = false

    try {
      const res = await fetch(AI_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chat, stream: true })
      })
      if (!res.ok || !res.body) throw new Error('worker_error_' + res.status)
      const ctype = res.headers.get('Content-Type') || ''
      if (!ctype.includes('text/event-stream')) {
        const data = await res.json()
        reply = data?.choices?.[0]?.message?.content?.trim() || ''
        if (!reply) throw new Error('empty_reply')
        streamed = true
      } else {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''
          for (const ev of events) {
            const line = ev.split('\n').find(l => l.startsWith('data:'))
            if (!line) continue
            const data = line.slice(5).trim()
            if (!data) continue
            let j: { type?: string; text?: string }
            try {
              j = JSON.parse(data)
            } catch {
              continue
            }
            if (j.type === 'thinking') {
              setThinking(true)
            } else if (j.type === 'text' && j.text) {
              setThinking(false)
              streamed = true
              reply += j.text
              setMessages(prev => prev.map(m => (m.id === id ? { ...m, text: reply } : m)))
            } else if (j.type === 'error') {
              throw new Error('stream_error')
            }
          }
        }
      }
    } catch {
      streamed = false
    }

    setThinking(false)
    setTyping(false)
    if (!streamed || !reply) {
      setMessages(prev => prev.filter(m => m.id !== id))
      setMessages(prev => [...prev, { id, role: 'ai', text: answer(text) }])
    }
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col h-[calc(100vh-5rem)]">
      <div className="text-center space-y-2 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">EAL Robotik AI</h1>
        <p className="text-sm text-muted-foreground">FRC veya takımımız hakkındaki soruları cevaplar.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'border bg-card'}`}>
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }} />
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="border bg-card rounded-2xl px-4 py-2.5 text-sm text-muted-foreground transition-opacity duration-700">
            <span className={thinking && !think.visible ? 'opacity-0' : 'opacity-100'}>
              {thinking ? THINKING_MESSAGES[think.index] : 'yazıyor...'}
            </span>
          </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={e => { e.preventDefault(); send() }}
        className="flex items-end gap-2 pt-4"
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onInput={e => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = el.scrollHeight + 'px'
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder="Mesajını yaz..."
          className="flex-1 resize-none overflow-y-auto rounded-2xl border bg-card px-4 py-2.5 text-sm outline-none focus:border-highlight/60 max-h-36"
        />
        <button
          type="submit"
          disabled={typing}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          Gönder
        </button>
      </form>
    </div>
  )
}