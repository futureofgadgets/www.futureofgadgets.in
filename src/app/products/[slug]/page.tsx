"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

type Product = {
  id: string;
  slug: string;
  name: string;
  title: string;
  sku?: string;
  description: string;
  price: number;
  mrp?: number;
  quantity: number;
  stock: number;
  status: string;
  category: string;
  brand?: string;
  rating?: number;
  image: string;
  frontImage?: string;
  images?: string[];
  coverImage?: string;
  updatedAt: string;
};

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.frontImage || product.image || product.coverImage || "/placeholder.svg"
    });
    
    toast.success(`Added to Cart`, {
      description: `${product.name} has been added to your cart.`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart")
      }
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.frontImage || product.image || product.coverImage || "/placeholder.svg"
    });
    
    toast.success(`Redirecting to Cart`, {
      description: `${product.name} added successfully.`,
      icon: "🛒"
    });
    
    setTimeout(() => {
      router.push("/cart");
    }, 1000);
  };

  useEffect(() => {
    if (!slug) return;

    // First try to find by slug, then by ID
    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => {
        const found = products.find((p: any) => 
          p.slug === slug || 
          p.id === slug ||
          p.name.toLowerCase().replace(/\s+/g, "-") === slug
        );
        if (found) {
          setProduct(found);
        } else {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">Error 404</div>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => router.push('/')}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              🏠 Home
            </button>
            <button 
              onClick={() => router.back()}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const allImages = [];
  if (product.frontImage) allImages.push(product.frontImage);
  if (product.images && product.images.length > 0) allImages.push(...product.images);
  if (product.image && !allImages.includes(product.image)) allImages.push(product.image);
  if (product.coverImage && !allImages.includes(product.coverImage)) allImages.push(product.coverImage);
  
  const images = allImages.length > 0 ? allImages : ["/placeholder.svg"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6 lg:max-h-screen lg:overflow-y-auto scrollbar-hidden">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">{product.category}</p>
            {product.brand && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">by {product.brand}</p>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">{i < Math.floor(product.rating!) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">({product.rating})</span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-medium">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Inclusive of all taxes</p>
              <p>EMI starts at ₹{Math.round(product.price / 12)}. No Cost EMI available</p>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              (product.stock || product.quantity) > 10 ? 'bg-green-500' : 
              (product.stock || product.quantity) > 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              {(product.stock || product.quantity) > 10 ? 'In Stock' : 
               (product.stock || product.quantity) > 0 ? `Only ${product.stock || product.quantity} left` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Offers & Services */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">Offers</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">Bank Offer</span>
                <span>Upto ₹4,000 discount on SBI Credit Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">No Cost EMI</span>
                <span>EMI starts at ₹{Math.round(product.price / 12)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">Cashback</span>
                <span>Upto ₹{Math.round(product.price * 0.03)} cashback with Amazon Pay</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6 sm:hidden">
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleAddToCart}
                className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(product.stock || product.quantity) === 0}
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(product.stock || product.quantity) === 0}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>10 days Service Centre Replacement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Cash/Pay on Delivery</span>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Brand</span>
                <span className="col-span-2">{product.brand}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Model Name</span>
                <span className="col-span-2">{product.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Category</span>
                <span className="col-span-2">{product.category}</span>
              </div>
              {product.category === 'Laptops' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Screen Size</span>
                    <span className="col-span-2">15.6 Inches</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Hard Disk Size</span>
                    <span className="col-span-2">512 GB SSD</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">CPU Model</span>
                    <span className="col-span-2">Intel Core i3 13th Gen</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">RAM Memory</span>
                    <span className="col-span-2">16 GB DDR4</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Operating System</span>
                    <span className="col-span-2">Windows 11 Home</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Graphics</span>
                    <span className="col-span-2">Intel UHD Graphics</span>
                  </div>
                </>
              )}
              {product.category === 'Monitors' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Screen Size</span>
                    <span className="col-span-2">27 Inches</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Resolution</span>
                    <span className="col-span-2">4K UHD (3840 x 2160)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Refresh Rate</span>
                    <span className="col-span-2">60Hz</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Panel Type</span>
                    <span className="col-span-2">IPS</span>
                  </div>
                </>
              )}
              {product.category === 'Keyboards' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Switch Type</span>
                    <span className="col-span-2">Cherry MX Blue</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Backlight</span>
                    <span className="col-span-2">RGB</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Connectivity</span>
                    <span className="col-span-2">USB-C</span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">SKU</span>
                <span className="col-span-2">{product.sku}</span>
              </div>
            </div>
          </div>

          {/* About This Item */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">About this item</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {product.category === 'Laptops' && (
                <>
                  <li>• Processor: 13th Generation Intel Core i3-1305U (10MB, up to 4.50 GHz, 5 Core)</li>
                  <li>• RAM: 16GB: 2x8GB, DDR4, 2666 MHz & Storage: 512GB SSD</li>
                  <li>• Display: 15.6&quot; FHD WVA AG 120Hz 250 nits Narrow Border & Graphics: Intel UHD Graphics</li>
                  <li>• Keyboard: Standard Keyboard & Software: Win 11 + Office H&S 2024</li>
                  <li>• Ports: 1 USB 2.0 port, 1 Headset jack, 1 HDMI 1.4 port, 1 RJ-45 port, 1 SD card slot, USB 3.2 Gen 1 Type-C</li>
                </>
              )}
              {product.category === 'Keyboards' && (
                <>
                  <li>• Mechanical switches provide tactile feedback and durability</li>
                  <li>• RGB backlighting with customizable effects and colors</li>
                  <li>• Programmable keys with macro support</li>
                  <li>• Aluminum frame construction for premium feel</li>
                  <li>• Compatible with Windows, Mac, and Linux</li>
                </>
              )}
              {product.category === 'Monitors' && (
                <>
                  <li>• 4K UHD resolution (3840 x 2160) for crystal clear images</li>
                  <li>• IPS panel technology for accurate colors and wide viewing angles</li>
                  <li>• USB-C connectivity with power delivery support</li>
                  <li>• VESA mount compatible for flexible positioning</li>
                  <li>• Blue light reduction technology for eye comfort</li>
                </>
              )}
              {!['Laptops', 'Keyboards', 'Monitors'].includes(product.category) && (
                <li>• {product.description}</li>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6 hidden sm:block">
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(product.stock || product.quantity) === 0}
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(product.stock || product.quantity) === 0}
              >
                Buy Now
              </button>
            </div>
            
            {/* Additional Services */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Add Laptop Set-up Service</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm">Professional setup and configuration</span>
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <span>⭐ 3.7</span>
                    <span>(3855 reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹740.00</div>
                  <button className="text-xs text-blue-600 hover:underline">Add to cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}