import React from 'react';
import Link from 'next/link';
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink 
} from '@/components/ui/navigation-menu';
import { buttonVariants } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src="/images/logo.png" 
            alt="Repro Collective Logo" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <Link href="/" passHref legacyBehavior>
                <NavigationMenuLink className={buttonVariants({ variant: 'ghost' })}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" passHref legacyBehavior>
                <NavigationMenuLink className={buttonVariants({ variant: 'ghost' })}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/testimonials" passHref legacyBehavior>
                <NavigationMenuLink className={buttonVariants({ variant: 'ghost' })}>
                  Testimonials
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="#donate" passHref legacyBehavior>
                <NavigationMenuLink className={buttonVariants({ variant: 'default', className: 'bg-sky-500 hover:bg-sky-600' })}>
                  Donate Now
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;