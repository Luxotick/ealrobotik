import { SYSTEM_PROMPT } from './system-prompt.js'

const UPSTREAM_URL = 'https://opencode.ai/zen/v1/chat/completions'
const TBA_API_URL = 'https://www.thebluealliance.com/api/v3'
const DDG_LITE_URL = 'https://lite.duckduckgo.com/lite/'
const DDG_HTML_URL = 'https://html.duckduckgo.com/html/'
const DEFAULT_MODEL = 'opencode-zen/deepseek-v4-flash-free'
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_team_info',
      description:
        'The Blue Alliance platformu üzerinden FRC takım bilgisi aratması yapar. ' +
        'Çıktı JSON formatında döner. Girdi olarak takım numarası girilmelidir (örn. 8828).',
      parameters: {
        type: 'object',
        properties: {
          team_number: {
            type: 'integer',
            description: 'FRC takım numarası (örn. 8828)'
          }
        },
        required: ['team_number']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search',
      description:
        'İnternette web araması yapar ve sonuç listesi döndürür. ' +
        'Güncel bilgi, haber, sonuç veya dış doğrulama gerektiren sorularda kullan. ' +
        'Sonuçlar title, url ve snippet alanlarıyla JSON liste olarak gelir.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Net ve kısa arama sorgusu (örn. "FRC 2026 REBUILT")'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'fetch_page',
      description:
        'Verilen URLdeki web sayfasını açar ve sayfanın metin içeriğini döndürür. ' +
        'Arama sonuçlarındaki siteleri incelemek, detaylı bilgi almak için kullan. ' +
        'Sayfa HTMLden arındırılmış düz metin olarak gelir.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'Ziyaret edilecek sayfanın tam URLsi (https:// ile başlamalı)'
          }
        },
        required: ['url']
      }
    }
  }
]

const MAX_BODY_BYTES = 32768
const MAX_MESSAGES = 24
const MAX_MESSAGE_LENGTH = 2000
const MAX_TOKENS = 512
const MAX_TOOL_ROUNDS = 5
const MAX_SEARCH_RESULTS = 8
const MAX_SNIPPET_LENGTH = 500
const MAX_QUERY_LENGTH = 300
const MAX_PAGE_CHARS = 8000
const MAX_PAGE_BYTES = 5 * 1024 * 1024
const UPSTREAM_TIMEOUT_MS = 30000

function sanitizeMessages(messages) {
  const out = []
  for (const m of messages.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== 'object') continue
    if (m.role !== 'user' && m.role !== 'assistant') continue
    const content = typeof m.content === 'string' ? m.content : ''
    if (!content.trim()) continue
    out.push({ role: m.role, content: content.slice(0, MAX_MESSAGE_LENGTH) })
  }
  return out
}

async function runTool(name, args, env) {
  if (name === 'get_team_info') {
    const team = Number(args.team_number)
    if (!Number.isInteger(team) || team <= 0) {
      return JSON.stringify({ error: 'invalid_team_number' })
    }
    const url = `${TBA_API_URL}/team/frc${team}`
    let res
    try {
      res = await fetch(url, {
        headers: { 'X-TBA-Auth-Key': env.TBA_API_KEY },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
      })
    } catch (err) {
      console.error('tba_unreachable', err.message)
      return JSON.stringify({ error: 'tba_unreachable' })
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('tba_status', res.status)
      return JSON.stringify({ error: 'tba_error', status: res.status, detail: detail.slice(0, 300) })
    }
    return await res.text()
  }

  if (name === 'search') {
    const query = typeof args.query === 'string' ? args.query.trim() : ''
    if (!query || query.length > MAX_QUERY_LENGTH) {
      return JSON.stringify({ error: 'invalid_query' })
    }
    for (const base of [DDG_LITE_URL, DDG_HTML_URL]) {
      let res
      try {
        res = await fetch(`${base}?q=${encodeURIComponent(query)}`, {
          headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html' },
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
        })
      } catch (err) {
        console.error('search_unreachable', base, err.message)
        continue
      }
      if (!res.ok) {
        console.error('search_status', base, res.status)
        continue
      }
      const html = await res.text()
      const results = parseSearchResults(html)
      if (results.length) return JSON.stringify({ results })
      console.error('search_no_results', base)
    }
    return JSON.stringify({ error: 'search_unavailable', results: [] })
  }

  if (name === 'fetch_page') {
    const url = typeof args.url === 'string' ? args.url.trim() : ''
    if (!url || !isSafeUrl(url)) return JSON.stringify({ error: 'invalid_url' })
    let res
    try {
      res = await fetch(url, {
        headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/xhtml+xml' },
        redirect: 'follow',
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
      })
    } catch (err) {
      console.error('page_unreachable', err.message)
      return JSON.stringify({ error: 'page_unreachable' })
    }
    if (!res.ok) {
      console.error('page_status', res.status)
      return JSON.stringify({ error: 'page_error', status: res.status })
    }
    const type = (res.headers.get('Content-Type') || '').toLowerCase()
    if (!type.includes('html')) {
      return JSON.stringify({ error: 'unsupported_content', contentType: type })
    }
    const declared = Number(res.headers.get('Content-Length') || 0)
    if (declared > MAX_PAGE_BYTES) return JSON.stringify({ error: 'page_too_large' })
    const html = await res.text()
    if (html.length > MAX_PAGE_BYTES) return JSON.stringify({ error: 'page_too_large' })
    const text = htmlToText(html)
    if (!text) return JSON.stringify({ error: 'empty_page' })
    const content =
      text.length > MAX_PAGE_CHARS ? text.slice(0, MAX_PAGE_CHARS) + '\n[icerik kesildi]' : text
    return JSON.stringify({ url: res.url || url, content })
  }

  return JSON.stringify({ error: 'unknown_tool' })
}

