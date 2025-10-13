"use client";

import Link from "next/link";
import { Home, ShoppingBag, Heart, User, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

export default function BottomNav() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const items = getCart();
      setCount(items.reduce((n, i) => n + (i.qty || 1), 0));
    };

    const updateWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };

    updateCart();
    updateWishlist();

    window.addEventListener("storage", updateCart);
    window.addEventListener("v0-cart-updated", updateCart as EventListener);
    window.addEventListener("storage", updateWishlist);
    window.addEventListener("wishlist-updated", updateWishlist as EventListener);

    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("v0-cart-updated", updateCart as EventListener);
      window.removeEventListener("storage", updateWishlist);
      window.removeEventListener("wishlist-updated", updateWishlist as EventListener);
    };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex justify-between items-center px-6 py-2 h-14">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center ${
            pathname === "/" ? "text-orange-600" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Home className="w-6 h-6" />
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="relative flex flex-col items-center justify-center"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              pathname === "/wishlist"
                ? "fill-pink-500 text-pink-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-pink-500 text-white text-[10px] font-semibold flex items-center justify-center">
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className={`relative flex flex-col items-center justify-center ${
            pathname === "/cart" ? "text-orange-600" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <ShoppingCart className="w-6 h-6" />
          {count > 0 && (
            <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-orange-600 text-white text-[10px] font-semibold flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center ${
            pathname === "/profile" ? "text-orange-600" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <User className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}
