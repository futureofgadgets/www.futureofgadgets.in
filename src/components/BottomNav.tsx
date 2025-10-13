"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag, Heart, User, ShoppingCart, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
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

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className={`flex justify-between items-center px-6 py-2 h-14 ${isAdmin ? 'px-4' : ''}`}>
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

        {/* Admin */}
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center ${
              pathname.startsWith("/admin") ? "text-orange-600" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        )}

        {/* Profile */}
        <Link
          href="/profile"
          className="flex flex-col items-center justify-center"
        >
          {session?.user ? (
            <div className="relative">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                  <span className="text-xs font-semibold text-white">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              {pathname === "/profile" && (
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-600 border border-white dark:border-gray-900" />
              )}
            </div>
          ) : (
            <User className={`w-6 h-6 ${
              pathname === "/profile" ? "text-orange-600" : "text-gray-600 dark:text-gray-400"
            }`} />
          )}
        </Link>
      </div>
    </nav>
  );
}
