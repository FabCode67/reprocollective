// 'use client';

// import React, { useState, useEffect } from 'react';
// import Navbar from '@/components/layouts/Navbar';
// import { getLocationsWithQRCodes } from '@/lib/data';
// import DonationModal from '@/components/DonationModel';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Loader2, Globe, Heart, Building, MapPin } from 'lucide-react';
// import DarkHeroImage from '@/components/DarkImage';
// import axios from 'axios';
// import Image from 'next/image';
// import { Skeleton } from '@/utility/skeleton';

// interface Location {
//   id: string;
//   name: string;
//   location: string;
//   accountNumber: string;
//   description: string;
//   qrCodeDataUrl?: string;
//   totalAmount?: number;
// }

// interface EnrichedLocation extends Location {
//   address: string;
// }

// interface Content {
//   section: string;
//   text: string;
//   updatedAt: string;
// }

// const HomePage: React.FC = () => {
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isContentLoading, setIsContentLoading] = useState(true);
//   const [, setContentSections] = useState<Content[]>([]);
//   const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({});
//   const [imagesLoaded, setImagesLoaded] = useState(false);

//   const fetchContent = async () => {
//     try {
//       setIsContentLoading(true);
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
//       const data = await response.json();
//       setContentSections(data.contents);

//       // Initialize editing state
//       const initialEditState: { [key: string]: string } = {};
//       data.contents.forEach((content: Content) => {
//         initialEditState[content.section] = content.text;
//       });
//       setEditingContent(initialEditState);
//     } catch (error) {
//       console.error('Error fetching content:', error);
//     } finally {
//       setIsContentLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContent();
//   }, []);

//   // Function to fetch location from API
//   const fetchLocation = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/locations`
//       );
//       const enrichedLocation: EnrichedLocation[] = response.data.map((loc: {
//         id: string;
//         name: string;
//         location: string;
//         accountNumber: string;
//         description: string;
//         qrCodeDataUrl?: string;
//       }) => ({
//         ...loc,
//         address: loc.location || 'Unknown Address',
//         accountNumber: loc.accountNumber || 'N/A',
//         description: loc.description || 'No description available',
//       }));
//       setLocations(enrichedLocation);
//     } catch (error) {
//       console.error('Error fetching location:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Load location on component mount
//   useEffect(() => {
//     fetchLocation();
//   }, []);

//   useEffect(() => {
//     async function loadLocation() {
//       try {
//         const loadedLocation = await getLocationsWithQRCodes();
//         setLocations(loadedLocation);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error loading location:', error);
//         setIsLoading(false);
//       }
//     }

//     loadLocation();
//   }, []);

//   // Simulate image loading delay for demo purposes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setImagesLoaded(true);
//     }, 1500);
    
//     return () => clearTimeout(timer);
//   }, []);

//   // Loading skeleton for location cards
//   const LocationCardSkeleton = () => (
//     <Card className="md:mb-4 mb-2 border-orange-100 px-0 overflow-hidden">
//       <CardHeader>
//         <Skeleton className="h-5 w-3/4 bg-gray-200 mb-2" />
//         <Skeleton className="h-4 w-1/2 bg-gray-200" />
//       </CardHeader>
//       <CardContent className="flex justify-between items-center">
//         <Skeleton className="h-8 w-24 bg-gray-200 rounded-md" />
//       </CardContent>
//     </Card>
//   );

//   // Loading skeleton for content
//   const ContentSkeleton = () => (
//     <div className="space-y-6 animate-pulse">
//       <div className="mb-8">
//         <Skeleton className="h-10 w-3/4 bg-gray-200 mb-4" />
//         <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
//         <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
//         <Skeleton className="h-4 w-2/3 bg-gray-200 mb-2" />
//       </div>
      
//       <div className="bg-orange-50 p-6 rounded-lg shadow-sm">
//         <Skeleton className="h-6 w-1/2 bg-gray-200 mb-4" />
//         <Skeleton className="h-[300px] w-full bg-gray-200 rounded-lg" />
//       </div>
      
//       <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
//         <div className="bg-[#F77665]/10 p-6 rounded-lg shadow-lg">
//           <Skeleton className="h-6 w-2/3 bg-gray-200 mb-4" />
//           <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
//           <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
//           <Skeleton className="h-4 w-3/4 bg-gray-200" />
//         </div>
//         <div className="bg-[#F77665]/10 p-6 rounded-lg shadow-lg">
//           <Skeleton className="h-6 w-2/3 bg-gray-200 mb-4" />
//           <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
//           <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
//           <Skeleton className="h-4 w-3/4 bg-gray-200" />
//         </div>
//       </div>
//     </div>
//   );

//   if (isLoading && isContentLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="animate-spin text-[#F77665]" size={48} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white text-gray-900">
//       <Navbar />
//       <DarkHeroImage />

//       <div id='about' className="container max-w-7xl p-4 mx-auto lg:mt-20 mt-0 flex lg:flex-row flex-col-reverse">
//         {/* Location Sidebar */}
//         <div id='locations' className="w-full lg:w-1/3 lg:mt-0 mt-6 lg:pr-6 block overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-4 text-[#F77665]">{"Contributor's station"}</h2>
          
