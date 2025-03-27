'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layouts/Navbar';
import { getLocationsWithQRCodes, Location } from '@/lib/data';
import DonationModal from '@/components/DonationModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Loader2, CheckCircle, Globe, Heart } from 'lucide-react';
import Image from 'next/image';
import TestimonialsPage from '@/components/testmonials';

const HomePage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'locations' | 'info'>('info');

  useEffect(() => {
    async function loadLocations() {
      try {
        const loadedLocations = await getLocationsWithQRCodes();
        setLocations(loadedLocations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading locations:', error);
        setIsLoading(false);
      }
    }

    loadLocations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="container max-w-7xl p-4 mx-auto mt-20 md:flex">
        {/* Mobile Section Toggle */}
        <div className="md:hidden flex mb-4">
          <button 
            onClick={() => setActiveSection('info')}
            className={`
              w-1/2 p-2 text-center 
              ${activeSection === 'info' ? 'bg-sky-500 text-white' : 'bg-gray-200'}
            `}
          >
            About
          </button>
          <button 
            onClick={() => setActiveSection('locations')}
            className={`
              w-1/2 p-2 text-center 
              ${activeSection === 'locations' ? 'bg-sky-500 text-white' : 'bg-gray-200'}
            `}
          >
            Locations
          </button>
        </div>

        {/* Locations Sidebar */}
        <div className={`
          w-full md:w-1/3 md:pr-6 
          ${activeSection === 'locations' ? 'block' : 'hidden md:block'}
          overflow-y-auto
        `}>
          <h2 className="text-2xl font-bold mb-4 text-sky-600">Our Donation Points</h2>
          {locations.map((location) => (
            <Card
              key={location.id}
              className="mb-4 hover:shadow-lg transition-shadow cursor-pointer border-sky-100 hover:border-sky-300"
              onClick={() => setSelectedLocation(location)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-sky-700">{location.name}</span>
                  <QrCode className="text-sky-500" />
                </CardTitle>
                <CardDescription className="text-gray-600">{location.address}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-700 mb-2 sm:mb-0">{location.description}</p>
                {location.qrCodeDataUrl && (
                  <Image
                    src={location.qrCodeDataUrl}
                    alt={`QR Code for ${location.name}`}
                    width={80}
                    height={80}
                    className="self-end sm:self-auto border-2 border-sky-100 rounded"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className={`
          w-full md:w-2/3 md:pl-6 md:border-l
          ${activeSection === 'info' ? 'block' : 'hidden md:block'}
        `}>
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-sky-600 flex items-center">
                <Heart className="mr-3 text-red-500" size={36} />
                Repro Collective
              </h1>
              <p className="text-base md:text-lg mb-6 text-gray-700 leading-relaxed">
                We believe in transformative change through strategic, compassionate giving. 
                Every donation is a powerful step towards sustainable development, 
                empowering communities to break cycles of vulnerability and create 
                lasting, meaningful impact.
              </p>
            </div>

            <div className="bg-sky-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-sky-700 flex items-center">
                <CheckCircle className="mr-3 text-green-500" size={28} />
                Your Donation Journey
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-sm md:text-base text-gray-700">
                <li>
                  <strong>Connect:</strong> Choose a local donation point that resonates with you
                </li>
                <li>
                  <strong>Scan:</strong> Use the provided QR code for a seamless donation experience
                </li>
                <li>
                  <strong>Select:</strong> Customize your contribution amount
                </li>
                <li>
                  <strong>Choose:</strong> Pick your preferred payment method
                </li>
                <li>
                  <strong>Impact:</strong> Witness how your donation creates real change
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center">
                <Globe className="mr-3" size={28} />
                Our Vision
              </h3>
              <p className="text-base md:text-lg leading-relaxed">
                We envision a world where every contribution, no matter how small, 
                creates ripples of positive transformation. By connecting donors 
                directly with community needs, we bridge compassion with practical solutions.
              </p>
            </div>
          </div>
        </div>
        
      </div>
      <TestimonialsPage />

      {/* Donation Modal */}
      {selectedLocation && (
        <DonationModal
          location={selectedLocation}
          isOpen={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onError={(error) => console.error('Donation Error:', error)}
          onSuccess={() => console.log('Donation Success')}
        />
      )}
    </div>
  );
};

export default HomePage;