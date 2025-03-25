// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { restaurants } from '@/lib/data';
import { cn } from "@/lib/utils";

interface SidebarProps {
  onRestaurantSelect: (restaurantId: string) => void;
  selectedRestaurantId: string | null;
}

export function Sidebar({ 
  onRestaurantSelect, 
  selectedRestaurantId 
}: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Restaurant Overview
      </h2>
      <div className="space-y-2">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => onRestaurantSelect(restaurant.id)}
            className={cn(
              "w-full text-left p-2 rounded",
              "hover:bg-red-50 transition-colors",
              selectedRestaurantId === restaurant.id 
                ? "bg-red-100 text-red-600" 
                : "text-black"
            )}
          >
            <div className="flex justify-between items-center">
              <span>{restaurant.name}</span>
              <span className="text-sm text-gray-500">
                ${restaurant.totalDonated}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}