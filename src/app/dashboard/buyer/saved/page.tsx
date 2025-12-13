"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { apiClient } from "@/api/clientConfig";
import type { PropertyOut } from "@/api/client/models/PropertyOut";
import { OpenAPI } from "@/api/client";
import { FaExclamationTriangle, FaHeartBroken, FaHeart } from "react-icons/fa";

// Helper function to construct full image URL
const getImageUrl = (imagePath: string | undefined | null): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const baseUrl = OpenAPI.BASE || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) || 'http://127.0.0.1:8000';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

interface SavedProperty {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  property: PropertyOut;
}

interface PaginatedSavedProperties {
  items: SavedProperty[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export default function SavedPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch saved properties
  const fetchSavedProperties = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kh_token') : null;
      if (!token) {
        setError('Please login to view saved properties');
        setLoading(false);
        return;
      }

      const skip = (page - 1) * pageSize;
      const response = await apiClient.get<PaginatedSavedProperties>('/api/saved-properties/', {
        params: { skip, limit: pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      // Transform API response to match PropertyCard format
      const transformedProperties = data.items.map((saved: SavedProperty) => {
        const p = saved.property;
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
      setTotalItems(data.total);
      setTotalPages(data.total_pages);
      setCurrentPage(data.page);
    } catch (err: any) {
      console.error('Error fetching saved properties:', err);
      if (err.response?.status === 401) {
        setError('Please login to view saved properties');
      } else {
        setError(err.message || 'Failed to fetch saved properties. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties(1);
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchSavedProperties(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePropertyUnsave = (propertyId: string) => {
    // Remove from list immediately for better UX
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    setTotalItems(prev => Math.max(0, prev - 1));
    
    // If we're on a page that becomes empty, go to previous page
    if (properties.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (properties.length > 1) {
      // Refresh to get updated pagination
      fetchSavedProperties(currentPage);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-neutral-900">Saved Properties</h1>
          <FaHeart className="text-3xl text-red-500" />
        </div>
        <p className="text-neutral-600 text-lg">Your favorite properties that you've saved for later</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 bg-gradient-to-br from-white to-neutral-50 rounded-xl shadow-sm border border-neutral-200">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-neutral-600 font-medium">Loading saved properties...</p>
          <p className="text-sm text-neutral-500 mt-1">Please wait while we fetch your favorites</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-2xl text-yellow-500" />
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-1">Oops! Something went wrong</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => fetchSavedProperties(currentPage)}
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
                <FaHeartBroken className="text-6xl text-neutral-400" />
              </div>
              <p className="text-lg font-medium text-neutral-700 mb-2">No saved properties yet</p>
              <p className="text-neutral-500 mb-6">Start exploring properties and save your favorites!</p>
              <a
                href="/dashboard/buyer"
                className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Browse Properties
              </a>
            </div>
          ) : (
            <>
              <div className="mb-5 text-sm text-neutral-600 bg-emerald-50 px-4 py-2 rounded-lg inline-block border border-emerald-100">
                <span className="font-medium text-emerald-700">
                  Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems} saved properties
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    userRole="buyer"
                    onUnsave={handlePropertyUnsave}
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
  );
}

