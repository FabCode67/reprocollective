'use client';

import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Location } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, MapPin, QrCode, Phone, User, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import ResultModal from './SuccessAndFailModel';

interface DonationModalProps {
    location: Location;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (amount?: number, transactionId?: string) => void;
    onError: (error: string) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({
    location,
    isOpen,
    onClose,
    onSuccess,
    onError
}) => {
    const [donationAmount, setDonationAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    // Donor information
    const [donorName, setDonorName] = useState<string>('');
    const [donorPhone, setDonorPhone] = useState<string>('');

    // Result modal states
    const [showResultModal, setShowResultModal] = useState<boolean>(false);
    const [resultSuccess, setResultSuccess] = useState<boolean>(false);
    const [resultMessage, setResultMessage] = useState<string>('');
    const [transactionId, setTransactionId] = useState<string>('');
    const [finalAmount, setFinalAmount] = useState<number | undefined>(undefined);

    // Payment iframe states
    const [showPaymentIframe, setShowPaymentIframe] = useState<boolean>(false);
    const [paymentUrl, setPaymentUrl] = useState<string>('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const validateForm = () => {
        // Validate donation amount
        const amount = parseFloat(donationAmount);
        if (isNaN(amount) || amount <= 0) {
            onError('Please enter a valid contribution amount');
            setErrorMessage('Please enter a valid contribution amount');
            return false;
        }

        // Validate phone number
        if (!donorPhone || donorPhone.length < 10) {
            onError('Please enter a valid phone number');
            setErrorMessage('Please enter a valid phone number');
            return false;
        }

        return true;
    };

    // Listen for payment completion messages from the iframe
    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Verify the origin of the message
            if (event.origin.includes('flutterwave.com')) {
                try {
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    
                    // Handle payment completion
                    if (data.status === 'successful') {
                        // Hide the payment iframe
                        setShowPaymentIframe(false);
                        
                        // Show success modal
                        setResultSuccess(true);
                        setResultMessage('Thank you for your generous contribution to REPROCOLLECTIVE!');
                        setTransactionId(data.transactionId || transactionId);
                        setShowResultModal(true);
                        
                        // Call the success callback
                        onSuccess(finalAmount, data.transactionId || transactionId);
                    } else if (data.status === 'failed' || data.status === 'cancelled') {
                        // Hide the payment iframe
                        setShowPaymentIframe(false);
                        
                        // Show failure modal
                        setResultSuccess(false);
                        setResultMessage(data.message || 'Payment failed');
                        setShowResultModal(true);
                        
                        // Call the error callback
                        onError(data.message || 'Payment failed');
                    }
                } catch (error) {
                    console.error('Error processing payment message:', error);
                }
            }
        };

        // Add event listener for postMessage from payment iframe
        window.addEventListener('message', handleMessage);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [transactionId, finalAmount, onSuccess, onError]);

