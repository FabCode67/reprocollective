// src/components/ui/DonationModal.tsx
'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantName: string;
}

export function DonationModal({ 
  open, 
  onOpenChange, 
  restaurantName 
}: DonationModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');

  const handleDonate = () => {
    // Implement donation logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Donate to {restaurantName}</DialogTitle>
          <DialogDescription>
            Choose your payment method and contribution amount
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Select onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile-money">Mobile Money</SelectItem>
              <SelectItem value="equity">Equity Bank</SelectItem>
            </SelectContent>
          </Select>

          <Input 
            type="number" 
            placeholder="Enter contribution amount" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
          />

          <Button 
            onClick={handleDonate} 
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Confirm Contribution
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}