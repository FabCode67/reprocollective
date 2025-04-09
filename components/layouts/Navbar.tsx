import React, { useState } from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { buttonVariants } from '@/components/ui/button';
// import { BellRing, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DonationModal from '../DonateModel';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isMenuOpen, ] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const router = useRouter();

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  const openDonationModal = () => {
    setIsDonationModalOpen(true);
  };

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
              width={80}
              height={10}
              // className="w-[100px] h-auto"
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
            <button
              onClick={openDonationModal}
              className={`
                ${buttonVariants({ variant: 'default', className: 'bg-sky-500 hover:bg-sky-600' })} 
                w-fit lg:w-auto text-center
              `}
            >
              Contribute Now
            </button>
            {/* <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <BellRing size={24} />}
            </button> */}
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
              {/* <NavigationMenuItem className="w-full lg:w-auto">
                <Link href="#testimonials" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={`
                      ${buttonVariants({ variant: 'ghost' })} 
                      w-full lg:w-auto text-center
                    `}
                  >
                    Testimonials
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}
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
                {/* Changed to button that opens modal instead of link */}
                <button
                  onClick={openDonationModal}
                  className={`
                    ${buttonVariants({ variant: 'default', className: 'bg-sky-500 hover:bg-sky-600' })} 
                    w-full lg:w-auto text-center
                  `}
                >
                  Contribute Now
                </button>
              </NavigationMenuItem>
              {/* <NavigationMenuItem className="w-full lg:w-auto"> */}
                {/* <div className="hidden lg:flex items-center gap-4 mt-4 lg:mt-0">
                  <button
                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                  >
                    {isMenuOpen ? <X size={24} /> : <BellRing size={24} />}
                  </button>
                </div> */}
              {/* </NavigationMenuItem> */}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Donation Modal Component */}
      <DonationModal isOpen={isDonationModalOpen} onClose={closeDonationModal} />
    </>
  );
};

export default Navbar;