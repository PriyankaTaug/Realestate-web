"use client";

import { useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/dashboard/PropertyCard";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";

// Mock data for demonstration
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
  const [properties, setProperties] = useState(mockProperties);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'sold' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low' | 'views'>('newest');
  const [showAddModal, setShowAddModal] = useState(false);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    console.log('Property deleted:', propertyId);
  };

  const handleAddProperty = (propertyData: any) => {
    setProperties(prev => [...prev, propertyData]);
    console.log('New property added:', propertyData);
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
              <span className="text-blue-600 text-lg">🏠</span>
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
              <span className="text-green-600 text-lg">✅</span>
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
              <span className="text-purple-600 text-lg">👁️</span>
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
              <span className="text-emerald-600 text-lg">💰</span>
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
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Pending ({getStatusCount('pending')})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'draft'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Draft ({getStatusCount('draft')})
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
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <div className="text-6xl mb-4">🏠</div>
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
                <span className="text-emerald-600 text-lg">➕</span>
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
                <span className="text-blue-600 text-lg">💬</span>
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
                <span className="text-purple-600 text-lg">📊</span>
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
