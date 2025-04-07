// File: pages/Donate.tsx
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL

interface DonationLocation {
  id: string;
  name: string;
  location: string;
  phone: string;
  imageUrl?: string;
}

const DonatePage: React.FC = () => {
  const [locationCode, setLocationCode] = useState<string>('');
  const [location, setLocation] = useState<DonationLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'card'>('mtn');
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentResponse, setPaymentResponse] = useState<{ message: string; transactionId: string } | null>(null);
  
  useEffect(() => {
    // Extract location code from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const code = params.get('location');
    
    if (code) {
      setLocationCode(code);
      fetchLocationDetails(code);
    } else {
      setLoading(false);
      setError('No location code found. Please scan a valid QR code.');
    }
  }, []);
  
  const fetchLocationDetails = async (code: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/locations/${code}`);
      setLocation(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to load location details. Please try again.');
      console.error('Error fetching location:', error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !donorName || !donorPhone) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setProcessing(true);
      setError(null);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments/initiate`, {
        locationCode,
        amount: parseFloat(amount),
        donorName,
        donorPhone,
        paymentMethod
      });
      
      setPaymentResponse(response.data);
      
      // If card payment, redirect to payment URL
      if (paymentMethod === 'card' && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
      
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      setError('Payment initiation failed. Please try again.');
      console.error('Error initiating payment:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error && !location) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (paymentResponse && paymentMethod === 'mtn') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-green-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Payment Initiated</h2>
          <p className="text-gray-600 text-center mb-2">{paymentResponse.message}</p>
          <p className="text-gray-500 text-sm text-center">Transaction ID: {paymentResponse.transactionId}</p>
          <p className="text-gray-500 text-sm text-center mt-4">Please check your phone to complete the payment.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {location?.imageUrl && (
          <div className="h-48 w-full overflow-hidden">
            <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Donate to {location?.name}</h1>
          <p className="text-gray-600 mb-6">Location: {location?.location}</p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">Amount (RWF)*</label>
              <input
                type="number"
                id="amount"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="donorName" className="block text-gray-700 font-medium mb-2">Your Name*</label>
              <input
                type="text"
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="donorPhone" className="block text-gray-700 font-medium mb-2">Phone Number*</label>
              <input
                type="tel"
                id="donorPhone"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="e.g. 07XXXXXXXX"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Payment Method*</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'mtn'}
                    onChange={() => setPaymentMethod('mtn')}
                    className="mr-2"
                  />
                  <span>MTN Mobile Money</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mr-2"
                  />
                  <span>Credit/Debit Card</span>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={processing}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-200 ${
                processing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {processing ? 'Processing...' : 'Make Contribution'}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-6 text-center">
           {" Your contribution will directly support Repro Collective's initiatives. Thank you for your generosity!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;