"use client"
import Link from "next/link";
import { Cookie, Settings, BarChart3, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function CookiePolicyPage() {
  const highlights = [
    { icon: Cookie, title: 'Essential', desc: 'Required for site functionality' },
    { icon: Settings, title: 'Functional', desc: 'Remember your preferences' },
    { icon: BarChart3, title: 'Analytics', desc: 'Improve user experience' },
    { icon: Zap, title: 'Performance', desc: 'Optimize site speed' }
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="text-sm sm:text-base text-gray-600">Last updated: November 2025</p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-12">
          {highlights.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-sm border">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full mb-3">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
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
                <Cookie className="w-5 h-5 text-purple-600" />
                What Are Cookies?
              </h2>
              <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Types of Cookies We Use
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and shopping cart operations.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                  <p>These cookies collect information about how visitors use our website, such as which pages are visited most often. This helps us improve our website performance.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
                  <p>These cookies allow our website to remember choices you make (such as your username or language preference) and provide enhanced features.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p>We use analytics cookies to understand how visitors interact with our website, helping us improve user experience and optimize our services.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                How We Use Cookies
              </h2>
              <p className="mb-3">We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keep you signed in to your account</li>
                <li>Remember items in your shopping cart</li>
                <li>Understand your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve website functionality and user experience</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Third-Party Cookies
              </h2>
              <p>We may use third-party services that set cookies on your device, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Google Analytics for website analytics</li>
                <li>Payment processors for secure transactions</li>
                <li>Social media platforms for sharing features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Managing Cookies
              </h2>
              <p className="mb-3">You can control and manage cookies in several ways:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser settings: Most browsers allow you to refuse or delete cookies</li>
                <li>Opt-out tools: Use browser extensions to block tracking cookies</li>
                <li>Privacy settings: Adjust your preferences in your account settings</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">Note: Disabling essential cookies may affect website functionality and your ability to use certain features.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Cookie Duration</h2>
              <p className="mb-3">We use both session and persistent cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until manually deleted</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Updates to This Policy</h2>
              <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
              <p>If you have questions about our use of cookies, please contact us at:</p>
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
