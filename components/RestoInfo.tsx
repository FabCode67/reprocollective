import { Restaurant } from "@/types";
import { 
    StarIcon,
    Users,
    LeafIcon,
    Globe,
    Phone,
    MapPin,
    ArrowLeft
  } from 'lucide-react';
import { Button } from "./ui/button";
import { Progress } from '@/components/ui/progress';

const renderRestaurantDetails = (restaurant: Restaurant, setIsDonationModalOpen: (value: boolean) => void, setSelectedRestaurantId: (id: string | null) => void) => (
    <div className="bg-white relative p-6 rounded-lg shadow-md h-full overflow-y-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          {restaurant.name}
        </h1>
        <p className="text-black">{restaurant.description}</p>
      </div>

      {/* Image and Basic Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name} 
          className="w-full h-64 object-cover rounded-lg"
        />
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <MapPin className="text-red-600" />
            <div>
              <h3 className="font-bold text-black">Location</h3>
              <p className="text-black">{restaurant.address}</p>
              <p className="text-sm text-gray-600">
                {restaurant.location.neighborhood}, {restaurant.location.city}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="text-red-600" />
            <div>
              <h3 className="font-bold text-black">Contact</h3>
              <p className="text-black">{restaurant.contactInfo.phone}</p>
              <p className="text-black">{restaurant.contactInfo.email}</p>
            </div>
          </div>

          {restaurant.contactInfo.website && (
            <div className="flex items-center space-x-3">
              <Globe className="text-red-600" />
              <div>
                <h3 className="font-bold text-black">Website</h3>
                <a 
                  href={restaurant.contactInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  {restaurant.contactInfo.website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Donation Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-black">Donation Progress</span>
          <span className="text-sm text-black">
            ${restaurant.totalDonated} / ${restaurant.donationGoal}
          </span>
        </div>
        <Progress 
          value={(restaurant.totalDonated / restaurant.donationGoal) * 100} 
          className="h-2 "
        />
      </div>

      {/* Services and Social Impact */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-bold text-red-600 mb-4">
            <Users className="inline-block mr-2" /> Services
          </h2>
          <ul className="space-y-2 text-black">
            {restaurant.services.map((service) => (
              <li key={service} className="flex items-center">
                <StarIcon className="text-red-600 mr-2" size={16} />
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-600 mb-4">
            <LeafIcon className="inline-block mr-2" /> Social Impact
          </h2>
          <div className="space-y-2 text-black">
            <p>
              <strong>Jobs Sustained:</strong> {restaurant.socialImpact.jobsSustained}
            </p>
            <p>
              <strong>Local Ingredients:</strong> 
              {restaurant.socialImpact.localIngredients ? 'Yes' : 'No'}
            </p>
            <div>
              <strong>Community Programs:</strong>
              <ul className="list-disc list-inside">
                {restaurant.socialImpact.communityPrograms.map((program) => (
                  <li key={program}>{program}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Top Menu Items */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Top Menu Items
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {restaurant.topMenuItems.map((item) => (
            <div 
              key={item.name} 
              className="border border-red-100 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-black mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-600">${item.price}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-600 text-red-600"
                >
                  View Item
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donate Button */}
      <Button 
        onClick={() => setIsDonationModalOpen(true)}
        className=" bg-red-600 hover:bg-red-700
        fixed top-20  right-10 w-fit cursor-pointer
        "
      >
        Donate Now
      </Button>
      <Button 
        className=" bg-black hover:bg-gray-900
        fixed top-20  right-56 w-fit cursor-pointer
        "
        onClick={() => setSelectedRestaurantId(null)}
      >
          <ArrowLeft className="ml-2" size={20} /> Back
      </Button>
      <div className="flex w-full items-center space-x-4 bg-black/5 p-4 rounded-lg">
      <Button 
        className=" bg-black hover:bg-gray-900
         w-[50%] cursor-pointer
        "
        onClick={() => setSelectedRestaurantId(null)}
      >
         <ArrowLeft className="ml-2" size={20} /> Back

      </Button>
      <Button 
        onClick={() => setIsDonationModalOpen(true)}
        className="  bg-red-600 hover:bg-red-700
        w-[50%] cursor-pointer
        "
      >
        Donate Now
      </Button>
      
      </div>
    </div>
  );

  export default renderRestaurantDetails;