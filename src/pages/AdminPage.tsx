import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api'

type Product = { _id: string; name: string; price: number; isActive: boolean; description?: string; imageUrl?: string }
type User = { _id: string; name: string; email: string; role: 'user' | 'admin'; disabled: boolean }
type Order = { _id: string; status: string; createdAt: string; totals: { grandTotal: number }; user?: { name: string; email: string } }

export default function AdminPage() {
  const [tab, setTab] = useState<'products' | 'users' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  const [pName, setPName] = useState('')
  const [pPrice, setPPrice] = useState<number>(9.99)
  const [pDesc, setPDesc] = useState('')
  const [pImageUrl, setPImageUrl] = useState('')

  async function loadAll() {
    setError(null)
    try {
      const [p, u, o] = await Promise.all([
        api.get('/api/products?includeInactive=1'),
        api.get('/api/admin/users'),
        api.get('/api/admin/orders'),
      ])
      setProducts(p.data.products || [])
      setUsers(u.data.users || [])
      setOrders(o.data.orders || [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load admin data')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function createProduct(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/api/products', { name: pName, price: Number(pPrice), description: pDesc, imageUrl: pImageUrl })
      setPName('')
      setPDesc('')
      setPImageUrl('')
      await loadAll()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create product')
    }
  }

  async function toggleProduct(p: Product) {
    await api.put(`/api/products/${p._id}`, { isActive: !p.isActive })
    await loadAll()
  }

  async function updateUser(u: User, patch: Partial<User>) {
    await api.patch(`/api/admin/users/${u._id}`, patch)
    await loadAll()
  }

  async function updateOrder(o: Order, status: string) {
    await api.patch(`/api/admin/orders/${o._id}`, { status })
    await loadAll()
  }

  return (
    <main>
      <h1>Admin Panel</h1>
      {error ? <div className="alert">{error}</div> : null}

      <div className="tabs">
        <button className={tab === 'products' ? 'tab active' : 'tab'} onClick={() => setTab('products')}>
          Products
        </button>
        <button className={tab === 'users' ? 'tab active' : 'tab'} onClick={() => setTab('users')}>
          Users
        </button>
        <button className={tab === 'orders' ? 'tab active' : 'tab'} onClick={() => setTab('orders')}>
          Orders
        </button>
      </div>

      {tab === 'products' ? (
        <section className="narrow">
          <h2>Add Product</h2>
          <form className="form" onSubmit={createProduct}>
            <label>
              Name
              <input value={pName} onChange={(e) => setPName(e.target.value)} required />
            </label>
            <label>
              Price
              <input value={pPrice} onChange={(e) => setPPrice(Number(e.target.value))} type="number" step="0.01" />
            </label>
            <label>
              Description
              <input value={pDesc} onChange={(e) => setPDesc(e.target.value)} />
            </label>
            <label>
              Image URL
              <input value={pImageUrl} onChange={(e) => setPImageUrl(e.target.value)} />
            </label>
            <button className="btn" type="submit">
              Create
            </button>
          </form>

          <h2>All Products</h2>
          <div className="list">
            {products.map((p) => (
              <div className="listRow" key={p._id}>
                <div>
                  <div className="cardTitle">
                    {p.name} {p.isActive ? '' : <span className="muted">(inactive)</span>}
                  </div>
                  <div className="muted">${p.price.toFixed(2)}</div>
                </div>
                <button className="btn secondary" onClick={() => toggleProduct(p)}>
                  {p.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'users' ? (
        <section className="narrow">
          <h2>Users</h2>
          <div className="list">
            {users.map((u) => (
              <div className="listRow" key={u._id}>
                <div>
                  <div className="cardTitle">
                    {u.name} <span className="muted">({u.email})</span>
                  </div>
                  <div className="muted">
                    role: {u.role} · {u.disabled ? 'disabled' : 'active'}
                  </div>
                </div>
                <div className="row">
                  <button
                    className="btn secondary"
                    onClick={() => updateUser(u, { role: u.role === 'admin' ? 'user' : 'admin' })}
                  >
                    Toggle admin
                  </button>
                  <button className="btn secondary" onClick={() => updateUser(u, { disabled: !u.disabled })}>
                    {u.disabled ? 'Enable' : 'Disable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'orders' ? (
        <section className="narrow">
          <h2>Orders</h2>
          <div className="list">
            {orders.map((o) => (
              <div className="card" key={o._id}>
                <div className="row space">
                  <div>
                    <div className="cardTitle">#{o._id.slice(-6)}</div>
                    <div className="muted">
                      {o.user ? `${o.user.name} (${o.user.email})` : '—'} · {new Date(o.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="price">${o.totals.grandTotal.toFixed(2)}</div>
                </div>
                <div className="row space">
                  <div className="pill">{o.status}</div>
                  <select value={o.status} onChange={(e) => updateOrder(o, e.target.value)}>
                    {['placed', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((s) => (
                      <option value={s} key={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

