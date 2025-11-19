"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Beautiful Family Home in Edappally',
  price: '₹75,00,000',
  location: 'Edappally, Kochi, Kerala',
  type: 'House',
  bedrooms: 3,
  bathrooms: 2,
  area: '2,200 sq ft',
  plotArea: '5 cents',
  images: [
    'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image+1',
    'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image+2',
    'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Property+Image+3',
  ],
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
  sellerInfo: {
    name: 'Jane Doe',
    phone: '+91 9876543210',
    email: 'jane@example.com'
  },
  yearBuilt: 2018,
  furnishing: 'Semi-furnished',
  facing: 'East',
  status: 'active'
};

export default function PropertyDetails() {
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the inquiry to your backend
    console.log('Inquiry submitted:', inquiryData);
    setInquirySubmitted(true);
    setShowInquiryForm(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={mockProperty.images[currentImageIndex]} 
                  alt={mockProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {mockProperty.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">{mockProperty.title}</h1>
                    <p className="text-neutral-600 flex items-center gap-1">
                      <span>📍</span> {mockProperty.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{mockProperty.price}</p>
                    <p className="text-sm text-neutral-600">Negotiable</p>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="text-2xl mb-1">🛏️</div>
                    <div className="text-sm font-medium text-neutral-900">{mockProperty.bedrooms}</div>
                    <div className="text-xs text-neutral-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="text-2xl mb-1">🚿</div>
                    <div className="text-sm font-medium text-neutral-900">{mockProperty.bathrooms}</div>
                    <div className="text-xs text-neutral-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="text-2xl mb-1">📐</div>
                    <div className="text-sm font-medium text-neutral-900">{mockProperty.area}</div>
                    <div className="text-xs text-neutral-600">Built Area</div>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="text-2xl mb-1">🌳</div>
                    <div className="text-sm font-medium text-neutral-900">{mockProperty.plotArea}</div>
                    <div className="text-xs text-neutral-600">Plot Area</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-3">Description</h2>
                  <p className="text-neutral-700 leading-relaxed">{mockProperty.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-3">Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mockProperty.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-neutral-700">
                        <span className="text-emerald-600">✓</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Property Type</span>
                  <span className="font-medium text-neutral-900">{mockProperty.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Year Built</span>
                  <span className="font-medium text-neutral-900">{mockProperty.yearBuilt}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Furnishing</span>
                  <span className="font-medium text-neutral-900">{mockProperty.furnishing}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Facing</span>
                  <span className="font-medium text-neutral-900">{mockProperty.facing}</span>
                </div>
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
                  <div className="text-4xl mb-3">✅</div>
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
                      <a 
                        href={`tel:${mockProperty.sellerInfo.phone}`}
                        className="w-full bg-white border-2 border-emerald-600 text-emerald-600 py-3 px-4 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-center block"
                      >
                        Call Now
                      </a>
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
                          className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Send Inquiry
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
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Seller Information</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">
                    {mockProperty.sellerInfo.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">{mockProperty.sellerInfo.name}</h4>
                  <p className="text-sm text-neutral-600">Property Owner</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <span>📞</span>
                  <span>{mockProperty.sellerInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <span>📧</span>
                  <span>{mockProperty.sellerInfo.email}</span>
                </div>
              </div>
            </div>

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
      </div>
    </div>
  );
}
