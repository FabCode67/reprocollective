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
import { Building2, MapPin, QrCode, CreditCard, Phone } from 'lucide-react';

interface DonationModalProps {
    location: Location;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (amount?: number) => void;
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
    const [paymentMethod, setPaymentMethod] = useState<'mobile-money' | 'equity'>('mobile-money');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    // Payment details states
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');

    const handleDonate = async () => {
        // Validate donation amount
        const amount = parseFloat(donationAmount);
        if (isNaN(amount) || amount <= 0) {
            onError('Please enter a valid donation amount');
            return;
        }

        // Validate payment details based on selected method
        if (paymentMethod === 'mobile-money') {
            if (!phoneNumber || phoneNumber.length < 10) {
                onError('Please enter a valid phone number');
                return;
            }
        } else if (paymentMethod === 'equity') {
            if (!cardNumber || cardNumber.length < 16) {
                onError('Please enter a valid card number');
                return;
            }
            if (!expiryDate || !expiryDate.includes('/')) {
                onError('Please enter a valid expiry date (MM/YY)');
                return;
            }
            if (!cvv || cvv.length < 3) {
                onError('Please enter a valid CVV');
                return;
            }
        }

        setIsProcessing(true);

        try {
            // Simulate donation process (replace with actual API call)
            await simulateDonation(amount, paymentMethod, location);
            
            // Clear form fields after successful donation
            setDonationAmount('');
            setPhoneNumber('');
            setCardNumber('');
            setExpiryDate('');
            setCvv('');
            
            // Call onSuccess callback
            onSuccess(amount);
            
            // Close the modal
            onClose();
        } catch (error) {
            // Handle and log any errors
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'An unexpected error occurred during donation';
            
            // Call onError callback with specific error message
            onError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    // Simulated donation function (replace with actual API call)
    const simulateDonation = async (
        amount: number, 
        method: 'mobile-money' | 'equity', 
        location: Location
    ): Promise<boolean> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Randomly simulate success/failure (remove in production)
        const simulatedSuccess = Math.random() > 0.2;
        
        if (!simulatedSuccess) {
            throw new Error(`Donation to ${location.name} failed. Please try again.`);
        }

        return true;
    };

    return (
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
                                <MapPin className="mr-1 w-4 h-4" /> {location.address}
                            </p>
                        </div>
                    </div>

                    {/* Account Number */}
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account" className="text-right">
                            Account
                        </Label>
                        <Input
                            id="account"
                            value={location.accountNumber}
                            readOnly
                            className="col-span-3 bg-gray-100"
                        />
                    </div> */}

                    {/* Donation Amount */}
                    

                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Payment</Label>
                        <div className="col-span-3 flex space-x-2">
                            <Button
                                variant={paymentMethod === 'mobile-money' ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod('mobile-money')}
                                className={
                                    paymentMethod === 'mobile-money'
                                        ? 'bg-sky-500 hover:bg-sky-600'
                                        : 'bg-white hover:bg-gray-100 border border-sky-600'
                                }
                            >
                                Mobile Money
                            </Button>
                            <Button
                                variant={paymentMethod === 'equity' ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod('equity')}
                                className={
                                    paymentMethod === 'equity'
                                        ? 'bg-sky-500 hover:bg-sky-600'
                                        : 'bg-white hover:bg-gray-100 border border-sky-600'
                                }
                            >
                                CARD
                            </Button>
                        </div>
                    </div>

                    {/* Payment Method Specific Fields */}
                    {paymentMethod === 'mobile-money' ? (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                                <Phone className="w-4 h-4 inline mr-1" />
                                Phone
                            </Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="Enter your phone number"
                                className="col-span-3"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    ) : (
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Enter donation amount"
                            className="col-span-3"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                        />
                    </div>
                </div>

                <Button
                    onClick={handleDonate}
                    disabled={ isProcessing}
                    className="w-full bg-sky-500 hover:bg-sky-600"
                >
                    {isProcessing ? 'Processing...' : 'Donate Now'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default DonationModal;