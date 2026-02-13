'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
  isOpen: boolean;
  image: string;
  title: string;
  onClose: () => void;
}

export default function ImageLightbox({ isOpen, image, title, onClose }: LightboxProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Positioned absolutely at top right */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Image Container - Full screen */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}