function isBlockedHost(host) {
  const h = host.replace(/^\[|\]$/g, '').toLowerCase().replace(/\.$/, '')
  if (h === 'localhost' || h.endsWith('.localhost') || h === '0.0.0.0') return true
  if (h === '::1' || h === '0:0:0:0:0:0:0:1' || h.startsWith('::ffff:') || h.startsWith('fe80:')) return true
  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!ipv4) return false
  const oct = ipv4.slice(1).map(Number)
  if (oct.some(o => o > 255)) return true
  const [a, b, c] = oct
  if (a === 10) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  return false
}

function isSafeUrl(raw) {
  let u
  try {
    u = new URL(raw)
  } catch {
    return false
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
  if (u.username || u.password) return false
  return !isBlockedHost(u.hostname)
}

function htmlToText(html) {
  let s = html
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ')
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  s = s.replace(/<!--[\s\S]*?-->/g, ' ')
  s = s.replace(/<\/(p|div|h[1-6]|li|tr|section|article|table)>/gi, '\n')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<[^>]+>/g, ' ')
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
  return s.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim()
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function stripTags(s) {
  return decodeHtml(s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')).trim()
}

function parseSearchResults(html) {
  const results = []
  const blocks = html.split(/<div class=['"]result/)
  for (let i = 1; i < blocks.length && results.length < MAX_SEARCH_RESULTS; i++) {
    const block = blocks[i]
    const titleMatch = block.match(/<a[^>]*>(.*?)<\/a>/s)
    const linkMatch = block.match(/uddg=([^&"']+)/)
    if (!titleMatch || !linkMatch) continue
    let url
    try {
      url = decodeURIComponent(linkMatch[1])
    } catch {
      continue
    }
    if (!url.startsWith('http')) continue
    const title = stripTags(titleMatch[1])
    if (!title) continue
    const snippetMatch = block.match(/class=['"]result[-_]snippet['"][^>]*>(.*?)<\/(?:a|td|div)>/s)
    const snippet = snippetMatch ? stripTags(snippetMatch[1]) : ''
    results.push({ title, url, snippet: snippet.slice(0, MAX_SNIPPET_LENGTH) })
  }
  return results
}

async function callUpstream(body, env) {
  return fetch(UPSTREAM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENCODE_API_KEY}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin'
    }
    const json = (status, body) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      })

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (origin) {
      const allowed = (env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      if (!allowed.includes(origin)) return json(403, { error: 'forbidden' })
    }

    if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' })

    const length = Number(request.headers.get('Content-Length') || 0)
    if (length > MAX_BODY_BYTES) return json(413, { error: 'payload_too_large' })

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const { success } = await env.CHAT_LIMITER.limit({ key: ip })
    if (!success) {
      return json(429, {
        error: 'rate_limited',
        message: 'Çok fazla istek gönderdin, bir dakika bekleyip tekrar dene.'
      })
    }

    const contentType = request.headers.get('Content-Type') || ''
    if (!contentType.includes('application/json')) return json(415, { error: 'unsupported_media_type' })

    let payload
    try {
      payload = await request.json()
    } catch {
      return json(400, { error: 'invalid_json' })
    }

    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.messages)) {
      return json(400, { error: 'invalid_body' })
    }
    if (JSON.stringify(payload).length > MAX_BODY_BYTES) return json(413, { error: 'payload_too_large' })

    const sanitized = sanitizeMessages(payload.messages)
    if (!sanitized.length) return json(400, { error: 'no_messages' })

    const requestedTokens = Number(payload.max_tokens)
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...sanitized]
    const maxTokens = Math.min(Number.isFinite(requestedTokens) ? requestedTokens : MAX_TOKENS, MAX_TOKENS)

    let data
    try {
      data = await chatLoop(messages, maxTokens, env)
    } catch (err) {
      console.error('upstream_unreachable', err.message)
      return json(502, { error: 'upstream_unreachable' })
    }

    return json(200, data)
  }
}

async function chatLoop(messages, maxTokens, env) {
  let responseData = null
  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const body = {
      model: env.MODEL || DEFAULT_MODEL,
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false
    }

    const upstream = await callUpstream(body, env)
    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      console.error('upstream_status', upstream.status)
      throw new Error('upstream_status_' + upstream.status + '_' + detail.slice(0, 200))
    }

    let parsed
    try {
      parsed = await upstream.json()
    } catch {
      throw new Error('upstream_invalid_response')
    }
    responseData = parsed

    const message = parsed.choices?.[0]?.message
    const toolCalls = message?.tool_calls
    if (!toolCalls?.length) return parsed

    messages.push(message)
    for (const call of toolCalls) {
      if (call.type !== 'function' || !call.id) continue
      let args = {}
      try {
        args = JSON.parse(call.function.arguments || '{}')
      } catch {
        args = {}
      }
      const content = await runTool(call.function.name, args, env)
      messages.push({ role: 'tool', tool_call_id: call.id, content })
    }
  }
  return responseData
}
