import React, { useState } from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { buttonVariants } from '@/components/ui/button';
import { BellRing, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Repro Collective Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button 
            onClick={toggleMenu} 
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <BellRing size={24} />}
          </button>
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
            </NavigationMenuItem>
            {/* <NavigationMenuItem className="w-full lg:w-auto">
              <Link href="#donate" passHref legacyBehavior>
                <NavigationMenuLink 
                  className={`
                    ${buttonVariants({ variant: 'default', className: 'bg-sky-500 hover:bg-sky-600' })} 
                    w-full lg:w-auto text-center
                  `}
                >
                  Donate Now
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;