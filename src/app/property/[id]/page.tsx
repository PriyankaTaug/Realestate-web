"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaBed, FaShower, FaRuler, FaTree, FaEnvelope, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { PropertiesService } from "@/api/client/services/PropertiesService";
import { PropertyOut } from "@/api/client/models/PropertyOut";
import { AuthService } from "@/api/client/services/AuthService";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import type { UserOut } from "@/api/client/models/UserOut";
import { apiClient } from "@/api/clientConfig";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image';
  }
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Otherwise, prepend the base URL
  const baseUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000')
    : 'http://127.0.0.1:8000';
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

export default function PropertyDetails() {
  const params = useParams();
  const propertyId = params?.id as string;
  
  const [property, setProperty] = useState<PropertyOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [user, setUser] = useState<UserOut | null>(null);

  // Check authentication to determine back link destination
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('kh_token');
          if (token) {
            OpenAPI.TOKEN = token;
            try {
              const userData = await AuthService.readMeApiAuthMeGet();
              setUser(userData);
            } catch (error) {
              // Token might be invalid, ignore
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const propertyData = await PropertiesService.getPropertyApiPropertiesPropertyIdGet(
          parseInt(propertyId)
        );
        setProperty(propertyData);
      } catch (err: any) {
        console.error('Error fetching property:', err);
        if (err.status === 404) {
          setError('Property not found');
        } else {
          setError('Failed to load property details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Get back link destination based on user role
  const getBackLink = () => {
    if (user) {
      const role = user.role?.toLowerCase() || 'buyer';
      // For buyers, go to saved properties or buyer dashboard
      // For sellers/agents, go to their properties page
      if (role === 'buyer') {
        return '/dashboard/buyer';
      } else if (role === 'seller') {
        return '/dashboard/seller/properties';
      } else if (role === 'agent') {
        return '/dashboard/agent/listings';
      } else {
        return `/dashboard/${role}`;
      }
    }
    return '/';
  };

  // Get user role for DashboardHeader
  const getUserRole = (): 'agent' | 'admin' | 'seller' | 'buyer' => {
    if (!user) return 'buyer';
    const role = user.role?.toLowerCase() || 'buyer';
    if (['agent', 'admin', 'seller', 'buyer'].includes(role)) {
      return role as 'agent' | 'admin' | 'seller' | 'buyer';
    }
    return 'buyer';
  };

  // Get images array from property
  const propertyImages = property?.images && property.images.length > 0
    ? property.images.map(img => getImageUrl(img.image_url))
    : property?.featured_image_url
    ? [getImageUrl(property.featured_image_url)]
    : ['https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image'];


  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property) {
      alert('Property information is not available. Please refresh the page.');
      return;
    }
    
    setSubmittingInquiry(true);
    try {
      // Call the inquiry API
      const response = await apiClient.post('/api/inquiries/', {
        property_id: parseInt(propertyId),
        buyer_name: inquiryData.name,
        buyer_email: inquiryData.email,
        buyer_phone: inquiryData.phone || null,
        message: inquiryData.message || null
      });
      
      if (response.status === 201) {
        setInquirySubmitted(true);
        setShowInquiryForm(false);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setInquirySubmitted(false);
          setInquiryData({ name: '', email: '', phone: '', message: '' });
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to send inquiry. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Property Not Found</h2>
            <p className="text-neutral-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
            <Link 
              href={getBackLink()}
              className="inline-block bg-emerald-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get amenities array
  const amenities = property.amenities ? property.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];

  // Property content JSX - shared between both layouts
  const propertyContent = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={propertyImages[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image';
                  }}
                />
                {propertyImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? propertyImages.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-700 rounded-full w-10 h-10 flex items-center justify-center transition-all"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === propertyImages.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-700 rounded-full w-10 h-10 flex items-center justify-center transition-all"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {propertyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                        currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                  </>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">{property.title}</h1>
                    <p className="text-neutral-600 flex items-center gap-1">
                      <MdLocationOn className="text-base" /> {property.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{property.price}</p>
                    <p className="text-sm text-neutral-600">Negotiable</p>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {property.bedrooms && (
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="flex justify-center mb-1">
                      <FaBed className="text-2xl text-neutral-600" />
                    </div>
                      <div className="text-sm font-medium text-neutral-900">{property.bedrooms}</div>
                    <div className="text-xs text-neutral-600">Bedrooms</div>
                  </div>
                  )}
                  {property.bathrooms && (
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="flex justify-center mb-1">
                      <FaShower className="text-2xl text-neutral-600" />
                    </div>
                      <div className="text-sm font-medium text-neutral-900">{property.bathrooms}</div>
                    <div className="text-xs text-neutral-600">Bathrooms</div>
                  </div>
                  )}
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="flex justify-center mb-1">
                      <FaRuler className="text-2xl text-neutral-600" />
                    </div>
                    <div className="text-sm font-medium text-neutral-900">{property.area}</div>
                    <div className="text-xs text-neutral-600">Area</div>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="flex justify-center mb-1">
                      <FaTree className="text-2xl text-neutral-600" />
                    </div>
                    <div className="text-sm font-medium text-neutral-900">{property.type}</div>
                    <div className="text-xs text-neutral-600">Type</div>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-3">Description</h2>
                    <p className="text-neutral-700 leading-relaxed">{property.description}</p>
                </div>
                )}

                {/* Features & Amenities */}
                {amenities.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-3">Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-neutral-700">
                        <FaCheckCircle className="text-emerald-600 text-sm" />
                          <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Property Type</span>
                  <span className="font-medium text-neutral-900">{property.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Listed Type</span>
                  <span className="font-medium text-neutral-900">{property.listed_type}</span>
                </div>
                {property.project_name && (
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Project Name</span>
                    <span className="font-medium text-neutral-900">{property.project_name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Status</span>
                  <span className="font-medium text-neutral-900 capitalize">{property.status || 'Active'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">City</span>
                  <span className="font-medium text-neutral-900">{property.city}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">District</span>
                  <span className="font-medium text-neutral-900">{property.district}</span>
                </div>
                {property.neighborhood && (
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Neighborhood</span>
                    <span className="font-medium text-neutral-900">{property.neighborhood}</span>
                  </div>
                )}
                {property.views !== undefined && (
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Views</span>
                    <span className="font-medium text-neutral-900">{property.views}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Interested in this property?</h3>
              
              {inquirySubmitted ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-3">
                    <FaCheckCircle className="text-4xl text-green-500" />
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Inquiry Sent!</h4>
                  <p className="text-sm text-neutral-600">The seller will contact you soon.</p>
                </div>
              ) : (
                <>
                  {!showInquiryForm ? (
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowInquiryForm(true)}
                        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Send Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={inquiryData.name}
                          onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                          className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryData.email}
                          onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                          className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={inquiryData.phone}
                          onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
                          className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Message
                        </label>
                        <textarea
                          value={inquiryData.message}
                          onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                          className="w-full p-3 border border-neutral-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows={3}
                          placeholder="Any specific questions or requirements?"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={submittingInquiry}
                          className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInquiryForm(false)}
                          className="px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Seller Info */}
            {property.owner && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Seller Information</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">
                      {property.owner.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                    <h4 className="font-medium text-neutral-900">{property.owner.full_name}</h4>
                    <p className="text-sm text-neutral-600 capitalize">{property.owner.role || 'Property Owner'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                    <FaEnvelope className="text-base" />
                    <a href={`mailto:${property.owner.email}`} className="hover:text-emerald-600">
                      {property.owner.email}
                    </a>
                </div>
                </div>
              </div>
            )}

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Always visit the property in person</li>
                <li>• Verify all documents before payment</li>
                <li>• Use secure payment methods</li>
                <li>• Report suspicious activities</li>
              </ul>
            </div>
          </div>
        </div>
  );

  // If user is logged in, use dashboard layout with sidebar
  if (user) {
    return (
      <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
        <DashboardSidebar userRole={getUserRole()} />
        <div className="lg:pl-64">
          <DashboardHeader userRole={getUserRole()} />
          
          {/* Back Link */}
          <div className="bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Link 
                href={getBackLink()}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium inline-flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Properties
              </Link>
            </div>
          </div>

          <main className="pt-2 pb-8 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              {propertyContent}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If not logged in, use simple layout without sidebar
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Back Link */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={getBackLink()}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium inline-flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {propertyContent}
      </div>
    </div>
  );
}
