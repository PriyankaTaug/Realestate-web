"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import "@/api/clientConfig";
import { PropertiesService } from "@/api/client";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import { useToast } from "@/components/ui/toast";
import type { PropertyOut } from "@/api/client";

const propertyTypes = ['House', 'Apartment', 'Villa', 'Plot', 'Commercial'];
const listedTypes = ['Sale', 'Rent'];
const statusOptions = ['active', 'pending', 'sold', 'draft'];

export default function EditProperty() {
  const params = useParams();
  const router = useRouter();
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [property, setProperty] = useState<PropertyOut | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    project_name: '',
    type: '',
    listed_type: '',
    state: '',
    district: '',
    city: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    status: 'active',
    amenities: ''
  });

  const [images, setImages] = useState<string[]>([]);

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setFetching(true);
        const propertyId = Number(params.id);
        
        if (isNaN(propertyId)) {
          throw new Error('Invalid property ID');
        }

        // Set token if available
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('kh_token');
          if (token) {
            OpenAPI.TOKEN = token;
          }
        }

        const data = await PropertiesService.getPropertyApiPropertiesPropertyIdGet(propertyId);
        setProperty(data);

        // Helper function to construct full image URL
        const getImageUrl = (imagePath: string | undefined | null) => {
          if (!imagePath) return undefined;
          if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
          }
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
          const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
          return `${baseUrl}${cleanPath}`;
        };

        // Extract image URLs
        const imageUrls = data.images && data.images.length > 0
          ? data.images.map(img => getImageUrl(img.image_url)).filter(Boolean) as string[]
          : [];

        // Parse location to extract components
        const locationParts = data.location.split(',').map(p => p.trim());
        const neighborhood = locationParts[0] || data.neighborhood || '';
        const city = locationParts[1] || data.city || '';
        const district = locationParts[2] || data.district || '';
        const state = locationParts[3] || data.state || '';

        setFormData({
          title: data.title || '',
          price: data.price || '',
          location: data.location || '',
          project_name: data.project_name || '',
          type: data.type || '',
          listed_type: data.listed_type || '',
          state: state,
          district: district,
          city: city,
          neighborhood: neighborhood,
          bedrooms: data.bedrooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
          area: data.area || '',
          description: data.description || '',
          status: data.status || 'active',
          amenities: data.amenities || ''
        });

        setImages(imageUrls);
      } catch (error: any) {
        console.error('Failed to fetch property', error);
        show({
          title: "Failed to load property",
          description: error instanceof Error ? error.message : 'Could not load property details',
          type: "error",
        });
        router.push('/dashboard/seller/properties');
      } finally {
        setFetching(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id, router, show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const propertyId = Number(params.id);
      
      if (isNaN(propertyId)) {
        throw new Error('Invalid property ID');
      }

      // Set token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('kh_token');
        if (token) {
          OpenAPI.TOKEN = token;
        }
      }

      // Prepare update data
      const updateData: any = {
        title: formData.title || null,
        price: formData.price || null,
        location: formData.location || null,
        project_name: formData.project_name || null,
        type: formData.type || null,
        listed_type: formData.listed_type || null,
        state: formData.state || null,
        district: formData.district || null,
        city: formData.city || null,
        neighborhood: formData.neighborhood || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area: formData.area || null,
        description: formData.description || null,
        status: formData.status || null,
        amenities: formData.amenities || null,
      };

      // Remove null values to only send updated fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === null || updateData[key] === '') {
          delete updateData[key];
        }
      });

      await PropertiesService.updatePropertyApiPropertiesPropertyIdPut(
        propertyId,
        updateData
      );

      show({
        title: "Property updated successfully!",
        description: `${formData.title} has been updated.`,
        type: "success",
      });
    
    // Redirect back to properties list
    router.push('/dashboard/seller/properties');
    } catch (error: any) {
      console.error('Failed to update property', error);
      show({
        title: "Failed to update property",
        description: error instanceof Error ? error.message : 'Could not update property',
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const propertyId = Number(params.id);
      
      if (isNaN(propertyId)) {
        throw new Error('Invalid property ID');
      }

      // Set token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('kh_token');
        if (token) {
          OpenAPI.TOKEN = token;
        }
      }

      await PropertiesService.deletePropertyApiPropertiesPropertyIdDelete(propertyId);

      show({
        title: "Property deleted successfully!",
        description: "The property has been removed from your listings.",
        type: "success",
      });

    setShowDeleteModal(false);
    
    // Redirect back to properties list
    router.push('/dashboard/seller/properties');
    } catch (error: any) {
      console.error('Failed to delete property', error);
      show({
        title: "Failed to delete property",
        description: error instanceof Error ? error.message : 'Could not delete property',
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-neutral-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-neutral-600 mb-4">Property not found</p>
            <Link
              href="/dashboard/seller/properties"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium px-4 py-2 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors inline-block"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Edit Property</h1>
          <p className="text-neutral-600">Update your property information</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete Property
          </button>
          <Link
            href="/dashboard/seller/properties"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium px-4 py-2 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter property title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                name="project_name"
                required
                value={formData.project_name}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="text"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Property Type *
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Listed Type *
              </label>
              <select
                name="listed_type"
                required
                value={formData.listed_type}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select listed type</option>
                {listedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Full Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter full location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                District *
              </label>
              <input
                type="text"
                name="district"
                required
                value={formData.district}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter district"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Neighborhood
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter neighborhood"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                min="0"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Number of bedrooms"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                min="0"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Number of bathrooms"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Area (sq ft) *
              </label>
              <input
                type="text"
                name="area"
                required
                value={formData.area}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Area in sq ft"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-neutral-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Describe your property..."
          />
        </div>

        {/* Property Images */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Property Images</h2>
          
          {images.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">
                Property Images ({images.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property+Image';
                      }}
                    />
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Main Image
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  ℹ️ Note: Images cannot be updated through this form. To update images, please delete and recreate the property listing.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-neutral-50 rounded-lg">
              <div className="text-4xl mb-2">🏠</div>
              <p className="text-neutral-600 mb-2">No images available</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Property'}
          </button>
          <Link
            href="/dashboard/seller/properties"
            className="border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Property</h3>
              <p className="text-neutral-600 mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1 border border-neutral-300 text-neutral-700 py-2 px-4 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
