"use client"

import { toast } from 'sonner'

type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  qty?: number
  color?: string
  selectedRam?: string
  selectedStorage?: string
  warranty?: { duration: string; price: number }
}

const KEY = "v0_cart"

function read(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(items))
  try {
    window.dispatchEvent(new CustomEvent("v0-cart-updated", { detail: { items } }))
  } catch {
    // no-op
  }
}

export function getCart(): CartItem[] {
  return read()
}

export function addToCart(item: CartItem) {
  const items = read()
  const idx = items.findIndex((i) => 
    i.id === item.id && 
    i.color === item.color &&
    i.selectedRam === item.selectedRam &&
    i.selectedStorage === item.selectedStorage &&
    i.warranty?.duration === item.warranty?.duration
  )
  if (idx >= 0) {
    items[idx].qty = (items[idx].qty || 1) + 1
  } else {
    items.push({ ...item, qty: 1 })
  }
  write(items)
}

export function updateQty(id: string, qty: number, color?: string, selectedRam?: string, selectedStorage?: string, warranty?: { duration: string; price: number }) {
  const items = read()
  const idx = items.findIndex((i) => 
    i.id === id &&
    i.color === color &&
    i.selectedRam === selectedRam &&
    i.selectedStorage === selectedStorage &&
    i.warranty?.duration === warranty?.duration
  )
  if (idx >= 0) {
    if (qty <= 0) items.splice(idx, 1)
    else items[idx].qty = qty
    write(items)
  }
}

export function removeFromCart(id: string, color?: string, selectedRam?: string, selectedStorage?: string, warranty?: { duration: string; price: number }) {
  const items = read().filter((i) => !(
    i.id === id &&
    i.color === color &&
    i.selectedRam === selectedRam &&
    i.selectedStorage === selectedStorage &&
    i.warranty?.duration === warranty?.duration
  ))
  write(items)
}

export function clearCart() {
  write([])
  if (typeof window !== "undefined") {
    localStorage.removeItem('appliedPromo')
    window.dispatchEvent(new CustomEvent("v0-cart-updated", { detail: { items: [] } }))
  }
}

export function clearPromoCode() {
  if (typeof window !== "undefined") {
    localStorage.removeItem('appliedPromo')
  }
}

export function updateWarranty(id: string, newWarranty: { duration: string; price: number } | undefined, color?: string, selectedRam?: string, selectedStorage?: string, currentWarranty?: { duration: string; price: number }) {
  const items = read()
  const idx = items.findIndex((i) => 
    i.id === id &&
    i.color === color &&
    i.selectedRam === selectedRam &&
    i.selectedStorage === selectedStorage &&
    i.warranty?.duration === currentWarranty?.duration
  )
  if (idx >= 0) {
    const item = items[idx]
    const basePrice = currentWarranty ? item.price - currentWarranty.price : item.price
    items[idx] = {
      ...item,
      warranty: newWarranty,
      price: basePrice + (newWarranty?.price || 0)
    }
    write(items)
  }
}
