'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const [socialLinks, setSocialLinks] = useState({ youtube: '', twitter: '', instagram: '', facebook: '' });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.contact) {
          setSocialLinks({
            youtube: data.contact.youtube || '',
            twitter: data.contact.twitter || '',
            instagram: data.contact.instagram || '',
            facebook: data.contact.facebook || ''
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className={`bg-gradient-to-b mx-auto from-gray-900 to-black text-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <img src="/logo.png" alt="Logo" className="h-10 w-full rounded" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Future Of Gadgets</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Your trusted partner for cutting-edge electronics and innovative tech gadgets.</p>
            <div className="flex space-x-3">
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="YouTube">
                  <img src="/share/youtube.png" alt="YouTube" className="w-6 h-6" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="Twitter">
                  <img src="/share/twitter.png" alt="Twitter" className="w-6 h-6" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="Instagram">
                  <img src="/share/instagram.png" alt="Instagram" className="w-6 h-6" />
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="Facebook">
                  <img src="/share/facebook.png" alt="Facebook" className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/category/laptops" className="text-gray-400 hover:text-blue-400 transition-colors">Laptops</Link></li>
              <li><Link href="/category/smartphones" className="text-gray-400 hover:text-blue-400 transition-colors">Smartphones</Link></li>
              <li><Link href="/category/headphones" className="text-gray-400 hover:text-blue-400 transition-colors">Headphones</Link></li>
              <li><Link href="/category/monitors" className="text-gray-400 hover:text-blue-400 transition-colors">Monitors</Link></li>
              <li><Link href="/category" className="text-gray-400 hover:text-blue-400 transition-colors">All Categories</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</Link></li>
              {/* <li><Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Support</Link></li> */}
              <li><Link href="/orders" className="text-gray-400 hover:text-blue-400 transition-colors">Track Orders</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-blue-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="text-gray-400 hover:text-blue-400 transition-colors">All Products</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 hover:text-blue-400 transition-colors">Wishlist</Link></li>
              <li><Link href="/cart" className="text-gray-400 hover:text-blue-400 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-blue-400 transition-colors">My Account</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center sm:text-left">© 2025 Future Of Gadgets. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}