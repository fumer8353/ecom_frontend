import { useEffect, useState, useMemo } from 'react'
import { api } from '../api'
import { useCart } from '../state/cart'

type Product = {
  _id: string
  name: string
  description: string
  imageUrl: string
  price: number
  category: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const { add } = useCart()

  useEffect(() => {
    let alive = true
    api
      .get('/api/products')
      .then((res) => {
        if (!alive) return
        setProducts(res.data.products || [])
      })
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load products'))
    return () => {
      alive = false
    }
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  return (
    <main>
      <div className="hero">
        <h1>Delicious Food, Delivered Fresh</h1>
        <p>Made with fresh, local ingredients and love</p>
      </div>

      {categories.length > 0 && (
        <div className="categories">
          <button
            className={`categoryBtn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`categoryBtn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {error ? <div className="alert">{error}</div> : null}

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map((p) => (
            <div className="card" key={p._id}>
              {p.imageUrl ? (
                <img className="img" src={p.imageUrl} alt={p.name} />
              ) : (
                <div className="img placeholder" />
              )}
              <div className="cardBody">
                <div className="cardTitle">{p.name}</div>
                <div className="cardDesc">{p.description}</div>
                <div className="row space">
                  <div className="price">${p.price.toFixed(2)}</div>
                  <button
                    onClick={() => add({ productId: p._id, name: p.name, price: p.price }, 1)}
                    className="btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

