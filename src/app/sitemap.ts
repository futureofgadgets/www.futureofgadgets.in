import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const categories = ['laptops', 'desktops', 'monitors', 'keyboards', 'headphones']
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/cart',
    '/catalog',
    '/products',
    '/search',
    '/wishlist',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
  ]

  const staticPages = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...categoryPages]
}
