'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SlidingHeroImages = () => {
  const images = [
    {
      src: "/donation.jpeg",
      alt: "Donation Impact",
      title: "Make an Impact Today",
      description: "Your donation helps transform lives in your community"
    },
    {
      src: "/donation.jpeg",
      alt: "Volunteer Opportunities",
      title: "Join Our Volunteers",
      is_black: true,
      description: "Be part of the change you want to see in the world"
    },
    {
      src: "/donation.jpeg",
      alt: "Community Programs",
      title: "Building Communities",
      description: "Together we create stronger, more resilient neighborhoods"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };


  return (
    <div className="relative w-full min-h-[80vh] md:h-64 lg:h-72 mb-6 mt-0 overflow-hidden">
      {/* Sliding Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              objectFit="cover"
              className="w-full h-full"
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0  bg-opacity-50 flex flex-col justify-center items-center p-4">
              <h2 className={`
                ${image.is_black ? 'text-black' : 'text-white'}
                 text-2xl font-bold text-center mb-2`}>{image.title}</h2>
              <p className={`
                ${
                  image.is_black ? 'text-orange-600' : 'text-white'
                } text-center text-sm`}>{image.description}</p>
            </div>
          </div>
        ))}
      </div>

     
  

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlidingHeroImages;