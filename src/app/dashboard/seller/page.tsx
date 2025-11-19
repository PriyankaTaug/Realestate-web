"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";
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
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=House',
    status: 'pending' as const,
    views: 134,
    inquiries: 6
  }
];

const recentInquiries = [
  {
    id: '1',
    propertyTitle: 'My Family Home',
    buyerName: 'Rajesh Kumar',
    message: 'Interested in scheduling a visit this weekend.',
    time: '2 hours ago',
    status: 'new'
  },
  {
    id: '2',
    propertyTitle: 'Investment Apartment',
    buyerName: 'Priya Nair',
    message: 'Can you provide more details about the parking facility?',
    time: '5 hours ago',
    status: 'replied'
  },
  {
    id: '3',
    propertyTitle: 'My Family Home',
    buyerName: 'Arun Menon',
    message: 'Is the price negotiable?',
    time: '1 day ago',
    status: 'new'
  }
];

export default function SellerDashboard() {
	const [showAddModal, setShowAddModal] = useState(false);
	const [properties, setProperties] = useState(mockProperties);

	const handleAddProperty = (propertyData: any) => {
		setProperties(prev => [...prev, propertyData]);
		console.log('New property added:', propertyData);
	};

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div>
				<h1 className="text-2xl font-bold text-neutral-900">Welcome back, Jane!</h1>
				<p className="text-neutral-600">Track your property listings and manage inquiries.</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Active Listings"
					value="2"
					change="No change"
					changeType="neutral"
					icon="🏠"
					description="Properties for sale"
				/>
				<DashboardCard
					title="Total Views"
					value="301"
					change="+12% this week"
					changeType="positive"
					icon="👁️"
					description="Property views"
				/>
				<DashboardCard
					title="New Inquiries"
					value="15"
					change="+3 today"
					changeType="positive"
					icon="💬"
					description="Buyer inquiries"
				/>
				<DashboardCard
					title="Estimated Value"
					value="₹1.1Cr"
					change="+2% market value"
					changeType="positive"
					icon="💰"
					description="Total property value"
				/>
			</div>

			{/* Recent Inquiries */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">Recent Inquiries</h2>
					<Link 
						href="/dashboard/seller/inquiries"
						className="text-emerald-600 text-sm font-medium hover:text-emerald-700"
					>
						View All
					</Link>
				</div>
				<div className="space-y-4">
					{recentInquiries.map((inquiry) => (
						<div key={inquiry.id} className="flex items-start gap-4 p-4 border border-neutral-100 rounded-lg">
							<div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
								<span className="text-emerald-600 font-semibold text-sm">
									{inquiry.buyerName.charAt(0)}
								</span>
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="font-medium text-neutral-900">{inquiry.buyerName}</h3>
									<span className={`px-2 py-1 rounded-full text-xs font-medium ${
										inquiry.status === 'new' 
											? 'bg-green-100 text-green-800' 
											: 'bg-blue-100 text-blue-800'
									}`}>
										{inquiry.status}
									</span>
								</div>
								<p className="text-sm text-neutral-600 mb-1">
									Re: {inquiry.propertyTitle}
								</p>
								<p className="text-sm text-neutral-700 mb-2">{inquiry.message}</p>
								<p className="text-xs text-neutral-500">{inquiry.time}</p>
							</div>
							<div className="flex gap-2">
								<button className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700">
									Reply
								</button>
								<button className="px-3 py-1 border border-neutral-300 text-neutral-700 text-sm rounded-md hover:bg-neutral-50">
									Call
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* My Properties */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">My Properties</h2>
					<div className="flex gap-2">
						<button
							onClick={() => setShowAddModal(true)}
							className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
						>
							Add New Property
						</button>
						<Link
							href="/dashboard/seller/properties"
							className="text-emerald-600 text-sm font-medium hover:text-emerald-700 px-4 py-2 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
						>
							View All
						</Link>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{properties.map((property) => (
						<PropertyCard
							key={property.id}
							property={property}
							userRole="seller"
						/>
					))}
				</div>
			</div>

			{/* Add Property Modal */}
			<AddPropertyModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={handleAddProperty}
			/>
		</div>
	);
}


