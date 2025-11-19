"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mock property data - in real app, this would come from API
const mockProperty = {
  id: '1',
  title: 'My Family Home',
  price: '7500000',
  location: 'Edappally, Kochi',
  type: 'House',
  bedrooms: 3,
  bathrooms: 2,
  area: '2200',
  plotArea: '5',
  description: 'This beautiful family home is located in the heart of Edappally, one of Kochi\'s most sought-after residential areas. The property features spacious rooms, modern amenities, and is perfect for families looking for a comfortable living space.',
  features: [
    'Spacious living room',
    'Modern kitchen with appliances',
    'Master bedroom with attached bathroom',
    'Covered parking for 2 cars',
    'Beautiful garden',
    'Close to schools and hospitals',
    'Easy access to public transport',
    'Peaceful neighborhood'
  ],
  images: [
    'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image+1',
    'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image+2',
    'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image+3',
  ],
  yearBuilt: 2018,
  furnishing: 'Semi-furnished',
  facing: 'East',
  status: 'active'
};

const propertyTypes = ['House', 'Apartment', 'Villa', 'Plot', 'Commercial'];
const furnishingOptions = ['Unfurnished', 'Semi-furnished', 'Fully-furnished'];
const facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const statusOptions = ['active', 'pending', 'sold', 'draft'];

export default function EditProperty() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: mockProperty.title,
    price: mockProperty.price,
    location: mockProperty.location,
    type: mockProperty.type,
    bedrooms: mockProperty.bedrooms.toString(),
    bathrooms: mockProperty.bathrooms.toString(),
    area: mockProperty.area,
    plotArea: mockProperty.plotArea,
    description: mockProperty.description,
    yearBuilt: mockProperty.yearBuilt.toString(),
    furnishing: mockProperty.furnishing,
    facing: mockProperty.facing,
    status: mockProperty.status
  });

  const [features, setFeatures] = useState(mockProperty.features);
  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<string[]>(mockProperty.images || []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages;
    });
  };

  const setAsMainImage = (index: number) => {
    if (index === 0) return; // Already main image
    moveImage(index, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Updated property:', { ...formData, features, images });
    setLoading(false);
    
    // Redirect back to properties list
    router.push('/dashboard/seller/properties');
  };

  const handleDelete = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Deleted property:', params.id);
    setLoading(false);
    setShowDeleteModal(false);
    
    // Redirect back to properties list
    router.push('/dashboard/seller/properties');
  };

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
                Price (₹) *
              </label>
              <input
                type="number"
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
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter location"
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
                {propertyTypes.map(type => (
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
                Built Area (sq ft) *
              </label>
              <input
                type="number"
                name="area"
                required
                value={formData.area}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Built area in sq ft"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Plot Area (cents)
              </label>
              <input
                type="number"
                name="plotArea"
                step="0.1"
                value={formData.plotArea}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Plot area in cents"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.yearBuilt}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Year built"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Furnishing
              </label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {furnishingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Facing Direction
              </label>
              <select
                name="facing"
                value={formData.facing}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {facingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
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
          
          {/* Image Upload */}
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload-edit"
            />
            <label htmlFor="image-upload-edit" className="cursor-pointer">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-neutral-600 mb-2">Click to upload property images</p>
              <p className="text-sm text-neutral-500">Support: JPG, PNG, GIF (Max 5MB each)</p>
            </label>
          </div>

          {/* Current Images */}
          {images.length > 0 && (
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">
                Property Images ({images.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-neutral-200 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    
                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-1">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(index)}
                            className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-emerald-700 transition-colors"
                            title="Set as main image"
                          >
                            ⭐
                          </button>
                        )}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index - 1)}
                            className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-blue-700 transition-colors"
                            title="Move left"
                          >
                            ←
                          </button>
                        )}
                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index + 1)}
                            className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-blue-700 transition-colors"
                            title="Move right"
                          >
                            →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Main Image Badge */}
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Main Image
                      </div>
                    )}

                    {/* Image Number */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">💡 Image Management Tips:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• The first image is your main property image</li>
                  <li>• Hover over images to reorder, set as main, or remove</li>
                  <li>• Use high-quality images for better engagement</li>
                  <li>• Recommended: 5-10 images showing different angles</li>
                </ul>
              </div>
            </div>
          )}

          {images.length === 0 && (
            <div className="text-center py-8 bg-neutral-50 rounded-lg">
              <div className="text-4xl mb-2">🏠</div>
              <p className="text-neutral-600 mb-2">No images uploaded yet</p>
              <p className="text-sm text-neutral-500">Add some images to showcase your property</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Features & Amenities</h2>
          
          {/* Add Feature */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Add a feature or amenity"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg">
                <span className="text-neutral-700">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
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
