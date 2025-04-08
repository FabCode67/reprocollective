'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layouts/Navbar';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Quote, 
  Star, 
  UserCircle2, 
  Globe, 
  MapPin 
} from 'lucide-react';
import Image from 'next/image';

// Define a Testimonial type
interface Testimonial {
  id: number;
  name: string;
  location: string;
  role: string;
  quote: string;
  impact: string;
  image?: string;
  rating: number;
}

// Sample testimonial data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Emma Njeri",
    location: "Kigali, Rwanda",
    role: "Community Health Worker",
    quote: "Repro Collective has been a lifeline for our community. Their support has transformed how we approach reproductive health education and access.",
    impact: "Helped provide reproductive health resources to 500+ women in urban settlements",
    image: "/user2.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "David Mutua",
    location: "Mombasa, Rwanda",
    role: "Local Educator",
    quote: "The resources and support from Repro Collective have empowered our youth to make informed decisions about their health and future.",
    impact: "Conducted 25 youth-focused reproductive health workshops",
    image: "/user.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah Thompson",
    location: "International Supporter",
    role: "Global Health Advocate",
    quote: "I've seen firsthand how Repro Collective creates sustainable change. Their approach goes beyond temporary aid to create lasting impact.",
    impact: "Helped raise $50,000 in international support",
    image: "/user3.jpg",
    rating: 5
  }
];

const TestimonialsPage: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(testimonials[0]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`
          ${index < rating ? 'text-yellow-400' : 'text-gray-300'}
          w-5 h-5 inline-block mr-1
        `}
      />
    ));
  };

  return (
    <section id='testimonials' className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-600 mb-4">
            Voices of Impact
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from the community that showcase the transformative power of collective support and compassionate action.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial List */}
          <div className="md:col-span-1 space-y-4">
            {testimonials.map((testimonial) => (
              <Card 
                key={testimonial.id}
                className={`
                  cursor-pointer 
                  transition-all duration-300
                  ${activeTestimonial?.id === testimonial.id 
                    ? 'border-sky-500 shadow-lg' 
                    : 'border-gray-200 hover:border-sky-300'}
                `}
                onClick={() => setActiveTestimonial(testimonial)}
              >
                <CardHeader className="flex flex-row items-center space-x-4">
                  {testimonial.image ? (
                    <Image 
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="text-sky-500 w-12 h-12" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Active Testimonial Details */}
          {activeTestimonial && (
            <Card className="md:col-span-2 bg-sky-50 border-sky-100">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <Quote className="text-sky-500 w-12 h-12 mb-4" />
                  <div>{renderStars(activeTestimonial.rating)}</div>
                </div>

                <blockquote className="text-xl md:text-2xl text-gray-800 italic mb-6">
                  {activeTestimonial.quote}
                </blockquote>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="mr-2 text-sky-500" />
                    <span>{activeTestimonial.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="mr-2 text-sky-500" />
                    <span>Impact: {activeTestimonial.impact}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPage;