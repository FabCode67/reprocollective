import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import DonationModal from '../DonateModel';
import Image from 'next/image';
import axios from 'axios';

interface Location {
  id: string;
  name: string;
  location: string;
  accountNumber: string;
  description: string;
  qrCodeDataUrl?: string;
  qrCode?: string; 
  totalAmount?: number;
}

const Navbar: React.FC = () => {
  const [isMenuOpen,] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  

  // Function to fetch locations
  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/locations`
      );
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle direct contribution
  const handleDirectContribution = () => {
    setSelectedLocation(null);
    setIsDonationModalOpen(true);
    setIsDropdownOpen(false);
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setIsDonationModalOpen(true);
    setIsDropdownOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!isDropdownOpen && locations.length === 0 && !isLoading) {
      fetchLocations();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close donation modal
  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
    setSelectedLocation(null);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
        <div className="container max-w-7xl mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Repro Collective Logo"
              width={80}
              height={10}
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center my-auto gap-4">
            {/* Report button */}
            <button
              onClick={() => {
                router.push('/report');
              }}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              Report
            </button>
            {/* Dropdown for Contribute Now */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`
                  w-fit p-2 text-white rounded-b-md bg-orange-500 hover:bg-orange-600 text-center
                `}
              >
                Contribute Now
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleDirectContribution}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      Contribute Directly
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="px-4 py-2 text-sm font-medium text-gray-700">
                      Contribute Through a Location:
                    </div>
                    {isLoading ? (
                      <div className="px-4 py-2 text-gray-500 italic">Loading locations...</div>
                    ) : locations.length > 0 ? (
                      <div className="max-h-48 overflow-y-auto">
                        {locations.map((location) => (
                          <button
                            key={location.id}
                            onClick={() => handleLocationSelect(location)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                          >
                            {location.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-gray-500 italic">No locations available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className={`
            ${isMenuOpen ? 'block' : 'hidden'} 
            lg:block 
            absolute lg:static 
            top-full left-0 w-full lg:w-auto 
            bg-white lg:bg-transparent 
            shadow-lg lg:shadow-none 
            pb-4 lg:pb-0
          `}>
            <NavigationMenuList className="
              flex flex-col lg:flex-row 
              space-y-2 lg:space-y-0 
              lg:space-x-4 
              p-4 lg:p-0
            ">
              <NavigationMenuItem className="w-full lg:w-auto">
                <Link href="/" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={`
                      ${buttonVariants({ variant: 'ghost' })} 
                      w-full lg:w-auto text-center
                    `}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full lg:w-auto">
                <Link href="#about" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={`
                      ${buttonVariants({ variant: 'ghost' })} 
                      w-full lg:w-auto text-center
                    `}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full lg:w-auto">
                <Link href="/report" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={`
                      ${buttonVariants({ variant: 'ghost' })} 
                      w-full lg:w-auto text-center
                    `}
                  >
                    Reports
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full lg:w-auto">
                {/* Dropdown for Contribute Now */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={`
                      w-full lg:w-auto rounded-md text-center p-2 text-white bg-orange-500 hover:bg-orange-600
                    `}
                  >
                    Contribute Now
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={handleDirectContribution}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                        >
                          Contribute Directly
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <div className="px-4 py-2 text-sm font-medium text-gray-700">
                          Contribute Through a Location:
                        </div>
                        {isLoading ? (
                          <div className="px-4 py-2 text-gray-500 italic">Loading locations...</div>
                        ) : locations.length > 0 ? (
                          <div className="max-h-48 overflow-y-auto">
                            {locations.map((location) => (
                              <button
                                key={location.id}
                                onClick={() => handleLocationSelect(location)}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                              >
                                {location.name}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-2 text-gray-500 italic">No locations available</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Donation Modal Component */}
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={closeDonationModal}
        location={selectedLocation?.qrCode} // Pass the selected location to the modal
      />
    </>
  );
};

export default Navbar;