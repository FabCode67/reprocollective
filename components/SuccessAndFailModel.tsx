'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSuccess: boolean;
    message?: string;
    transactionId?: string;
    amount?: number;
    onRetry?: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
    isOpen,
    onClose,
    isSuccess,
    message,
    transactionId,
    amount,
    onRetry
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader className="flex flex-col items-center text-center">
                    {isSuccess ? (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
                            <DialogTitle className="text-xl font-bold text-green-700">
                                Contribution Successful!
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                {message || 'Thank you for your generous contribution to Reprocollecitve.'}
                            </DialogDescription>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-16 h-16 text-red-500 mb-2" />
                            <DialogTitle className="text-xl font-bold text-red-700">
                                Contribution Failed
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                {message || 'We encountered an error processing your contribution.'}
                            </DialogDescription>
                        </>
                    )}
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {isSuccess && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            {amount && (
                                <p className="text-center text-green-700 font-semibold mb-2">
                                    Amount: {amount.toLocaleString()} {amount >= 10 ? 'RWF' : 'USD'}
                                </p>
                            )}
                            {transactionId && (
                                <p className="text-center text-sm text-green-600">
                                    Transaction ID: {transactionId}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    {isSuccess ? (
                        <Button
                            onClick={onClose}
                            className="w-full bg-green-500 hover:bg-green-600"
                        >
                            Continue
                        </Button>
                    ) : (
                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="w-1/2 border-red-500 text-red-500 hover:bg-red-50"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={onRetry}
                                className="w-1/2 bg-red-500 hover:bg-red-600"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ResultModal;