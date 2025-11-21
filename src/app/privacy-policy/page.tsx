"use client"
import Link from "next/link";
import { Shield, Lock, Eye, UserCheck, Database, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function PrivacyPolicyPage() {
  const highlights = [
    { icon: Shield, title: 'Data Protection', desc: 'Your data is encrypted and secure' },
    { icon: Lock, title: 'Secure Storage', desc: 'Industry-standard security measures' },
    { icon: Eye, title: 'Transparency', desc: 'Clear about data usage' },
    { icon: UserCheck, title: 'Your Rights', desc: 'Full control over your data' }
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600">Last updated: November 2025</p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-12">
          {highlights.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-sm border">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full mb-3">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
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
                <Database className="w-5 h-5 text-blue-600" />
                1. Information We Collect
              </h2>
              <p className="mb-3">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Order history and preferences</li>
                <li>Account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-600" />
                2. How We Use Your Information
              </h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                3. Information Sharing
              </h2>
              <p className="mb-3">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction processing</li>
                <li>Shipping companies to deliver your orders</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                4. Data Security
              </h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                5. Your Rights
              </h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                6. Cookies
              </h2>
              <p>We use cookies and similar technologies to enhance your experience. See our <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link> for more details.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
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
