import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function RegisterPage() {
  const nav = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await register(name, email, password)
      nav('/')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Sign up failed'
      const errors = err?.response?.data?.errors
      setError(errors?.length ? `${msg}: ${errors.join(' ')}` : msg)
    }
  }

  return (
    <main className="narrow">
      <h1>Create Account</h1>
      <p className="muted" style={{ marginBottom: '24px' }}>
        Join us and start ordering delicious food! Password must be 12+ characters with uppercase, lowercase, number, and symbol.
      </p>
      {error ? <div className="alert">{error}</div> : null}
      <form onSubmit={onSubmit} className="form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <button className="btn" type="submit" style={{ width: '100%' }}>
          Sign up
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </main>
  )
}

