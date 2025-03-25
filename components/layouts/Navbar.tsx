// src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact Us' }
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-red-500 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-red-600">
          Restaurant Donations
        </div>
        <div className="flex space-x-6">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "text-black hover:text-red-600 transition-colors",
                "font-medium"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}