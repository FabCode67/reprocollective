'use client';

import { useState } from 'react';
import { 
  ArrowRight, 
  HeartHandshake, 
  Trophy, 
  Target, 
  Hotel,
} from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Sidebar } from '@/components/layouts/Sidebar';
import { DonationModal } from '@/components/ui/DonationModal';
import { restaurants } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import renderRestaurantDetails from '@/components/RestoInfo';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import About from './about/page';

export default function HomePage() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isRestaurantSelectionModalOpen, setIsRestaurantSelectionModalOpen] = useState(false);

  const selectedRestaurant = restaurants.find(
    (r) => r.id === selectedRestaurantId
  );

  const totalCommunityDonations = restaurants.reduce(
    (sum, restaurant) => sum + restaurant.totalDonated, 
    0
  );

  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setIsRestaurantSelectionModalOpen(false);
    setIsDonationModalOpen(true);
  };

  const renderWelcomeContent = () => (
    <div className="grid md:grid-cols-2 gap-8 h-full">
      {/* Left Side: Mission & Impact */}
      <div className="flex flex-col justify-center space-y-6 p-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-red-600">
            Repro Collective
          </h1>
          <p className="text-black text-lg">
            Empowering local restaurants through community-driven support and sustainable giving.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 bg-red-50 p-4 rounded-lg">
            <HeartHandshake className="text-red-600" size={40} />
            <div>
              <h3 className="font-bold text-black">Community Impact</h3>
              <p className="text-sm text-black">
                Total Donations: ${totalCommunityDonations.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-black/5 p-4 rounded-lg">
            <Hotel className="text-red-600" size={40} />
            <div>
              <h3 className="font-bold text-black">Local Restaurants Supported</h3>
              <p className="text-sm text-black">
                {restaurants.length} Restaurants Across the Community
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button 
            variant="default" 
            className="bg-red-600 hover:bg-red-700 flex items-center"
            onClick={() => setIsRestaurantSelectionModalOpen(true)}
          >
            Start Donating <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button 
            variant="outline" 
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Right Side: Donation Progress */}
      <div className="flex flex-col justify-center space-y-6 p-6 bg-red-50/50 rounded-lg">
        <div className="text-center">
          <Trophy className="mx-auto text-red-600 mb-4" size={60} />
          <h2 className="text-2xl font-bold text-black mb-2">
            Our Collective Goal
          </h2>
          <p className="text-black mb-4">
            Join our mission to support local restaurants and create sustainable communities.
          </p>
        </div>

        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-black font-medium">{restaurant.name}</span>
                <span className="text-sm text-black">
                  ${restaurant.totalDonated} / ${restaurant.donationGoal}
                </span>
              </div>
              <Progress 
                value={(restaurant.totalDonated / restaurant.donationGoal) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 bg-black/5 p-4 rounded-lg">
          <Target className="text-red-600" size={30} />
          <p className="text-sm text-black">
            Every donation brings us closer to supporting local restaurants.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      
      <div className="flex flex-1 mt-16">
        <Sidebar 
          onRestaurantSelect={setSelectedRestaurantId}
          selectedRestaurantId={selectedRestaurantId}
        />
        
        <main className="flex-1 bg-gray-50">
          {selectedRestaurant ? (
            renderRestaurantDetails(selectedRestaurant, setIsDonationModalOpen, setSelectedRestaurantId)
          ) : (
            renderWelcomeContent()
          )}
        </main>
      </div>

      {/* Restaurant Selection Modal */}
      <Dialog 
        open={isRestaurantSelectionModalOpen} 
        onOpenChange={setIsRestaurantSelectionModalOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select a Restaurant to Support</DialogTitle>
            <DialogDescription>
              {"Choose a local restaurant you'd like to donate to and make a difference."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRestaurantSelect(restaurant.id)}
              >
                <div>
                  <h3 className="font-bold">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">
                    ${restaurant.totalDonated} raised / ${restaurant.donationGoal} goal
                  </p>
                </div>
                <Progress 
                  value={(restaurant.totalDonated / restaurant.donationGoal) * 100} 
                  className="w-1/3 h-2"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {selectedRestaurant && (
        <DonationModal 
          open={isDonationModalOpen}
          onOpenChange={setIsDonationModalOpen}
          restaurantName={selectedRestaurant.name}
        />
      )}


      <About />
    </div>
  );
}