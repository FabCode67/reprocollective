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
    name: 'Camellia Restaurant',
    address: 'KN 67 St, Kigali, Rwanda',
    accountNumber: '0786684390',
    description: 'A popular dining spot supporting Repro Collective\'s mission'
  },
  {
    id: 'Marriott-1',
    name: 'Marriott Hotel',
    address: 'Kacyiru, Kigali, Rwanda',
    accountNumber: '0788709997',
    description: 'Luxury hotel partnering with Repro Collective'
  },
  {
    id: 'cafe-1',
    name: 'MACOCO corner cafe',
    address: 'Kigali Heights, Rwanda',
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