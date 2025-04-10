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
import { Menu, X } from 'lucide-react'; // Import icons for the hamburger menu

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileOptionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle direct contribution
  const handleDirectContribution = () => {
    setIsDonationModalOpen(true);
    setIsDropdownOpen(false);
    setShowMobileOptions(false);
    setIsMenuOpen(false); // Close mobile menu when opening donation modal
  };

  // Handle locations navigation
  const handleLocationsClick = () => {
    setIsDropdownOpen(false);
    setShowMobileOptions(false);
    setIsMenuOpen(false); // Close mobile menu after navigation
    
    // Navigate to locations section
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      // If we're already on the home page
      if (currentPath === '/' || currentPath === '') {
        const locationsSection = document.getElementById('locations');
        if (locationsSection) {
          locationsSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If on another page, navigate to home with locations hash
        router.push('/#locations');
      }
    }
  };

  // Toggle dropdown for desktop
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Toggle mobile options
  const toggleMobileOptions = () => {
    setShowMobileOptions(!showMobileOptions);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      
      if (mobileOptionsRef.current && !mobileOptionsRef.current.contains(event.target as Node)) {
        setShowMobileOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Close donation modal
  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
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
              width={60}
              height={10}
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 ml-auto mr-2 rounded-md hover:bg-gray-100 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center my-auto gap-4">
            {/* Report button */}
            {/* <button
              onClick={() => {
                router.push('/report');
              }}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              Report
            </button> */}
            
            {/* Contribute button for mobile */}
            <div className="relative" ref={mobileOptionsRef}>
              <button
                onClick={toggleMobileOptions}
                className="w-fit p-2 text-white rounded-md bg-orange-500 hover:bg-orange-600 text-center"
              >
                Contribute
              </button>
              
              {/* Mobile contribution options */}
              {showMobileOptions && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 w-4/5 max-w-sm">
                    <h3 className="text-lg font-medium mb-4 text-center">Contribution Options</h3>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleDirectContribution}
                        className="w-full py-3 text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                      >
                        Contribute Directly
                      </button>
                      <button
                        onClick={handleLocationsClick}
                        className="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                      >
                        Contribute Through Locations
                      </button>
                      <button
                        onClick={() => setShowMobileOptions(false)}
                        className="w-full py-2 text-gray-600 hover:text-gray-800 mt-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Menu */}
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
              <NavigationMenuItem className="w-full lg:w-auto block">
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
                {/* Dropdown for Contribute Now (Desktop) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="w-full lg:w-auto rounded-md text-center p-2 text-white bg-orange-500 hover:bg-orange-600"
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
                        <button
                          onClick={handleLocationsClick}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                        >
                          Contribute Through Locations
                        </button>
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
      />
    </>
  );
};

export default Navbar;