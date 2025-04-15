// src/app/spotlights/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layouts/Navbar';

// Types
interface Spotlight {
  id: string;
  title: string;
  description: string;
  image: string | null;
  isActive: boolean;
  order: number;
}

export default function SpotlightsPage() {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch active spotlights
  useEffect(() => {
    const fetchSpotlights = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spotlights/active`);
        const data = await response.json();
        setSpotlights(data.spotlights);
      } catch (error) {
        console.error('Error fetching spotlights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlights();
  }, []);

  // Navigate to previous spotlight
  const prevSpotlight = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? spotlights.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next spotlight
  const nextSpotlight = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % spotlights.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (spotlights.length === 0) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black text-center mb-8">Spotlights</h1>
          <p className="text-lg text-center text-gray-700">No spotlights available at the moment. Please check back later.</p>
          <div className="mt-8 text-center">
            <Link href="/" className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSpotlight = spotlights[currentIndex];

  return (
    <div className="min-h-screen bg-white text-gray-900">
    <Navbar />
    <div className="px-4 py-6 mx-auto mt-16 sm:mt-20 w-full max-w-7xl">

      <header className="bg-[#F77665] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Our Spotlights</h1>
          <p className="mt-2 text-black">Highlighting what matters most</p>
        </div>
      </header>

      {/* Spotlight Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Navigation Buttons */}
            {spotlights.length > 1 && (
              <>
                <button 
                  onClick={prevSpotlight} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg"
                  aria-label="Previous spotlight"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={nextSpotlight} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg"
                  aria-label="Next spotlight"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Spotlight Content */}
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-square md:aspect-auto bg-gray-100">
                {currentSpotlight.image ? (
                  <img 
                    src={currentSpotlight.image} 
                    alt={currentSpotlight.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-100">
                    <span className="text-orange-500 text-lg">No image available</span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-black mb-4">{currentSpotlight.title}</h2>
                <div className="w-16 h-1 bg-orange-500 mb-6"></div>
                <p className="text-gray-700 text-lg mb-8">{currentSpotlight.description}</p>
                
                {/* Pagination Indicator */}
                {spotlights.length > 1 && (
                  <div className="flex items-center justify-center md:justify-start space-x-2 mt-auto">
                    {spotlights.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-orange-500' : 'bg-gray-300 hover:bg-orange-300'
                        }`}
                        aria-label={`Go to spotlight ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Spotlights List (Optional) */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">All Spotlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {spotlights.map((spotlight, index) => (
                <div 
                  key={spotlight.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 ${
                    index === currentIndex ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className="h-48 bg-gray-100">
                    {spotlight.image ? (
                      <img 
                        src={spotlight.image} 
                        alt={spotlight.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-100">
                        <span className="text-orange-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-black mb-2">{spotlight.title}</h4>
                    <p className="text-gray-700 text-sm line-clamp-2">{spotlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}