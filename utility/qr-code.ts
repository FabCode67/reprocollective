'use client';

import QRCode from 'qrcode';

export interface QRCodeData {
  locationName: string;
  locationAddress: string;
  websiteUrl: string;
  accountNumber: string;
  locationId: string;
}

export async function generateQRCode(data: QRCodeData): Promise<string> {
  // Create a URL with encoded location information
  const encodedData = encodeURIComponent(JSON.stringify({
    locationId: data.locationId,
    location: {
      name: data.locationName,
      address: data.locationAddress
    },
    websiteUrl: data.websiteUrl,
    accountNumber: data.accountNumber
  }));

  const qrCodeContent = `${data.websiteUrl}/donate?location=${encodedData}`;

  try {
    // Generate QR code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeContent, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2,
      color: {
        dark: '#000', // Black dots
        light: '#fff' // White background
      }
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}

export async function generateAllLocationQRCodes(locations: any[]): Promise<any[]> {
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://repro-collective.com';

  const locationsWithQRCodes = await Promise.all(
    locations.map(async (location) => {
      const qrCodeDataUrl = await generateQRCode({
        locationId: location.id,
        locationName: location.name,
        locationAddress: location.address,
        websiteUrl: websiteUrl,
        accountNumber: location.accountNumber
      });

      return {
        ...location,
        qrCodeDataUrl: qrCodeDataUrl
      };
    })
  );

  return locationsWithQRCodes;
}

// Utility to parse location data from QR code
export function parseLocationFromQRCode(encodedData: string): QRCodeData | null {
  try {
    const decodedData = decodeURIComponent(encodedData);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Error parsing QR code data:', error);
    return null;
  }
}