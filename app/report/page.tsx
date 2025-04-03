// src/app/reports/page.tsx
'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layouts/Navbar';


interface DonationData {
  id: string;
  date: Date;
  amount: number;
  paymentMethod: 'MTN Mobile Money' | 'Bank Card';
  location: string;
  locationType: 'Restaurant' | 'Hotel' | 'School' | 'Other';
  status: 'Completed' | 'Pending' | 'Failed';
  donorName?: string;
  donorEmail?: string;
}

export default function DonationReportPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - in a real app this would come from your API
  const mockDonations: DonationData[] = [
    {
      id: '1',
      date: new Date('2025-03-31'),
      amount: 50.00,
      paymentMethod: 'MTN Mobile Money',
      location: 'Kingfisher Restaurant',
      locationType: 'Restaurant',
      status: 'Completed',
      donorName: 'John Doe',
      donorEmail: 'john@example.com'
    },
    {
      id: '2',
      date: new Date('2025-03-30'),
      amount: 25.00,
      paymentMethod: 'Bank Card',
      location: 'City Hotel',
      locationType: 'Hotel',
      status: 'Completed',
      donorName: 'Jane Smith',
      donorEmail: 'jane@example.com'
    },
    {
      id: '3',
      date: new Date('2025-03-29'),
      amount: 100.00,
      paymentMethod: 'MTN Mobile Money',
      location: 'Sunshine School',
      locationType: 'School',
      status: 'Pending',
      donorName: 'David Brown',
      donorEmail: 'david@example.com'
    },
    {
      id: '4',
      date: new Date('2025-03-27'),
      amount: 75.00,
      paymentMethod: 'Bank Card',
      location: 'Blue Sky Hotel',
      locationType: 'Hotel',
      status: 'Failed',
      donorName: 'Sarah Johnson',
      donorEmail: 'sarah@example.com'
    },
    {
      id: '5',
      date: new Date('2025-03-26'),
      amount: 30.00,
      paymentMethod: 'MTN Mobile Money',
      location: 'Central School',
      locationType: 'School',
      status: 'Completed',
      donorName: 'Michael Wilson',
      donorEmail: 'michael@example.com'
    }
  ];

  // Filter the donations based on the selected filters
  const filteredDonations = mockDonations.filter((donation) => {
    const dateInRange = (!startDate || donation.date >= startDate) && 
                        (!endDate || donation.date <= endDate);
    const matchesLocation = locationFilter === 'all' || donation.location === locationFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || donation.paymentMethod === paymentMethodFilter;
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    
    return dateInRange && matchesLocation && matchesPaymentMethod && matchesStatus;
  });

  // Calculate summary statistics
  const totalDonations = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const completedDonations = filteredDonations.filter(d => d.status === 'Completed').length;
  const pendingDonations = filteredDonations.filter(d => d.status === 'Pending').length;
  const failedDonations = filteredDonations.filter(d => d.status === 'Failed').length;

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(mockDonations.map(d => d.location)));

  return (
    <><div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="container max-w-7xl p-4 mx-auto mt-20 lg:flex">
      <div className="flex w-full flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-sky-600">Donation Reports</h1>
          <div className="flex space-x-2">
            <Button variant="outline">Export CSV</Button>
            <Button variant="outline">Print</Button>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="border border-sky-100">
          <CardHeader className="bg-sky-50">
            <CardTitle className="text-sky-700">Filter Reports</CardTitle>
            <CardDescription>Select criteria to filter donation reports</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label htmlFor="date-range">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method Filter */}
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="All Payment Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Methods</SelectItem>
                    <SelectItem value="MTN Mobile Money">MTN Mobile Money</SelectItem>
                    <SelectItem value="Bank Card">Bank Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input id="search" placeholder="Search by name, email or ID" />
              </div>

              <div className="flex items-end">
                <Button className="bg-sky-600 hover:bg-sky-700">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sky-600 text-lg">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalDonations.toFixed(2)}</div>
              <p className="text-sm text-gray-500">From {filteredDonations.length} donations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-600 text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedDonations}</div>
              <p className="text-sm text-gray-500">Successful donations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-600 text-lg">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingDonations}</div>
              <p className="text-sm text-gray-500">Awaiting completion</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-600 text-lg">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{failedDonations}</div>
              <p className="text-sm text-gray-500">Unsuccessful attempts</p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Reports Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-sky-50">
            <TabsTrigger value="list" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">List View</TabsTrigger>
            <TabsTrigger value="location" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">By Location</TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">By Payment Method</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader className="bg-sky-50">
                <CardTitle className="text-sky-700">Donation List</CardTitle>
                <CardDescription>
                  Showing {filteredDonations.length} donations for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.id}</TableCell>
                        <TableCell>{format(donation.date, 'PPP')}</TableCell>
                        <TableCell>${donation.amount.toFixed(2)}</TableCell>
                        <TableCell>{donation.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{donation.location}</span>
                            <span className="text-xs text-gray-500">{donation.locationType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{donation.donorName || 'Anonymous'}</span>
                            <span className="text-xs text-gray-500">{donation.donorEmail || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {donation.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredDonations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No donations found with the selected filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="location" className="mt-6">
            <Card>
              <CardHeader className="bg-sky-50">
                <CardTitle className="text-sky-700">Donations by Location</CardTitle>
                <CardDescription>
                  Summary of donations grouped by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Location summary would go here */}
                <div className="text-center py-10">
                  <p className="text-gray-500">Location summary data visualization would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="mt-6">
            <Card>
              <CardHeader className="bg-sky-50">
                <CardTitle className="text-sky-700">Donations by Payment Method</CardTitle>
                <CardDescription>
                  Summary of donations grouped by payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Payment method summary would go here */}
                <div className="text-center py-10">
                  <p className="text-gray-500">Payment method data visualization would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
    </>
  );
}