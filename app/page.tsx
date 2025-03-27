'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layouts/Navbar';
import { getLocationsWithQRCodes, Location } from '@/lib/data';
import DonationModal from '@/components/DonationModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Loader2 } from 'lucide-react';
import Image from 'next/image';

const HomePage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      
      <div className="container mx-auto mt-20 flex">
        {/* Locations Sidebar */}
        <div className="w-1/3 pr-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-sky-600">Donation Locations</h2>
          {locations.map((location) => (
            <Card 
              key={location.id} 
              className="mb-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedLocation(location)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {location.name}
                  <QrCode className="text-sky-500" />
                </CardTitle>
                <CardDescription>{location.address}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <p>{location.description}</p>
                {location.qrCodeDataUrl && (
                  <Image 
                    src={location.qrCodeDataUrl} 
                    alt={`QR Code for ${location.name}`} 
                    width={80} 
                    height={80} 
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-2/3 pl-6 border-l">
          <h1 className="text-4xl font-bold mb-4 text-sky-600">
            Repro Collective
          </h1>
          <p className="text-lg mb-6">
            We are dedicated to making a positive impact in our community. 
            By donating at our partner locations, you help support our mission 
            of sustainable development and social change.
          </p>

          <div className="bg-sky-50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-sky-700">
              How to Donate
            </h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Visit one of our partner locations</li>
              <li>Scan the QR code displayed</li>
              <li>Choose your donation amount</li>
              <li>Select Mobile Money or Equity</li>
              <li>Complete your donation</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {selectedLocation && (
        <DonationModal
          location={selectedLocation}
          isOpen={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default HomePage;