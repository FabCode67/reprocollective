'use client';

import { generateAllLocationQRCodes } from "@/utility/qr-code";

export interface Location {
  id: string;
  name: string;
  address: string;
  accountNumber: string;
  qrCodeDataUrl?: string;
  description: string;
}

const baseLocations: Location[] = [
  {
    id: 'resto-1',
    name: 'Green Leaf Restaurant',
    address: '123 Main Street, Nairobi',
    accountNumber: '0786684390',
    description: 'A popular dining spot supporting Repro Collective\'s mission'
  },
  {
    id: 'hotel-1',
    name: 'Skyline Hotel',
    address: '456 Riverside Drive, Mombasa',
    accountNumber: '0786684390',
    description: 'Luxury hotel partnering with Repro Collective'
  },
  {
    id: 'cafe-1',
    name: 'Urban Grind Cafe',
    address: '789 City Center, Kisumu',
    accountNumber: '0786684390',
    description: 'Community-focused cafe supporting our cause'
  }
];

// Function to get locations with QR codes
export async function getLocationsWithQRCodes(): Promise<Location[]> {
  const locationsWithQRCodes = await generateAllLocationQRCodes(baseLocations);
  return locationsWithQRCodes;
}

export default baseLocations;