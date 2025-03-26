'use client';

import Image from 'next/image';
import { 
  HeartHandshake, 
  Users, 
  Globe, 
  Award,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layouts/Navbar';

export default function AboutPage() {
  const impactStats = [
    {
      icon: Users,
      title: "Community Driven",
      description: "Connecting local food lovers with restaurants that need support"
    },
    {
      icon: Globe,
      title: "Local Impact",
      description: "Strengthening neighborhood economies through sustainable giving"
    },
    {
      icon: Award,
      title: "Transparent Giving",
      description: "100% of donations directly support selected restaurants"
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Rodriguez",
      role: "Founder & CEO",
      description: "Passionate about community resilience and local business support"
    },
    {
      name: "Michael Chen",
      role: "Community Director",
      description: "Expert in nonprofit strategy and restaurant ecosystem development"
    },
    {
      name: "Elena Thompson",
      role: "Tech & Innovation Lead",
      description: "Driving technological solutions for social impact"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main id='about' className="container mx-auto px-4 py-16 mt-16">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-red-600">
              About Repro Collective
            </h1>
            <p className="text-xl text-black/80 leading-relaxed">
              {"We're more than a donation platform. We're a community-driven movement dedicated to supporting local restaurants through innovative, transparent, and impactful giving."}
            </p>
            <div className="flex space-x-4">
              <Button className="bg-red-600 hover:bg-red-700">
                Our Mission <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600">
                Join Our Community
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-red-50 rounded-2xl p-6">
              <Image 
                src="https://www.wildapricot.com/wp-content/uploads/2022/10/how-to-get-donations-18-ways.png" 
                alt="Repro Collective Community" 
                width={600} 
                height={400} 
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* Impact Overview */}
        <section className="bg-black/5 py-16 rounded-2xl mb-20">
          <div className="container mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              Our Collective Impact
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              {"Through collaborative efforts and transparent giving, we're creating a sustainable ecosystem that supports local restaurants and strengthens community bonds."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <stat.icon className="text-red-600 mb-4" size={48} />
                  <CardTitle className="text-black">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black/70">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Passionate individuals dedicated to creating meaningful change in local restaurant ecosystems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-red-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
                  <Image 
                    src="/api/placeholder/200/200" 
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {member.name}
                </h3>
                <p className="text-red-600 mb-4">{member.role}</p>
                <p className="text-black/70">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-red-600 text-white rounded-2xl py-16 text-center">
          <div className="container mx-auto">
            <HeartHandshake size={72} className="mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-bold mb-4">
              Join Our Mission Today
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Every donation creates a ripple effect of support for local restaurants. 
              Together, we can build stronger, more resilient communities.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
                Start Donating
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-8 text-center">
        <p>© 2024 Repro Collective. All Rights Reserved.</p>
      </footer>
    </div>
  );
}