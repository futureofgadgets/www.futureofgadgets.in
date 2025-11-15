'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  Home,
  Mail,
  Image as ImageIcon,
  Gift,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import LoadingButton from '@/components/ui/loading-button'
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
import Link from 'next/link'

export default function SettingsPage() {
  // ---------- states ----------
  const [activeSection, setActiveSection] = useState<string>('all')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sectionSaveLoading, setSectionSaveLoading] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)

  const [sectionProducts, setSectionProducts] = useState({
    dealOfTheDay: [] as string[],
    featuredSection: [] as string[],
    bestSeller: [] as string[],
  })

  const [homeSettings, setHomeSettings] = useState({
    heroTitle: 'Welcome to Electronic Store',
    heroSubtitle: 'Find the best electronics at amazing prices',
    featuredProducts: 6,
    carouselImages: 5,
    todayDealsCount: 8,
    flashSaleEnabled: true,
    testimonialCount: 6,
  })

  const [sliderSettings, setSliderSettings] = useState([
    { id: 1, title: '', offer: '', buttonText1: '', buttonText2: '', image: '', link: '' },
    { id: 2, title: '', offer: '', buttonText1: '', buttonText2: '', image: '', link: '' },
    { id: 3, title: '', offer: '', buttonText1: '', buttonText2: '', image: '', link: '' }
  ])
  const [sliderFiles, setSliderFiles] = useState<(File | null)[]>([null, null, null])
  const [sliderPreviews, setSliderPreviews] = useState<string[]>(['', '', ''])
  const [sliderLoading, setSliderLoading] = useState(false)

  const [aboutSettings, setAboutSettings] = useState({
    title: 'About Electronic Store',
    description: 'We are a leading electronics retailer providing quality products since 2020.',
    mission: 'To provide the best electronics at affordable prices with excellent customer service.'
  })

  const [contactSettings, setContactSettings] = useState({
    email: 'contact@electronic.com',
    phone: '+91 9876543210',
    address: '123 Electronics Street, Tech City, India',
    hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
    youtube: '',
    twitter: '',
    instagram: '',
    facebook: ''
  })

  const [youtubeVideos, setYoutubeVideos] = useState<{ id: number; url: string; saved: boolean }[]>([])
  const [editingVideo, setEditingVideo] = useState<number | null>(null)
  const [videoLoading, setVideoLoading] = useState<Record<number, boolean>>({})

  // Custom category sections
  const [customCategories, setCustomCategories] = useState<{ name: string; slug: string; image: string; heading: string }[]>([])
  const [customFiles, setCustomFiles] = useState<(File | null)[]>([])
  const [categorySections, setCategorySections] = useState<{ id: number; title: string; categories: { name: string; slug: string; image: string; heading: string }[]; files: (File | null)[]; saved: boolean }[]>([])
  const [editingSection, setEditingSection] = useState<number | null>(null)
  const [sectionLoading, setSectionLoading] = useState<Record<number, boolean>>({})
  const [promotionalBanners, setPromotionalBanners] = useState([
    { title: '', subtitle: '', description: '', link: '', bgColor: 'from-slate-900 to-slate-800', textColor: 'text-orange-400' },
    { title: '', subtitle: '', description: '', link: '', bgColor: 'from-blue-600 to-blue-700', textColor: 'text-blue-100' }
  ])
  const [promotionalLoading, setPromotionalLoading] = useState(false)

  const sections = [
    { id: 'all', name: 'All', icon: Settings, color: 'text-gray-600' },
    { id: 'home', name: 'Home Page', icon: Home, color: 'text-blue-600' },
    { id: 'slider', name: 'Home Slider', icon: ImageIcon, color: 'text-indigo-600' },
    { id: 'promotional', name: 'Promotional Banners', icon: Gift, color: 'text-orange-600' },
    { id: 'categories', name: 'Categories', icon: Package, color: 'text-green-600' },
    { id: 'contact', name: 'Contact Page', icon: Mail, color: 'text-purple-600' },
  ]

  const sectionNames: Record<string, string> = {
    dealOfTheDay: 'Deal of the Day',
    featuredSection: 'Featured Section',
    bestSeller: 'Best Seller',
  }

  // ---------- helpers ----------
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
          const ctx = canvas.getContext('2d')
          if (ctx) ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file)
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          }, 'image/jpeg', 0.85)
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
        const data = await res.json().catch(() => ({}))
        if ((data as any).url) updated[i].image = (data as any).url
      }
    }
    return updated
  }

  const handleSave = async (section: string, tag: string, data: any) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, data })
    })
    if (res.ok) {
      toast.success(`${section} settings saved successfully!`)
    } else {
      toast.error('Failed to save settings')
    }
  }

  // ---------- initial fetch ----------
  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => (r.ok ? r.json() : {})).catch(() => ({})),
      fetch('/api/products').then(r => (r.ok ? r.json() : [])).catch(() => ([]))
    ]).then(([data = {}, productsData = []]) => {
      if ((data as any).home) setHomeSettings((data as any).home)
      if ((data as any).slider) {
        setSliderSettings((data as any).slider)
        setSliderFiles((data as any).slider.map(() => null))
        setSliderPreviews((data as any).slider.map((s: any) => s.image || ''))
      }
      if ((data as any).about) setAboutSettings((data as any).about)
      if ((data as any).contact) setContactSettings((data as any).contact)
      if ((data as any).youtubeVideos) setYoutubeVideos((data as any).youtubeVideos.map((v: any) => ({ ...v, saved: true })))
      if ((data as any).sectionProducts) {
        const { newArrivals, trendingNow, ...rest } = (data as any).sectionProducts
        setSectionProducts(rest)
      }
      if ((data as any).customCategories) {
        setCustomCategories((data as any).customCategories)
        setCustomFiles((data as any).customCategories.map(() => null))
      }
      if ((data as any).categorySections) {
        setCategorySections((data as any).categorySections.map((s: any) => ({ 
          ...s, 
          saved: true,
          files: s.categories?.map(() => null) || []
        })))
      }
      if ((data as any).promotionalBanners) {
        setPromotionalBanners((data as any).promotionalBanners)
      }
      setProducts(productsData || [])
    }).catch(() => {})
  }, [])

  // ---------- renderSection ----------
  function renderSection(id: string) {
    switch (id) {
      case 'home':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Home className="h-6 w-6 text-blue-600" />
              <Link href='/' className="text-xl font-semibold text-gray-900 hover:underline underline-offset-2">Home Page Sections</Link>
            </div>

            <div className="space-y-6">
              {Object.entries(sectionProducts).map(([key, selectedIds]) => (
                <div key={key} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{sectionNames[key] || key}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-start gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(selectedIds as any[]).includes(product.id)}
                          onChange={(e) => {
                            const updated = { ...sectionProducts }
                            if (e.target.checked) {
                              updated[key as keyof typeof sectionProducts] = [...(selectedIds as any[]), product.id]
                            } else {
                              updated[key as keyof typeof sectionProducts] = (selectedIds as any[]).filter(id => id !== product.id)
                            }
                            setSectionProducts(updated)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">₹{product.price}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{(selectedIds as any[]).length} products selected</p>
                </div>
              ))}

              <LoadingButton onClick={async () => {
                setSectionSaveLoading(true)
                await handleSave('Section products', 'sectionProducts', sectionProducts)
                setSectionSaveLoading(false)
              }} loading={sectionSaveLoading} className="flex items-center gap-2">
                Save Section
              </LoadingButton>
            </div>
          </div>
        )

      case 'slider':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-6 w-6 text-indigo-600" />
                <Link target='blank' href='/' className="text-xl font-semibold text-gray-900 hover:underline underline-offset-2">Home Slider Settings</Link>
                <span className="text-sm text-gray-500">(Atleast 3 Slider is Always show)</span>
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
                  setSliderFiles([...sliderFiles, null])
                  setSliderPreviews([...sliderPreviews, ''])
                }}
                className="flex items-center gap-2"
              >
                <Gift className="h-4 w-4" />
                Add Slider
              </Button>
            </div>

            {sliderSettings.map((slide, index) => (
              <div key={slide.id} className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Slide {index + 1}</h3>
                  {sliderSettings.length > 3 ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Slide?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete this slide. This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button variant='destructive' onClick={() => {
                            const updated = sliderSettings.filter((_, i) => i !== index)
                            setSliderSettings(updated)
                            setSliderFiles(sliderFiles.filter((_, i) => i !== index))
                            setSliderPreviews(sliderPreviews.filter((_, i) => i !== index))
                            toast.success('Slide deleted successfully')
                          }}>Delete</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button variant="destructive" size="sm" disabled title="Minimum 3 slides required">Delete</Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input value={slide.title} onChange={(e) => {
                      const updated = [...sliderSettings]; updated[index].title = e.target.value; setSliderSettings(updated)
                    }} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Text</label>
                    <Input value={slide.offer} onChange={(e) => {
                      const updated = [...sliderSettings]; updated[index].offer = e.target.value; setSliderSettings(updated)
                    }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button 1 Text</label>
                      <Input value={slide.buttonText1} onChange={(e) => {
                        const updated = [...sliderSettings]; updated[index].buttonText1 = e.target.value; setSliderSettings(updated)
                      }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button 2 Text</label>
                      <Input value={slide.buttonText2} onChange={(e) => {
                        const updated = [...sliderSettings]; updated[index].buttonText2 = e.target.value; setSliderSettings(updated)
                      }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Link</label>
                    <Input value={slide.link} placeholder="/products" onChange={(e) => {
                      const updated = [...sliderSettings]; updated[index].link = e.target.value; setSliderSettings(updated)
                    }} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slide Image</label>
                    <div className="flex items-center gap-3">
                      <Input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0]; if (file) {
                          const files = [...sliderFiles]; files[index] = file; setSliderFiles(files)
                          const previews = [...sliderPreviews]; previews[index] = URL.createObjectURL(file); setSliderPreviews(previews)
                        }
                      }} />
                      {(sliderFiles[index] || slide.image) && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => {
                          const files = [...sliderFiles]; files[index] = null; setSliderFiles(files)
                          const previews = [...sliderPreviews]; previews[index] = ''; setSliderPreviews(previews)
                          const updated = [...sliderSettings]; updated[index].image = ''; setSliderSettings(updated)
                        }}>Remove</Button>
                      )}
                    </div>
                    {(sliderPreviews[index] || slide.image) && (<img src={sliderPreviews[index] || slide.image} alt="Preview" className="mt-2 h-20 object-contain" />)}
                  </div>
                </div>
              </div>
            ))}

            <LoadingButton onClick={async () => {
              setSliderLoading(true)
              try {
                const updated = await uploadSliderImages()
                await handleSave('Slider', 'slider', updated)
                setSliderFiles(updated.map(() => null))
                toast.success('Slider settings saved successfully!')
              } catch {
                toast.error('Failed to save')
              } finally {
                setSliderLoading(false)
              }
            }} loading={sliderLoading} className="mt-4 flex items-center gap-2">Save Slider</LoadingButton>
          </div>
        )

      case 'categories':
        return (
          <div className="space-y-6">
            {/* Create Category Sections */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Category Sections</h2>
                </div>
                <Button onClick={() => {
                  const newSection = { id: Date.now(), title: '', categories: [], files: [], saved: false }
                  setCategorySections([...categorySections, newSection])
                  setEditingSection(newSection.id)
                }}>Add New Section</Button>
              </div>

              <div className="space-y-6">
                {categorySections.map((section, sIdx) => (
                  <div key={section.id} className="border-2 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className='flex flex-col sm:flex-row gap-2 sm:items-center flex-1'>
                      {section.saved && editingSection !== section.id ? (
                        <Link target='blank' href={`/category/${section.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg font-semibold text-black hover:underline">
                          {section.title}
                        </Link>
                      ) : (
                        <Input 
                          placeholder="Enter category name (e.g., Laptop, Accessories)" 
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...categorySections]
                            updated[sIdx].title = e.target.value
                            setCategorySections(updated)
                          }}
                          className="text-lg font-semibold w-full sm:max-w-md"
                        />
                      )}
                     
                        {section.saved && editingSection !== section.id ? (
                          <Button onClick={() => setEditingSection(section.id)} className="w-full sm:w-auto">Update</Button>
                        ) : (
                          <LoadingButton onClick={async () => {
                            setSectionLoading(prev => ({ ...prev, [section.id]: true }))
                            try {
                              const updated = { ...section }
                              for (let i = 0; i < section.files.length; i++) {
                                if (section.files[i]) {
                                  const compressed = await compressImage(section.files[i]!)
                                  const formData = new FormData()
                                  formData.append('file', compressed)
                                  const res = await fetch('/api/upload-single', { method: 'POST', body: formData })
                                  const data = await res.json().catch(() => ({}))
                                  if ((data as any).url) updated.categories[i].image = (data as any).url
                                }
                              }
                              const allSections = [...categorySections]
                              allSections[sIdx] = { ...updated, files: updated.categories.map(() => null), saved: true }
                              const sectionsToSave = allSections.map(({ saved, files, ...rest }) => rest)
                              await handleSave('Category section', 'categorySections', sectionsToSave)
                              setCategorySections(allSections)
                              setEditingSection(null)
                            } catch (error) {
                              toast.error('Failed to save')
                            } finally { 
                              setSectionLoading(prev => ({ ...prev, [section.id]: false }))
                            }
                          }} loading={sectionLoading[section.id] || false} className="w-full sm:w-auto">Save</LoadingButton>
                        )}
                        </div>
                         <div className="flex gap-2">
                        <Button onClick={() => {
                          const updated = [...categorySections]
                          const newSlug = ''
                          const isDuplicate = updated[sIdx].categories.some(cat => cat.slug === newSlug && newSlug !== '')
                          if (isDuplicate) {
                            toast.error('Duplicate slug detected! Please use a unique slug.')
                            return
                          }
                          updated[sIdx].categories.push({ name: '', slug: '', image: '', heading: section.title })
                          updated[sIdx].files.push(null)
                          setCategorySections(updated)
                        }} className="flex-1 sm:flex-none">Add Item</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="destructive" className="flex-1 sm:flex-none">Delete</Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Section?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete this entire section. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button variant="destructive" onClick={() => {
                                setCategorySections(categorySections.filter((_, idx) => idx !== sIdx))
                                toast.success('Section deleted')
                              }}>Delete</Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {section.categories.map((cat, cIdx) => (
                        <div key={cIdx} className="p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">Item {cIdx + 1}</h4>
                            <Button variant="destructive" size="sm" onClick={() => {
                              const updated = [...categorySections]
                              updated[sIdx].categories = updated[sIdx].categories.filter((_, idx) => idx !== cIdx)
                              updated[sIdx].files = updated[sIdx].files.filter((_, idx) => idx !== cIdx)
                              setCategorySections(updated)
                              toast.success('Item deleted')
                            }}>Delete</Button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                            <Input placeholder="Name" value={cat.name} onChange={(e) => {
                              const updated = [...categorySections]
                              updated[sIdx].categories[cIdx].name = e.target.value
                              setCategorySections(updated)
                            }} />
                            <Input placeholder="Slug" value={cat.slug} onChange={(e) => {
                              const updated = [...categorySections]
                              const newSlug = e.target.value
                              const isDuplicate = updated[sIdx].categories.some((c, i) => i !== cIdx && c.slug === newSlug && newSlug !== '')
                              if (isDuplicate) {
                                toast.error('Duplicate slug! Please use a unique slug.')
                                return
                              }
                              updated[sIdx].categories[cIdx].slug = newSlug
                              setCategorySections(updated)
                            }} />
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Input type="file" accept="image/*" className="flex-1" onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const updated = [...categorySections]
                                if (!updated[sIdx].files) updated[sIdx].files = []
                                updated[sIdx].files[cIdx] = file
                                setCategorySections(updated)
                              }
                            }} />
                            {((section.files?.[cIdx]) || cat.image) && <Button variant="destructive" size="sm" onClick={() => {
                              const updated = [...categorySections]
                              if (updated[sIdx].files) updated[sIdx].files[cIdx] = null
                              updated[sIdx].categories[cIdx].image = ''
                              setCategorySections(updated)
                            }}>Remove</Button>}
                          </div>

                          {((section.files?.[cIdx]) || cat.image) && <img src={section.files?.[cIdx] ? URL.createObjectURL(section.files[cIdx]!) : cat.image} alt="Preview" className="mt-2 h-12 object-contain" />}
                        </div>
                      ))}
                    </div>


                  </div>
                ))}
              </div>

              <LoadingButton className='mt-3' onClick={async () => {
                setIsLoading(true)
                try {
                  const allSections = [...categorySections]
                  for (let sIdx = 0; sIdx < allSections.length; sIdx++) {
                    for (let i = 0; i < allSections[sIdx].files.length; i++) {
                      if (allSections[sIdx].files[i]) {
                        const compressed = await compressImage(allSections[sIdx].files[i]!)
                        const formData = new FormData()
                        formData.append('file', compressed)
                        const res = await fetch('/api/upload-single', { method: 'POST', body: formData })
                        const data = await res.json().catch(() => ({}))
                        if ((data as any).url) allSections[sIdx].categories[i].image = (data as any).url
                      }
                    }
                    allSections[sIdx].files = allSections[sIdx].categories.map(() => null)
                    allSections[sIdx].saved = true
                  }
                  const sectionsToSave = allSections.map(({ saved, files, ...rest }) => rest)
                  await handleSave('Category sections', 'categorySections', sectionsToSave)
                  setCategorySections(allSections)
                } finally { setIsLoading(false) }
              }} loading={isLoading}>Save Sections</LoadingButton>
            </div>
          </div>
        )

      case 'promotional':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Promotional Banners (2 Blocks)</h2>
            </div>

            <div className="space-y-6">
              {promotionalBanners.map((banner, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Banner {index + 1}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <Input value={banner.title} onChange={(e) => {
                        const updated = [...promotionalBanners]
                        updated[index].title = e.target.value
                        setPromotionalBanners(updated)
                      }} placeholder="e.g., LAPTOPS" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <Input value={banner.subtitle} onChange={(e) => {
                        const updated = [...promotionalBanners]
                        updated[index].subtitle = e.target.value
                        setPromotionalBanners(updated)
                      }} placeholder="e.g., Up to 40%-70% Off" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Input value={banner.description} onChange={(e) => {
                        const updated = [...promotionalBanners]
                        updated[index].description = e.target.value
                        setPromotionalBanners(updated)
                      }} placeholder="e.g., Premium laptops at affordable prices" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                      <Input value={banner.link} onChange={(e) => {
                        const updated = [...promotionalBanners]
                        updated[index].link = e.target.value
                        setPromotionalBanners(updated)
                      }} placeholder="e.g., /category/laptops" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Gradient</label>
                        <Input value={banner.bgColor} onChange={(e) => {
                          const updated = [...promotionalBanners]
                          updated[index].bgColor = e.target.value
                          setPromotionalBanners(updated)
                        }} placeholder="e.g., from-slate-900 to-slate-800" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                        <Input value={banner.textColor} onChange={(e) => {
                          const updated = [...promotionalBanners]
                          updated[index].textColor = e.target.value
                          setPromotionalBanners(updated)
                        }} placeholder="e.g., text-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <LoadingButton onClick={async () => {
                setPromotionalLoading(true)
                await handleSave('Promotional banners', 'promotionalBanners', promotionalBanners)
                setPromotionalLoading(false)
              }} loading={promotionalLoading}>Save Promotional Banners</LoadingButton>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="h-6 w-6 text-purple-600" />
                <Link target='blank' href='/contact' className="text-xl font-semibold text-gray-900 hover:underline-offset-2">Contact Page Settings</Link>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input type="email" value={contactSettings.email} onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })} placeholder="contact@example.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input value={contactSettings.phone} onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })} placeholder="+91 9876543210" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <Input value={contactSettings.address} onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })} placeholder="Store address" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                    <Input value={contactSettings.hours} onChange={(e) => setContactSettings({ ...contactSettings, hours: e.target.value })} placeholder="Mon-Fri: 9AM-6PM" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                    <Input value={contactSettings.youtube || ''} onChange={(e) => setContactSettings({ ...contactSettings, youtube: e.target.value })} placeholder="https://youtube.com/@channel" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                    <Input value={contactSettings.twitter || ''} onChange={(e) => setContactSettings({ ...contactSettings, twitter: e.target.value })} placeholder="https://twitter.com/username" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                    <Input value={contactSettings.instagram || ''} onChange={(e) => setContactSettings({ ...contactSettings, instagram: e.target.value })} placeholder="https://instagram.com/username" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                    <Input value={contactSettings.facebook || ''} onChange={(e) => setContactSettings({ ...contactSettings, facebook: e.target.value })} placeholder="https://facebook.com/page" />
                  </div>
                </div>

                <LoadingButton onClick={async () => {
                  setContactLoading(true)
                  await handleSave('Contact page', 'contact', contactSettings)
                  setContactLoading(false)
                }} loading={contactLoading} className="flex items-center gap-2">Save Contact</LoadingButton>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">YouTube Video Links</h3>
                <Button onClick={() => {
                  const newVideo = { id: Date.now(), url: '', saved: false }
                  setYoutubeVideos([...youtubeVideos, newVideo])
                  setEditingVideo(newVideo.id)
                }}>+ Add Video</Button>
              </div>

              <div className="space-y-3">
                {youtubeVideos.map((video, idx) => (
                  <div key={video.id} className="flex items-center gap-2 rounded-lg">
                    {video.saved && editingVideo !== video.id ? (
                      <>
                        <Input value={video.url} disabled className="flex-1" />
                        <Button size="sm" onClick={() => setEditingVideo(video.id)}>Edit</Button>
                      </>
                    ) : (
                      <>
                        <Input 
                          value={video.url} 
                          onChange={(e) => {
                            const updated = [...youtubeVideos]
                            updated[idx].url = e.target.value
                            setYoutubeVideos(updated)
                          }}
                          placeholder="https://youtube.com/watch?v=..."
                          className="flex-1"
                        />
                        <LoadingButton 
                          size="sm"
                          loading={videoLoading[video.id] || false}
                          disabled={!video.url.trim()}
                          onClick={async () => {
                            if (!video.url.trim()) {
                              toast.error('Please enter a video URL')
                              return
                            }
                            const isDuplicate = youtubeVideos.some((v, i) => i !== idx && v.url === video.url)
                            if (isDuplicate) {
                              toast.error('This video link already exists')
                              return
                            }
                            setVideoLoading(prev => ({ ...prev, [video.id]: true }))
                            try {
                              const updated = [...youtubeVideos]
                              updated[idx].saved = true
                              const videosToSave = updated.map(({ saved, ...rest }) => rest)
                              await handleSave('YouTube videos', 'youtubeVideos', videosToSave)
                              setYoutubeVideos(updated)
                              setEditingVideo(null)
                            } finally {
                              setVideoLoading(prev => ({ ...prev, [video.id]: false }))
                            }
                          }}
                        >
                          Save
                        </LoadingButton>
                      </>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Video Link?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete this video link.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button variant="destructive" onClick={async () => {
                            const updated = youtubeVideos.filter((_, i) => i !== idx)
                            const videosToSave = updated.map(({ saved, ...rest }) => rest)
                            await handleSave('YouTube videos', 'youtubeVideos', videosToSave)
                            setYoutubeVideos(updated)
                            toast.success('Video deleted')
                          }}>Delete</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ---------- main render ----------
  return (
    <div className="flex flex-col h-full">
      <header className="bg-white px-6 py-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your store settings and content</p>
      </header>

      <div className="flex text-sm overflow-x-auto gap-8 px-6 py-4 border-b">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`pb-0 font-medium border-b-2 transition whitespace-nowrap ${
              activeSection === section.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-400 hover:text-gray-600 cursor-pointer'
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {activeSection === 'all' ? (
          <div className="space-y-8">
            {renderSection('home')}
            {renderSection('slider')}
            {renderSection('promotional')}
            {renderSection('categories')}
            {renderSection('contact')}
          </div>
        ) : activeSection ? (
          renderSection(activeSection)
        ) : (
          <div className="space-y-8">
            {renderSection('home')}
            {renderSection('slider')}
            {renderSection('promotional')}
            {renderSection('categories')}
            {renderSection('contact')}
          </div>
        )}
      </div>
    </div>
  )
}
