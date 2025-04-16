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
import { Building2, MapPin, QrCode, AlertTriangle } from 'lucide-react';
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
                <DialogContent className="sm:max-w-[425px] max-w-[90vw] max-h-[85vh] bg-white p-3 sm:p-6 rounded-lg overflow-hidden flex flex-col">
                    {!showPaymentIframe ? (
                        <>
                            <DialogHeader className="pb-1">
                                <DialogTitle className="text-base sm:text-lg flex items-center">
                                    <QrCode className="mr-2 text-[#F77665] h-4 w-4 sm:h-5 sm:w-5" />
                                    Contribute to REPROCOLLECTIVE
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                    Support our mission through {location.name}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="overflow-y-auto flex-grow pr-1 -mr-1">
                                <div className="space-y-3 py-2">
                                    {/* Location Details - Compact Version */}
                                    <div className="flex items-center space-x-2 bg-orange-50 p-2 rounded-lg">
                                        <Building2 className="text-[#F77665] shrink-0 h-4 w-4" />
                                        <div className="truncate">
                                            <h4 className="font-medium text-sm">{location.name}</h4>
                                            <p className="text-xs text-gray-600 flex items-center truncate">
                                                <MapPin className="mr-1 w-3 h-3 shrink-0" /> {location.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment Method Notice - More Compact */}
                                    <div className="bg-blue-50 p-2 rounded-lg flex items-start space-x-2">
                                        <AlertTriangle className="text-blue-500 shrink-0 h-4 w-4 mt-0.5" />
                                        <p className="text-xs text-blue-600">
                                            We currently accept MTN Mobile Money payments in Rwandan Francs (RWF) only.
                                        </p>
                                    </div>

                                    {/* Error message display */}
                                    {errorMessage && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-r-lg">
                                            <p className="text-red-700 text-xs">{errorMessage}</p>
                                        </div>
                                    )}

                                    {/* Donor Information */}
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 items-center gap-2">
                                            <Label htmlFor="donorName" className="text-xs">
                                                Name <span className="text-gray-500 text-xs">(Optional)</span>
                                            </Label>
                                            <Input
                                                id="donorName"
                                                placeholder="Your name"
                                                className="col-span-2 h-8 text-sm"
                                                value={donorName}
                                                onChange={(e) => setDonorName(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 items-start gap-2">
                                            <Label htmlFor="donorPhone" className="text-xs pt-1.5">
                                                Phone <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="col-span-2">
                                                <Input
                                                    id="donorPhone"
                                                    type="tel"
                                                    placeholder="MTN number"
                                                    className="h-8 text-sm"
                                                    value={donorPhone}
                                                    onChange={handlePhoneInput}
                                                />
                                                <p className="text-[10px] text-gray-500 mt-0.5">
                                                    Enter MTN number for payment
                                                </p>
                                            </div>
                                        </div>

                                        {/* Donation Amount */}
                                        <div className="grid grid-cols-3 items-center gap-2">
                                            <Label htmlFor="amount" className="text-xs">
                                                Amount <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="col-span-2 relative">
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    min="1"
                                                    placeholder="Enter amount"
                                                    className="h-8 text-sm pr-10"
                                                    value={donationAmount}
                                                    onChange={(e) => setDonationAmount(e.target.value)}
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-xs">
                                                    RWF
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-center pt-1">
                                        <a 
                                            href="https://docs.google.com/forms/d/1iryfcNbqPIAM3zrhqYp6dpBML5tVzanURpdKJIAdHFs" 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#F77665] text-xs hover:underline inline-flex items-center"
                                        >
                                            <span className="mr-1 bg-[#F77665] text-white px-1.5 py-0.5 rounded-full text-[10px]">New</span>
                                            Become a monthly contributor
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="h-8 text-xs px-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDonate}
                                    disabled={isProcessing}
                                    className="h-8 text-xs px-3 bg-[#F77665] hover:bg-[#F77665]/90"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin mr-1 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div> 
                                            Processing...
                                        </>
                                    ) : (
                                        "Contribute Now"
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <DialogHeader className="pb-2">
                                <DialogTitle className="text-base sm:text-lg">Payment</DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                    Complete your MTN Mobile Money payment
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="w-full h-64 sm:h-72 relative border rounded overflow-hidden flex-grow">
                                <iframe
                                    ref={iframeRef}
                                    src={paymentUrl}
                                    className="w-full h-full border-0"
                                    allow="payment"
                                    title="Payment Gateway"
                                />
                            </div>
                            
                            <div className="flex justify-end mt-2">
                                <Button
                                    onClick={handleClosePaymentIframe}
                                    variant="outline"
                                    className="h-8 text-xs"
                                >
                                    Cancel Payment
                                </Button>
                            </div>
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