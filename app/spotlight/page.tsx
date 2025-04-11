'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layouts/Navbar';

// Sample spotlight data - in a real app, this would come from an API or CMS
const spotlightItems = [
  {
    id: 1,
    title: "Community Champion: Dr. Sarah Martinez",
    category: "Profile",
    image: "/user.jpg",
    description: "Dr. Martinez has spent the last decade fighting for reproductive rights in underserved communities, establishing three clinics and mentoring dozens of young healthcare workers.",
    date: "April 3, 2025",
    featured: true,
  },
  {
    id: 2,
    title: "Mobile Health Initiative Reaches Milestone",
    category: "Program",
    image: "/user.jpg",
    description: "Our mobile health unit has provided services to over 10,000 people across rural areas since its launch six months ago.",
    date: "March 28, 2025",
    featured: false,
  },
  {
    id: 3,
    title: "New Research on Reproductive Health Disparities",
    category: "Research",
    image: "/user.jpg",
    description: "Recent study conducted by Reprocollecitve reveals significant disparities in access to reproductive healthcare across different communities.",
    date: "March 15, 2025",
    featured: false,
  },
  {
    id: 4, 
    title: "Youth Education Program Expands to 5 New Schools",
    category: "Education",
    image: "/user.jpg",
    description: "Our comprehensive sexual health education program will now reach an additional 3,000 students in the coming school year.",
    date: "April 5, 2025",
    featured: false,
  }
];

const SpotlightPage = () => {
  // Separate featured spotlight from regular items
  const featuredSpotlight = spotlightItems.find(item => item.featured);
  const regularSpotlights = spotlightItems.filter(item => !item.featured);

  return (
    <div className="min-h-screen bg-white text-gray-900">
    <Navbar />
    <div className="px-4 py-6 mx-auto mt-16 sm:mt-20 w-full max-w-7xl">

      {/* Hero section with page title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Spotlight</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Highlighting the people, programs, and progress making a difference in reproductive health access and education.
        </p>
      </div>

      {/* Featured spotlight */}
      {featuredSpotlight && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Spotlight</h2>
          <Card className="overflow-hidden">
            <div className="lg:flex">
              <div className="lg:w-1/2 h-64 lg:h-auto relative">
                <div className="w-full h-full relative bg-gray-200">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Image: {featuredSpotlight.title}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-6">
                <Badge className="mb-2">{featuredSpotlight.category}</Badge>
                <CardTitle className="text-2xl mb-2">{featuredSpotlight.title}</CardTitle>
                <CardDescription className="text-sm mb-4">{featuredSpotlight.date}</CardDescription>
                <p className="mb-6">{featuredSpotlight.description}</p>
                <Button>Read Full Story</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Regular spotlights */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">More Spotlights</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularSpotlights.map(spotlight => (
            <Card key={spotlight.id} className="flex flex-col h-full">
              <div className="h-48 relative bg-gray-200">
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Image: {spotlight.title}
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge>{spotlight.category}</Badge>
                  <span className="text-sm text-gray-500">{spotlight.date}</span>
                </div>
                <CardTitle className="mt-2">{spotlight.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{spotlight.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-16 bg-orange-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Know Someone Who Should Be Featured?</h2>
        <p className="mb-6 max-w-2xl mx-auto">We are always looking for inspiring individuals, innovative programs, and impactful initiatives to highlight. 
          If you know someone making a difference in reproductive health and rights, let us know.
        </p>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
          Submit a Spotlight Nomination
        </Button>
      </div>

      {/* Pagination for future use */}
      <div className="mt-12 flex justify-center">
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-orange-100">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SpotlightPage;