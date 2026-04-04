import { Link } from 'react-router-dom'
import { useCart } from '../state/cart'

export default function CartPage() {
  const { items, itemsTotal, remove, setQty } = useCart()

  return (
    <main className="narrow">
      <h1>Cart</h1>
      {items.length === 0 ? (
        <p className="muted">
          Your cart is empty. <Link to="/">Go to menu</Link>.
        </p>
      ) : (
        <>
          <div className="list">
            {items.map((i) => (
              <div className="listRow" key={i.productId}>
                <div>
                  <div className="cardTitle">{i.name}</div>
                  <div className="muted">${i.price.toFixed(2)} each</div>
                </div>
                <div className="row">
                  <input
                    className="qty"
                    type="number"
                    min={1}
                    max={99}
                    value={i.qty}
                    onChange={(e) => setQty(i.productId, Number(e.target.value))}
                  />
                  <button className="btn secondary" onClick={() => remove(i.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="row space" style={{ marginTop: '24px', padding: '20px', background: 'white', borderRadius: '16px', border: '2px solid var(--border)' }}>
            <div>
              <div className="muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Total</div>
              <div className="price" style={{ fontSize: '28px' }}>${itemsTotal.toFixed(2)}</div>
            </div>
            <Link className="btn" to="/checkout" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  )
}

