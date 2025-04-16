// src/app/philanthropists/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Loader2, Heart, ArrowRight, ChevronRight, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layouts/Navbar';

// Types
interface Philanthropist {
    id: string;
    name: string;
    biography: string;
    contribution: string | null;
    contactInfo: string | null; // We'll keep this in the type but not display it
    image: string | null;
    isActive: boolean;
    order: number;
}

export default function PhilanthropistsPage() {
    const [philanthropists, setPhilanthropists] = useState<Philanthropist[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhilanthropist, setSelectedPhilanthropist] = useState<Philanthropist | null>(null);

    // Fetch active philanthropists
    useEffect(() => {
        const fetchPhilanthropists = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/philanthropists/active`);
                const data = await response.json();
                setPhilanthropists(data.philanthropists);

                // Set first philanthropist as selected by default
                if (data.philanthropists.length > 0) {
                    setSelectedPhilanthropist(data.philanthropists[0]);
                }
            } catch (error) {
                console.error('Error fetching philanthropists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhilanthropists();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-[#F77665]" />
            </div>
        );
    }

    if (philanthropists.length === 0) {
        return (
            <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
                <Navbar />
                <div className="max-w-7xl mx-auto mt-20">
                    <h1 className="text-4xl font-bold text-center mb-8">Local Philanthropists</h1>
                    <p className="text-lg text-center text-gray-700">No philanthropist profiles available at the moment. Please check back later.</p>
                    <div className="mt-8 text-center">
                        <Link href="/" className="inline-block px-6 py-3 bg-[#F77665] text-white font-medium rounded-md hover:bg-[#F77665]/90 transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Truncate biography for cards
    const truncateBio = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Get hero section background based on first philanthropist
    const heroBackground = selectedPhilanthropist?.image || '/hero-bg.jpg';

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative bg-cover bg-center h-96 md:h-[500px] mt-16 sm:mt-20" style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroBackground})` 
            }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#F77665]/80 to-black/70 mix-blend-multiply"></div>
                <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Local Philanthropists</h1>
                    <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
                    <p className="text-lg md:text-xl text-white max-w-2xl">
                        Meet the generous individuals who are making a difference in our community through their support and contributions.
                    </p>
                    {/* <div className="mt-8">
                        <Link 
                            href="/donate" 
                            className="inline-flex items-center px-6 py-3 rounded-full bg-white text-[#F77665] font-medium hover:bg-gray-100 transition-all transform hover:scale-105"
                        >
                            <Heart className="mr-2 h-5 w-5" />
                            Become a Supporter
                        </Link>
                    </div> */}
                </div>
            </section>

            {/* Philanthropist Cards Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {philanthropists.map((philanthropist) => (
                            <div 
                                key={philanthropist.id} 
                                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer border-b-4 ${
                                    selectedPhilanthropist?.id === philanthropist.id 
                                        ? 'border-[#F77665]' 
                                        : 'border-transparent hover:border-[#F77665]/50'
                                }`}
                                onClick={() => setSelectedPhilanthropist(philanthropist)}
                            >
                                <div className="h-56 bg-gray-200 relative">
                                    {philanthropist.image ? (
                                        <Image 
                                            src={philanthropist.image}
                                            alt={philanthropist.name}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <User className="h-20 w-20 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 flex items-center">
                                        {philanthropist.name}
                                        {selectedPhilanthropist?.id === philanthropist.id && (
                                            <span className="w-2 h-2 rounded-full bg-[#F77665] ml-2"></span>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {truncateBio(philanthropist.biography)}
                                    </p>
                                    <button 
                                        className={`flex items-center text-sm font-medium ${
                                            selectedPhilanthropist?.id === philanthropist.id 
                                                ? 'text-[#F77665]' 
                                                : 'text-gray-500 hover:text-[#F77665]'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPhilanthropist(philanthropist);
                                            document.getElementById('philanthropist-detail')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        Read more <ChevronRight className="ml-1 h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Selected Philanthropist Detail Section */}
            {selectedPhilanthropist && (
                <section id="philanthropist-detail" className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="container mx-auto max-w-5xl">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            <span className="inline-block border-b-4 border-[#F77665] pb-2">Philanthropist Profile</span>
                        </h2>
                        
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-2/5 relative h-64 md:h-auto bg-gray-100">
                                    {selectedPhilanthropist.image ? (
                                        <Image 
                                            src={selectedPhilanthropist.image}
                                            alt={selectedPhilanthropist.name}
                                            className="object-contain"
                                            fill
                                        />
                                    ) : (
                                        <div className="w-full h-full min-h-64 flex items-center justify-center">
                                            <User className="h-24 w-24 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="md:w-3/5 p-8">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                        {selectedPhilanthropist.name}
                                    </h3>
                                    <div className="w-16 h-1 bg-[#F77665] mb-6"></div>
                                    
                                    <div className="prose max-w-none">
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-[#F77665] mb-2">Biography</h4>
                                            <p className="text-gray-700">
                                                {selectedPhilanthropist.biography}
                                            </p>
                                        </div>
                                        
                                        {selectedPhilanthropist.contribution && (
                                            <div className="mb-6">
                                                <h4 className="text-lg font-semibold text-[#F77665] mb-2">Contributions</h4>
                                                <p className="text-gray-700">
                                                    {selectedPhilanthropist.contribution}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-8">
                                        <Link 
                                            href="/#location" 
                                            className="inline-flex items-center px-6 py-3 rounded-md bg-[#F77665] text-white font-medium hover:bg-[#F77665]/90 transition-all"
                                        >
                                            Join Our Mission <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Join Our Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
                <div className="container mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community of Supporters</h2>
                    <div className="w-24 h-1 bg-[#F77665] mx-auto mb-8"></div>
                    <p className="text-lg max-w-2xl mx-auto mb-12">
                        Interested in supporting our mission? Join our community of local philanthropists and make a difference today.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="w-16 h-16 bg-[#F77665]/20 text-[#F77665] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Donate</h3>
                            <p className="text-gray-300 mb-4">Support our mission with a one-time or recurring contribution.</p>
                            <Link href="/#location" className="text-[#F77665] hover:text-[#F77665]/80 font-medium inline-flex items-center">
                                Contribute now <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                        
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="w-16 h-16 bg-[#F77665]/20 text-[#F77665] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v7h-2zm0 8h2v2h-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Learn More</h3>
                            <p className="text-gray-300 mb-4">Discover how your support makes a difference in our community.</p>
                            <Link href="/#about" className="text-[#F77665] hover:text-[#F77665]/80 font-medium inline-flex items-center">
                                About our mission <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                        
                      
                    </div>
                    
                    <div className="mt-16">
                        <Link 
                            href="https://docs.google.com/forms/d/1iryfcNbqPIAM3zrhqYp6dpBML5tVzanURpdKJIAdHFs" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-8 py-4 rounded-full bg-[#F77665] text-white font-medium hover:bg-[#F77665]/90 transition-all transform hover:scale-105"
                        >
                            <Heart className="mr-2 h-5 w-5" fill="white" />
                            Become a Monthly Contributor
                            <span className="ml-2 bg-white text-[#F77665] text-xs px-2 py-0.5 rounded-full font-bold">
                                NEW
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}