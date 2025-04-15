// src/app/philanthropists/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layouts/Navbar';

// Types
interface Philanthropist {
    id: string;
    name: string;
    biography: string;
    contribution: string | null;
    contactInfo: string | null;
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
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (philanthropists.length === 0) {
        return (
            <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-black text-center mb-8">Local Philanthropists</h1>
                    <p className="text-lg text-center text-gray-700">No philanthropist profiles available at the moment. Please check back later.</p>
                    <div className="mt-8 text-center">
                        <Link href="/" className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />
            <div className="px-4 py-6 mx-auto mt-16 sm:mt-20 w-full max-w-7xl">

                {/* Header */}
                <header className="bg-[#F77665] text-white py-10">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold">Our Local Philanthropists</h1>
                        <p className="mt-4 text-black max-w-2xl mx-auto">
                            Meet the generous individuals who are making a difference in our community through their support and contributions.
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Sidebar - Philanthropist List */}
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold mb-6 text-black border-b border-orange-200 pb-2">
                                    Our Philanthropists
                                </h2>
                                <ul className="space-y-2">
                                    {philanthropists.map((philanthropist) => (
                                        <li key={philanthropist.id}>
                                            <button
                                                onClick={() => setSelectedPhilanthropist(philanthropist)}
                                                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${selectedPhilanthropist?.id === philanthropist.id
                                                        ? 'bg-orange-500 text-white'
                                                        : 'text-black hover:bg-orange-100'
                                                    }`}
                                            >
                                                {philanthropist.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Main Content - Selected Philanthropist Details */}
                        <div className="md:col-span-2">
                            {selectedPhilanthropist && (
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="md:flex">
                                        {/* Philanthropist Image */}
                                        <div className="md:w-1/3 bg-gray-100">
                                            {selectedPhilanthropist.image ? (
                                                <img
                                                    src={selectedPhilanthropist.image}
                                                    alt={selectedPhilanthropist.name}
                                                    className="w-full h-full object-cover object-center"
                                                    style={{ minHeight: "300px" }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200" style={{ minHeight: "300px" }}>
                                                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Philanthropist Information */}
                                        <div className="md:w-2/3 p-8">
                                            <h2 className="text-3xl font-bold text-black mb-2">{selectedPhilanthropist.name}</h2>
                                            <div className="w-16 h-1 bg-orange-500 mb-6"></div>

                                            <div className="prose max-w-none">
                                                <h3 className="text-xl font-semibold text-black mb-3">Biography</h3>
                                                <p className="text-gray-700 mb-6">{selectedPhilanthropist.biography}</p>

                                                {selectedPhilanthropist.contribution && (
                                                    <>
                                                        <h3 className="text-xl font-semibold text-black mb-3">Contributions</h3>
                                                        <p className="text-gray-700 mb-6">{selectedPhilanthropist.contribution}</p>
                                                    </>
                                                )}

                                                {selectedPhilanthropist.contactInfo && (
                                                    <>
                                                        <h3 className="text-xl font-semibold text-black mb-3">Contact Information</h3>
                                                        <p className="text-gray-700">{selectedPhilanthropist.contactInfo}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Featured Philanthropists Section */}
                <section className=" shadow bg-gray-600 text-white py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-2">Our Supporters</h2>
                        <div className="w-24 h-1 bg-orange-500 mx-auto mb-12"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {philanthropists.slice(0, 3).map((philanthropist) => (
                                <div key={philanthropist.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                                    <div className="h-64 bg-gray-800">
                                        {philanthropist.image ? (
                                            <img
                                                src={philanthropist.image}
                                                alt={philanthropist.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{philanthropist.name}</h3>
                                        <div className="w-12 h-1 bg-orange-500 mb-4"></div>
                                        <p className="text-gray-300 line-clamp-3 mb-4">{philanthropist.biography}</p>
                                        <button
                                            onClick={() => setSelectedPhilanthropist(philanthropist)}
                                            className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                                Interested in supporting our mission? Join our community of local philanthropists and make a difference today.
                            </p>

                            {/* call us on 078889999 or text us vie email of saye@gmail.cpm */}
                            {/* create a div that shows a contact information with a button to call or email us */}
                            <div className="flex items-center justify-center space-x-4">
                                <p className="text-lg text-gray-300">Contact us:</p>
                                <a href="tel:+250787304095" className="text-orange-500 hover:text-orange-400 font-medium">
                                    +250 787 304 095
                                </a>
                                <span className="text-gray-300">or</span>
                                <p className="text-lg text-gray-300">Email us:</p>
                                <a href='mailto:ayecompany@dukatazeonline.rw
' className="text-orange-500 hover:text-orange-400 font-medium">
                                    ayecompany@dukatazeonline.rw
                                </a>
                            </div>


                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}