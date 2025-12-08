import React, { useState, useRef, ChangeEvent } from 'react';
import { FiX, FiInfo, FiMapPin, FiHome, FiImage } from 'react-icons/fi';

interface FormDataState {
  project_name: string;
  title: string;
  price: string;
  type: string;
  listed_type: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  state: string;
  district: string;
  city: string;
  neighborhood: string;
  description: string;
  amenities: string;
  status: string;
}

interface AddPropertyModalProps {
  onClose: () => void;
  onSubmit?: (formData: FormData) => Promise<void>;
  isOpen?: boolean;
}

interface TabProps {
  active: boolean;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const Tab = ({ active, onClick, Icon, children }: TabProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
      active
        ? 'border-emerald-500 text-emerald-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <Icon className="w-4 h-4 mr-2" />
    {children}
  </button>
);

const AddPropertyModal = ({ onClose, onSubmit, isOpen = true }: AddPropertyModalProps) => {
  if (!isOpen) return null;
  
  const [activeTab, setActiveTab] = useState('basic');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const tabs = ['basic', 'location', 'details', 'images'];
  
  const [formData, setFormData] = useState<FormDataState>({
    project_name: '',
    title: '',
    price: '',
    type: '',
    listed_type: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    state: '',
    district: '',
    city: '',
    neighborhood: '',
    description: '',
    amenities: '',
    status: 'active'
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const goToNextTab = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent form submission
    const currentIndex = tabs.indexOf(activeTab);
    console.log('Current tab:', activeTab, 'Index:', currentIndex, 'Total tabs:', tabs.length);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      console.log('Moving to next tab:', nextTab);
      setActiveTab(nextTab);
    }
  };
  
  const goToPrevTab = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent form submission
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted from tab:', activeTab);
    
    if (!onSubmit) return;
    
    try {
      setIsSubmitting(true);
      
      const requiredFields = [
        'project_name', 'title', 'price', 'type', 'listed_type',
        'state', 'district', 'city'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormDataState]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });
      
      // Always append images field, even if empty
      if (images.length > 0) {
        images.forEach((image) => {
          formDataToSend.append('images', image);
        });
      }

      console.log('Submitting form with', images.length, 'images');
      await onSubmit(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred while submitting the form');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">Project Name *</label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Property Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label htmlFor="listed_type" className="block text-sm font-medium text-gray-700">Listed For *</label>
                <select
                  id="listed_type"
                  name="listed_type"
                  value={formData.listed_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select listing type</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">District *</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Neighborhood/Landmark</label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 'details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (sq ft)</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
              <input
                type="text"
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Swimming Pool, Gym, Parking"
              />
            </div>
          </div>
        );
      
      case 'images':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Choose Images
              </button>
              <p className="mt-2 text-sm text-gray-500">Select one or more images for the property</p>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Check if current tab is the last tab
  const isLastTab = activeTab === tabs[tabs.length - 1];
  const isFirstTab = activeTab === tabs[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6 space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                Icon={
                  tab === 'basic' ? FiInfo :
                  tab === 'location' ? FiMapPin :
                  tab === 'details' ? FiHome : FiImage
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'images' && images.length > 0 && ` (${images.length})`}
              </Tab>
            ))}
          </nav>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {renderTabContent()}
          
          <form onSubmit={handleSubmit}>
            <div className="mt-8 flex justify-between">
              <div>
                {!isFirstTab && (
                  <button
                    type="button"
                    onClick={goToPrevTab}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Previous
                  </button>
                )}
              </div>
              
              <div className="flex space-x-2">
                {!isLastTab ? (
                  <button
                    type="button"
                    onClick={goToNextTab}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;