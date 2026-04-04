import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useCart } from '../state/cart'

export default function CheckoutPage() {
  const nav = useNavigate()
  const { items, itemsTotal, clear } = useCart()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      setError('Cart is empty.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await api.post('/api/orders', {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        shipping: { address, city, phone, note },
      })
      clear()
      nav('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Checkout failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="narrow">
      <h1>Checkout</h1>
      <div className="muted">Total: ${itemsTotal.toFixed(2)}</div>
      {error ? <div className="alert">{error}</div> : null}
      <form onSubmit={onSubmit} className="form">
        <label>
          Address
          <input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label>
          City
          <input value={city} onChange={(e) => setCity(e.target.value)} required />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          Note (optional)
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <button className="btn" disabled={saving} type="submit">
          {saving ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </main>
  )
}

