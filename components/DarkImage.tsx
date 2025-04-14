'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import StatisticsCards from './StatisticsCards';

const SlidingHeroImages = () => {
  const images = [
    {
      src: "/home1.png",
      alt: "Making a Difference",
      title: "REPROCOLLECTIVE",
      description: "Collective Action , lasting impact.",
      cta: "Contribute now",
      ctaLink: "/#about"
    },
    {
      src: "/home4.jpg",
      alt: "Volunteer Making Impact",
      title: "REPROCOLLECTIVE",
      description: "Collective Action , lasting impact.",
      cta: "Get Involved",
      ctaLink: "/#about"
    },
    {
      src: "/home2.jpg",
      alt: "Community Gathering",
      title: "REPROCOLLECTIVE",
      description: "Collective Action , lasting impact.",
      cta: "Our Programs",
      ctaLink: "/#about"
    },
    {
      src: "/home3.jpg",
      alt: "Success Story",
      title: "REPROCOLLECTIVE",
      description: "Collective Action , lasting impact.",
      cta: "Read Stories",
      ctaLink: "/reports"
    },
    {
      src: "/home4.jpg",
      alt: "Community Event",
      title: "REPROCOLLECTIVE",
      description: "Collective Action , lasting impact.",
      cta: "View Events",
      ctaLink: "/report"
    },
    
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Auto slide every 5 seconds, but pause on hover
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length, isHovering]);

  // Manual navigation
  // interface ImageData {
  //   src: string;
  //   alt: string;
  //   title: string;
  //   description: string;
  //   cta: string;
  //   ctaLink: string;
  // }

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  // Previous and next controls
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <><div
      className="relative w-full h-[80vh] lg:h-[90vh] mb-6 mt-0 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Sliding Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <div className="absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
                priority={index === 0}
                className="object-cover" />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 top-12 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-center items-center p-6 py-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {image.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white text-center max-w-xl mx-auto mb-6 drop-shadow">
                {image.description}
              </p>
              <a
                href={image.ctaLink}
                className="bg-[#F77665] hover:bg-[#F77665] text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300 inline-block mt-2 transform hover:scale-105"
              >
                {image.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none  sm:flex"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none  sm:flex"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute md:bottom-8 bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-[#F77665] scale-125'
                : 'bg-white bg-opacity-70 hover:bg-opacity-100'}`}
            aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </div><StatisticsCards /></>
  );
};

export default SlidingHeroImages;