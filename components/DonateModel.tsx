import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: string;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, location }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorPhone: '',
    paymentMethod: '',
    currency: 'RWF',
    locationCode: location || '',
  });

  // Payment iframe states
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Listen for payment completion messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message (replace with your payment provider's domain)
      if (event.origin.includes('flutterwave.com')) {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          
          // Handle payment completion
          if (data.status === 'successful') {
            // Hide the payment iframe
            setShowPaymentIframe(false);
            
            // Show success toast
            toast(
              <div>
                <strong>Contribution Successful</strong>
                <p>Thank you for your generous contribution!</p>
              </div>
            );
            
            // Close the modal
            onClose();
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            // Hide the payment iframe
            setShowPaymentIframe(false);
            
            // Show failure toast
            toast(
              <div className="text-destructive">
                <strong>Contribution Failed</strong>
                <p>{data.message || "Payment process failed or was cancelled"}</p>
              </div>
            );
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
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Include redirectUrl in the payment data
      const paymentData = {
        ...formData,
        // This will be used for the payment gateway to know where to redirect or send messages
        redirectUrl: `${window.location.origin}/payment-callback`,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process donation');
      }

      // Handle successful payment initiation
      if (data.redirectUrl) {
        // Instead of redirecting to a new page, show in iframe
        setPaymentUrl(data.redirectUrl);
        setShowPaymentIframe(true);
      } else {
        // If no redirect needed (like for some mobile money options)
        toast(
          <div>
            <strong>Contribution Successful</strong>
            <p>Thank you for your generous contribution!</p>
          </div>
        );
        onClose();
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast(
        <div className="text-destructive">
          <strong>Contribution Failed</strong>
          <p>{error instanceof Error ? error.message : "Failed to process donation"}</p>
        </div>
      );
      setLoading(false);
    }
  };

  const handleClosePaymentIframe = () => {
    setShowPaymentIframe(false);
    setLoading(false);
    toast(
      <div>
        <strong>Payment Cancelled</strong>
        <p>You have cancelled the payment process.</p>
      </div>
    );
  };

  // Handle dialog close when payment iframe is showing
  const handleDialogClose = () => {
    if (showPaymentIframe) {
      handleClosePaymentIframe();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        {!showPaymentIframe ? (
          // Payment form content
          <>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Make a Contribution</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Your support helps us continue our important work. Thank you!
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-3 py-2 sm:py-4">
              <div className="grid gap-3 sm:gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-1 sm:gap-4">
                  <Label htmlFor="amount" className="text-sm sm:text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    className="col-span-1 sm:col-span-3 text-sm sm:text-base"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-1 sm:gap-4">
                  <Label htmlFor="currency" className="text-sm sm:text-right">
                    Currency
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger className="col-span-1 sm:col-span-3 text-sm sm:text-base h-9 sm:h-10">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RWF">RWF</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-1 sm:gap-4">
                  <Label htmlFor="donorName" className="text-sm sm:text-right">
                    Name (Optional)
                  </Label>
                  <Input
                    id="donorName"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    className="col-span-1 sm:col-span-3 text-sm sm:text-base"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-1 sm:gap-4">
                  <Label htmlFor="donorPhone" className="text-sm sm:text-right">
                    Phone
                  </Label>
                  <Input
                    id="donorPhone"
                    name="donorPhone"
                    value={formData.donorPhone}
                    onChange={handleChange}
                    className="col-span-1 sm:col-span-3 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-1 sm:gap-4">
                  <Label htmlFor="paymentMethod" className="text-sm sm:text-right">
                    Payment Method
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                  >
                    <SelectTrigger className="col-span-1 sm:col-span-3 text-sm sm:text-base h-9 sm:h-10">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-sm h-9 sm:h-10">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto text-sm h-9 sm:h-10">
                  {loading ? "Processing..." : "Contribute Now"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          // Payment iframe content
          <>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Complete Your Payment</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
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
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClosePaymentIframe}
                className="w-full sm:w-auto text-sm h-9 sm:h-10"
              >
                Cancel Payment
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;