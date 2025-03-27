// src/types/donation.ts
export interface DonationLocation {
  id: string;
  name: string;
  address: string;
  accountNumber: string;
  qrCodeReference: string;
  description?: string;
  imageUrl?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface DonationDetails {
  amount: number;
  location: DonationLocation;
  paymentMethod: PaymentMethod;
}