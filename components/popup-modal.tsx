'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface PopupData {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_enabled: boolean;
}

export default function PopupModal() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        console.log('[v0] Fetching popup announcement...');
        const response = await fetch('/api/announcements');
        const responseText = await response.text();
        console.log('[v0] Response status:', response.status);
        console.log('[v0] Response text:', responseText);

        if (response.ok && responseText) {
          try {
            const data = JSON.parse(responseText) as PopupData;
            console.log('[v0] Parsed popup data:', data);
            if (data && data.is_enabled) {
              setPopup(data);
              setIsOpen(true);
            }
          } catch (parseError) {
            console.error('[v0] JSON parse error:', parseError);
          }
        } else {
          console.log('[v0] API returned no data or error');
        }
      } catch (error) {
        console.error('[v0] Failed to fetch popup:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      fetchPopup();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !popup) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl mx-4 overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in-scale">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-md"
          aria-label="Close popup"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Content Container */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          {popup.image_url && (
            <div className="relative h-64 md:h-auto min-h-96 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
              <Image
                src={popup.image_url || "/placeholder.svg"}
                alt={popup.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          )}

          {/* Text Section */}
          <div className={`p-8 md:p-10 flex flex-col justify-center ${popup.image_url ? 'col-span-1' : 'col-span-2'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
              {popup.title}
            </h2>

            {popup.description && (
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {popup.description}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleClose}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Learn More
              </button>
              <button
                onClick={handleClose}
                className="w-full px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
