// src/app/admin/reports/page.tsx
'use client';

import { Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RootLayout from '@/components/layouts/Dashboardlayout';

export default function ReportsPage() {
  // Mock data for recent donations
  const recentDonations = [
    { id: '1', date: 'Apr 3, 2025', amount: 50.00, method: 'MTN Mobile Money', location: 'Kingfisher Restaurant', status: 'Completed' },
    { id: '2', date: 'Apr 2, 2025', amount: 25.00, method: 'Bank Card', location: 'City Hotel', status: 'Completed' },
    { id: '3', date: 'Apr 2, 2025', amount: 100.00, method: 'MTN Mobile Money', location: 'Sunshine School', status: 'Pending' },
    { id: '4', date: 'Apr 1, 2025', amount: 75.00, method: 'Bank Card', location: 'Blue Sky Hotel', status: 'Failed' },
    { id: '5', date: 'Mar 31, 2025', amount: 30.00, method: 'MTN Mobile Money', location: 'Central School', status: 'Completed' },
  ];

  // Mock data for monthly reports
  const monthlyReports = [
    { month: 'March 2025', donations: 145, total: '$5,280', growth: '+8.3%', status: 'Complete' },
    { month: 'February 2025', donations: 132, total: '$4,870', growth: '+12.4%', status: 'Complete' },
    { month: 'January 2025', donations: 118, total: '$4,120', growth: '+5.2%', status: 'Complete' },
    { month: 'December 2024', donations: 126, total: '$3,920', growth: '-2.5%', status: 'Complete' },
  ];

  return (
    <RootLayout>
    <div className="container mx-auto">
      {/* Page title and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and view donation analytics reports</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Select Date Range
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="transactions" className="mb-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            Transaction Reports
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            Monthly Reports
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            Custom Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Transaction Reports</CardTitle>
                <CardDescription>View and filter donation transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                <Filter className="mr-2 h-4 w-4" />
                Filter Transactions
              </Button>
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
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">Load More Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Reports</CardTitle>
              <CardDescription>Summary reports generated at the end of each month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Donations</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.month}</TableCell>
                      <TableCell>{report.donations}</TableCell>
                      <TableCell>{report.total}</TableCell>
                      <TableCell className={report.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {report.growth}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{report.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Generate customized reports based on specific criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-sky-50 p-6 rounded-md text-center">
                  <h3 className="text-lg font-medium text-sky-800 mb-2">Create a Custom Report</h3>
                  <p className="text-sky-700 mb-4">
                    Select your parameters to generate a tailored report based on your requirements
                  </p>
                  <Button className="bg-sky-600 hover:bg-sky-700">Create New Report</Button>
                </div>
                
                <div className="text-center text-gray-500">
                  <p>No custom reports generated yet.</p>
                  <p>Select parameters and create your first custom report.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </RootLayout>
  );
}