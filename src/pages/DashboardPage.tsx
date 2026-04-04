import { useEffect, useState } from 'react'
import { api } from '../api'

type Order = {
  _id: string
  status: string
  totals: { grandTotal: number }
  createdAt: string
  items: { name: string; qty: number }[]
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get('/api/orders/mine')
      .then((res) => setOrders(res.data.orders || []))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load orders'))
  }, [])

  return (
    <main className="narrow">
      <h1>My Orders</h1>
      {error ? <div className="alert">{error}</div> : null}
      {orders.length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <div className="list">
          {orders.map((o) => (
            <div className="card" key={o._id}>
              <div className="row space">
                <div>
                  <div className="cardTitle">Order #{o._id.slice(-6)}</div>
                  <div className="muted">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="pill">{o.status}</div>
              </div>
              <div className="muted">
                {o.items.map((i, idx) => (
                  <span key={idx}>
                    {i.name} x{i.qty}
                    {idx < o.items.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
              <div className="price">Total: ${o.totals.grandTotal.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

