"use client";
import { useEffect, useState } from "react";

export default function WhatsAppFloat() {
  const [contactSettings, setContactSettings] = useState({
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.contact) setContactSettings(data.contact);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleWhatsAppClick = () => {
    if (!loading && contactSettings.phone) {
      window.open(`https://wa.me/${contactSettings.phone}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-18 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!contactSettings.phone) return null;

  return (
    <div className="fixed bottom-18 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-75"></div>
      <button
        onClick={handleWhatsAppClick}
        className="relative bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
        className="w-10 h-10" 
      />
      </button>
    </div>
  );
}
