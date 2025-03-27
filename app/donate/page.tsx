'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseLocationFromQRCode } from '@/utility/qr-code';
import DonationModal from '@/components/DonationModel';
import { getLocationsWithQRCodes, Location as DataLocation } from '@/lib/data';

const DonatePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setLocations] = useState<DataLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<DataLocation | null>(null);

  useEffect(() => {
    async function loadLocationsAndProcessQRCode() {
      try {
        const loadedLocations = await getLocationsWithQRCodes();
        setLocations(loadedLocations);

        const locationParam = searchParams.get('location');
        if (locationParam) {
          const parsedLocation = parseLocationFromQRCode(locationParam);
          if (parsedLocation) {
            const matchedLocation = loadedLocations.find(
              loc => loc.id === parsedLocation.locationId
            );

            if (matchedLocation) {
              setSelectedLocation(matchedLocation);
            }
          }
        }
      } catch (error) {
        console.error('Error processing location:', error);
      }
    }

    loadLocationsAndProcessQRCode();
  }, [searchParams]);

  const handleModalClose = () => {
    setSelectedLocation(null);
    router.push('/');
  };

  return (
    <>
      {selectedLocation && (
        <DonationModal
          location={selectedLocation}
          isOpen={!!selectedLocation}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

const DonatePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonatePageContent />
    </Suspense>
  );
};

export default DonatePage;
