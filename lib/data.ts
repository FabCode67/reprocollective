'use client';

import { generateAllLocationQRCodes } from "@/utility/qr-code";

export interface Location {
  id: string;
  name: string;
  location: string;
  accountNumber: string;
  qrCodeDataUrl?: string;
  qrCode?: string;
  description: string;
}

const baseLocations: Location[] = [
  {
    id: 'resto-1',
    name: 'Camellia Restaurant',
    location: 'KN 67 St, Kigali, Rwanda',
    accountNumber: '0786684390',
    description: 'A popular dining spot supporting REPROCOLLECTIVE\'s mission'
  },
  {
    id: 'Marriott-1',
    name: 'Marriott Hotel',
    location: 'Kacyiru, Kigali, Rwanda',
    accountNumber: '0788709997',
    description: 'Luxury hotel partnering with REPROCOLLECTIVE'
  },
  {
    id: 'cafe-1',
    name: 'MACOCO corner cafe',
    location: 'Kigali Heights, Rwanda',
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