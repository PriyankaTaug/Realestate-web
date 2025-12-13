"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/dashboard/PropertyCard";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";
import "@/api/clientConfig";
import { PropertiesService } from "@/api/client";
import { AuthService } from "@/api/client";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import { useToast } from "@/components/ui/toast";
import type { UserOut } from "@/api/client/models/UserOut";
import { 
  MdHome, 
  MdCheckCircle, 
  MdVisibility, 
  MdAttachMoney,
  MdAdd,
  MdMessage,
  MdBarChart
} from "react-icons/md";
import { FaHome } from "react-icons/fa";

// Initial local sample data (used only as fallback if API returns nothing)
const mockProperties = [
  {
    id: '1',
    title: 'My Family Home',
    price: '₹75,00,000',
    location: 'Edappally, Kochi',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: '2,200 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=House',
    status: 'active' as const,
    views: 167,
    inquiries: 9
  },
  {
    id: '2',
    title: 'Investment Apartment',
    price: '₹35,00,000',
    location: 'Kaloor, Kochi',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: '1,200 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Apartment',
    status: 'pending' as const,
    views: 134,
    inquiries: 6
  },
  {
    id: '3',
    title: 'Modern Villa',
    price: '₹1,20,00,000',
    location: 'Kakkanad, Kochi',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '3,500 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Villa',
    status: 'draft' as const,
    views: 45,
    inquiries: 2
  },
  {
    id: '4',
    title: 'Luxury Penthouse',
    price: '₹2,50,00,000',
    location: 'Marine Drive, Kochi',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: '2,800 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Penthouse',
    status: 'sold' as const,
    views: 289,
    inquiries: 23
  }
];

