// src/app/ProtectedLayout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // You can add additional checks here if needed
        // e.g., check if token is expired, validate isAdmin flag, etc.
        if (userData.email && userData.isAdmin) {
          setIsAuthenticated(true);
        } else {
          // Invalid user data
          localStorage.removeItem('reprouser');
          router.push('/login');
        }
      } catch (error) {
        // Invalid JSON in localStorage
        localStorage.removeItem('reprouser');
        router.push('/login');
      }
    } else {
      // No user data found
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null (redirect happens in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the layout
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}