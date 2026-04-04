import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  productId: string
  name: string
  price: number
  qty: number
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  itemsTotal: number
}

const CartContext = createContext<CartState | undefined>(undefined)
const LS_CART = 'pizza_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem(LS_CART)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  })

  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(items))
  }, [items])

  function add(item: Omit<CartItem, 'qty'>, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId)
      if (!existing) return [...prev, { ...item, qty }]
      return prev.map((p) => (p.productId === item.productId ? { ...p, qty: Math.min(99, p.qty + qty) } : p))
    })
  }

  function remove(productId: string) {
    setItems((prev) => prev.filter((p) => p.productId !== productId))
  }

  function setQty(productId: string, qty: number) {
    setItems((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p)),
    )
  }

  function clear() {
    setItems([])
  }

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const value = useMemo(() => ({ items, add, remove, setQty, clear, itemsTotal }), [items, itemsTotal])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

