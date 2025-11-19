"use client";

import { useState } from "react";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyData: any) => void;
}

const propertyTypes = ['House', 'Apartment', 'Villa', 'Plot', 'Commercial'];
const furnishingOptions = ['Unfurnished', 'Semi-furnished', 'Fully-furnished'];
const facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

export default function AddPropertyModal({ isOpen, onClose, onSubmit }: AddPropertyModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    type: 'House',
    bedrooms: '',
    bathrooms: '',
    area: '',
    plotArea: '',
    description: '',
    yearBuilt: '',
    furnishing: 'Unfurnished',
    facing: 'East',
    status: 'active'
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const propertyData = {
        ...formData,
        features,
        images,
        id: Date.now().toString(), // Generate temporary ID
        views: 0,
        inquiries: 0
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(propertyData);
      handleClose();
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      title: '',
      price: '',
      location: '',
      type: 'House',
      bedrooms: '',
      bathrooms: '',
      area: '',
      plotArea: '',
      description: '',
      yearBuilt: '',
      furnishing: 'Unfurnished',
      facing: 'East',
      status: 'active'
    });
    setFeatures([]);
    setImages([]);
    setNewFeature('');
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = formData.title && formData.price && formData.location && formData.area;
  const isStep2Valid = true; // Optional fields
  const isStep3Valid = images.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Add New Property</h2>
            <p className="text-sm text-neutral-600">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-neutral-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-600">Basic Info</span>
            <span className="text-xs text-neutral-600">Details</span>
            <span className="text-xs text-neutral-600">Images & Features</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-neutral-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe your property..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Additional Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Additional Details</h3>
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
            )}

            {/* Step 3: Images and Features */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Property Images *</h3>
                  
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-neutral-600 mb-2">Click to upload property images</p>
                      <p className="text-sm text-neutral-500">Support: JPG, PNG, GIF (Max 5MB each)</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-neutral-700 mb-2">
                        Uploaded Images ({images.length})
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-neutral-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Features & Amenities</h3>
                  
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
                  {features.length > 0 && (
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
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-200 bg-neutral-50">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStep3Valid}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Property'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
