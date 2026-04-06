import axios from 'axios'

const apiBase =
  (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export const api = axios.create({
  baseURL: apiBase,
})

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}
