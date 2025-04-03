
// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import { Bell, ChevronDown, CreditCard, DollarSign, Home, Menu, QrCode, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function AdminPortal() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for recent donations
  const recentDonations = [
    { id: '1', date: 'Apr 3, 2025', amount: 50.00, method: 'MTN Mobile Money', location: 'Kingfisher Restaurant', status: 'Completed' },
    { id: '2', date: 'Apr 2, 2025', amount: 25.00, method: 'Bank Card', location: 'City Hotel', status: 'Completed' },
    { id: '3', date: 'Apr 2, 2025', amount: 100.00, method: 'MTN Mobile Money', location: 'Sunshine School', status: 'Pending' },
    { id: '4', date: 'Apr 1, 2025', amount: 75.00, method: 'Bank Card', location: 'Blue Sky Hotel', status: 'Failed' },
    { id: '5', date: 'Mar 31, 2025', amount: 30.00, method: 'MTN Mobile Money', location: 'Central School', status: 'Completed' },
  ];

  // Mock data for top donation locations
  const topLocations = [
    { name: 'Kingfisher Restaurant', amount: 650, count: 17 },
    { name: 'City Hotel', amount: 520, count: 12 },
    { name: 'Sunshine School', amount: 480, count: 15 },
    { name: 'Central School', amount: 350, count: 10 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-sky-600 text-white p-2 rounded-md">
                <QrCode className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-sky-700">ReproActive</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
                    <AvatarFallback className="bg-sky-100 text-sky-700">AD</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-sm text-left font-medium">
                    Admin User
                    <span className="block text-xs text-gray-500 font-normal">Administrator</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Hidden on mobile unless toggled */}
        <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-[calc(100vh-3.5rem)] overflow-y-auto pt-16 md:pt-0`}>
          <nav className="p-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start text-sky-700 bg-sky-50 font-medium">
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100 font-medium">
              <DollarSign className="mr-2 h-5 w-5" />
              Donations
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100 font-medium">
              <Users className="mr-2 h-5 w-5" />
              Donors
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100 font-medium">
              <QrCode className="mr-2 h-5 w-5" />
              QR Codes
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100 font-medium">
              <CreditCard className="mr-2 h-5 w-5" />
              Payments
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100 font-medium">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
          <div className="container mx-auto">
            {/* Page title and actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">{"Welcome back! Here's what's happening with your donations today."}</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <Input className="max-w-[180px]" placeholder="Search..." />
                <Button className="bg-sky-600 hover:bg-sky-700">Generate Report</Button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,540</div>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active QR Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    +4 new this month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Donor Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    +18.3% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Donation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$38.50</div>
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    -2.3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="bg-white border">
                <TabsTrigger value="overview" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="donations" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
                  Recent Donations
                </TabsTrigger>
                <TabsTrigger value="locations" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
                  Top Locations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly Goal Progress Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Goal Progress</CardTitle>
                      <CardDescription>April 2025 Fundraising Goal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <div>$12,540 raised</div>
                            <div className="text-sky-700">$20,000 goal</div>
                          </div>
                          <Progress value={63} className="h-2 bg-gray-100" />
                          <div className="text-center text-sm text-gray-500">63% of monthly goal reached</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-sky-50 p-4 rounded-md">
                              <div className="text-gray-500 text-sm">MTN Mobile Money</div>
                              <div className="text-xl font-bold">$7,840</div>
                              <div className="text-xs text-gray-500">62% of donations</div>
                            </div>
                            <div className="bg-sky-50 p-4 rounded-md">
                              <div className="text-gray-500 text-sm">Bank Cards</div>
                              <div className="text-xl font-bold">$4,700</div>
                              <div className="text-xs text-gray-500">38% of donations</div>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-sky-600 hover:bg-sky-700">View Detailed Analytics</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Quick Actions Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Manage your donation system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-auto py-4 justify-start items-start text-left">
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              <QrCode className="h-4 w-4" /> Generate QR Code
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Create new donation point</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto py-4 justify-start items-start text-left">
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              <DollarSign className="h-4 w-4" /> Create Campaign
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Set up new fundraiser</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto py-4 justify-start items-start text-left">
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              <Users className="h-4 w-4" /> Donor Management
                            </div>
                            <div className="text-xs text-gray-500 mt-1">View & manage donors</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto py-4 justify-start items-start text-left">
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              <CreditCard className="h-4 w-4" /> Payment Settings
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Configure payment options</div>
                          </div>
                        </Button>
                      </div>
                      
                      <div className="mt-6">
                        <div className="text-sm font-medium mb-2">System Status</div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="font-medium">All systems operational</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Last checked: April 3, 2025 at 09:25 AM</div>
                            </div>
                            <Button variant="ghost" size="sm">View details</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="donations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Donations</CardTitle>
                    <CardDescription>The latest donations across all locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentDonations.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell className="font-medium">{donation.id}</TableCell>
                            <TableCell>{donation.date}</TableCell>
                            <TableCell>${donation.amount.toFixed(2)}</TableCell>
                            <TableCell>{donation.method}</TableCell>
                            <TableCell>{donation.location}</TableCell>
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
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline">View All Donations</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="locations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Locations</CardTitle>
                    <CardDescription>Locations with the highest donation amounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {topLocations.map((location, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="font-medium">{location.name}</div>
                            <div className="text-gray-500">${location.amount}</div>
                          </div>
                          <Progress 
                            value={location.amount / 650 * 100} 
                            className="h-2 bg-gray-100" 
                            // indicatorClassName="bg-sky-600" 
                          />
                          <div className="text-xs text-gray-500">{location.count} donations</div>
                        </div>
                      ))}
                      
                      <div className="mt-4 flex justify-center">
                        <Button variant="outline">View All Locations</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}