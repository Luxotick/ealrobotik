import { SYSTEM_PROMPT } from './system-prompt.js'

const UPSTREAM_URL = 'https://opencode.ai/zen/v1/chat/completions'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
const GEMINI_FALLBACK_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite'
]
const TBA_API_URL = 'https://www.thebluealliance.com/api/v3'
const DDG_LITE_URL = 'https://lite.duckduckgo.com/lite/'
const DDG_HTML_URL = 'https://html.duckduckgo.com/html/'
const DEFAULT_MODEL = 'deepseek-v4-flash-free'
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_team_info',
      description:
        'The Blue Alliance platformu Ã¼zerinden FRC takÄ±m bilgisi aratmasÄ± yapar. ' +
        'Ã‡Ä±ktÄ± JSON formatÄ±nda dÃ¶ner. Girdi olarak takÄ±m numarasÄ± girilmelidir (Ã¶rn. 8828).',
      parameters: {
        type: 'object',
        properties: {
          team_number: {
            type: 'integer',
            description: 'FRC takÄ±m numarasÄ± (Ã¶rn. 8828)'
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
        'Ä°nternette web aramasÄ± yapar ve sonuÃ§ listesi dÃ¶ndÃ¼rÃ¼r. ' +
        'GÃ¼ncel bilgi, haber, sonuÃ§ veya dÄ±ÅŸ doÄŸrulama gerektiren sorularda kullan. ' +
        'SonuÃ§lar title, url ve snippet alanlarÄ±yla JSON liste olarak gelir.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Net ve kÄ±sa arama sorgusu (Ã¶rn. "FRC 2026 REBUILT")'
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
        'Verilen URLdeki web sayfasÄ±nÄ± aÃ§ar ve sayfanÄ±n metin iÃ§eriÄŸini dÃ¶ndÃ¼rÃ¼r. ' +
        'Arama sonuÃ§larÄ±ndaki siteleri incelemek, detaylÄ± bilgi almak iÃ§in kullan. ' +
        'Sayfa HTMLden arÄ±ndÄ±rÄ±lmÄ±ÅŸ dÃ¼z metin olarak gelir.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'Ziyaret edilecek sayfanÄ±n tam URLsi (https:// ile baÅŸlamalÄ±)'
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
const MAX_TOKENS = 1024
const MAX_TOOL_ROUNDS = 5
const MAX_SEARCH_RESULTS = 8
const MAX_SNIPPET_LENGTH = 500
const MAX_QUERY_LENGTH = 300
const MAX_PAGE_CHARS = 8000
const MAX_PAGE_BYTES = 5 * 1024 * 1024
const UPSTREAM_TIMEOUT_MS = 30000
const STREAM_TIMEOUT_MS = 120000

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

async function callUpstream(body, env, ip, timeoutMs = UPSTREAM_TIMEOUT_MS) {
  return fetch(UPSTREAM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENCODE_API_KEY}`,
      'User-Agent': 'opencode/1.21.12',
      'x-real-ip': ip
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs)
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
        message: 'Ã‡ok fazla istek gÃ¶nderdin, bir dakika bekleyip tekrar dene.'
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
      data =
        payload.stream === true
          ? await runLoopStream(messages, maxTokens, env, ip)
          : await chatLoop(messages, maxTokens, env, ip)
    } catch (err) {
      console.error('upstream_unreachable', err.message)
      return json(502, { error: 'upstream_unreachable' })
    }

    if (payload.stream === true) {
      return new Response(data, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive'
        }
      })
    }

    return json(200, data)
  }
}

async function chatLoop(messages, maxTokens, env, ip) {
  const routes = [(body) => callUpstream(body, env, ip)]
  if (env.GOOGLE_API_KEY) {
    for (const model of GEMINI_FALLBACK_MODELS) {
      routes.push((body) => callGemini(body, env, model))
    }
  }
  let lastErr = null
  for (const route of routes) {
    try {
      return await runLoop(messages, maxTokens, env, route)
    } catch (err) {
      lastErr = err
      console.error('route_failed', err.message.slice(0, 200))
    }
  }
  throw lastErr || new Error('no_route_available')
}

async function runLoop(messages, maxTokens, env, route) {
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
    if (env.THINKING !== 'off') body.reasoning_effort = 'medium'

    const upstream = await route(body)
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
    const firstMessage = parsed.choices?.[0]?.message
    if (firstMessage?.extra_content) delete firstMessage.extra_content
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

async function callGemini(body, env, model, timeoutMs = UPSTREAM_TIMEOUT_MS) {
  return fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GOOGLE_API_KEY}`
    },
    body: JSON.stringify({ ...body, model }),
    signal: AbortSignal.timeout(timeoutMs)
  })
}

function runLoopStream(messages, maxTokens, env, ip) {
  return new ReadableStream({
    async start(controller) {
      const emit = obj => {
        try {
          controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(obj) + '\n\n'))
        } catch {}
      }
      const routes = [(body, t) => callUpstream(body, env, ip, t)]
      if (env.GOOGLE_API_KEY) {
        for (const model of GEMINI_FALLBACK_MODELS) {
          routes.push((body, t) => callGemini(body, env, model, t))
        }
      }

      let lastErr = null
      for (const route of routes) {
        try {
          await streamRounds(messages, maxTokens, env, route, emit)
          try {
            controller.close()
          } catch {}
          return
        } catch (err) {
          lastErr = err
          console.error('stream_route_failed', err.message.slice(0, 200))
        }
      }
      emit({ type: 'error', message: (lastErr?.message || 'no_route').slice(0, 200) })
      try {
        controller.close()
      } catch {}
    }
  })
}

