'use client';

import { useState, useEffect } from 'react';
import { MapPin, Edit, Trash2, QrCode } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import RootLayout from '@/components/layouts/Dashboardlayout';
import AddLocationDialog from './AddingLoaction';
import UpdateLocationDialog from './UpdateLocationDialog';
import QRCodeModal from '@/components/QRCodeModal';

// Define interfaces for type safety
interface LocationPerformance {
  locationId: string;
  locationName: string;
  address: string;
  phone: string;
  totalAmount: number;
  donationCount: number;
}

interface Location {
  id: string;
  name: string;
  amount: number;
  count: number;
  status: string;
  location?: string;
  phone?: string;
}

export default function LocationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [, setPerformanceData] = useState<LocationPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsPerformanceLoading] = useState(true);

  // Function to fetch locations from API
  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/locations`,
      );
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch location performance data
  const fetchLocationPerformance = async () => {
    setIsPerformanceLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/location-performance`,
      );
      setPerformanceData(response.data.performance || []);
    } catch (error) {
      console.error('Error fetching location performance:', error);
    } finally {
      setIsPerformanceLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLocations();
    fetchLocationPerformance();
  }, []);

  // Handle successful location addition
  const handleLocationAdded = (newLocation: Location) => {
    setLocations((prev) => [...prev, newLocation]);
  };

  // Handle update location
  const handleUpdateLocation = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId) || 
                     mockLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setIsUpdateDialogOpen(true);
    }
  };

  // Handle QR code generation
  const handleGenerateQRCode = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId) || 
                     mockLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setIsQRCodeModalOpen(true);
    }
  };

  // Handle delete location
  const handleDeleteLocation = async (locationId: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}`);
        // Update the locations state after successful deletion
        setLocations(prev => prev.filter(location => location.id !== locationId));
      } catch (error) {
        console.error('Error deleting location:', error);
        // For mock data
        setLocations(prev => prev.filter(location => location.id !== locationId));
      }
    }
  };

  // Handle location update success
  const handleLocationUpdated = (updatedLocation: Location) => {
    setLocations(prev => 
      prev.map(location => 
        location.id === updatedLocation.id ? updatedLocation : location
      )
    );
    setIsUpdateDialogOpen(false);
  };

  // For demo purposes, using mock data if API is not connected
  const mockLocations: Location[] = [
    { id: '1', name: 'Kingfisher Restaurant', amount: 650, count: 17, status: 'Active', location: '123 Main St', phone: '555-1234' },
    { id: '2', name: 'City Hotel', amount: 520, count: 12, status: 'Active', location: '456 Oak Ave', phone: '555-5678' },
    { id: '3', name: 'Sunshine School', amount: 480, count: 15, status: 'Active', location: '789 Pine Rd', phone: '555-9012' },
    { id: '4', name: 'Central School', amount: 350, count: 10, status: 'Active', location: '321 Elm St', phone: '555-3456' },
    { id: '5', name: 'Orange Orange Hotel', amount: 320, count: 8, status: 'Inactive', location: '654 Maple Dr', phone: '555-7890' },
    { id: '6', name: 'Community Center', amount: 280, count: 9, status: 'Active', location: '987 Cedar Ln', phone: '555-2345' },
    { id: '7', name: 'Downtown Mall', amount: 250, count: 7, status: 'Active', location: '159 Birch Rd', phone: '555-6789' },
    { id: '8', name: 'University Cafeteria', amount: 220, count: 6, status: 'Inactive', location: '753 Walnut Ave', phone: '555-0123' },
  ];

  // Prepare display data with real performance data if available
  const displayLocations = locations.length > 0 ? locations : mockLocations;
  
  return (
    <RootLayout>
      <div className="container mx-auto">
        {/* Page title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donor Locations</h1>
            <p className="text-gray-500">Manage and monitor all donation locations</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              className="bg-[#F77665] hover:bg-[#F77665]"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Add New Location
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Location Performance</CardTitle>
            <CardDescription>Top performing donation locations</CardDescription>
          </CardHeader>
          <CardContent>
           
          </CardContent>
        </Card>

        {/* All Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All contribution Locations</CardTitle>
            <CardDescription>Complete list of all registered contribution points</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading locations...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.location ?? 'N/A'}</TableCell>
                      <TableCell>{location.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          className={location.status === 'Active' ? 
                            'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {location.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateQRCode(location.id)}
                            className="text-[#F77665] hover:bg-orange-50"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateLocation(location.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteLocation(location.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Location Dialog */}
      <AddLocationDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSuccess={handleLocationAdded}
      />

      {/* Update Location Dialog */}
      {selectedLocation && (
        <UpdateLocationDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          onSuccess={handleLocationUpdated}
          location={selectedLocation}
        />
      )}

      {/* QR Code Modal */}
      {selectedLocation && (
        <QRCodeModal
          isOpen={isQRCodeModalOpen}
          onClose={() => setIsQRCodeModalOpen(false)}
          locationId={selectedLocation.id}
          locationName={selectedLocation.name}
          locationAddress={selectedLocation.location}
        />
      )}
    </RootLayout>
  );
}