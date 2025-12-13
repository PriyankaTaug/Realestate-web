"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { apiClient } from "@/api/clientConfig";
import { 
  FaHome, 
  FaBed, 
  FaShower, 
  FaRuler, 
  FaEye, 
  FaComments,
  FaExclamationTriangle 
} from "react-icons/fa";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image?: string;
  images?: string[];
  status: 'active' | 'pending' | 'sold' | 'draft';
  views?: number;
  inquiries?: number;
}

interface PropertyCardProps {
  property: Property;
  userRole: 'agent' | 'admin' | 'seller' | 'buyer';
  showActions?: boolean;
  onDelete?: (propertyId: string) => void;
  onStatusUpdate?: (propertyId: string, newStatus: 'active' | 'pending' | 'sold' | 'draft') => void;
  onUnsave?: (propertyId: string) => void; // Callback when property is unsaved
}

export default function PropertyCard({ property, userRole, showActions = true, onDelete, onStatusUpdate, onUnsave }: PropertyCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Check if property is saved (for buyers)
  useEffect(() => {
    if (userRole === 'buyer') {
      checkSavedStatus();
    }
  }, [property.id, userRole]);
  
  const checkSavedStatus = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kh_token') : null;
      if (!token) return;
      
      const response = await apiClient.get(`/api/saved-properties/check/${property.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsSaved(response.data.is_saved);
    } catch (error) {
      // If not authenticated or error, assume not saved
      setIsSaved(false);
    }
  };
  
  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (userRole !== 'buyer') return;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('kh_token') : null;
    if (!token) {
      // Redirect to login or show message
      alert('Please login to save properties');
      return;
    }
    
    setSaving(true);
    try {
      if (isSaved) {
        // Unsave
        await apiClient.delete(`/api/saved-properties/${property.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsSaved(false);
        // Call onUnsave callback if provided
        if (onUnsave) {
          onUnsave(property.id);
        }
      } else {
        // Save
        await apiClient.post('/api/saved-properties/', 
          { property_id: parseInt(property.id) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setIsSaved(true);
      }
    } catch (error: any) {
      console.error('Error toggling save:', error);
      if (error.response?.status === 401) {
        alert('Please login to save properties');
      } else if (error.response?.status === 400 && error.response?.data?.detail === 'Property already saved') {
        setIsSaved(true);
      } else {
        alert('Failed to save property. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };
  
  // Get images array - use images if available, fallback to single image, or default
  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : property.image 
    ? [property.image] 
    : ['https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property+Image'];
  
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setLoading(true);
    try {
      await onDelete(property.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'active' | 'pending' | 'sold' | 'draft') => {
    if (!onStatusUpdate) return;
    
    setUpdatingStatus(true);
    try {
      await onStatusUpdate(property.id, newStatus);
    } catch (error) {
      console.error('Error updating property status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Property Image Gallery */}
      <div className="relative h-48 bg-neutral-200 overflow-hidden">
        <img 
          src={propertyImages[currentImageIndex]} 
          alt={`${property.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property+Image';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>

        {/* Image Counter */}
        {propertyImages.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
            {currentImageIndex + 1}/{propertyImages.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {propertyImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(prev => 
                  prev === 0 ? propertyImages.length - 1 : prev - 1
                );
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-700 rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(prev => 
                  prev === propertyImages.length - 1 ? 0 : prev + 1
                );
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-700 rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              ›
            </button>
          </>
        )}

        {/* Image Dots */}
        {propertyImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Favorite Button for Buyers */}
        {userRole === 'buyer' && (
          <button 
            onClick={handleSaveToggle}
            disabled={saving}
            className={`absolute top-3 right-12 p-2 rounded-full bg-white/80 hover:bg-white transition-all ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            } ${isSaved ? 'animate-pulse' : ''}`}
            title={isSaved ? 'Remove from saved' : 'Save property'}
          >
            {isSaved ? (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">{property.title}</h3>
          <span className="text-lg font-bold text-emerald-600">{property.price}</span>
        </div>
        
        <p className="text-sm text-neutral-600 mb-3">{property.location}</p>
        
        <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
          <span className="flex items-center gap-1">
            <FaHome className="text-base" /> {property.type}
          </span>
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <FaBed className="text-base" /> {property.bedrooms} bed
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <FaShower className="text-base" /> {property.bathrooms} bath
            </span>
          )}
          <span className="flex items-center gap-1">
            <FaRuler className="text-base" /> {property.area}
          </span>
        </div>

        {/* Stats for sellers/agents */}
        {(userRole === 'seller' || userRole === 'agent') && (
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
            {property.views && (
              <span className="flex items-center gap-1">
                <FaEye className="text-base" /> {property.views} views
              </span>
            )}
            {property.inquiries && (
              <span className="flex items-center gap-1">
                <FaComments className="text-base" /> {property.inquiries} inquiries
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-neutral-100">
            {userRole === 'buyer' && (
              <Link 
                href={`/property/${property.id}`}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors text-center block"
              >
                Contact Seller
              </Link>
            )}
            
            {(userRole === 'seller' || userRole === 'agent') && (
              <div className={`grid gap-2 ${onStatusUpdate ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <Link 
                  href={`/dashboard/${userRole}/properties/${property.id}/edit`}
                  className="bg-emerald-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-emerald-700 transition-colors text-center"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                {/* Mark as Sold / Mark as Active button */}
                {onStatusUpdate && property.status !== 'sold' && (
                  <button
                    onClick={() => handleStatusUpdate('sold')}
                    disabled={updatingStatus}
                    className="bg-orange-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingStatus ? '...' : 'Sold'}
                  </button>
                )}
                {onStatusUpdate && property.status === 'sold' && (
                  <button
                    onClick={() => handleStatusUpdate('active')}
                    disabled={updatingStatus}
                    className="bg-green-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingStatus ? '...' : 'Active'}
                  </button>
                )}
              </div>
            )}
            
            {userRole === 'admin' && (
              <>
                <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors">
                  Manage
                </button>
                <button className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                  Details
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FaExclamationTriangle className="text-4xl text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Property</h3>
              <p className="text-neutral-600 mb-6">
                Are you sure you want to delete "{property.title}"? This action cannot be undone.
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