async function streamRounds(messages, maxTokens, env, route, emit) {
  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    emit({ type: 'thinking' })
    const body = {
      model: env.MODEL || DEFAULT_MODEL,
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: true
    }
    if (env.THINKING !== 'off') body.reasoning_effort = 'medium'

    const upstream = await route(body, STREAM_TIMEOUT_MS)
    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      console.error('upstream_status', upstream.status)
      throw new Error('upstream_status_' + upstream.status + '_' + detail.slice(0, 200))
    }

    const { content, toolCalls } = await readStream(upstream, emit)
    if (!toolCalls.length) {
      emit({ type: 'done' })
      return
    }

    messages.push({ role: 'assistant', content, tool_calls: toolCalls })
    for (const call of toolCalls) {
      if (call.type !== 'function' || !call.id) continue
      let args = {}
      try {
        args = JSON.parse(call.function.arguments || '{}')
      } catch {
        args = {}
      }
      const toolContent = await runTool(call.function.name, args, env)
      messages.push({ role: 'tool', tool_call_id: call.id, content: toolContent })
    }
  }
  emit({ type: 'done' })
}

async function readStream(upstream, emit) {
  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let content = ''
  const toolCalls = new Map()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let idx
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx).trim()
        buffer = buffer.slice(idx + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') return { content, toolCalls: [...toolCalls.values()] }
        let j
        try {
          j = JSON.parse(data)
        } catch {
          continue
        }
        const delta = j.choices?.[0]?.delta
        if (!delta) continue
        if (delta.content) {
          content += delta.content
          emit({ type: 'text', text: delta.content })
        }
        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            let acc = toolCalls.get(tc.index ?? 0)
            if (!acc) {
              acc = {
                index: tc.index ?? 0,
                id: '',
                type: 'function',
                function: { name: '', arguments: '' }
              }
              toolCalls.set(acc.index, acc)
            }
            if (tc.id) acc.id = tc.id
            if (tc.type) acc.type = tc.type
            if (tc.function?.name) acc.function.name += tc.function.name
            if (tc.function?.arguments) acc.function.arguments += tc.function.arguments
          }
        }
      }
    }
  } finally {
    try {
      reader.releaseLock()
    } catch {}
  }
  return { content, toolCalls: [...toolCalls.values()] }
}
