import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const defaultSettings = {
  home: {
    heroTitle: 'Welcome to Future Of Gadgets',
    heroSubtitle: 'Find the best electronics at amazing prices',
    featuredProducts: 6,
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
  }
}

export async function GET() {
  const settings = await prisma.setting.findMany()
  
  if (settings.length === 0) {
    return NextResponse.json(defaultSettings)
  }
  
  const result = settings.reduce((acc, setting) => {
    acc[setting.tag] = setting.data
    return acc
  }, {} as Record<string, any>)
  
  return NextResponse.json(result)
}

export async function POST(req: Request) {
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
}
