// src/components/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Home, MapPin, Menu, QrCode, X, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <Home className="mr-2 h-5 w-5" />, 
      path: '/admin' 
    },
    { 
      name: 'Donor Locations', 
      icon: <MapPin className="mr-2 h-5 w-5" />, 
      path: '/admin/locations' 
    },
    { 
      name: 'Reports', 
      icon: <BarChart3 className="mr-2 h-5 w-5" />, 
      path: '/admin/reports' 
    },
    {
      name: "Transactions",
      icon: <Coins className="mr-2 h-5 w-5" />,
      path: "/admin/transactions",
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-3 left-3 z-30 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar - Hidden on mobile unless toggled */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-screen overflow-y-auto`}
      >
        {/* Logo */}
        <Link className="p-4 border-b flex items-center gap-2" href={'/'}>
          <div className="bg-sky-600 text-white p-2 rounded-md">
            <QrCode className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-sky-700">ReproCollective</h1>
        </Link>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start font-medium ${
                  isActive(item.path) ? 'text-sky-700 bg-sky-50' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}