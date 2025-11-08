import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const defaultSettings = {
  home: {
    heroTitle: 'Welcome to Future Of Gadgets',
    heroSubtitle: 'Find the best electronics at amazing prices',
    carouselImages: 5,
    todayDealsCount: 8,
    flashSaleEnabled: true,
    testimonialCount: 6
  },
  slider: [
    {
      id: 1,
      title: 'Experience Pure Sound - Your Perfect Headphones Awaits!',
      offer: 'Limited Time Offer 30% Off',
      buttonText1: 'Buy now',
      buttonText2: 'Find more',
      image: '',
      link: '/products'
    },
    {
      id: 2,
      title: 'Next-Level Gaming Starts Here - Discover PlayStation 5 Today!',
      offer: 'Hurry up only few lefts!',
      buttonText1: 'Shop Now',
      buttonText2: 'Explore Deals',
      image: '',
      link: '/products'
    },
    {
      id: 3,
      title: 'Power Meets Elegance - Apple MacBook Pro is Here for you!',
      offer: 'Exclusive Deal 40% Off',
      buttonText1: 'Order Now',
      buttonText2: 'Learn More',
      image: '',
      link: '/products'
    }
  ],
  about: {
    title: 'About Future Of Gadgets',
    description: 'We are a leading electronics retailer providing quality products since 2020.',
    mission: 'To provide the best electronics at affordable prices with excellent customer service.'
  },
  contact: {
    email: '',
    phone: '',
    address: '',
    hours: ''
  },
  sectionProducts: {
    newArrivals: [],
    dealOfTheDay: [],
    bestSeller: [],
    trendingNow: [],
    featuredSection: [],
  },
  laptopCategories: [
    { name: "Open Box Laptop's", slug: "open-box", image: "/category/laptop.jpeg", heading: "laptop" },
    { name: "Refurbished Laptop's", slug: "refurbished", image: "/category/laptop.jpeg", heading: "laptop" },
    { name: "Brand New Laptop's", slug: "brand-new", image: "/category/laptop.jpeg", heading: "laptop" },
    { name: "Desktop", slug: "desktop", image: "/category/monitor.jpeg", heading: "laptop" },
    { name: "Mobile Phone", slug: "mobile", image: "/category/accessories.png", heading: "laptop" },
    { name: "Gadgets", slug: "gadgets", image: "/category/accessories.png", heading: "laptop" },
  ],
  accessories: [
    { name: "Charger & Power Cable", slug: "charger", image: "/category/accessories.png", heading: "accessories" },
    { name: "Ram", slug: "ram", image: "/category/storage.jpeg", heading: "accessories" },
    { name: "SSD", slug: "ssd", image: "/category/storage.jpeg", heading: "accessories" },
    { name: "Battery", slug: "battery", image: "/category/accessories.png", heading: "accessories" },
    { name: "Laptop Parts", slug: "laptop-parts", image: "/category/accessories.png", heading: "accessories" },
    { name: "Screen", slug: "screen", image: "/category/monitor.jpeg", heading: "accessories" },
    { name: "Keyboard & Keyboard", slug: "keyboard", image: "/category/keyboard.jpeg", heading: "accessories" },
    { name: "Mouse & Pad", slug: "mouse", image: "/category/mouse.jpeg", heading: "accessories" },
    { name: "Monitor's", slug: "monitors", image: "/category/monitor.jpeg", heading: "accessories" },
    { name: "Cable's", slug: "cables", image: "/category/accessories.png", heading: "accessories" },
    { name: "HeadPhone", slug: "headphone", image: "/category/headphones.jpeg", heading: "accessories" },
    { name: "Speaker", slug: "speaker", image: "/category/accessories.png", heading: "accessories" },
    { name: "Cleaner", slug: "cleaner", image: "/category/accessories.png", heading: "accessories" },
    { name: "Pen Drive", slug: "pen-drive", image: "/category/storage.jpeg", heading: "accessories" },
    { name: "Laptop Stand", slug: "laptop-stand", image: "/category/accessories.png", heading: "accessories" },
    { name: "USB HUB", slug: "usb-hub", image: "/category/accessories.png", heading: "accessories" },
    { name: "External Case", slug: "external-case", image: "/category/accessories.png", heading: "accessories" },
  ]
}

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    
    if (settings.length === 0) {
      return NextResponse.json(defaultSettings)
    }
    
    const result = settings.reduce((acc, setting) => {
      acc[setting.tag] = setting.data
      return acc
    }, {} as Record<string, any>)
    
    return NextResponse.json({ ...defaultSettings, ...result })
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json(defaultSettings)
  }
}

export async function POST(req: Request) {
  try {
    const { tag, data } = await req.json()
    
    if (!tag || !data) {
      return NextResponse.json({ error: 'Tag and data are required' }, { status: 400 })
    }
    
    const setting = await prisma.setting.upsert({
      where: { tag },
      update: { data },
      create: { tag, data }
    })
    
    return NextResponse.json({ success: true, setting })
  } catch (error) {
    console.error('POST /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to save settings', details: String(error) }, { status: 500 })
  }
}
