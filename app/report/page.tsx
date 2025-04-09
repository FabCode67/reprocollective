'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {  PlusCircle, RefreshCw, Calculator } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/DatePicker';
// import RootLayout from '@/components/layouts/Dashboardlayout';
import Navbar from '@/components/layouts/Navbar';


// Types
interface Partner {
  id: string;
  name: string;
  description: string | null;
  percentage: number;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Distribution {
  id: string;
  partnerId: string;
  amount: number;
  fromDate: string;
  toDate: string;
  totalCollected: number;
  status: string;
  paymentDetails: string | null;
  createdAt: string;
  updatedAt: string;
  partner: Partner;
}

interface PartnerSummary {
  partnerId: string;
  partnerName: string;
  percentage: number;
  totalEntitledAmount: number;
  totalDistributed: number;
  pendingAmount: number;
  completionPercentage: number;
}

interface DistributionCalculation {
  partnerId: string;
  partnerName: string;
  percentage: number;
  amount: number;
  fromDate: string;
  toDate: string;
  totalCollected: number;
}

interface DistributionSummary {
  totalDonations: number;
  totalDistributed: number;
  remainingAmount: number;
  partnerSummaries: PartnerSummary[];
}

export default function PartnerDistributionAdmin() {
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for partners
  const [partners, setPartners] = useState<Partner[]>([]);
  const [newPartner, setNewPartner] = useState({
    name: '',
    description: '',
    percentage: 0,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [showAddPartnerDialog, setShowAddPartnerDialog] = useState(false);

  // State for distributions
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [distributionSummary, setDistributionSummary] = useState<DistributionSummary | null>(null);
  
  // State for distribution calculation
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [calculatedDistributions, setCalculatedDistributions] = useState<DistributionCalculation[]>([]);
  const [totalCalculated, setTotalCalculated] = useState(0);
  
  // State for processing a distribution
  const [processingDistribution, setProcessingDistribution] = useState<DistributionCalculation | null>(null);
  const [paymentDetails, setPaymentDetails] = useState('');
  const [showProcessDialog, setShowProcessDialog] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchPartners();
    fetchDistributionSummary();
    fetchDistributionHistory();
  }, []);

  // Fetch partners
  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`
        ${
          process.env.NEXT_PUBLIC_API_URL
        }/partners`);
      setPartners(response.data.partners);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch partners');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Initialize default partners
  const initializeDefaultPartners = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/partners/init-default`);
      setSuccess('Default partners initialized successfully');
      fetchPartners();
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize default partners');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Add a new partner
  const addPartner = async () => {
    try {
      setIsLoading(true);
      await axios.post(`
        ${process.env.NEXT_PUBLIC_API_URL}/api/partners`, newPartner);
      setSuccess('Partner added successfully');
      setShowAddPartnerDialog(false);
      setNewPartner({
        name: '',
        description: '',
        percentage: 0,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
      });
      fetchPartners();
      setIsLoading(false);
    } catch (err) {
      setError('Failed to add partner');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Calculate distributions
  const calculateDistributions = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${
        process.env.NEXT_PUBLIC_API_URL
      }/distributions/calculate`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      setCalculatedDistributions(response.data.distributions);
      setTotalCalculated(response.data.totalCollected);
      setIsLoading(false);
      setSuccess('Distribution calculations completed');
    } catch (err) {
      setError('Failed to calculate distributions');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Process a distribution
  const processDistribution = async () => {
    if (!processingDistribution) return;

    try {
      setIsLoading(true);
      await axios.post(`${
        process.env.NEXT_PUBLIC_API_URL
      }/distributions/process`, {
        partnerId: processingDistribution.partnerId,
        amount: processingDistribution.amount,
        fromDate: processingDistribution.fromDate,
        toDate: processingDistribution.toDate,
        totalCollected: processingDistribution.totalCollected,
        paymentDetails,
      });
      
      setSuccess('Distribution processed successfully');
      setShowProcessDialog(false);
      setPaymentDetails('');
      setProcessingDistribution(null);
      
      // Refresh data
      fetchDistributionSummary();
      fetchDistributionHistory();
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process distribution');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Fetch distribution history
  const fetchDistributionHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${
        process.env.NEXT_PUBLIC_API_URL
      }/distributions/history`);
      setDistributions(response.data.distributions);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch distribution history');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Fetch distribution summary
  const fetchDistributionSummary = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${
        process.env.NEXT_PUBLIC_API_URL
      }/distributions/summary`);
      setDistributionSummary(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch distribution summary');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF',
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  // Clear alerts after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
    <Navbar />
    <div className="container max-w-7xl p-4 mx-auto mt-20 lg:flex">
    <div className="container mx-auto py-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Partner Distribution Management</h1>
      
      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-sky-50 border-sky-600">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4 bg-sky-100">
          <TabsTrigger value="summary" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">Summary</TabsTrigger>
          <TabsTrigger value="partners" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">Partners</TabsTrigger>
          <TabsTrigger value="calculate" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">Calculate</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">History</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card className="border-sky-200">
            <CardHeader className="bg-sky-50">
              <CardTitle>Distribution Summary</CardTitle>
              <CardDescription>Overview of all donations and their distribution to partners</CardDescription>
            </CardHeader>
            <CardContent>
              {distributionSummary ? (
                <div>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <Card className="border-sky-200">
                      <CardHeader className="pb-2 bg-sky-50">
                        <CardTitle className="text-lg">Total Donations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{formatCurrency(distributionSummary.totalDonations)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-sky-200">
                      <CardHeader className="pb-2 bg-sky-50">
                        <CardTitle className="text-lg">Total Distributed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{formatCurrency(distributionSummary.totalDistributed)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-sky-200">
                      <CardHeader className="pb-2 bg-sky-50">
                        <CardTitle className="text-lg">Remaining</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{formatCurrency(distributionSummary.remainingAmount)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Partner Distribution Status</h3>
                  <div className="space-y-6">
                    {distributionSummary.partnerSummaries.map((partner) => (
                      <div key={partner.partnerId} className="bg-sky-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{partner.partnerName}</h4>
                            <p className="text-sm text-gray-500">{partner.percentage}% of donations</p>
                          </div>
                          <Badge 
                            variant={partner.completionPercentage >= 100 ? "default" : "secondary"}
                            className={partner.completionPercentage >= 100 ? "bg-sky-600" : "bg-sky-200 text-black"}
                          >
                            {partner.completionPercentage}% Complete
                          </Badge>
                        </div>
                        <Progress 
                          value={partner.completionPercentage > 100 ? 100 : partner.completionPercentage} 
                          className="h-2 mb-2 bg-sky-100"
                          // indicatorClassName="bg-sky-500"
                        />
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-gray-500">Entitled</p>
                            <p className="font-medium">{formatCurrency(partner.totalEntitledAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Distributed</p>
                            <p className="font-medium">{formatCurrency(partner.totalDistributed)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Pending</p>
                            <p className="font-medium">{formatCurrency(partner.pendingAmount)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p>Loading summary data...</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-sky-50">
              <Button 
                variant="outline" 
                onClick={fetchDistributionSummary}
                disabled={isLoading}
                className="cursor-pointer border-sky-500 text-sky-700 hover:bg-sky-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Partners Tab */}
        <TabsContent value="partners">
          <Card className="border-sky-200">
            <CardHeader className="bg-sky-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Partner Management</CardTitle>
                  <CardDescription>Manage distribution partners and their percentages</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showAddPartnerDialog} onOpenChange={setShowAddPartnerDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-sky-600 hover:bg-sky-700">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Partner
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Add New Partner</DialogTitle>
                        <DialogDescription>
                          Add a new partner for donation distribution
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Partner Name</Label>
                          <Input 
                            id="name" 
                            value={newPartner.name}
                            onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                            className="border-sky-200 focus:border-sky-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Input 
                            id="description" 
                            value={newPartner.description}
                            onChange={(e) => setNewPartner({...newPartner, description: e.target.value})}
                            className="border-sky-200 focus:border-sky-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="percentage">Percentage (%)</Label>
                          <Input 
                            id="percentage" 
                            type="number"
                            min="0"
                            max="100"
                            value={newPartner.percentage}
                            onChange={(e) => setNewPartner({...newPartner, percentage: parseFloat(e.target.value)})}
                            className="border-sky-200 focus:border-sky-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contactName">Contact Name</Label>
                          <Input 
                            id="contactName" 
                            value={newPartner.contactName}
                            onChange={(e) => setNewPartner({...newPartner, contactName: e.target.value})}
                            className="border-sky-200 focus:border-sky-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contactEmail">Contact Email</Label>
                          <Input 
                            id="contactEmail" 
                            type="email"
                            value={newPartner.contactEmail}
                            onChange={(e) => setNewPartner({...newPartner, contactEmail: e.target.value})}
                            className="border-sky-200 focus:border-sky-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contactPhone">Contact Phone</Label>
                          <Input 
                            id="contactPhone" 
                            value={newPartner.contactPhone}
                            onChange={(e) => setNewPartner({...newPartner, contactPhone: e.target.value})}
                            className="border-sky-200 focus:border-sky-500"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={addPartner} disabled={isLoading} className="bg-sky-600 hover:bg-sky-700">
                          Add Partner
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    onClick={initializeDefaultPartners}
                    disabled={isLoading || partners.length > 0}
                    className="border-sky-500 text-sky-700 hover:bg-sky-100"
                  >
                    Initialize Default Partners
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {partners.length > 0 ? (
                <Table>
                  <TableHeader className="bg-sky-50">
                    <TableRow>
                      <TableHead>Partner Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner.id} className="border-b border-sky-100">
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>{partner.description || 'N/A'}</TableCell>
                        <TableCell className="text-right">{partner.percentage}%</TableCell>
                        <TableCell>
                          {partner.contactName ? (
                            <div>
                              <p>{partner.contactName}</p>
                              <p className="text-sm text-gray-500">{partner.contactEmail}</p>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={partner.isActive ? "default" : "secondary"}
                            className={partner.isActive ? "bg-sky-600" : "bg-sky-200 text-black"}
                          >
                            {partner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-gray-500 mb-4">No partners found</p>
                  <Button 
                    onClick={initializeDefaultPartners} 
                    disabled={isLoading}
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    Initialize Default Partners
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calculate Tab */}
        <TabsContent value="calculate">
          <Card className="border-sky-200">
            <CardHeader className="bg-sky-50">
              <CardTitle>Calculate Distributions</CardTitle>
              <CardDescription>
                Calculate partner distributions for a specific date range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <DatePicker 
                    date={startDate} 
                    setDate={setStartDate} 
                    className="w-full border-sky-200 focus:border-sky-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <DatePicker 
                    date={endDate} 
                    setDate={setEndDate} 
                    className="w-full border-sky-200 focus:border-sky-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mb-6">
                <Button 
                  onClick={calculateDistributions} 
                  disabled={isLoading}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Distribution
                </Button>
              </div>
              
              {calculatedDistributions.length > 0 && (
                <div>
                  <div className="bg-sky-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-500">Period</p>
                    <p className="font-medium">
                      {startDate && format(startDate, 'PPP')} to {endDate && format(endDate, 'PPP')}
                    </p>
                    <Separator className="my-2 bg-sky-200" />
                    <p className="text-sm text-gray-500">Total Collected</p>
                    <p className="text-xl font-bold">{formatCurrency(totalCalculated)}</p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Distribution Breakdown</h3>
                  <Table>
                    <TableHeader className="bg-sky-50">
                      <TableRow>
                        <TableHead>Partner</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculatedDistributions.map((dist) => (
                        <TableRow key={dist.partnerId} className="border-b border-sky-100">
                          <TableCell className="font-medium">{dist.partnerName}</TableCell>
                          <TableCell>{dist.percentage}%</TableCell>
                          <TableCell className="text-right">{formatCurrency(dist.amount)}</TableCell>
                          <TableCell>
                            <Dialog open={showProcessDialog && processingDistribution?.partnerId === dist.partnerId} 
                                   onOpenChange={(open) => {
                                     if (!open) setProcessingDistribution(null);
                                     setShowProcessDialog(open);
                                   }}>
                              <DialogTrigger asChild>
                                {/* <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setProcessingDistribution(dist)}
                                  className="border-sky-500 text-sky-700 hover:bg-sky-100"
                                >
                                  Process
                                </Button> */}
                              </DialogTrigger>
                              <DialogContent className="bg-white">
                                <DialogHeader>
                                  <DialogTitle>Process Distribution</DialogTitle>
                                  <DialogDescription>
                                    Process a payment of {processingDistribution && formatCurrency(processingDistribution.amount)} to {processingDistribution?.partnerName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="grid gap-4 mb-4">
                                    <div>
                                      <Label htmlFor="amount">Amount</Label>
                                      <Input 
                                        id="amount" 
                                        value={processingDistribution?.amount} 
                                        disabled 
                                        className="bg-sky-50"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="paymentDetails">Payment Details</Label>
                                      <Input 
                                        id="paymentDetails" 
                                        placeholder="e.g. Transaction ID, method, etc."
                                        value={paymentDetails}
                                        onChange={(e) => setPaymentDetails(e.target.value)}
                                        className="border-sky-200 focus:border-sky-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    onClick={processDistribution} 
                                    disabled={isLoading}
                                    className="bg-sky-600 hover:bg-sky-700"
                                  >
                                    Complete Distribution
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card className="border-sky-200">
            <CardHeader className="bg-sky-50">
              <CardTitle>Distribution History</CardTitle>
              <CardDescription>View all past distributions to partners</CardDescription>
            </CardHeader>
            <CardContent>
              {distributions.length > 0 ? (
                <Table>
                  <TableHeader className="bg-sky-50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Partner</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributions.map((dist) => (
                      <TableRow key={dist.id} className="border-b border-sky-100">
                        <TableCell>{formatDate(dist.createdAt)}</TableCell>
                        <TableCell className="font-medium">{dist.partner.name}</TableCell>
                        <TableCell>
                          {formatDate(dist.fromDate)} - {formatDate(dist.toDate)}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(dist.amount)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              dist.status === 'completed' ? 'default' : 
                              dist.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            className={
                              dist.status === 'completed' ? 'bg-sky-600' : 
                              dist.status === 'pending' ? 'bg-sky-200 text-black' : 'bg-red-500'
                            }
                          >
                            {dist.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">No distribution history found</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-sky-50">
              <Button 
                variant="outline" 
                onClick={fetchDistributionHistory}
                className="border-sky-500 text-sky-700 hover:bg-sky-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
    </div>
  );
}

























