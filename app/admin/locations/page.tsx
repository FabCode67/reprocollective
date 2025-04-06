'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import RootLayout from '@/components/layouts/Dashboardlayout';
import AddLocationDialog from './AddingLoaction';

export default function LocationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [locations, setLocations] = useState<{ id: string; name: string; amount: number; count: number; status: string; location?: string; phone?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle successful location addition
  const handleLocationAdded = (newLocation: { id: string; name: string; amount: number; count: number; status: string }) => {
    setLocations((prev) => [...prev, newLocation]);
  };

  // For demo purposes, using mock data if API is not connected
  const displayLocations = locations.length > 0 ? locations : [
    { id: '1', name: 'Kingfisher Restaurant', amount: 650, count: 17, status: 'Active' },
    { id: '2', name: 'City Hotel', amount: 520, count: 12, status: 'Active' },
    { id: '3', name: 'Sunshine School', amount: 480, count: 15, status: 'Active' },
    { id: '4', name: 'Central School', amount: 350, count: 10, status: 'Active' },
    { id: '5', name: 'Blue Sky Hotel', amount: 320, count: 8, status: 'Inactive' },
    { id: '6', name: 'Community Center', amount: 280, count: 9, status: 'Active' },
    { id: '7', name: 'Downtown Mall', amount: 250, count: 7, status: 'Active' },
    { id: '8', name: 'University Cafeteria', amount: 220, count: 6, status: 'Inactive' },
  ];

  // Find highest donation amount for progress bar calculation
  const maxAmount = Math.max(...displayLocations.map(loc => loc.amount || 0));

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
              className="bg-sky-600 hover:bg-sky-700"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayLocations.slice(0, 4).map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-gray-500">${location.amount || 0}</div>
                  </div>
                  <Progress 
                    value={((location.amount || 0) / maxAmount) * 100} 
                    className="h-2 bg-gray-100" 
                  />
                  <div className="text-xs text-gray-500">{location.count || 0} donations</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Donation Locations</CardTitle>
            <CardDescription>Complete list of all registered donation points</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading locations...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
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
                      <TableCell className="font-medium">{location.id}</TableCell>
                      <TableCell>{location.name}</TableCell>
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
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Deactivate</Button>
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
    </RootLayout>
  );
}