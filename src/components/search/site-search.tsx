"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function SiteSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    async function fetchSuggestions() {
      if (debounced.length > 1) {
        try {
          const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(debounced)}`)
          const data = await res.json()
          setSuggestions(data.suggestions || [])
        } catch (error) {
          console.error('Failed to fetch suggestions:', error)
          setSuggestions([])
        }
      } else {
        setSuggestions([])
      }
    }
    fetchSuggestions()
  }, [debounced])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-xl", className)}>
      <form onSubmit={onSubmit} className="flex h-10 items-center rounded-md border border-border bg-background px-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search for products"
          className="flex-1 bg-transparent outline-none text-foreground"
          aria-label="Search"
        />
        <button type="submit" className="ml-2 text-sm text-foreground/80 hover:text-foreground">
          Search
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-border bg-background shadow"
        >
          <ul className="max-h-80 overflow-auto">
            {suggestions.map((s: any) => (
              <li
                key={s.id}
                className="flex cursor-pointer items-center gap-3 p-3 hover:bg-muted"
                onClick={() => {
                  setOpen(false)
                  router.push(`/products/${s.slug}`)
                }}
              >
                <img
                  src={s.image || "/placeholder.svg?height=40&width=40&query=product"}
                  alt={`${s.title} image`}
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm text-foreground">{s.title}</div>
                  <div className="text-xs text-foreground/70">₹{(s.price / 100).toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-2 text-right text-xs text-foreground/70">Press Enter to search</div>
        </div>
      )}
    </div>
  )
}
