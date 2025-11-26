import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Future of Gadgets - Electronics Store',
    short_name: 'Future of Gadgets',
    description: 'Modern e-commerce platform for electronics and tech products',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2874f0',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
