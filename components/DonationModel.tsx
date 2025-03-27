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

interface DonationModalProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ 
  location, 
  isOpen, 
  onClose 
}) => {
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile-money' | 'equity'>('mobile-money');

  const handleDonate = () => {
    // Placeholder for donation logic
    console.log('Donating', donationAmount, 'to', location.name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Donate to Repro Collective</DialogTitle>
          <DialogDescription>
            Support {location.name} location
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Payment</Label>
            <div className="col-span-3 flex space-x-2">
              <Button
                variant={paymentMethod === 'mobile-money' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('mobile-money')}
                className="bg-sky-500 hover:bg-sky-600"
              >
                Mobile Money
              </Button>
              <Button
                variant={paymentMethod === 'equity' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('equity')}
                className="bg-sky-500 hover:bg-sky-600"
              >
                Equity
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleDonate}
          disabled={!donationAmount}
          className="w-full bg-sky-500 hover:bg-sky-600"
        >
          Donate Now
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;