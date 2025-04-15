'use client';
import { Heart } from 'lucide-react';
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

interface Content {
  section: string;
  text: string;
  updatedAt: string;
}

interface ApiResponse {
  summary: ReportSummary;
  donations: Donation[];
}

const StatisticsCards = () => {
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isContentLoading, setIsContentLoading] = useState<boolean>(true);
  const [, setDonations] = useState<Donation[]>([]);
  
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
        throw new Error('Failed to fetch contribution reports');
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
  }, [startDate, endDate, locationFilter, paymentMethodFilter, statusFilter, searchTerm]);

  const [, setContentSections] = useState<Content[]>([]);
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({});

  const fetchContent = async () => {
    try {
      setIsContentLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      const data = await response.json();
      setContentSections(data.contents);

      // Initialize editing state
      const initialEditState: { [key: string]: string } = {};
      data.contents.forEach((content: Content) => {
        initialEditState[content.section] = content.text;
      });
      setEditingContent(initialEditState);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsContentLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);
  
  const statsData = [
    {
      title: "Total Contributions",
      period: "2021-2024",
      value: editingContent["money"] ? editingContent["money"] + ' Rwf' : "Loading...",
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
    }
  ];

  // Skeleton loader for statistics cards
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
      <div className="flex-shrink-0 p-3 rounded-full bg-gray-200 animate-pulse h-14 w-14"></div>
      <div className="ml-5 space-y-2 w-full">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-7 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
      {/* Monthly Contributor Banner */}
      <div className="mb-6 bg-gradient-to-r from-[#F77665] to-[#F77665]/80 rounded-lg shadow-lg p-4 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Support Our Ongoing Mission</h3>
            <p className="text-white/90">Join our community of monthly contributors and make a lasting impact</p>
          </div>
          <a 
            href="https://docs.google.com/forms/d/1iryfcNbqPIAM3zrhqYp6dpBML5tVzanURpdKJIAdHFs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-[#F77665] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center"
          >
            <Heart className="mr-2 h-5 w-5" fill="#F77665" />
            Become a Monthly Contributor
            <span className="ml-2 bg-[#F77665] text-white px-2 py-0.5 rounded-full text-xs">New</span>
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {isLoading || isContentLoading ? (
          // Show skeleton loaders when loading
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          // Show actual data when loaded
          statsData.map((stat, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default StatisticsCards;