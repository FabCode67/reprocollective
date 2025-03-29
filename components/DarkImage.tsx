'use client';
import React from 'react';
import Image from 'next/image';

const DarkHeroImage = () => {
  return (
    <div className="relative w-full h-48 md:h-64 lg:hidden mb-6">
      {/* Hero Image */}
      <Image
        src="/donation.jpeg" // Replace with your image path
        alt="Donation Impact"
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
      />
      
      {/* Dark Overlay */}
      <div className="absolute bg-opacity-50 flex flex-col justify-center items-center p-4">
        <h2 className="text-blue-700 text-2xl font-bold text-center mb-2">Make an Impact Today</h2>
        <p className="text-blue-700 font-bold text-center text-sm">Your donation helps transform lives in your community</p>
      </div>
    </div>
  );
};

export default DarkHeroImage;