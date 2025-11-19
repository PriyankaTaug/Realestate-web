"use client";

import { useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import PropertyCard from "@/components/dashboard/PropertyCard";
import PropertySearch from "@/components/dashboard/PropertySearch";

// Mock data for demonstration
const mockProperties = [
  {
    id: '1',
    title: 'Modern Villa in Kochi',
    price: '₹85,00,000',
    location: 'Kakkanad, Kochi',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '2,400 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Villa',
    status: 'active' as const,
    views: 245,
    inquiries: 12
  },
  {
    id: '2',
    title: 'Luxury Apartment',
    price: '₹45,00,000',
    location: 'Marine Drive, Kochi',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: '1,800 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Villa',
    status: 'pending' as const,
    views: 189,
    inquiries: 8
  },
  {
    id: '3',
    title: 'Traditional House',
    price: '₹65,00,000',
    location: 'Fort Kochi',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: '2,000 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Villa',
    status: 'sold' as const,
    views: 156,
    inquiries: 15
  }
];

interface SearchFilters {
  query: string;
  category: string;
  status: string;
  priceRange: string;
  location: string;
}

export default function AgentDashboard() {
	const [filteredProperties, setFilteredProperties] = useState(mockProperties);

	const handleSearch = (filters: SearchFilters) => {
		let filtered = mockProperties;

		// Filter by search query
		if (filters.query) {
			filtered = filtered.filter(property => 
				property.title.toLowerCase().includes(filters.query.toLowerCase()) ||
				property.location.toLowerCase().includes(filters.query.toLowerCase())
			);
		}

		// Filter by category
		if (filters.category !== "all") {
			filtered = filtered.filter(property => 
				property.type.toLowerCase() === filters.category.toLowerCase()
			);
		}

		// Filter by status
		if (filters.status !== "all") {
			filtered = filtered.filter(property => 
				property.status === filters.status
			);
		}

		// Filter by location
		if (filters.location !== "all") {
			filtered = filtered.filter(property => 
				property.location.toLowerCase().includes(filters.location.toLowerCase())
			);
		}

		setFilteredProperties(filtered);
	};

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div>
				<h1 className="text-2xl font-bold text-neutral-900">Welcome back, John!</h1>
				<p className="text-neutral-600">Here's what's happening with your listings today.</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Listings"
					value="24"
					change="+2 this week"
					changeType="positive"
					icon="🏠"
					description="Active properties"
				/>
				<DashboardCard
					title="Total Views"
					value="1,247"
					change="+18% from last month"
					changeType="positive"
					icon="👁️"
					description="Property views"
				/>
				<DashboardCard
					title="Inquiries"
					value="87"
					change="+5 today"
					changeType="positive"
					icon="💬"
					description="New inquiries"
				/>
				<DashboardCard
					title="Closed Deals"
					value="12"
					change="+3 this month"
					changeType="positive"
					icon="🤝"
					description="Successful sales"
				/>
			</div>

			{/* Property Search */}
			<PropertySearch onSearch={handleSearch} />

			{/* Filtered Properties */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">
						Properties ({filteredProperties.length})
					</h2>
					<button 
						className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
						suppressHydrationWarning
					>
						Add New Property
					</button>
				</div>
				
				{filteredProperties.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredProperties.map((property) => (
							<PropertyCard
								key={property.id}
								property={property}
								userRole="agent"
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12 bg-white rounded-lg border border-gray-200">
						<div className="mx-auto h-12 w-12 text-gray-400">
							<svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
							</svg>
						</div>
						<h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
						<p className="mt-1 text-sm text-gray-500">Try adjusting your search filters.</p>
					</div>
				)}
			</div>
		</div>
	);
}


