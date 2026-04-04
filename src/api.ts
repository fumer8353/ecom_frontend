import axios from 'axios'

/** Resolved after initApi() runs (call from main.tsx before rendering). */
export const api = axios.create({
  baseURL: 'http://localhost:5000',
})

type AppConfig = {
  apiBaseUrl?: string
}

/**
 * Resolve API base URL: optional VITE_API_URL at build time, else /app-config.json (runtime), else localhost.
 * No GitHub secret required — production can ship app-config.json from CI without embedding in the bundle.
 */
export async function initApi(): Promise<void> {
  let base = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')

  if (!base) {
    try {
      const res = await fetch('/app-config.json', { cache: 'no-store' })
      if (res.ok) {
        const cfg = (await res.json()) as AppConfig
        base = (cfg.apiBaseUrl || '').trim().replace(/\/$/, '')
      }
    } catch {
      // use localhost below
    }
  }

  if (!base) {
    base = 'http://localhost:5000'
  }

  api.defaults.baseURL = base
}

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}
