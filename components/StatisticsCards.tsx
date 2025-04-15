'use client';
import React, { useEffect, useState } from 'react';


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
const StatisticsCards = () => {
  // Sample data - replace with your actual data

  const [summary, setSummary] = useState<ReportSummary>({
      totalAmount: 0,
      totalCount: 0,
      completed: 0,
      pending: 0,
      failed: 0
    });
    const [startDate, ] = useState<Date | undefined>(
      new Date(new Date().setDate(new Date().getDate() - 30))
    );
    const [endDate, ] = useState<Date | undefined>(new Date());
    const [locationFilter, ] = useState<string>('all');
    const [paymentMethodFilter, ] = useState<string>('all');
    const [statusFilter, ] = useState<string>('all');
    const [searchTerm,] = useState<string>('');
    const [, setIsLoading] = useState<boolean>(true);
    const [ ,setDonations] = useState<Donation[]>([]);
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


    useEffect(() => {
      fetchDonations();
    }
    , [startDate, endDate, locationFilter, paymentMethodFilter, statusFilter, searchTerm]);
  const statsData = [
    {
      title: "Total Contributions",
      period: "2021-2024",
      value: "1,245,720 Rwf",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
      
      )
    },
    {
      title: "Current Year",
      period: "2025",
      value: `${summary.totalAmount.toFixed(2)} Rwf`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    // {
    //   title: "Current total Contributors",
    //   period: "2025",
    //   value: "3,782",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    //       <circle cx="9" cy="7" r="4" />
    //       <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    //       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    //     </svg>
    //   )
    // }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {statsData.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 flex items-center transform transition-transform duration-300 hover:scale-105"
          >
            <div className="flex-shrink-0 p-3 rounded-full bg-[#F77665]/10 text-[#F77665]">
              {stat.icon}
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-xs text-gray-400">{stat.period}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;