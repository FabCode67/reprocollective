'use client';

import React, { useState } from 'react';
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
import { Building2, MapPin, QrCode, CreditCard, Phone, User, Mail } from 'lucide-react';
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
    const [donorEmail, setDonorEmail] = useState<string>('');

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

    const validateForm = () => {
        // Validate donation amount
        const amount = parseFloat(donationAmount);
        if (isNaN(amount) || amount <= 0) {
            onError('Please enter a valid contribution amount');
            setErrorMessage('Please enter a valid contribution amount');
            return false;
        }

        // Validate donor information
        if (!donorName.trim()) {
            onError('Please enter your name');
            setErrorMessage('Please enter your name');
            return false;
        }

        if (!donorPhone || donorPhone.length < 10) {
            onError('Please enter a valid phone number');
            setErrorMessage('Please enter a valid phone number');
            return false;
        }

        // Email validation (optional but validate if provided)
        if (donorEmail && !donorEmail.includes('@')) {
            onError('Please enter a valid email address');
            setErrorMessage('Please enter a valid email address');
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
                donorName,
                donorPhone,
                donorEmail: donorEmail || undefined, // Only include if provided
                paymentMethod,
                currency: paymentMethod === 'card' ? 'USD' : 'RWF' // Default currency based on payment method
            };

            // Call the payment initiation API
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payments/initiate`, paymentData)

            // Handle successful payment initiation
            if (response.data.success) {
                // Clear form fields
                resetForm();
                setResultSuccess(true);
                setResultMessage('Thank you for your generous contribution to Repro Collective!');
                setTransactionId(response.data.transactionId || '');
                setFinalAmount(parseFloat(donationAmount));
                setShowResultModal(true);
                
                // Also call the original onSuccess callback
                onSuccess(parseFloat(donationAmount), response.data.transactionId);
                // If there's a payment URL (for card payments or redirects), redirect to it
                if (response.data.paymentUrl) {
                    console.log('Redirecting to payment URL:', response.data.paymentUrl);

                    // Redirect to the payment URL (for card payments or redirects)
                    window.open(response.data.paymentUrl, '_blank');
                    
                } else {
                    // Otherwise, consider it successful
                    setResultSuccess(true);
                    setResultMessage('Thank you for your generous contribution to Repro Collective!');
                    setTransactionId(response.data.transactionId || '');
                    setFinalAmount(parseFloat(donationAmount));
                    setShowResultModal(true);
                    
                    // Also call the original onSuccess callback
                    onSuccess(parseFloat(donationAmount), response.data.transactionId);
                }
            } else {
                // Show failure modal
                setResultSuccess(false);
                setResultMessage(response.data.message || 'Payment initiation failed');
                setShowResultModal(true);
                
                // Also call the original onError callback
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
            
            // Also call the original onError callback
            onError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetForm = () => {
        setDonationAmount('');
        setDonorName('');
        setDonorPhone('');
        setDonorEmail('');
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

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <QrCode className="mr-2 text-sky-500" />
                            Donate to Repro Collective
                        </DialogTitle>
                        <DialogDescription>
                            Support our mission through {location.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Location Details */}
                        <div className="flex items-center space-x-3 bg-sky-50 p-3 rounded-lg">
                            <Building2 className="text-sky-500" />
                            <div>
                                <h4 className="font-semibold">{location.name}</h4>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <MapPin className="mr-1 w-4 h-4" /> {location.location}
                                </p>
                            </div>
                        </div>

                        {/* Donor Information */}

                        {/* //error message show */}

                        {errorMessage && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <p className="text-red-700">{errorMessage}</p>
                            </div>
                        )}




                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="donorName" className="text-right">
                                <User className="w-4 h-4 inline mr-1" />
                                Name
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

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="donorEmail" className="text-right">
                                <Mail className="w-4 h-4 inline mr-1" />
                                Email
                            </Label>
                            <Input
                                id="donorEmail"
                                type="email"
                                placeholder="Your email (optional)"
                                className="col-span-3"
                                value={donorEmail}
                                onChange={(e) => setDonorEmail(e.target.value)}
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
                                            ? 'bg-sky-500 hover:bg-sky-600'
                                            : 'bg-white hover:bg-gray-100 border border-sky-600'
                                    }
                                >
                                    MTN Mobile
                                </Button>
                                <Button
                                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                                    onClick={() => setPaymentMethod('card')}
                                    className={
                                        paymentMethod === 'card'
                                            ? 'bg-sky-500 hover:bg-sky-600'
                                            : 'bg-white hover:bg-gray-100 border border-sky-600'
                                    }
                                >
                                    Card
                                </Button>
                                <Button
                                    variant={paymentMethod === 'bank_transfer' ? 'default' : 'outline'}
                                    onClick={() => setPaymentMethod('bank_transfer')}
                                    className={
                                        paymentMethod === 'bank_transfer'
                                            ? 'bg-sky-500 hover:bg-sky-600'
                                            : 'bg-white hover:bg-gray-100 border border-sky-600'
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
                        className="w-full bg-sky-500 hover:bg-sky-600"
                    >
                        {isProcessing ? 'Processing...' : 'Contribute Now'}
                    </Button>
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