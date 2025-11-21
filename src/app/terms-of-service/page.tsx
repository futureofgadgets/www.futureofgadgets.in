"use client"
import Link from "next/link";
import { FileText, ShoppingCart, CreditCard, Truck, RotateCcw, Scale } from "lucide-react";
import { useEffect, useState } from "react";

export default function TermsOfServicePage() {
  const highlights = [
    { icon: FileText, title: 'Clear Terms', desc: 'Easy to understand policies' },
    { icon: ShoppingCart, title: 'Fair Orders', desc: 'Transparent ordering process' },
    { icon: CreditCard, title: 'Secure Payments', desc: 'Protected transactions' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' }
  ];

    const [contactSettings, setContactSettings] = useState({
      email: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.contact) setContactSettings(data.contact)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, []);
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 mt-5 sm:mt-2">
        {/* Header */}
        <div className="text-left mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-sm sm:text-base text-gray-600">Last updated: November 2025</p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-12">
          {highlights.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-sm border">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mb-3">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                1. Acceptance of Terms
              </h2>
              <p>By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                2. Account Registration
              </h2>
              <p className="mb-3">To make purchases, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                3. Product Information
              </h2>
              <p>We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, or error-free. We reserve the right to correct errors and update information at any time.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                4. Orders and Payments
              </h2>
              <p className="mb-3">When you place an order:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You agree to pay the listed price plus applicable taxes and shipping</li>
                <li>We reserve the right to refuse or cancel orders</li>
                <li>Payment must be received before order processing</li>
                <li>All sales are subject to product availability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                5. Shipping and Delivery
              </h2>
              <p>Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-red-600" />
                6. Returns and Refunds
              </h2>
              <p className="mb-3">Our return policy includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products must be returned within 30 days of delivery</li>
                <li>Items must be unused and in original packaging</li>
                <li>Refunds will be processed within 7-10 business days</li>
                <li>Shipping costs are non-refundable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-pink-600" />
                7. Intellectual Property
              </h2>
              <p>All content on this website, including text, graphics, logos, and images, is our property and protected by copyright laws. You may not reproduce or distribute any content without permission.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>We are not liable for any indirect, incidental, or consequential damages arising from your use of our services or products.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">10. Contact Information</h2>
              <p>For questions about these Terms of Service, contact us at:</p>
              {loading ? (
                <div className="mt-2 flex items-center gap-2">
                  <span>Email:</span>
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                </div>
              ) : (
                <p className="mt-2">Email: <a href={`mailto:${contactSettings.email}`} className="text-blue-600 hover:underline">{contactSettings.email}</a></p>
              )}
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <Link href="/" className="text-blue-600 hover:underline text-sm">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
