// app/transactions/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from '@/components/ui/calendar'
import RootLayout from '@/components/layouts/Dashboardlayout'

// Types
interface Location {
  id: string | null;
  name: string;
  location: string;
  donationCount: number;
}

interface Transaction {
  id: string;
  amount: number;
  donorName: string;
  donorPhone: string;
  paymentMethod: string;
  transactionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  locationDetails: Location | null;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Create a separate component for the transaction content that uses hooks
function TransactionsContent() {
  // States
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [loading, setLoading] = useState<boolean>(true)
  
  // Filters
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Fetch data
  const fetchTransactions = async () => {
    setLoading(true)
    
    // Build query parameters
    const params = new URLSearchParams()
    
    if (selectedLocation) params.append('locationId', selectedLocation)
    if (selectedStatus) params.append('status', selectedStatus)
    if (selectedPaymentMethod) params.append('paymentMethod', selectedPaymentMethod)
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())
    params.append('page', pagination.page.toString())
    params.append('limit', pagination.limit.toString())
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/transactions?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setTransactions(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchLocations = async () => {
    try {
      const response = await fetch(`${
        process.env.NEXT_PUBLIC_API_URL
      }/payments/locations`)
      const data = await response.json()
      
      if (data.success) {
        setLocations(data.data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }
  
  // Initialize
  useEffect(() => {
    fetchLocations()
    
    // Get initial filters from URL
    const page = searchParams.get('page') || '1'
    const locationId = searchParams.get('locationId')
    const status = searchParams.get('status')
    const paymentMethod = searchParams.get('paymentMethod')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    
    if (locationId) setSelectedLocation(locationId)
    if (status) setSelectedStatus(status)
    if (paymentMethod) setSelectedPaymentMethod(paymentMethod)
    if (startDateParam) setStartDate(new Date(startDateParam))
    if (endDateParam) setEndDate(new Date(endDateParam))
    
    setPagination(prev => ({
      ...prev,
      page: parseInt(page)
    }))
  }, [searchParams])
  
  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions()
    
    // Update URL with current filters
    const params = new URLSearchParams()
    if (selectedLocation) params.append('locationId', selectedLocation)
    if (selectedStatus) params.append('status', selectedStatus)
    if (selectedPaymentMethod) params.append('paymentMethod', selectedPaymentMethod)
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())
    params.append('page', pagination.page.toString())
    
    const url = `transactions?${params.toString()}`
    router.push(url, { scroll: false })
  }, [pagination.page, selectedLocation, selectedStatus, selectedPaymentMethod, startDate, endDate, router])
  
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }))
  }
  
  const handleApplyFilters = () => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }))
  }
  
  const handleResetFilters = () => {
    setSelectedLocation('')
    setSelectedStatus('')
    setSelectedPaymentMethod('')
    setStartDate(null)
    setEndDate(null)
    setPagination(prev => ({
      ...prev,
      page: 1
    }))
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm a')
  }
  
  // Get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Transactions</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
          <Button onClick={handleApplyFilters} className="bg-[#F77665] hover:bg-[#F77665]">Apply Filters</Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select
                value={selectedLocation || ''}
                onValueChange={(value) => setSelectedLocation(value === '' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                  value="Locations"
                  >All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem 
                      key={location.id || '1'} 
                      value={location.id === null ? '1' : location.id}
                    >
                      {location.name} ({location.donationCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Select
                value={selectedStatus || ''}
                onValueChange={(value) => setSelectedStatus(value === '' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Statuses">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Payment Method Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select
                value={selectedPaymentMethod || ''}
                onValueChange={(value) => setSelectedPaymentMethod(value === '' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Methods">All Methods</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Start Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    selected={startDate || undefined}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* End Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    selected={endDate || undefined}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-50">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 text-[#F77665] animate-spin mr-2" />
                        Loading transactions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found with the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-orange-50">
                      <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell>
                        <div>{transaction.donorName}</div>
                        <div className="text-sm text-gray-500">{transaction.donorPhone}</div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                        <span className="capitalize">{transaction.paymentMethod}</span>
                      </TableCell>
                      <TableCell>{transaction?.location ?? "Unknown"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-gray-500">
              Showing {transactions.length} of {pagination.total} transactions
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  />
                </PaginationItem>
                
                {Array.from({ length: pagination.totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  // Only show first, last, current, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === pagination.page}
                          onClick={() => handlePageChange(pageNumber)}
                          className={pageNumber === pagination.page ? "bg-[#F77665]" : ""}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  // Show ellipsis for gaps
                  if (
                    (pageNumber === 2 && pagination.page > 3) ||
                    (pageNumber === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${pageNumber}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext
                    className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  )
}

// Main page component
const TransactionsPage = () => {
  return (
    <RootLayout>
      <Suspense fallback={
        <div className="container mx-auto py-6 flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 text-[#F77665] animate-spin" />
          <span className="ml-2">Loading transactions...</span>
        </div>
      }>
        <TransactionsContent />
      </Suspense>
    </RootLayout>
  )
}

export default TransactionsPage