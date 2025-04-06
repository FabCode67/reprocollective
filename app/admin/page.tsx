// src/app/admin/page.tsx
'use client';

import { DollarSign, QrCode, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RootLayout from '@/components/layouts/Dashboardlayout';

export default function DashboardPage() {
  return (
    <RootLayout>
    <div className="container mx-auto">
      {/* Page title and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">{"Welcome back! Here's what's happening with your donations today."}</p>
        </div>
        <div className="mt-4 md:mt-0">
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
                    <QrCode className="h-4 w-4" /> View QR Codes
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Manage existing codes</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </RootLayout>
  );
}