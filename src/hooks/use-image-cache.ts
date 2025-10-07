import { useState, useEffect } from 'react'

const imageCache = new Map<string, string>()

export function useImageCache(src: string) {
  const [cachedSrc, setCachedSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (imageCache.has(src)) {
      setCachedSrc(imageCache.get(src)!)
      setLoading(false)
      return
    }

    // For Cloudinary URLs, preload
    const img = new Image()
    img.onload = () => {
      imageCache.set(src, src)
      setCachedSrc(src)
      setLoading(false)
    }
    img.onerror = () => {
      setLoading(false)
    }
    img.src = src
  }, [src])

  return { cachedSrc, loading }
}