//           {isLoading ? (
//             // Loading skeleton for locations
//             <>
//               <LocationCardSkeleton />
//               <LocationCardSkeleton />
//               <LocationCardSkeleton />
//             </>
//           ) : locations.length > 0 ? (
//             // Actual location data
//             locations.map((location) => (
//               <Card
//                 key={location.id}
//                 className="md:mb-4 mb-2 hover:shadow-lg transition-shadow cursor-pointer border-orange-100 px-0 hover:border-orange-300"
//                 onClick={() => setSelectedLocation(location)}
//               >
//                 <CardHeader>
//                   <CardTitle className="flex justify-between items-center">
//                     <span className="text-[#F77665] flex items-center">
//                       <Building className="mr-2 h-4 w-4" />
//                       {location.name}
//                     </span>
//                     {location.totalAmount && (
//                       <span className="text-[#F77665] text-xs font-semibold bg-orange-50 px-2 py-1 rounded-full">
//                         {location.totalAmount}RWF
//                       </span>
//                     )}
//                   </CardTitle>
//                   <CardDescription className="text-gray-600 flex items-center">
//                     <MapPin className="mr-1 h-3 w-3" />
//                     {location.location}
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
//                   <button className="bg-[#F77665] text-white md:w-fit w-fit px-4 py-2 text-sm rounded-md flex justify-end ml-auto self-end hover:bg-[#F77665]/90 transition-colors">
//                     Contribute
//                   </button>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <Card className="mb-4">
//               <CardContent className="p-4">
//                 <p className="text-center text-gray-500">No locations available</p>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="w-full lg:w-2/3 lg:pl-6 lg:border-l lg:mt-12 mt-2 block">
//           {isContentLoading ? (
//             // Loading skeleton for content
//             <ContentSkeleton />
//           ) : (
//             <div className="space-y-6">
//               <div className="mb-8">
//                 <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-[#F77665] flex items-center">
//                   <Heart className="mr-3 text-red-500" size={36} />
//                   REPROCOLLECTIVE
//                 </h1>
//                 <p dangerouslySetInnerHTML={{ __html: editingContent['home'] }} className="text-base lg:text-lg mb-6 text-gray-700 leading-relaxed">
//                 </p>
//               </div>

//               <div className="bg-orange-50 p-6 rounded-lg shadow-sm">
//                 {!imagesLoaded ? (
//                   // Loading skeleton for image
//                   <div className="relative w-full h-[400px] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
//                     <Loader2 className="animate-spin text-[#F77665]" size={36} />
//                   </div>
//                 ) : (
//                   <Image
//                     src="/chart.png"
//                     alt="Hero Image"
//                     width={700}
//                     height={400}
//                     className="mt-4 rounded-lg shadow-lg w-full h-auto"
//                   />
//                 )}
//               </div>
              
//               <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
//                 <div className="bg-gradient-to-r from-[#F77665] to-[#F77665] text-white p-6 rounded-lg shadow-lg">
//                   <h3 className="text-xl lg:text-2xl font-bold mb-4 flex items-center">
//                     <Globe className="mr-3" size={28} />
//                     Our Vision
//                   </h3>
//                   <p className="text-base lg:text-lg leading-relaxed">
//                     {editingContent['vision'] || "We envision a world where every contribution, no matter how small, creates ripples of positive transformation. By connecting contributors directly with community needs, we bridge compassion with practical solutions."}
//                   </p>
//                 </div>
//                 <div className="bg-gradient-to-r from-[#F77665] to-[#F77665] text-white p-6 rounded-lg shadow-lg">
//                   <h3 className="text-xl lg:text-2xl font-bold mb-4 flex items-center">
//                     <Globe className="mr-3" size={28} />
//                     Our Mission
//                   </h3>
//                   <p className="text-base lg:text-lg leading-relaxed">
//                     {editingContent['about'] || "Our mission is to empower communities through transparent and impactful contributions. By leveraging technology, we ensure that every contribution reaches its intended purpose, fostering trust and collaboration."}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Testimonials section */}
//       <section id='testimonials' className="lg:block hidden">
//         {/* <TestimonialsPage /> */}
//       </section>

//       {/* Donation Modal */}
//       {selectedLocation && (
//         <DonationModal
//           location={selectedLocation}
//           isOpen={!!selectedLocation}
//           onClose={() => setSelectedLocation(null)}
//           onError={(error) => console.error('Contribution Error:', error)}
//           onSuccess={() => console.log('Contribution Success')} 
//         />
//       )}
//     </div>
//   );
// };

// export default HomePage;



import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col min-h-screen m-auto items-center justify-center'>
      <h1 className='text-3xl font-bold text-[#F77665]'>Coming Soon...</h1>
      <p className='text-gray-500 mt-2'>We are dealing with database connection problems</p>
      <div className="loader"></div>
    </div>
  )
}

export default page