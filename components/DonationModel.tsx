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
import { Building2, MapPin, QrCode } from 'lucide-react';

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

    const handleDonate = async () => {
        // Validate donation amount
        const amount = parseFloat(donationAmount);
        if (isNaN(amount) || amount <= 0) {
            onError('Please enter a valid donation amount');
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate donation process (replace with actual API call)
            await simulateDonation(amount, paymentMethod, location);
            
            // Clear donation amount after successful donation
            setDonationAmount('');
            
            // Call onSuccess callback
            onSuccess();
            
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account" className="text-right">
                            Account
                        </Label>
                        <Input
                            id="account"
                            value={location.accountNumber}
                            readOnly
                            className="col-span-3 bg-gray-100"
                        />
                    </div>

                    {/* Donation Amount */}
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

                    {/* Payment Method */}
                    <div className="grid grid-cols-2  w-full items-center gap-4">
                        <Label className="text-right">Payment</Label>
                        <div className="col-span-3 justify-end ml-auto flex space-x-2">
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
                                Equity
                            </Button>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleDonate}
                    disabled={!donationAmount || isProcessing}
                    className="w-full bg-sky-500 hover:bg-sky-600"
                >
                    {isProcessing ? 'Processing...' : 'Donate Now'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default DonationModal;