'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  // Define public routes that don't need authentication
  const publicPaths = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicPaths.includes(pathname);

  useEffect(() => {
    // Skip auth check for public routes
    if (isPublicRoute) {
      setAuthState('unauthenticated');
      return;
    }

    // Check authentication status
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('reprouser');
        if (!userStr) {
          return false;
        }

        const user = JSON.parse(userStr);
        if (!user.email || !user.isAdmin) {
          return false;
        }
        
        return true;
      } catch (error) {
        console.log('Error parsing user data:', error);
        return false;
      }
    };

    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
      setAuthState('authenticated');
    } else {
      // If not authenticated and not on a public route, redirect to login
      setAuthState('unauthenticated');
      
      // Use a small timeout to avoid immediate redirect conflicts
      const redirectTimer = setTimeout(() => {
        localStorage.removeItem('reprouser'); // Clean up any invalid state
        router.replace('/login');
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [router, pathname, isPublicRoute]);

  // Show loading state while checking authentication
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If on a public path or unauthenticated, just render children without the dashboard layout
  if (isPublicRoute || authState === 'unauthenticated') {
    return <>{children}</>;
  }

  // Render dashboard layout for authenticated routes
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