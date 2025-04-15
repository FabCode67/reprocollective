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
import { toast } from 'sonner';
import { Loader2, AlertTriangle, Phone } from 'lucide-react';

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
    paymentMethod: 'mtn', // Only allow MTN Mobile Money
    currency: 'RWF', // Only allow RWF
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

  // Format phone number as the user types
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, donorPhone: value }));
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

  const validateForm = () => {
    // Validate amount
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast(<div className="text-destructive"><strong>Error</strong><p>Please enter a valid amount</p></div>);
      return false;
    }

    // Validate phone number (must be at least 10 digits)
    if (!formData.donorPhone || formData.donorPhone.length < 10) {
      toast(<div className="text-destructive"><strong>Error</strong><p>Please enter a valid MTN mobile number</p></div>);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] bg-white p-4 sm:p-6 rounded-lg">
        {!showPaymentIframe ? (
          // Payment form content
          <>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl flex items-center">
                <Phone className="mr-2 text-[#F77665] h-5 w-5" />
                Make a Contribution
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Your support helps us continue our important work. Thank you!
              </DialogDescription>
            </DialogHeader>
            
            {/* Payment Method Notice */}
            <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-3 mt-2">
              <AlertTriangle className="text-blue-500 shrink-0 h-5 w-5 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Payment Information</p>
                <p className="text-xs text-blue-600">
                  We currently accept MTN Mobile Money payments in Rwandan Francs (RWF) only.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <Label htmlFor="amount" className="text-sm flex items-center sm:justify-end">
                    Amount <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="sm:col-span-3 relative">
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="1"
                      value={formData.amount}
                      onChange={handleChange}
                      className="pr-12"
                      placeholder="Enter amount"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                      RWF
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <Label htmlFor="donorName" className="text-sm flex items-center sm:justify-end">
                    Name <span className="text-gray-500 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="donorName"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    className="sm:col-span-3"
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <Label htmlFor="donorPhone" className="text-sm flex items-center sm:justify-end">
                    Phone <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="sm:col-span-3">
                    <Input
                      id="donorPhone"
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={handlePhoneInput}
                      className="w-full"
                      placeholder="Your MTN mobile number"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the MTN number that will be used for payment
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full sm:w-auto bg-[#F77665] hover:bg-[#F77665]/90 order-1 sm:order-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Contribute via MTN Mobile Money"
                  )}
                </Button>
              </DialogFooter>
              
              <div className="text-center pt-2">
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
            </form>
          </>
        ) : (
          // Payment iframe content
          <>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Complete Your Payment</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Please complete the MTN Mobile Money payment below
              </DialogDescription>
            </DialogHeader>
            
            <div className="w-full h-[300px] sm:h-[400px] relative border rounded">
              {paymentProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#F77665]" />
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
                className="w-full sm:w-auto"
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