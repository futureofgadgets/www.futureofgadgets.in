'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { getCookieConsent } from '@/lib/cookies';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const setCookie = (value: string) => {
    document.cookie = `cookieConsent=${value}; max-age=${31536000}; path=/; SameSite=Lax`;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full p-6 shadow-2xl animate-slide-up rounded-t-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Can we store cookies?</h3>
            <p className="text-sm text-gray-600 w-full md:w-4/5">
              We store your data locally on your device, not on our servers, to provide a better user experience. 
              This helps us remember your preferences and improve site performance. 
              Learn more in our{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
              {' '}and{' '}
              <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a>.
            </p>
          </div>
          
          <div className="flex sm:flex-col gap-3 w-full md:w-auto">
            <Button
              onClick={() => setCookie('rejected')}
              className="flex-1 md:flex-none px-6 py-2.5 border- bg-white text-black border border-gray-300 rounded-sm hover:bg-gray-50 font-medium transition hover:cursor-pointer"
            >
              Reject
            </Button>
            <Button
              onClick={() => setCookie('accepted')}
              className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 font-medium transition hover:cursor-pointer"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
