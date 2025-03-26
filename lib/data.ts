import { Restaurant } from "@/types";

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Tasty Bites',
    description: 'A community-driven restaurant committed to sustainable local dining and social impact',
    totalDonated: 5000,
    imageUrl: 'https://www.safarisrwandasafari.com/wp-content/uploads/2023/08/poivre-noir-kigali.jpg',
    donationGoal: 10000,
    address: '123 Community Street, Kigali City Center',
    contactInfo: {
      phone: '+250 788 123 456',
      email: 'contact@tastybites.rw',
      website: 'www.tastybites.rw'
    },
    location: {
      latitude: -1.9403,
      longitude: 30.0609,
      city: 'Kigali',
      neighborhood: 'City Center'
    },
    services: [
      'Dine-in',
      'Takeaway',
      'Catering',
      'Community Meals Program'
    ],
    topMenuItems: [
      {
        name: 'Rwandan Fusion Platter',
        description: 'A curated selection of local dishes showcasing Rwandan culinary traditions',
        price: 12.99
      },
      {
        name: 'Farm-to-Table Vegetarian Bowl',
        description: 'Fresh locally sourced vegetables with organic grains',
        price: 10.50
      },
      {
        name: 'Traditional Brochettes',
        description: 'Grilled meat skewers with homemade sauce',
        price: 8.75
      }
    ],
    socialImpact: {
      jobsSustained: 25,
      localIngredients: true,
      communityPrograms: [
        'Youth Culinary Training',
        'Local Farmer Support',
        'Meal Donation Program'
      ]
    }
  },
  {
    id: '2',
    name: 'Green Plate',
    description: 'Sustainable dining experience focused on environmental and community wellness',
    totalDonated: 7500,
    imageUrl: 'https://www.safarisrwandasafari.com/wp-content/uploads/2023/08/poivre-noir-kigali.jpg',
    donationGoal: 15000,
    address: '456 Eco Avenue, Kigali Sustainable District',
    contactInfo: {
      phone: '+250 782 456 789',
      email: 'hello@greenplate.rw',
      website: 'www.greenplate.rw'
    },
    location: {
      latitude: -1.9362,
      longitude: 30.0675,
      city: 'Kigali',
      neighborhood: 'Sustainable District'
    },
    services: [
      'Eco-friendly Dining',
      'Organic Menu',
      'Zero-Waste Kitchen',
      'Community Workshops'
    ],
    topMenuItems: [
      {
        name: 'Sustainable Harvest Bowl',
        description: 'Organic quinoa, roasted local vegetables, and herb dressing',
        price: 13.50
      },
      {
        name: 'Plant-Based Burger',
        description: 'Locally sourced plant protein with homemade vegan sauce',
        price: 11.25
      },
      {
        name: 'Seasonal Vegetable Medley',
        description: 'Fresh, locally grown vegetables with artisan dressing',
        price: 9.75
      }
    ],
    socialImpact: {
      jobsSustained: 18,
      localIngredients: true,
      communityPrograms: [
        'Environmental Education',
        'Sustainable Agriculture Support',
        'Community Garden Initiative'
      ]
    }
  }
];