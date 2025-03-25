// src/app/page.tsx
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Sidebar } from '@/components/layouts/Sidebar';
import { DonationModal } from '@/components/ui/DonationModal';
import { restaurants } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const selectedRestaurant = restaurants.find(
    (r) => r.id === selectedRestaurantId
  );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      
      <div className="flex flex-1 mt-16">
        <Sidebar 
          onRestaurantSelect={setSelectedRestaurantId}
          selectedRestaurantId={selectedRestaurantId}
        />
        
        <main className="flex-1 p-6 bg-gray-50">
          {selectedRestaurant ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                {selectedRestaurant.name}
              </h1>
              <img 
                src={selectedRestaurant.imageUrl} 
                alt={selectedRestaurant.name} 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="mb-4">{selectedRestaurant.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="font-bold">Total Donated: </span>
                  ${selectedRestaurant.totalDonated}
                </div>
                <div>
                  <span className="font-bold">Donation Goal: </span>
                  ${selectedRestaurant.donationGoal}
                </div>
              </div>
              
              <Button 
                onClick={() => setIsDonationModalOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Donate Now
              </Button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Welcome to Restaurant Donations
                </h2>
                <p className="text-black">
                  Select a restaurant from the sidebar to view details and donate
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedRestaurant && (
        <DonationModal 
          open={isDonationModalOpen}
          onOpenChange={setIsDonationModalOpen}
          restaurantName={selectedRestaurant.name}
        />
      )}
    </div>
  );
}