    const handleDonate = async () => {
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Prepare payment data based on backend API requirements
            const paymentData = {
                locationCode: location.qrCode, // Assuming location has a code property
                amount: parseFloat(donationAmount),
                donorName: donorName ?? 'anonymous',
                donorPhone,
                paymentMethod: 'mtn', // Only MTN Mobile Money is supported
                currency: 'RWF', // Only RWF is supported
                // Add a redirect URL that your backend will include in the payment flow
                redirectUrl: `${window.location.origin}/payment-callback`
            };

            // Call the payment initiation API
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payments/initiate`, paymentData)

            // Handle successful payment initiation
            if (response.data.success) {
                // Clear form fields
                resetForm();
                setTransactionId(response.data.transactionId || '');
                setFinalAmount(parseFloat(donationAmount));
                
                // If there's a payment URL, show it in iframe
                if (response.data.paymentUrl) {
                    console.log('Showing payment URL in iframe:', response.data.paymentUrl);
                    setPaymentUrl(response.data.paymentUrl);
                    setShowPaymentIframe(true);
                } else {
                    // Otherwise, consider it successful
                    setResultSuccess(true);
                    setResultMessage('Thank you for your generous contribution to REPROCOLLECTIVE!');
                    setShowResultModal(true);
                    
                    // Call the success callback
                    onSuccess(parseFloat(donationAmount), response.data.transactionId);
                }
            } else {
                // Show failure modal
                setResultSuccess(false);
                setResultMessage(response.data.message || 'Payment initiation failed');
                setShowResultModal(true);
                
                // Call the error callback
                onError(response.data.message || 'Payment initiation failed');
                console.error('Payment initiation failed:', response.data.message);
            }
        } catch (error) {
            // Handle API call errors
            console.error("Payment error:", error);
            const errorMessage = axios.isAxiosError(error) && error.response?.data
                ? error.response.data.error || error.response.data.details || 'An unexpected error occurred during contribution'
                : 'An unexpected error occurred during contribution';
            
            // Show failure modal
            setResultSuccess(false);
            setResultMessage(errorMessage);
            setShowResultModal(true);
            setErrorMessage(errorMessage);
            
            // Call the error callback
            onError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetForm = () => {
        setDonationAmount('');
        setDonorName('');
        setDonorPhone('');
    };

    const handleResultModalClose = () => {
        setShowResultModal(false);
        if (resultSuccess) {
            // Close the donation modal if payment was successful
            onClose();
        }
    };

    const handleClosePaymentIframe = () => {
        setShowPaymentIframe(false);
        setErrorMessage('Payment process was cancelled');
    };

    // Format phone number as the user types
    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only digits
        const value = e.target.value.replace(/\D/g, '');
        setDonorPhone(value);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] max-w-[90vw] bg-white p-4 sm:p-6 rounded-lg">
                    {!showPaymentIframe ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center text-lg sm:text-xl">
                                    <QrCode className="mr-2 text-[#F77665] h-5 w-5 sm:h-6 sm:w-6" />
                                    Donate to REPROCOLLECTIVE
                                </DialogTitle>
                                <DialogDescription className="text-sm sm:text-base">
                                    Support our mission through {location.name}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {/* Location Details */}
                                <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg">
                                    <Building2 className="text-[#F77665] shrink-0 h-5 w-5" />
                                    <div>
                                        <h4 className="font-semibold">{location.name}</h4>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <MapPin className="mr-1 w-4 h-4 shrink-0" /> {location.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Method Notice */}
                                <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-3">
                                    <AlertTriangle className="text-blue-500 shrink-0 h-5 w-5 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">Payment Information</p>
                                        <p className="text-xs text-blue-600">
                                            We currently accept MTN Mobile Money payments in Rwandan Francs (RWF) only.
                                        </p>
                                    </div>
                                </div>

                                {/* Error message display */}
                                {errorMessage && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                                        <p className="text-red-700 text-sm">{errorMessage}</p>
                                    </div>
                                )}

                                {/* Donor Information */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                                        <Label htmlFor="donorName" className="sm:text-right flex items-center">
                                            <User className="w-4 h-4 inline mr-1 sm:hidden" />
                                            <span>Name <span className="text-gray-500 text-xs">(Optional)</span></span>
                                        </Label>
                                        <div className="sm:col-span-3">
                                            <Input
                                                id="donorName"
                                                placeholder="Your full name"
                                                className="w-full"
                                                value={donorName}
                                                onChange={(e) => setDonorName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                                        <Label htmlFor="donorPhone" className="sm:text-right flex items-center">
                                            <Phone className="w-4 h-4 inline mr-1 sm:hidden" />
                                            <span>Phone <span className="text-red-500">*</span></span>
                                        </Label>
                                        <div className="sm:col-span-3">
                                            <Input
                                                id="donorPhone"
                                                type="tel"
                                                placeholder="Your MTN mobile number"
                                                className="w-full"
                                                value={donorPhone}
                                                onChange={handlePhoneInput}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Enter the MTN number that will be used for payment
                                            </p>
                                        </div>
                                    </div>

                                    {/* Donation Amount */}
                                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                                        <Label htmlFor="amount" className="sm:text-right">
                                            Amount <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="sm:col-span-3 relative">
                                            <Input
                                                id="amount"
                                                type="number"
                                                min="1"
                                                placeholder="Enter contribution amount"
                                                className="w-full pr-12"
                                                value={donationAmount}
                                                onChange={(e) => setDonationAmount(e.target.value)}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                                RWF
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleDonate}
                                    disabled={isProcessing}
                                    className="w-full bg-[#F77665] hover:bg-[#F77665]/90 text-white py-2 h-auto text-base"
                                >
                                    {isProcessing ? 'Processing...' : 'Contribute via MTN Mobile Money'}
                                </Button>
                                
                                <div className="text-center">
                                    <a 
                                        href="https://docs.google.com/forms/d/1iryfcNbqPIAM3zrhqYp6dpBML5tVzanURpdKJIAdHFs" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#F77665] text-sm hover:underline flex items-center justify-center"
                                    >
                                        <span className="mr-1 bg-[#F77665] text-white px-2 py-0.5 rounded-full text-xs">New</span>
                                        Become a monthly contributor instead
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center">
                                    <QrCode className="mr-2 text-[#F77665]" />
                                    Complete Your Payment
                                </DialogTitle>
                                <DialogDescription>
                                    Please complete the payment process below
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="w-full h-72 sm:h-96 relative">
                                <iframe
                                    ref={iframeRef}
                                    src={paymentUrl}
                                    className="w-full h-full border-0"
                                    allow="payment"
                                    title="Payment Gateway"
                                />
                            </div>
                            
                            <Button
                                onClick={handleClosePaymentIframe}
                                variant="outline"
                                className="mt-2"
                            >
                                Cancel Payment
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Result Modal for success/failure feedback */}
            <ResultModal
                isOpen={showResultModal}
                onClose={handleResultModalClose}
                isSuccess={resultSuccess}
                message={resultMessage}
                transactionId={transactionId}
                amount={finalAmount}
                onRetry={handleDonate}
            />
        </>
    );
};

export default DonationModal;