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
import { Loader2 } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: string;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorPhone: '',
    paymentMethod: 'card', // Default to card for easier testing
    currency: 'RWF',
    // locationCode: location || 'general',
  });

  // Payment iframe states
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset modal state when it opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setShowPaymentIframe(false);
      setPaymentUrl('');
      setPaymentProcessing(false);
    }
  }, [isOpen]);

  // Handle payment processor messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Received postMessage event:", event);
      
      // Handle Flutterwave response
      // Note: You may need to adjust this based on your payment processor's message format
      try {
        if (typeof event.data === 'string' && event.data.includes('flutterwave')) {
          const paymentData = JSON.parse(event.data);
          if (paymentData.status === 'successful') {
            handlePaymentSuccess();
          } else if (paymentData.status === 'failed' || paymentData.status === 'cancelled') {
            handlePaymentFailure(paymentData.message || 'Payment failed');
          }
        }
        
        // Handle redirects from iframe
        if (event.data && event.data.type === 'payment_status') {
          if (event.data.status === 'success') {
            handlePaymentSuccess();
          } else {
            handlePaymentFailure(event.data.message || 'Payment process failed');
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Also monitor iframe for load events to handle redirects
  useEffect(() => {
    const iframe = iframeRef.current;
    
    if (iframe && showPaymentIframe) {
      const handleIframeLoad = () => {
        try {
          // Check if the iframe loaded a success or failure page
          // This is a fallback mechanism if postMessage doesn't work
          const iframeUrl = iframe.contentWindow?.location.href;
          console.log('Iframe loaded URL:', iframeUrl);
          
          if (iframeUrl && iframeUrl.includes('payment_success')) {
            handlePaymentSuccess();
          } else if (iframeUrl && iframeUrl.includes('payment_failure')) {
            handlePaymentFailure('Payment process failed');
          }
        } catch (e) {
          // Cross-origin restrictions might prevent reading the URL
          console.log('Cannot access iframe URL due to cross-origin restrictions', e);
        }
      };
      
      iframe.addEventListener('load', handleIframeLoad);
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
      };
    }
  }, [iframeRef.current, showPaymentIframe]);

  const handlePaymentSuccess = () => {
    setPaymentProcessing(false);
    setShowPaymentIframe(false);
    toast(
      <div>
        <strong>Contribution Successful</strong>
        <p>Thank you for your generous contribution!</p>
      </div>
    );
    onClose();
  };

  const handlePaymentFailure = (message: string) => {
    setPaymentProcessing(false);
    setShowPaymentIframe(false);
    toast(
      <div className="text-destructive">
        <strong>Contribution Failed</strong>
        <p>{message}</p>
      </div>
    );
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Allow client-side redirects to be intercepted with an iframe
      const formDataWithOptions = {
        ...formData,
        amount: parseFloat(formData.amount), // Convert string to number
        returnResponseOnly: true, // Tell API to return URL instead of redirecting
        callbackUrl: `${window.location.origin}/payment-callback`,
      };
      
      console.log('Submitting payment data:', formDataWithOptions);
      
      // Use Fetch API with options to handle CORS
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formDataWithOptions),
        redirect: 'follow', // Important: Let Fetch handle redirects
      });
      
      console.log('Response status:', response.status);
      
      // Check if we got a redirect response
      if (response.redirected) {
        console.log('Got redirect to:', response.url);
        setPaymentUrl(response.url);
        setShowPaymentIframe(true);
        setPaymentProcessing(true);
        return;
      }
      
      // Handle JSON response
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (err) {
        // If response is not JSON, try to get the text
        const textResponse = await response.text();
        console.log('Raw response:', err);
        
        // Check if text contains a URL
        if (textResponse.includes('http')) {
          const urlMatch = textResponse.match(/(https?:\/\/[^\s"']+)/);
          if (urlMatch && urlMatch[0]) {
            setPaymentUrl(urlMatch[0]);
            setShowPaymentIframe(true);
            setPaymentProcessing(true);
            return;
          }
        }
        
        throw new Error('Unexpected response format');
      }
      
      // If we have a successful JSON response with a redirectUrl
      if (responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl) {
        const url = responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl;
        console.log('Setting payment URL from response:', url);
        setPaymentUrl(url);
        setShowPaymentIframe(true);
        setPaymentProcessing(true);
      } else if (responseData.success) {
        // For payment methods that don't require redirect
        handlePaymentSuccess();
      } else {
        // Handle API errors
        throw new Error(responseData.message || responseData.error || 'Payment initiation failed');
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
    setPaymentProcessing(false);
    setLoading(false);
    toast(
      <div>
        <strong>Payment Cancelled</strong>
        <p>You have cancelled the payment process.</p>
      </div>
    );
  };

  // Combined handler for closing modal
  const handleModalClose = () => {
    if (paymentProcessing) {
      // Show confirmation before closing during payment
      if (window.confirm('Are you sure you want to cancel the payment process?')) {
        setPaymentProcessing(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-white">
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
                      <SelectItem value="USD">USD</SelectItem>
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
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Contribute Now"
                  )}
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
            
            <div className="w-full h-[400px] md:h-[500px] relative border rounded">
              {paymentProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2">Processing payment...</p>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={paymentUrl}
                className="w-full h-full border-0"
                allow="payment"
                title="Payment Gateway"
                onLoad={() => setPaymentProcessing(false)}
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