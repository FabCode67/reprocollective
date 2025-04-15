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
import { Building2, MapPin, QrCode, CreditCard, Phone, User } from 'lucide-react';
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
    const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'card' | 'bank_transfer'>('mtn');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    // Donor information
    const [donorName, setDonorName] = useState<string>('');
    const [donorPhone, setDonorPhone] = useState<string>('');

    // Additional card information for 'card' payment method
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');

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

       
        if (!donorPhone || donorPhone.length < 10) {
            onError('Please enter a valid phone number');
            setErrorMessage('Please enter a valid phone number');
            return false;
        }

      

        // Additional validation for card payment method
        if (paymentMethod === 'card') {
            if (!cardNumber || cardNumber.length < 16) {
                onError('Please enter a valid card number');
                setErrorMessage('Please enter a valid card number');
                return false;
            }
            if (!expiryDate || !expiryDate.includes('/')) {
                onError('Please enter a valid expiry date (MM/YY)');
                setErrorMessage('Please enter a valid expiry date (MM/YY)');
                return false;
            }
            if (!cvv || cvv.length < 3) {
                onError('Please enter a valid CVV');
                setErrorMessage('Please enter a valid CVV');
                return false;
            }
        }

        return true;
    };

    // Listen for payment completion messages from the iframe
    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Verify the origin of the message (should be from your payment provider's domain)
            // Replace 'flutterwave.com' with the actual domain that will send the message
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
                paymentMethod,
                currency: paymentMethod === 'card' ? 'USD' : 'RWF', // Default currency based on payment method
                // Add a redirect URL that your backend will include in the payment flow
                // This should be a URL that Flutterwave will redirect to after payment
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
                
                // If there's a payment URL (for card payments or redirects), show it in iframe
                if (response.data.paymentUrl) {
                    console.log('Showing payment URL in iframe:', response.data.paymentUrl);
                    setPaymentUrl(response.data.paymentUrl);
                    setShowPaymentIframe(true);
                } else {
                    // Otherwise, consider it successful (e.g., for MTN Mobile Money that might not need redirection)
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
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
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

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    {!showPaymentIframe ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center">
                                    <QrCode className="mr-2 text-[#F77665]" />
                                    Donate to REPROCOLLECTIVE
                                </DialogTitle>
                                <DialogDescription>
                                    Support our mission through {location.name}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {/* Location Details */}
                                <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg">
                                    <Building2 className="text-[#F77665]" />
                                    <div>
                                        <h4 className="font-semibold">{location.name}</h4>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <MapPin className="mr-1 w-4 h-4" /> {location.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Error message display */}
                                {errorMessage && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                        <p className="text-red-700">{errorMessage}</p>
                                    </div>
                                )}

                                {/* Donor Information */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="donorName" className="text-right">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Name (Optional)
                                    </Label>
                                    <Input
                                        id="donorName"
                                        placeholder="Your full name"
                                        className="col-span-3"
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="donorPhone" className="text-right">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Phone
                                    </Label>
                                    <Input
                                        id="donorPhone"
                                        type="tel"
                                        placeholder="Your phone number"
                                        className="col-span-3"
                                        value={donorPhone}
                                        onChange={(e) => setDonorPhone(e.target.value)}
                                    />
                                </div>

                                {/* Payment Method Selection */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Payment</Label>
                                    <div className="col-span-3 flex flex-wrap gap-2">
                                        <Button
                                            variant={paymentMethod === 'mtn' ? 'default' : 'outline'}
                                            onClick={() => setPaymentMethod('mtn')}
                                            className={
                                                paymentMethod === 'mtn'
                                                    ? 'bg-[#F77665] hover:bg-[#F77665]'
                                                    : 'bg-white hover:bg-gray-100 border border-[#F77665]'
                                            }
                                        >
                                            MTN Mobile
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'card' ? 'default' : 'outline'}
                                            onClick={() => setPaymentMethod('card')}
                                            className={
                                                paymentMethod === 'card'
                                                    ? 'bg-[#F77665] hover:bg-[#F77665]'
                                                    : 'bg-white hover:bg-gray-100 border border-[#F77665]'
                                            }
                                        >
                                            Card
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'bank_transfer' ? 'default' : 'outline'}
                                            onClick={() => setPaymentMethod('bank_transfer')}
                                            className={
                                                paymentMethod === 'bank_transfer'
                                                    ? 'bg-[#F77665] hover:bg-[#F77665]'
                                                    : 'bg-white hover:bg-gray-100 border border-[#F77665]'
                                            }
                                        >
                                            Bank Transfer
                                        </Button>
                                    </div>
                                </div>

                                {/* Payment Method Specific Fields */}
                                {paymentMethod === 'card' && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="cardNumber" className="text-right">
                                                <CreditCard className="w-4 h-4 inline mr-1" />
                                                Card
                                            </Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                type="text"
                                                className="col-span-3"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="expiryDate" className="text-right">
                                                Expiry
                                            </Label>
                                            <Input
                                                id="expiryDate"
                                                placeholder="MM/YY"
                                                className="col-span-1"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                            />
                                            <Label htmlFor="cvv" className="text-right">
                                                CVV
                                            </Label>
                                            <Input
                                                id="cvv"
                                                type="password"
                                                placeholder="123"
                                                className="col-span-1"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Donation Amount */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right">
                                        Amount
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Enter contribution amount"
                                        className="col-span-3"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleDonate}
                                disabled={isProcessing}
                                className="w-full bg-[#F77665] hover:bg-[#F77665]"
                            >
                                {isProcessing ? 'Processing...' : 'Contribute Now'}
                            </Button>
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
                            
                            <div className="w-full h-96 relative">
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