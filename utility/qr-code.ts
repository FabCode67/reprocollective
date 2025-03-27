'use client';

import QRCode from 'qrcode';

export interface QRCodeData {
  locationName: string;
  locationAddress: string;
  websiteUrl: string;
  accountNumber: string;
}

export async function generateQRCode(data: QRCodeData): Promise<string> {
  const qrCodeContent = JSON.stringify({
    location: {
      name: data.locationName,
      address: data.locationAddress
    },
    websiteUrl: data.websiteUrl,
    accountNumber: data.accountNumber
  });

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
  const websiteUrl = 'https://reprocollective-webapp.vercel.app'; // Replace with actual website URL

  const locationsWithQRCodes = await Promise.all(
    locations.map(async (location) => {
      const qrCodeDataUrl = await generateQRCode({
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