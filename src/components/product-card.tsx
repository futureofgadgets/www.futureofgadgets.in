"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";

export default function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();
  const discounted = product.mrp && product.mrp > product.price;
  const discountPct =
    discounted && product.mrp
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-gray-50">
        {discounted && discountPct > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
            {discountPct}% OFF
          </div>
        )}
        <CloudinaryImage
          src={product.frontImage || product.image || "/no-image.svg"}
          alt={`${product.name} image`}
          width={500}
          height={300}
          className="h-48 sm:h-56 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block mb-2">
          <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 min-h-[40px] transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.brand && (
          <div className="text-xs text-gray-500 mb-3">{product.brand}</div>
        )}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {discounted && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp?.toLocaleString()}
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  {discountPct}% off
                </span>
              </>
            )}
          </div>
          {product.quantity === 0 ? (
            <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
          ) : product.quantity <= 5 ? (
            <span className="text-xs text-orange-600 font-semibold">Only {product.quantity} left</span>
          ) : (
            <span className="text-xs text-green-600 font-semibold">In Stock</span>
          )}
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-semibold py-2.5 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          onClick={() => {
            addToCart({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.frontImage || product.image,
            });
            toast({
              title: "Added to cart",
              description: `${product.name} has been added to your cart.`,
            });
          }}
          disabled={product.quantity <= 0}
        >
          {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
