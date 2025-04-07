'use client';

import { 
  BarChart3, 
  MapPin, 
  QrCode, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const DashboardContent = () => {
    // Mock data for recent donations
    const recentDonations = [
      { id: '1', date: 'Apr 3, 2025', amount: 50.00, method: 'MTN Mobile Money', location: 'Kingfisher Restaurant', status: 'Completed' },
      { id: '2', date: 'Apr 2, 2025', amount: 25.00, method: 'Bank Card', location: 'City Hotel', status: 'Completed' },
      { id: '3', date: 'Apr 2, 2025', amount: 100.00, method: 'MTN Mobile Money', location: 'Sunshine School', status: 'Pending' },
      { id: '4', date: 'Apr 1, 2025', amount: 75.00, method: 'Bank Card', location: 'Blue Sky Hotel', status: 'Failed' },
    ];
  
    return (
      <>
        {/* Page title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500">{"Welcome back! Here's what's happening with your contributions today."}</p>
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
              <CardTitle className="text-sm font-medium text-gray-500">Total Contributions</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-500">Average Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$38.50</div>
              <p className="text-sm text-red-600 flex items-center mt-1">
                -2.3% from last month
              </p>
            </CardContent>
          </Card>
        </div>
  
        {/* Monthly Goal Progress Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      <div className="text-xs text-gray-500">62% of contributions</div>
                    </div>
                    <div className="bg-sky-50 p-4 rounded-md">
                      <div className="text-gray-500 text-sm">Bank Cards</div>
                      <div className="text-xl font-bold">$4,700</div>
                      <div className="text-xs text-gray-500">38% of contributions</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-sky-600 hover:bg-sky-700">View Detailed Analytics</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest contributions across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonations.slice(0, 4).map((donation, index) => (
                  <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium">{donation.location}</div>
                      <div className="text-sm text-gray-500">{donation.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${donation.amount.toFixed(2)}</div>
                      <Badge 
                        className={
                          donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {donation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Donations</Button>
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your donation system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <Users className="h-4 w-4" /> Add Donor
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Register new donor</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 justify-start items-start text-left">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4" /> Add Location
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Add new donation location</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 justify-start items-start text-left">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <BarChart3 className="h-4 w-4" /> Generate Report
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Export donation data</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };
  
  const LocationsContent = () => {
    // Mock data for top donation locations
    const topLocations = [
      { name: 'Kingfisher Restaurant', amount: 650, count: 17, address: '123 Main St, City Center', active: true },
      { name: 'City Hotel', amount: 520, count: 12, address: '456 Beach Road, Westside', active: true },
      { name: 'Sunshine School', amount: 480, count: 15, address: '789 Education Lane, Northside', active: true },
      { name: 'Central School', amount: 350, count: 10, address: '101 Learning Ave, Eastside', active: false },
      { name: 'Blue Sky Hotel', amount: 320, count: 8, address: '202 Mountain View, Southside', active: true },
      { name: 'Green Park Restaurant', amount: 290, count: 9, address: '303 Park Street, Downtown', active: true },
    ];
  
    return (
      <>
        {/* Page title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donor Locations</h1>
            <p className="text-gray-500">Manage and monitor all your donation collection points</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Input className="max-w-[180px]" placeholder="Search locations..." />
            <Button className="bg-sky-600 hover:bg-sky-700">Add New Location</Button>
          </div>
        </div>
  
        {/* Location Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-green-600 flex items-center mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-sm text-green-600 flex items-center mt-1">
                83% active rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Per Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$430</div>
              <p className="text-sm text-green-600 flex items-center mt-1">
                +$50 from last month
              </p>
            </CardContent>
          </Card>
        </div>
  
        {/* Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All contribution Locations</CardTitle>
            <CardDescription>Overview of all registered contribution points</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Total contributions</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLocations.map((location, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell>{location.count}</TableCell>
                    <TableCell>${location.amount}</TableCell>
                    <TableCell>
                      <Badge className={location.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {location.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
  
        {/* Location Performance */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
              <CardDescription>contribution amounts by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topLocations.slice(0, 4).map((location, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-gray-500">${location.amount}</div>
                    </div>
                    <Progress 
                      value={location.amount / 650 * 100} 
                      className="h-2 bg-gray-100" 
                    />
                    <div className="text-xs text-gray-500">{location.count} contributions</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };
  
  const ReportsContent = () => {
    // Mock data for monthly reports
    const monthlyReports = [
      { id: 'R001', name: 'Monthly contribution Summary - March 2025', date: 'Apr 1, 2025', type: 'PDF', size: '1.2 MB' },
      { id: 'R002', name: 'Donor Demographics Report - Q1 2025', date: 'Mar 31, 2025', type: 'Excel', size: '2.4 MB' },
      { id: 'R003', name: 'Payment Method Analysis', date: 'Mar 25, 2025', type: 'PDF', size: '0.8 MB' },
      { id: 'R004', name: 'Location Performance Report', date: 'Mar 20, 2025', type: 'PDF', size: '1.5 MB' },
      { id: 'R005', name: 'Fundraising Campaign Results', date: 'Mar 15, 2025', type: 'Excel', size: '3.2 MB' },
    ];
  
    return (
      <>
        {/* Page title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500">Generate, view and download contribution reports</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button className="bg-sky-600 hover:bg-sky-700">Generate New Report</Button>
          </div>
        </div>
  
        {/* Report Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-8 w-8 text-sky-600 mb-2" />
                <h3 className="font-bold">contribution Summary</h3>
                <p className="text-sm text-gray-500 mb-4">Overview of all contributions with trends and patterns</p>
                <Button className="w-full">Generate</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Users className="h-8 w-8 text-sky-600 mb-2" />
                <h3 className="font-bold">Donor Report</h3>
                <p className="text-sm text-gray-500 mb-4">Detailed information about your donors and their behavior</p>
                <Button className="w-full">Generate</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <MapPin className="h-8 w-8 text-sky-600 mb-2" />
                <h3 className="font-bold">Location Analysis</h3>
                <p className="text-sm text-gray-500 mb-4">Performance metrics by location with detailed breakdown</p>
                <Button className="w-full">Generate</Button>
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Reports generated in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
  
        {/* Schedule Reports */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Configure automatic report generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Monthly contribution Summary</div>
                      <div className="text-sm text-gray-500">Scheduled: First day of each month</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Weekly Location Performance</div>
                      <div className="text-sm text-gray-500">Scheduled: Every Monday</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Quarterly Donor Analysis</div>
                      <div className="text-sm text-gray-500">Scheduled: First day of each quarter</div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                  <Button variant="ghost">+ Add New Scheduled Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };
  

  // export all components for use in the main dashboard layout

    export { DashboardContent, LocationsContent, ReportsContent };