"use client"

import { useEffect, useRef, useState } from 'react'
import { AI_WORKER_URL } from '@/lib/ai-config'

interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  text: string
}

const replies: Array<[RegExp, string]> = [
  [/eğitim/i, 'Eğitimler sayfamızda yazılım ve mekanik için küratörlü kaynaklar var: WPILib, YAGSL, AdvantageScope, Fusion 360 ve daha fazlası. Ana sayfadaki Eğitimler bölümünden ulaşabilirsin.'],
  [/sponsor|destek/i, 'EAL Robotik; İl Milli Eğitim Müdürlüğü, okulumuz, mezunlar derneğimiz ve birçok özel sektör kuruluşu tarafından destekleniyor. Ana sayfadaki sponsor şeridinde tüm destekçilerimizi görebilirsin.'],
  [/performans|kupa|başarı/i, '2021 kuruluşundan bu yana 4 kez play-off gördük; 2026 sezonunda 21. sıradan 5. ittifakın ilk tercihi olarak play-off\'a geçtik. Detaylar Performans tablosunda.'],
  [/iletişim|instagram|ulaş/i, 'Bize Instagram adresimizden ulaşabilirsin: @ealrobotik_8828. Ana sayfanın İletişim bölümünde de mevcut.'],
  [/takım|üye|katıl/i, 'Takımımız Eskişehir Anadolu Lisesi öğrencilerinden oluşuyor. Katılım ve etkinliklerimiz hakkında bilgi için bize Instagram üzerinden yazabilirsin.'],
  [/merhaba|selam|hi/i, 'Merhaba! EAL Robotik AI asistanına hoş geldin. Takımımız, eğitimlerimiz veya sponsorlarımız hakkında soru sorabilirsin.']
]

const fallback = 'Bu konuda sana en iyi nasıl yardımcı olabileceğimi düşünüyorum. Takım, eğitimler veya performans hakkında sorabilirsin. Detaylı bilgi için ana sayfaya veya Instagram hesabımıza göz atabilirsin.'

function answer(input: string): string {
  for (const [pattern, text] of replies) {
    if (pattern.test(input)) return text
  }
  return fallback
}

export default function AiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'ai', text: 'Merhaba! EAL Robotik AI asistanına hoş geldin. Ne öğrenmek istersin?' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(2)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text || typing) return
    const history = [...messages, { id: idRef.current, role: 'user' as const, text }]
    setMessages(history)
    setInput('')
    setTyping(true)

    const chat: Array<{ role: string; content: string }> = history
      .slice(-20)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text.slice(0, 1900) }))

    let reply: string
    try {
      const res = await fetch(AI_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chat })
      })
      if (!res.ok) throw new Error('worker_error_' + res.status)
      const data = await res.json()
      reply = data?.choices?.[0]?.message?.content?.trim()
      if (!reply) throw new Error('empty_reply')
    } catch {
      reply = answer(text)
    }

    setTyping(false)
    setMessages(prev => [...prev, { id: idRef.current++, role: 'ai', text: reply }])
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
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="border bg-card rounded-2xl px-4 py-2.5 text-sm text-muted-foreground">yazıyor...</div>
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