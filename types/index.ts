export interface Restaurant {
  id: string;
  name: string;
  description: string;
  totalDonated: number;
  imageUrl: string;
  donationGoal: number;
  address: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  location: {
    latitude: number;
    longitude: number;
    city: string;
    neighborhood: string;
  };
  services: string[];
  topMenuItems: Array<{
    name: string;
    description: string;
    price: number;
  }>;
  socialImpact: {
    jobsSustained: number;
    localIngredients: boolean;
    communityPrograms: string[];
  };
}