export default function SellerProperties() {
  const { show } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low' | 'views'>('newest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserOut | null>(null);

  // Fetch user info first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('kh_token');
          if (token) {
            OpenAPI.TOKEN = token;
            const userData = await AuthService.readMeApiAuthMeGet();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch properties for the logged-in seller
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return; // Wait for user to be loaded
      
      setLoading(true);
      try {
        // Set token
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('kh_token');
          if (token) {
            OpenAPI.TOKEN = token;
          }
        }

        // Fetch all properties (we'll filter by owner_id on frontend)
        const response = await PropertiesService.listPropertiesApiPropertiesGet(
          0, 
          100, // Get more properties to ensure we get all seller's properties
          undefined, // bedrooms
          undefined, // bathrooms
          undefined, // city
          undefined, // district
          undefined, // state
          undefined, // neighborhood
          undefined, // type
          undefined, // listed_type
          undefined, // status (get all statuses for seller)
        );
        
        const data = response.items || [];
        
        // Filter properties by owner_id on frontend
        const sellerProperties = data.filter((p: any) => p.owner_id === user.id);
        
        if (sellerProperties.length > 0) {
          // Helper function to construct full image URL
          const getImageUrl = (imagePath: string | undefined | null) => {
            if (!imagePath) return undefined;
            // If it's already a full URL, return as is
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
              return imagePath;
            }
            // Otherwise, prepend the backend base URL
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
            // Remove leading slash if present and add it properly
            const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
            return `${baseUrl}${cleanPath}`;
          };
          
          const mapped = sellerProperties.map((p: any) => {
            // Extract all image URLs from property_images table
            const imageUrls = p.images && p.images.length > 0
              ? p.images.map((img: any) => getImageUrl(img.image_url)).filter(Boolean) as string[]
              : [];
            
            // Use first image as the main image, or undefined if no images
            const mainImage = imageUrls.length > 0 ? imageUrls[0] : undefined;
            
            return {
              id: String(p.id),
              title: p.title,
              price: p.price,
              location: p.location,
              type: p.type,
              bedrooms: p.bedrooms || undefined,
              bathrooms: p.bathrooms || undefined,
              area: p.area,
              image: mainImage,
              images: imageUrls, // Array of image URLs for carousel
              status: p.status as any,
              views: p.views,
              inquiries: p.inquiries,
              created_at: p.created_at,
            };
          });
          setProperties(mapped as any);
        } else {
          // No properties found for this seller
          setProperties([]);
        }
      } catch (err) {
        // Silently fail - using empty array as fallback
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to load properties", err);
        }
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  const filteredProperties = properties.filter(property => 
    filter === 'all' || property.status === filter
  );

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return parseInt(b.price.replace(/[₹,]/g, '')) - parseInt(a.price.replace(/[₹,]/g, ''));
      case 'price-low':
        return parseInt(a.price.replace(/[₹,]/g, '')) - parseInt(b.price.replace(/[₹,]/g, ''));
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'oldest':
        return parseInt(a.id) - parseInt(b.id);
      default: // newest
        return parseInt(b.id) - parseInt(a.id);
    }
  });

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await PropertiesService.deletePropertyApiPropertiesPropertyIdDelete(Number(propertyId));
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      console.log('Property deleted:', propertyId);
      show({
        title: "Property deleted",
        description: "The property has been successfully deleted.",
        type: "success",
      });
    } catch (error) {
      console.error('Failed to delete property', error);
      show({
        title: "Failed to delete property",
        description: "An error occurred while deleting the property. Please try again.",
        type: "error",
      });
    }
  };

  const handleStatusUpdate = async (propertyId: string, newStatus: 'active' | 'pending' | 'sold' | 'draft') => {
    try {
      // Set token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('kh_token');
        if (token) {
          OpenAPI.TOKEN = token;
        }
      }

      // Update property status via API
      await PropertiesService.updatePropertyApiPropertiesPropertyIdPut(
        Number(propertyId),
        { status: newStatus }
      );

      // Update local state
      setProperties(prev => 
        prev.map(p => 
          p.id === propertyId 
            ? { ...p, status: newStatus }
            : p
        )
      );

      const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      show({
        title: "Status updated",
        description: `Property status has been updated to "${statusLabel}".`,
        type: "success",
      });
    } catch (error: any) {
      console.error('Failed to update property status', error);
      show({
        title: "Failed to update status",
        description: error?.message || "An error occurred while updating the property status. Please try again.",
        type: "error",
      });
      throw error; // Re-throw so PropertyCard can handle it
    }
  };

  const handleAddProperty = async (formData: FormData) => {
    try {
      // Extract and validate required fields
      const title = formData.get('title') as string;
      const price = formData.get('price') as string;
      const projectName = formData.get('project_name') as string;
      const state = formData.get('state') as string;
      const district = formData.get('district') as string;
      const city = formData.get('city') as string;
      const neighborhood = formData.get('neighborhood') as string || city; // Default to city if empty
      const type = formData.get('type') as string;
      const listedType = formData.get('listed_type') as string;
      const area = formData.get('area') as string || '0'; // Default to '0' if empty (backend requires it)
      const bedrooms = formData.get('bedrooms') as string;
      const bathrooms = formData.get('bathrooms') as string;
      const description = formData.get('description') as string || '';
      const amenities = formData.get('amenities') as string || '';
      const status = formData.get('status') as string || 'active';

      // Construct location string
      const locationParts = [neighborhood, city, district, state].filter(Boolean);
      const location = locationParts.join(', ');

      // Validate required fields
      if (!title || !price || !projectName || !state || !district || !city || !type || !listedType || !area) {
        throw new Error('Missing required fields. Please fill in all required fields.');
      }

      // Validate price is a valid number
      const priceNum = parseFloat(price.replace(/[₹,]/g, ''));
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error('Price must be a valid positive number.');
      }

      // Get images from FormData
      const images = formData.getAll('images') as File[];
      if (!images || images.length === 0) {
        throw new Error('At least one image is required.');
      }

      // Update token in OpenAPI config if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('kh_token');
        if (token) {
          OpenAPI.TOKEN = token;
        }
      }

      // Log the form data being sent (without files)
      console.log('Sending form data:', {
        title,
        price,
        project_name: projectName,
        location,
        type,
        listed_type: listedType,
        state,
        district,
        city,
        neighborhood,
        area,
        bedrooms,
        bathrooms,
        description,
        amenities,
        status,
        imagesCount: images.length
      });

      // Log the API base URL for debugging
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      console.log('API Base URL:', OpenAPI.BASE);
      console.log('Attempting to create property at:', `${OpenAPI.BASE}/api/properties/`);
      console.log('Number of images:', images.length);
      
      // Verify backend is accessible before making the request
      try {
        const healthCheck = await fetch(`${BASE_URL}/api/health`);
        if (!healthCheck.ok) {
          throw new Error(`Backend health check failed: ${healthCheck.status} ${healthCheck.statusText}`);
        }
        console.log('Backend health check passed');
      } catch (healthError) {
        console.error('Backend health check error:', healthError);
        throw new Error(`Cannot connect to backend server at ${BASE_URL}. Please ensure the backend is running on port 8000.`);
      }

      // Use the generated API client method
      console.log('Calling API to create property...');
      console.log('Images being sent:', images.map(img => ({ name: img.name, size: img.size, type: img.type })));
      
      const created = await PropertiesService.createPropertyApiPropertiesPost({
        title,
        price: priceNum,
        project_name: projectName,
        location,
        type,
        listed_type: listedType,
        state,
        district,
        city,
        neighborhood,
        area,
        status,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        description: description || null,
        amenities: amenities || null,
        images: images, // Array of File/Blob objects
      });
      
      console.log('API response received:', created);
      
      // Verify the response has required fields
      if (!created || !created.id) {
        throw new Error('Invalid response from server: Property ID is missing');
      }
      
      // Helper function to construct full image URL
      const getImageUrl = (imagePath: string | undefined | null) => {
        if (!imagePath) return undefined;
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath;
        }
        // Otherwise, prepend the backend base URL
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        // Remove leading slash if present and add it properly
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${baseUrl}${cleanPath}`;
      };
      
      // Extract all image URLs from property_images table
      const imageUrls = created.images && created.images.length > 0
        ? created.images.map(img => getImageUrl(img.image_url)).filter(Boolean) as string[]
        : [];
      
      // Use first image as the main image, or fallback to uploaded image preview
      const mainImage = imageUrls.length > 0 
        ? imageUrls[0] 
        : (images[0] ? URL.createObjectURL(images[0]) : undefined);
      
      // Update the UI with the new property
      const mapped = {
        id: String(created.id || Date.now()),
        title: created.title,
        price: created.price || price,
        location: created.location || location,
        type: created.type || type,
        bedrooms: created.bedrooms || (bedrooms ? parseInt(bedrooms) : undefined),
        bathrooms: created.bathrooms || (bathrooms ? parseInt(bathrooms) : undefined),
        area: created.area || area || undefined,
        image: mainImage,
        images: imageUrls, // Array of image URLs for carousel
        status: created.status || status,
        views: created.views || 0,
        inquiries: created.inquiries || 0,
        created_at: created.created_at,
      };
      
      console.log('Mapped property data:', mapped);
      setProperties(prev => [...prev, mapped as any]);
      setShowAddModal(false);
      console.log('New property added to state. Total properties:', properties.length + 1);
      show({
        title: "Property created successfully!",
        description: `${title} has been added to your listings.`,
        type: "success",
      });
    } catch (error: any) {
      console.error('Failed to add property', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      let errorMessage = 'Failed to add property. ';
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      if (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message.includes('Network Error'))) {
        errorMessage += `Network error: Could not connect to backend at ${BASE_URL}. `;
        errorMessage += 'Please ensure the backend server is running on port 8000.';
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please check the console for details.';
      }
      
      show({
        title: "Failed to create property",
        description: errorMessage,
        type: "error",
      });
    }
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return properties.length;
    return properties.filter(p => p.status === status).length;
  };

  const totalValue = properties
    .filter(p => p.status !== 'sold')
    .reduce((sum, p) => sum + parseInt(p.price.replace(/[₹,]/g, '')), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Properties</h1>
          <p className="text-neutral-600">Manage and track your property listings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Add New Property
          </button>
          <Link
            href="/dashboard/seller"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium px-4 py-2 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MdHome className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Properties</p>
              <p className="text-xl font-bold text-neutral-900">{properties.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Active Listings</p>
              <p className="text-xl font-bold text-neutral-900">{getStatusCount('active')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MdVisibility className="text-purple-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Views</p>
              <p className="text-xl font-bold text-neutral-900">
                {properties.reduce((sum, p) => sum + (p.views || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MdAttachMoney className="text-emerald-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Portfolio Value</p>
              <p className="text-xl font-bold text-neutral-900">
                ₹{(totalValue / 10000000).toFixed(1)}Cr
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All ({getStatusCount('all')})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Active ({getStatusCount('active')})
            </button>
            <button
              onClick={() => setFilter('sold')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'sold'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Sold ({getStatusCount('sold')})
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="views">Most Views</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {sortedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              userRole="seller"
              onDelete={handleDeleteProperty}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <FaHome className="text-6xl text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No {filter !== 'all' ? filter : ''} properties found
          </h3>
          <p className="text-neutral-600 mb-6">
            {filter === 'all' 
              ? "You haven't added any properties yet." 
              : `No ${filter} properties at the moment.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Add Your First Property
            </button>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {sortedProperties.length > 0 && (
        <div className="bg-neutral-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow w-full text-left"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <MdAdd className="text-emerald-600 text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Add New Property</h4>
                <p className="text-sm text-neutral-600">List a new property for sale</p>
              </div>
            </button>
            <Link
              href="/dashboard/seller/inquiries"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdMessage className="text-blue-600 text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">View Inquiries</h4>
                <p className="text-sm text-neutral-600">Manage buyer inquiries</p>
              </div>
            </Link>
            <Link
              href="/dashboard/seller"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MdBarChart className="text-purple-600 text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">View Dashboard</h4>
                <p className="text-sm text-neutral-600">See overview and stats</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProperty}
      />
    </div>
  );
}
