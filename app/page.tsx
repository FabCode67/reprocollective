'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layouts/Navbar';
import { getLocationsWithQRCodes, Location } from '@/lib/data';
import DonationModal from '@/components/DonationModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, Globe, Heart } from 'lucide-react';
import Image from 'next/image';
import TestimonialsPage from '@/components/testmonials';
import DarkHeroImage from '@/components/DarkImage';

const HomePage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'locations' | 'info' | 'testimonials'>('locations');

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
    <><div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="container max-w-7xl p-4 mx-auto mt-20 lg:flex">
        {/* Mobile Section Toggle */}
        <div className="lg:hidden flex mb-1">
          <button
            onClick={() => setActiveSection('locations')}
            className={`
              w-1/2 p-2 text-center 
              ${activeSection === 'locations' ? 'bg-sky-500 text-white' : 'bg-gray-200'}
            `}
          >
            HOME
          </button>
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
            onClick={() => setActiveSection('testimonials')}
            className={`
              w-1/2 p-2 text-center 
              ${activeSection === 'testimonials' ? 'bg-sky-500 text-white' : 'bg-gray-200'}
            `}
          >
            Testimonials
          </button>


        </div>

        {/* Locations Sidebar */}
        <div className={`
          w-full lg:w-1/3 lg:pr-6  mt-0
          ${activeSection === 'locations' ? 'block' : 'hidden lg:block'}
          overflow-y-auto
        `}>
          <DarkHeroImage />
          <h2 className="text-2xl font-bold mb-4 text-sky-600">{"Doner's station"}</h2>
          {locations.map((location) => (
            <Card
              key={location.id}
              className="md:mb-4 mb-2 hover:shadow-lg transition-shadow cursor-pointer border-sky-100 px-0 hover:border-sky-300"
              onClick={() => setSelectedLocation(location)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-sky-700">{location.name}</span>
                  {/* <Image
              src={location.qrCodeDataUrl || '/logo.png'}
              alt={`QR Code for ${location.name}`}
              width={50}
              height={50}
              className="self-end sm:self-auto border-2 border-sky-100 rounded"
            /> */}

                  {/* display money earned  */}
                  <span className="text-sky-700 text-xs font-semibold">70000 Rwf</span>
                </CardTitle>
                <CardDescription className="text-gray-600">{location.address}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                {/* // display momo pay number and equity account number */}

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Image src="/mtn.webp" alt="momo" width={35} height={35} />
                    <span className=" text-xs text-gray-600">5553422</span>
                  </div>
                  {/* drwa small horisontal line             */}
                  <div className="border-l border-gray-300 h-6"></div>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/equity.png"
                      alt="equity"
                      width={35}
                      height={35} />
                    <span className=" text-xs text-gray-600">444-5555-7777-2232</span>
                  </div>
                </div>
                <button className="bg-sky-500 text-white md:w-fit w-full px-2 py-1 text-sm rounded-md">Donate</button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className={`
          w-full lg:w-2/3 lg:pl-6 lg:border-l mt-12
          ${activeSection === 'info' ? 'block' : 'hidden lg:block'}
        `}>
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-sky-600 flex items-center">
                <Heart className="mr-3 text-red-500" size={36} />
                Repro Collective
              </h1>
              <p className="text-base lg:text-lg mb-6 text-gray-700 leading-relaxed">
                We believe in transformative change through strategic, compassionate giving.
                Every donation is a powerful step towards sustainable development,
                empowering communities to break cycles of vulnerability and create
                lasting, meaningful impact.
              </p>
            </div>

            <div className="bg-sky-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-sky-700 flex items-center">
                <CheckCircle className="mr-3 text-green-500" size={28} />
                Your Donation Journey
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-sm lg:text-base text-gray-700">
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
              <h3 className="text-xl lg:text-2xl font-bold mb-4 flex items-center">
                <Globe className="mr-3" size={28} />
                Our Vision
              </h3>
              <p className="text-base lg:text-lg leading-relaxed">
                We envision a world where every contribution, no matter how small,
                creates ripples of positive transformation. By connecting donors
                directly with community needs, we bridge compassion with practical solutions.
              </p>
            </div>
          </div>
        </div>

      </div>
      {<div className={`
          ${activeSection === 'testimonials' ? 'block' : 'hidden'}
        `}>
        <TestimonialsPage />
      </div>}



      {/* Donation Modal */}
      {selectedLocation && (
        <DonationModal
          location={selectedLocation}
          isOpen={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onError={(error) => console.error('Donation Error:', error)}
          onSuccess={() => console.log('Donation Success')} />
      )}
    </div><section id='testimonials' className="lg:block hidden">
        <TestimonialsPage />
      </section></>
  );
};

export default HomePage;