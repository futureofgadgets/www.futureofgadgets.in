'use client'

import { useState, useEffect } from 'react'
import { Settings, Home, Info, Mail, Save, Image, Tag, Star, Zap, Gift, Edit, Cross, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string>('all')
  const [homeSettings, setHomeSettings] = useState({
    heroTitle: 'Welcome to Future Of Gadgets',
    heroSubtitle: 'Find the best electronics at amazing prices',
    featuredProducts: 6,
    carouselImages: 5,
    todayDealsCount: 8,
    flashSaleEnabled: true,
    testimonialCount: 6
  })

  const [sliderSettings, setSliderSettings] = useState([
    { id: 1, title: '', offer: '', buttonText1: '', buttonText2: '', image: '', link: '' },
    { id: 2, title: '', offer: '', buttonText1: '', buttonText2: '', image: '', link: '' },
    { id: 3, title: '', offer: '', buttonText1: '', buttonText2: '', image: '', link: '' }
  ])
  const [sliderFiles, setSliderFiles] = useState<(File | null)[]>([null, null, null])
  const [sliderPreviews, setSliderPreviews] = useState<string[]>(['', '', ''])

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width, height = img.height
          const maxSize = 1200
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          } else if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => resolve(new File([blob!], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.85)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadSliderImages = async () => {
    const updated = [...sliderSettings]
    for (let i = 0; i < sliderFiles.length; i++) {
      if (sliderFiles[i]) {
        const compressed = await compressImage(sliderFiles[i]!)
        const formData = new FormData()
        formData.append('file', compressed)
        const res = await fetch('/api/upload-single', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.url) updated[i].image = data.url
      }
    }
    return updated
  }

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.home) setHomeSettings(data.home)
        if (data.slider) {
          setSliderSettings(data.slider)
          setSliderFiles(data.slider.map(() => null))
          setSliderPreviews(data.slider.map((s: any) => s.image || ''))
        }
        if (data.about) setAboutSettings(data.about)
        if (data.contact) setContactSettings(data.contact)
      })
      .catch(() => {})
  }, [])

  const [aboutSettings, setAboutSettings] = useState({
    title: 'About Future Of Gadgets',
    description: 'We are a leading electronics retailer providing quality products since 2020.',
    mission: 'To provide the best electronics at affordable prices with excellent customer service.'
  })

  const [contactSettings, setContactSettings] = useState({
    email: '',
    phone: '',
    address: '',
    hours: ''
  })

  const handleSave = async (section: string, tag: string, data: any) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag, data })
      })
      if (res.ok) {
        toast.success(`${section} settings saved successfully!`)
      }
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const sections = [
    { id: 'all', name: 'All', icon: Settings, color: 'text-gray-600' },
    { id: 'home', name: 'Home Page', icon: Home, color: 'text-blue-600' },
    { id: 'slider', name: 'Home Slider', icon: Image, color: 'text-indigo-600' },
    { id: 'deals', name: "Today's Deals", icon: Tag, color: 'text-red-600' },
    { id: 'flash', name: 'Flash Sale', icon: Zap, color: 'text-yellow-600' },
    { id: 'testimonials', name: 'Testimonials', icon: Star, color: 'text-amber-600' },
    { id: 'contact', name: 'Contact Page', icon: Mail, color: 'text-purple-600' },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white px-4 sm:px-6 py-4 sm:py-6 border-b shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage your store settings and content</p>
      </header>

      <div className="flex text-xs sm:text-sm overflow-x-auto gap-4 sm:gap-8 px-4 sm:px-6 py-3 sm:py-4 border-b bg-white">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`pb-2 font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === section.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 cursor-pointer'
            }`}
          >
            <section.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {section.name}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        {activeSection === 'all' ? (
          <div className="space-y-8">
            {renderSection('home')}
            {renderSection('slider')}
            {renderSection('deals')}
            {renderSection('flash')}
            {renderSection('testimonials')}
            {renderSection('contact')}
          </div>
        ) : activeSection ? (
          renderSection(activeSection)
        ) : (
          <div className="space-y-8">
            {renderSection('home')}
            {renderSection('slider')}
            {renderSection('deals')}
            {renderSection('flash')}
            {renderSection('testimonials')}
            {renderSection('contact')}
          </div>
        )}
      </div>
    </div>
  )

  function renderSection(id: string) {
    switch(id) {
      case 'home':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Home Page Sections</h2>
            </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deals of the Day - Products Count</label>
                <Input
                  type="number"
                  value={homeSettings.todayDealsCount}
                  onChange={(e) => setHomeSettings({...homeSettings, todayDealsCount: parseInt(e.target.value)})}
                  placeholder="8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Best of Electronics - Products Count</label>
                <Input
                  type="number"
                  value={homeSettings.featuredProducts}
                  onChange={(e) => setHomeSettings({...homeSettings, featuredProducts: parseInt(e.target.value)})}
                  placeholder="6"
                />
              </div>
            </div>
            
              <Button onClick={() => handleSave('Home page', 'home', homeSettings)} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Home Settings
              </Button>
            </div>
          </div>
        )
      case 'slider':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-wrap gap-2 items-center justify-between mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Image className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Home Slider Settings</h2>
              <span className="text-xs sm:text-sm text-gray-500">(Min 3 sliders)</span>
            </div>
            <Button
              onClick={() => {
                const newSlide = {
                  id: sliderSettings.length + 1,
                  title: '',
                  offer: '',
                  buttonText1: '',
                  buttonText2: '',
                  image: '',
                  link: '/products'
                }
                setSliderSettings([...sliderSettings, newSlide])
              }}
              size="sm"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Add Slider
            </Button>
          </div>
          
          {sliderSettings.map((slide, index) => (
            <div key={slide.id} className="mb-4 sm:mb-6 p-3 sm:p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700">Slide {index + 1}</h3>
                {sliderSettings.length > 3 ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Slide?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this slide. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          variant='destructive'
                          onClick={() => {
                            const updated = sliderSettings.filter((_, i) => i !== index)
                            setSliderSettings(updated)
                            toast.success('Slide deleted successfully')
                          }}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button variant="destructive" size="sm" disabled title="Minimum 3 slides required">
                    Delete
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    value={slide.title}
                    onChange={(e) => {
                      const updated = [...sliderSettings]
                      updated[index].title = e.target.value
                      setSliderSettings(updated)
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Text</label>
                  <Input
                    value={slide.offer}
                    onChange={(e) => {
                      const updated = [...sliderSettings]
                      updated[index].offer = e.target.value
                      setSliderSettings(updated)
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button 1 Text</label>
                    <Input
                      value={slide.buttonText1}
                      onChange={(e) => {
                        const updated = [...sliderSettings]
                        updated[index].buttonText1 = e.target.value
                        setSliderSettings(updated)
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button 2 Text</label>
                    <Input
                      value={slide.buttonText2}
                      onChange={(e) => {
                        const updated = [...sliderSettings]
                        updated[index].buttonText2 = e.target.value
                        setSliderSettings(updated)
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Link</label>
                  <Input
                    value={slide.link}
                    placeholder="/products"
                    onChange={(e) => {
                      const updated = [...sliderSettings]
                      updated[index].link = e.target.value
                      setSliderSettings(updated)
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slide Image</label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const files = [...sliderFiles]
                          files[index] = file
                          setSliderFiles(files)
                          const previews = [...sliderPreviews]
                          previews[index] = URL.createObjectURL(file)
                          setSliderPreviews(previews)
                        }
                      }}
                    />
                    {(sliderFiles[index] || slide.image) && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const files = [...sliderFiles]
                          files[index] = null
                          setSliderFiles(files)
                          const previews = [...sliderPreviews]
                          previews[index] = ''
                          setSliderPreviews(previews)
                          const updated = [...sliderSettings]
                          updated[index].image = ''
                          setSliderSettings(updated)
                        }}
                      >
                        <X className='w-5 h-5'/>
                      </Button>
                    )}
                  </div>
                  {(sliderPreviews[index] || slide.image) && (
                    <img src={sliderPreviews[index] || slide.image} alt="Preview" className="mt-2 h-20 object-contain" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <Button onClick={async () => {
            const loadingToast = toast.loading('Uploading images and saving...')
            try {
              const updated = await uploadSliderImages()
              await handleSave('Slider', 'slider', updated)
              setSliderFiles(updated.map(() => null))
              toast.dismiss(loadingToast)
            } catch (error) {
              toast.error('Failed to save', { id: loadingToast })
            }
          }} className="mt-4 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Slider Settings
            </Button>
          </div>
        )
      case 'deals':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Today&apos;s Deals Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <Input placeholder="Today's Best Deals" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Range</label>
              <Input placeholder="Up to 70% Off" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timer Duration (hours)</label>
              <Input type="number" placeholder="24" />
            </div>
          </div>
          
            <Button className="mt-4 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Deals Settings
            </Button>
          </div>
        )
      case 'flash':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Flash Sale Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flash Sale Title</label>
              <Input placeholder="⚡ Flash Sale - Limited Time!" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale Duration (minutes)</label>
              <Input type="number" placeholder="60" />
            </div>
          </div>
          
            <Button className="mt-4 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Flash Sale Settings
            </Button>
          </div>
        )
      case 'testimonials':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Customer Testimonials</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <Input placeholder="What Our Customers Say" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="showRatings" className="rounded" />
              <label htmlFor="showRatings" className="text-sm font-medium text-gray-700">Show Star Ratings</label>
            </div>
          </div>
          
            <Button className="mt-4 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Testimonial Settings
            </Button>
          </div>
        )
      case 'contact':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Page Settings</h2>
          </div>
          
          <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input
                type="email"
                value={contactSettings.email}
                onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                placeholder="contact@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input
                value={contactSettings.phone}
                onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
                placeholder="+91 9876543210"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input
                value={contactSettings.address}
                onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
                placeholder="Store address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
              <Input
                value={contactSettings.hours}
                onChange={(e) => setContactSettings({...contactSettings, hours: e.target.value})}
                placeholder="Mon-Fri: 9AM-6PM"
              />
            </div>
          </div>
            
              <Button onClick={() => handleSave('Contact page', 'contact', contactSettings)} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Contact Settings
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }
}

