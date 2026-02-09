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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in-scale flex flex-col" 
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Image Container - Flexible and centered */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden">
          <div className="relative w-full h-full min-h-0">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 768px) 100vw, 90vw"
            />
          </div>
        </div>

        {/* Caption */}
        {title && (
          <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
            <p className="text-center text-gray-700 font-medium text-sm md:text-base">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
