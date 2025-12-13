"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { PropertiesService } from "@/api/client/services/PropertiesService";
import type { PropertyOut } from "@/api/client/models/PropertyOut";
import type { PaginatedProperties } from "@/api/client/models/PaginatedProperties";
import { OpenAPI } from "@/api/client";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

// Helper function to construct full image URL
const getImageUrl = (imagePath: string | undefined | null): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Get base URL from OpenAPI config
  const baseUrl = OpenAPI.BASE || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) || 'http://127.0.0.1:8000';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};


export default function BuyerDashboard() {
  const [properties, setProperties] = useState<PropertyOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // Items per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    bedrooms: '',
    city: '',
    district: '',
    state: '',
    type: '',
    listed_type: '',
  });

  // Fetch properties
  const fetchProperties = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * pageSize;
      const params: any = {
        skip,
        limit: pageSize,
        status: 'active', // Only show active properties
      };

      // Add filters if provided
      if (filters.bedrooms) {
        params.bedrooms = parseInt(filters.bedrooms);
      }
      if (filters.city) {
        params.city = filters.city;
      }
      if (filters.district) {
        params.district = filters.district;
      }
      if (filters.state) {
        params.state = filters.state;
      }
      if (filters.type) {
        params.type = filters.type;
      }
      if (filters.listed_type) {
        params.listed_type = filters.listed_type;
      }

      // Use PropertiesService with all filter parameters
      const response: PaginatedProperties = await PropertiesService.listPropertiesApiPropertiesGet(
        params.skip,
        params.limit,
        params.bedrooms,
        params.bathrooms,
        params.city,
        params.district,
        params.state,
        undefined, // neighborhood - not in filters yet
        params.type,
        params.listed_type,
        params.status
      );

      // Extract paginated response data
      const items = response.items || [];
      const total = response.total || 0;
      const totalPages = response.total_pages || 1;
      const currentPageNum = response.page || page;

      // Transform API response to match PropertyCard format
      const transformedProperties = items.map((p: PropertyOut) => {
        // Extract all image URLs
        const imageUrls = p.images && p.images.length > 0
          ? p.images.map(img => getImageUrl(img.image_url)).filter(Boolean) as string[]
          : [];

        // Use first image as the main image
        const mainImage = imageUrls.length > 0 ? imageUrls[0] : undefined;

        return {
          id: p.id.toString(),
          title: p.title,
          price: p.price,
          location: p.location,
          type: p.type,
          bedrooms: p.bedrooms || undefined,
          bathrooms: p.bathrooms || undefined,
          area: p.area,
          image: mainImage,
          images: imageUrls,
          status: (p.status || 'active') as 'active' | 'pending' | 'sold' | 'draft',
          views: p.views,
          inquiries: p.inquiries,
        };
      });

      setProperties(transformedProperties);
      setTotalItems(total);
      setTotalPages(totalPages);
      setCurrentPage(currentPageNum);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.bedrooms, filters.city, filters.district, filters.state, filters.type, filters.listed_type]);

  // Fetch when page changes
  useEffect(() => {
    fetchProperties(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      bedrooms: '',
      city: '',
      district: '',
      state: '',
      type: '',
      listed_type: '',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back, Mike! 👋</h1>
        <p className="text-neutral-600 text-lg">Continue your property search and manage your saved listings.</p>
      </div>

      {/* Properties Section with Filters */}
      <div>
        {/* Filter Panel - Always Visible */}
        <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-xl shadow-md border border-emerald-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h3 className="text-base font-semibold text-neutral-900">Filter Properties</h3>
            </div>
            {(filters.bedrooms || filters.city || filters.district || filters.state || filters.type || filters.listed_type) && (
              <button
                onClick={clearFilters}
                className="text-emerald-600 text-xs font-medium hover:text-emerald-700 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-400"
                  suppressHydrationWarning
                >
                  <option value="">All</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="e.g., Kochi"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-400"
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">District</label>
                <input
                  type="text"
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  placeholder="e.g., Ernakulam"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-400"
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">State</label>
                <input
                  type="text"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  placeholder="e.g., Kerala"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-400"
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Property Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-400"
                  suppressHydrationWarning
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Listed Type</label>
                <select
                  value={filters.listed_type}
                  onChange={(e) => handleFilterChange('listed_type', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-400"
                  suppressHydrationWarning
                >
                  <option value="">All</option>
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
				</div>
			</div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-neutral-50 rounded-xl shadow-sm border border-neutral-200">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
            <p className="mt-4 text-neutral-600 font-medium">Loading properties...</p>
            <p className="text-sm text-neutral-500 mt-1">Please wait while we fetch the best matches for you</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-2xl text-yellow-500" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-1">Oops! Something went wrong</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={fetchProperties}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-white to-neutral-50 rounded-xl shadow-sm border border-neutral-200">
                <div className="flex justify-center mb-4">
                  <FaHome className="text-6xl text-neutral-400" />
                </div>
                <p className="text-lg font-medium text-neutral-700 mb-2">No properties found</p>
                <p className="text-neutral-500">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <>
                <div className="mb-5 text-sm text-neutral-600 bg-emerald-50 px-4 py-2 rounded-lg inline-block border border-emerald-100">
                  <span className="font-medium text-emerald-700">
                    Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems} properties
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {properties.map((property) => (
						<PropertyCard
							key={property.id}
							property={property}
							userRole="buyer"
						/>
					))}
				</div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-300"
                    >
                      ← Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm ${
                                currentPage === pageNum
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200'
                                  : 'border-neutral-300 text-neutral-700 hover:bg-emerald-50 hover:border-emerald-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span key={pageNum} className="px-2 py-2 text-neutral-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-300"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
			</div>
		</div>
	);
}
