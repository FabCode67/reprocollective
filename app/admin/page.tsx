// src/app/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
// import Navbar from '@/components/layouts/Navbar';
import RootLayout from '@/components/layouts/Dashboardlayout';

interface DonationLocation {
  id: string;
  name: string;
  location: string;
}

interface Donation {
  id: string;
  amount: number;
  donorName: string;
  donorPhone: string;
  paymentMethod: string;
  transactionId?: string;
  status: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
  donationLocation: DonationLocation;
}

interface ReportSummary {
  totalAmount: number;
  totalCount: number;
  completed: number;
  pending: number;
  failed: number;
}

interface ApiResponse {
  summary: ReportSummary;
  donations: Donation[];
}

export default function DonationReportPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<DonationLocation[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<ReportSummary>({
    totalAmount: 0,
    totalCount: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  // Fetch donations based on filters
  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      
      const queryParams = new URLSearchParams();
      
      if (startDate) {
        queryParams.append('startDate', startDate.toISOString());
      }
      
      if (endDate) {
        queryParams.append('endDate', endDate.toISOString());
      }
      
      if (locationFilter !== 'all') {
        queryParams.append('locationId', locationFilter);
      }
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      if (paymentMethodFilter !== 'all') {
        queryParams.append('paymentMethod', paymentMethodFilter);
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/reports?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contibution reports');
      }
      
      const data: ApiResponse = await response.json();
      setDonations(data.donations);
      setSummary(data.summary);
      
    } catch (error) {
      console.error('Error fetching contribution reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all locations for the filter dropdown
  const fetchLocations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchLocations();
    fetchDonations();
  }, []);

  // Handle filter application
  const handleApplyFilters = () => {
    fetchDonations();
  };

  // Group donations by location
  const donationsByLocation = donations.reduce((acc, donation) => {
    const locationName = donation.donationLocation?.name;
    
    if (!acc[locationName]) {
      acc[locationName] = {
        locationName,
        totalAmount: 0,
        count: 0
      };
    }
    
    acc[locationName].totalAmount += donation.amount;
    acc[locationName].count += 1;
    
    return acc;
  }, {} as Record<string, { locationName: string; totalAmount: number; count: number }>);

  // Group donations by payment method
  const donationsByPaymentMethod = donations.reduce((acc, donation) => {
    if (!acc[donation.paymentMethod]) {
      acc[donation.paymentMethod] = {
        method: donation.paymentMethod,
        totalAmount: 0,
        count: 0
      };
    }
    
    acc[donation.paymentMethod].totalAmount += donation.amount;
    acc[donation.paymentMethod].count += 1;
    
    return acc;
  }, {} as Record<string, { method: string; totalAmount: number; count: number }>);

  // Get formatted payment method display name
  const getPaymentMethodDisplay = (method: string) => {
    switch(method.toLowerCase()) {
      case 'mtn':
        return 'MTN Mobile Money';
      case 'card':
        return 'Bank Card';
      default:
        return method;
    }
  };

  // Get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    // Define CSV headers
    const headers = [
      'ID',
      'Date',
      'Amount',
      'Payment Method',
      'Location',
      'Donor Name',
      'Donor Phone',
      'Status',
    ];
    
    // Transform donations data to CSV format
    const csvData = donations.map((donation) => {
      return [
        donation.id,
        format(new Date(donation.createdAt), 'yyyy-MM-dd'),
        donation.amount.toFixed(2),
        getPaymentMethodDisplay(donation.paymentMethod),
        donation.donationLocation?.name,
        donation.donorName || 'Anonymous',
        donation.donorPhone || 'N/A',
        donation.status
      ].join(',');
    });
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData
    ].join('\n');
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set up download attributes
    const fileName = `donation-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Function to print the current view
  const printReport = () => {
    window.print();
  };
  

  return (
    <RootLayout>
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container max-w-7xl p-4 mx-auto mt-0 lg:flex">
        <div className="flex w-full flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#F77665]">Contribution Reports</h1>
            <div className="flex space-x-2">
  <Button variant="outline" onClick={exportToCSV}>Export CSV</Button>
  <Button variant="outline" onClick={printReport}>Print</Button>

            </div>
          </div>

          {/* Filter Section */}
          <Card className="border border-orange-100">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-[#F77665]">Filter Reports</CardTitle>
              <CardDescription>Select criteria to filter contribution reports</CardDescription>
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
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location?.name}
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
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="card">Bank Card</SelectItem>
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input 
                    id="search" 
                    placeholder="Search by name, phone or ID" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    className="bg-[#F77665] hover:bg-[#F77665]"
                    onClick={handleApplyFilters}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Apply Filters'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#F77665] text-lg">Total Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.totalAmount.toFixed(2)}RWF</div>
                <p className="text-sm text-gray-500">From {summary.totalCount} Contributions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-600 text-lg">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.completed}</div>
                <p className="text-sm text-gray-500">Successful Contributions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-600 text-lg">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.pending}</div>
                <p className="text-sm text-gray-500">Awaiting completion</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600 text-lg">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.failed}</div>
                <p className="text-sm text-gray-500">Unsuccessful attempts</p>
              </CardContent>
            </Card>
          </div>

          {/* Contribution Reports Tabs */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="bg-orange-50">
              <TabsTrigger value="list" className="data-[state=active]:bg-[#F77665] data-[state=active]:text-white">List View</TabsTrigger>
              <TabsTrigger value="location" className="data-[state=active]:bg-[#F77665] data-[state=active]:text-white">By Location</TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-[#F77665] data-[state=active]:text-white">By Payment Method</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-[#F77665]">Contribution List</CardTitle>
                  <CardDescription>
                    Showing {donations.length} contributions for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading contributions...</p>
                    </div>
                  ) : (
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
                        {donations.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell className="font-medium">{donation.id.substring(0, 8)}</TableCell>
                            <TableCell>{format(new Date(donation.createdAt), 'PPP')}</TableCell>
                            <TableCell>{donation.amount.toFixed(2)}RWF</TableCell>
                            <TableCell>{getPaymentMethodDisplay(donation.paymentMethod)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{donation.donationLocation?.name}</span>
                                <span className="text-xs text-gray-500">{donation.donationLocation?.location}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{donation.donorName || 'Anonymous'}</span>
                                <span className="text-xs text-gray-500">{donation.donorPhone || 'N/A'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeStyle(donation.status)}>
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {donations.length === 0 && !isLoading && (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No contributions found with the selected filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="location" className="mt-6">
              <Card>
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-[#F77665]">Contribution by Location</CardTitle>
                  <CardDescription>
                    Summary of Contribution grouped by location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading location data...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>Contribution</TableHead>
                          <TableHead>Total Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.values(donationsByLocation).map((item) => (
                          <TableRow key={item?.locationName}>
                            <TableCell className="font-medium">{item?.locationName}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>{item.totalAmount.toFixed(2)} RWF</TableCell>
                          </TableRow>
                        ))}
                        {Object.keys(donationsByLocation).length === 0 && !isLoading && (
                          <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                              No location data available for the selected filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-[#F77665]">Contribution by Payment Method</CardTitle>
                  <CardDescription>
                    Summary of Contribution grouped by payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading payment method data...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Contribution</TableHead>
                          <TableHead>Total Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.values(donationsByPaymentMethod).map((item) => (
                          <TableRow key={item.method}>
                            <TableCell className="font-medium">{getPaymentMethodDisplay(item.method)}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>{item.totalAmount.toFixed(2)}RWF</TableCell>
                          </TableRow>
                        ))}
                        {Object.keys(donationsByPaymentMethod).length === 0 && !isLoading && (
                          <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                              No payment method data available for the selected filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </RootLayout>
  );
}