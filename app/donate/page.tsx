'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseLocationFromQRCode } from '@/utility/qr-code';
import DonationModal from '@/components/DonationModel';
import { getLocationsWithQRCodes, Location as DataLocation } from '@/lib/data';
import { 
  Toaster, 
  toast 
} from 'sonner';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2
} from 'lucide-react';

const DonatePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setLocations] = useState<DataLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<DataLocation | null>(null);

  // Toast notification types
  const toastTypes = {
    success: (message: string) => toast.success(message, {
      icon: <CheckCircle className="text-green-500" />,
      className: 'bg-green-50 border-green-200'
    }),
    error: (message: string) => toast.error(message, {
      icon: <XCircle className="text-red-500" />,
      className: 'bg-red-50 border-red-200'
    }),
    info: (message: string) => toast.info(message, {
      icon: <Info className="text-blue-500" />,
      className: 'bg-blue-50 border-blue-200'
    }),
    warning: (message: string) => toast.warning(message, {
      icon: <AlertTriangle className="text-yellow-500" />,
      className: 'bg-yellow-50 border-yellow-200'
    })
  };

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
              
              // Show info toast when location is found via QR code
              toastTypes.info(`Scanned location: ${matchedLocation.name}`);
            } else {
              // Show warning if location not found
              toastTypes.warning('Location not found. Please try again.');
            }
          } else {
            toastTypes.error('Invalid QR code. Please scan a valid code.');
          }
        }
      } catch (error) {
        console.error('Error processing location:', error);
        toastTypes.error('An error occurred while processing the location.');
      }
    }

    loadLocationsAndProcessQRCode();
  }, [searchParams]);

  const handleModalClose = () => {
    setSelectedLocation(null);
    router.push('/');
    toastTypes.success('Donation process completed. Thank you for your support!');
  };

  const handleDonationSuccess = (amount?: number) => {
      if (amount !== undefined) {
          toastTypes.success(`Thank you for your contrubution of $${amount}!`);
      } else {
          toastTypes.success('Thank you for your contrubution!');
      }
  };

  const handleDonationError = (errorMessage: string) => {
    toastTypes.error(`Contribution failed: ${errorMessage}`);
  };

  return (
    <>
      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
      />
      
      {selectedLocation && (
        <DonationModal
          location={selectedLocation}
          isOpen={!!selectedLocation}
          onClose={handleModalClose}
          onSuccess={handleDonationSuccess}
          onError={handleDonationError}
        />
      )}
    </>
  );
};

const DonatePage = () => {
  return (
    <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>}>
      <DonatePageContent />
    </Suspense>
  );
};

export default DonatePage;