"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/dashboard/PropertyCard";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";
import "@/api/clientConfig";
import { PropertiesService } from "@/api/client";
import { MdHome, MdCheckCircle, MdAccessTime, MdHandshake } from "react-icons/md";

// Initial local sample data (used only as fallback if API returns nothing)
const mockListings = [
  {
    id: '1',
    title: 'Modern Villa in Kochi',
    price: '₹85,00,000',
    location: 'Kakkanad, Kochi',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '2,400 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Villa',
    status: 'active' as const,
    views: 245,
    inquiries: 12,
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    title: 'Luxury Apartment',
    price: '₹45,00,000',
    location: 'Marine Drive, Kochi',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: '1,800 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Apartment',
    status: 'pending' as const,
    views: 189,
    inquiries: 8,
    dateAdded: '2024-01-10'
  },
  {
    id: '3',
    title: 'Traditional House',
    price: '₹65,00,000',
    location: 'Fort Kochi',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: '2,000 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=House',
    status: 'sold' as const,
    views: 156,
    inquiries: 15,
    dateAdded: '2024-01-05'
  }
];

export default function MyListings() {
  const [listings, setListings] = useState<any[]>(mockListings);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    PropertiesService.listPropertiesApiPropertiesGet(0, 50)
        .then((data) => {
          if (data && data.length > 0) {
            const mapped = data.map((p) => ({
              id: String(p.id),
              title: p.title,
              price: p.price,
              location: p.location,
              type: p.type,
              bedrooms: p.bedrooms || undefined,
              bathrooms: p.bathrooms || undefined,
              area: p.area,
              image: p.main_image || undefined,
              images: p.images,
              status: p.status as any,
              views: p.views,
              inquiries: p.inquiries,
            }));
            setListings(mapped as any);
          }
        })
        .catch((err) => {
          // Silently fail - using mock data as fallback
          if (process.env.NODE_ENV === 'development') {
            console.error("Failed to load properties", err);
          }
          // Don't throw - component will use mockListings from useState initial value
        });
  }, []);
const handleAddProperty = async (formData: FormData) => {
  try {
    const response = await fetch('http://localhost:8000/api/properties', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create property');
    }

    const result = await response.json();
    // Handle successful response
    console.log('Property created:', result);
    // Refresh properties list or update UI
  } catch (error) {
    console.error('Error creating property:', error);
    throw error; // This will be caught by the modal's error handling
  }
};
  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Property
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MdHome className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {listings.filter(l => l.status === 'active').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {listings.filter(l => l.status === 'pending').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <MdAccessTime className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sold</p>
              <p className="text-2xl font-bold text-blue-600">
                {listings.filter(l => l.status === 'sold').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MdHandshake className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All Properties', count: listings.length },
            { key: 'active', label: 'Active', count: listings.filter(l => l.status === 'active').length },
            { key: 'pending', label: 'Pending', count: listings.filter(l => l.status === 'pending').length },
            { key: 'sold', label: 'Sold', count: listings.filter(l => l.status === 'sold').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard
                property={property}
                userRole="agent"
              />
              {/* Additional actions for listings */}
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="bg-white/90 backdrop-blur-sm p-1.5 rounded-md shadow-sm hover:bg-white transition-colors">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button className="bg-white/90 backdrop-blur-sm p-1.5 rounded-md shadow-sm hover:bg-white transition-colors">
                  <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? "You haven't added any properties yet. Start by adding your first property."
              : `No ${filter} properties found.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Add Your First Property
            </button>
          )}
        </div>
      )}

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddProperty}
      />
    </div>
  );
}
