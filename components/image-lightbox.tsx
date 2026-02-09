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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-md"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
          <div className="relative w-full h-full max-h-[calc(90vh-80px)]">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Caption */}
        {title && (
          <div className="p-4 bg-white border-t border-gray-200">
            <p className="text-center text-gray-700 font-medium">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
