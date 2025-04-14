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

export interface Report {
  id: string;
  title: string;
  date: string;
  moneyEarned: number;
  padsBought: number;
  padsDonated: number;
  description: string;
  adolescentsTrained: number;
  content: string;
  image?: string;
}