"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";
import PropertyCard from "@/components/dashboard/PropertyCard";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";
import "@/api/clientConfig";
import { PropertiesService } from "@/api/client";
import { AuthService } from "@/api/client";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import { useToast } from "@/components/ui/toast";
import { 
  MdHome, 
  MdVisibility, 
  MdMessage, 
  MdAttachMoney,
  MdBarChart,
  MdCheckCircle,
  MdTrendingUp
} from "react-icons/md";
import { FaHome } from "react-icons/fa";

export default function SellerDashboard() {
	const { show } = useToast();
	const [showAddModal, setShowAddModal] = useState(false);
	const [properties, setProperties] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [userName, setUserName] = useState("Seller");
	const [user, setUser] = useState<any>(null);
	const [stats, setStats] = useState({
		activeListings: 0,
		totalProperties: 0,
		totalViews: 0,
		totalInquiries: 0,
		portfolioValue: 0,
		soldProperties: 0
	});

	// Fetch user info first
	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (typeof window !== 'undefined') {
					const token = localStorage.getItem('kh_token');
					if (token) {
						OpenAPI.TOKEN = token;
						const userData = await AuthService.readMeApiAuthMeGet();
						setUser(userData);
						if (userData?.full_name) {
							setUserName(userData.full_name.split(' ')[0]); // Get first name
						}
					}
				}
			} catch (error) {
				console.error('Failed to fetch user data', error);
			}
		};
		fetchUser();
	}, []);

	// Fetch properties for the logged-in seller
	useEffect(() => {
		const fetchData = async () => {
			if (!user) return; // Wait for user to be loaded
			
			try {
				setLoading(true);
				
				// Set token if available
				if (typeof window !== 'undefined') {
					const token = localStorage.getItem('kh_token');
					if (token) {
						OpenAPI.TOKEN = token;
					}
				}

				// Fetch all properties (we'll filter by owner_id on frontend)
				const response = await PropertiesService.listPropertiesApiPropertiesGet(
					0, 
					100, // Get more properties to ensure we get all seller's properties
					undefined, // bedrooms
					undefined, // bathrooms
					undefined, // city
					undefined, // district
					undefined, // state
					undefined, // neighborhood
					undefined, // type
					undefined, // listed_type
					undefined, // status (get all statuses for seller)
				);
				
				const data = response.items || [];
				
				// Filter properties by owner_id on frontend
				const sellerProperties = data.filter((p: any) => p.owner_id === user.id);
				
				if (sellerProperties.length > 0) {
					// Helper function to construct full image URL
					const getImageUrl = (imagePath: string | undefined | null) => {
						if (!imagePath) return undefined;
						if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
							return imagePath;
						}
						const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
						const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
						return `${baseUrl}${cleanPath}`;
					};
					
					const mapped = sellerProperties.map((p: any) => {
						const imageUrls = p.images && p.images.length > 0
							? p.images.map(img => getImageUrl(img.image_url)).filter(Boolean) as string[]
							: [];
						
						const mainImage = imageUrls.length > 0 ? imageUrls[0] : undefined;
						
						return {
							id: String(p.id),
							title: p.title,
							price: p.price,
							location: p.location,
							type: p.type,
							bedrooms: p.bedrooms || undefined,
							bathrooms: p.bathrooms || undefined,
							area: p.area,
							image: mainImage,
							images: imageUrls,
							status: p.status || 'active',
							views: p.views || 0,
							inquiries: p.inquiries || 0,
							created_at: p.created_at,
						};
					});
					
					setProperties(mapped);
					
					// Calculate statistics
					const activeListings = mapped.filter(p => p.status === 'active').length;
					const soldProperties = mapped.filter(p => p.status === 'sold').length;
					const totalViews = mapped.reduce((sum, p) => sum + (p.views || 0), 0);
					const totalInquiries = mapped.reduce((sum, p) => sum + (p.inquiries || 0), 0);
					
					// Calculate portfolio value (sum of active property prices)
					const portfolioValue = mapped
						.filter(p => p.status === 'active')
						.reduce((sum, p) => {
							const priceStr = p.price.replace(/[₹,]/g, '');
							const priceNum = parseFloat(priceStr);
							return sum + (isNaN(priceNum) ? 0 : priceNum);
						}, 0);
					
					setStats({
						activeListings,
						totalProperties: mapped.length,
						totalViews,
						totalInquiries,
						portfolioValue,
						soldProperties
					});
				} else {
					// No properties found for this seller
					setProperties([]);
					setStats({
						activeListings: 0,
						totalProperties: 0,
						totalViews: 0,
						totalInquiries: 0,
						portfolioValue: 0,
						soldProperties: 0
					});
				}
			} catch (error: any) {
				console.error('Failed to load dashboard data', error);
				show({
					title: "Failed to load data",
					description: "Could not fetch your properties. Please refresh the page.",
					type: "error",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [user]);

	const handleAddProperty = async (formData: FormData) => {
		try {
			// Extract and validate required fields
			const title = formData.get('title') as string;
			const price = formData.get('price') as string;
			const projectName = formData.get('project_name') as string;
			const state = formData.get('state') as string;
			const district = formData.get('district') as string;
			const city = formData.get('city') as string;
			const neighborhood = formData.get('neighborhood') as string || city;
			const type = formData.get('type') as string;
			const listedType = formData.get('listed_type') as string;
			const area = formData.get('area') as string || '0';
			const bedrooms = formData.get('bedrooms') as string;
			const bathrooms = formData.get('bathrooms') as string;
			const description = formData.get('description') as string || '';
			const amenities = formData.get('amenities') as string || '';
			const status = formData.get('status') as string || 'active';

			const locationParts = [neighborhood, city, district, state].filter(Boolean);
			const location = locationParts.join(', ');

			if (!title || !price || !projectName || !state || !district || !city || !type || !listedType || !area) {
				throw new Error('Missing required fields. Please fill in all required fields.');
			}

			const priceNum = parseFloat(price.replace(/[₹,]/g, ''));
			if (isNaN(priceNum) || priceNum <= 0) {
				throw new Error('Price must be a valid positive number.');
			}

			const images = formData.getAll('images') as File[];
			if (!images || images.length === 0) {
				throw new Error('At least one image is required.');
			}

			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('kh_token');
				if (token) {
					OpenAPI.TOKEN = token;
				}
			}

			const created = await PropertiesService.createPropertyApiPropertiesPost({
				title,
				price: priceNum,
				project_name: projectName,
				location,
				type,
				listed_type: listedType,
				state,
				district,
				city,
				neighborhood,
				area,
				status,
				bedrooms: bedrooms ? parseInt(bedrooms) : null,
				bathrooms: bathrooms ? parseInt(bathrooms) : null,
				description: description || null,
				amenities: amenities || null,
				images: images,
			});
			
			// Helper function to construct full image URL
			const getImageUrl = (imagePath: string | undefined | null) => {
				if (!imagePath) return undefined;
				if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
					return imagePath;
				}
				const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
				const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
				return `${baseUrl}${cleanPath}`;
			};
			
			const imageUrls = created.images && created.images.length > 0
				? created.images.map(img => getImageUrl(img.image_url)).filter(Boolean) as string[]
				: [];
			
			const mainImage = imageUrls.length > 0 
				? imageUrls[0] 
				: (images[0] ? URL.createObjectURL(images[0]) : undefined);
			
			const mapped = {
				id: String(created.id || Date.now()),
				title: created.title,
				price: created.price || price,
				location: created.location || location,
				type: created.type || type,
				bedrooms: created.bedrooms || (bedrooms ? parseInt(bedrooms) : undefined),
				bathrooms: created.bathrooms || (bathrooms ? parseInt(bathrooms) : undefined),
				area: created.area || area || undefined,
				image: mainImage,
				images: imageUrls,
				status: created.status || status,
				views: created.views || 0,
				inquiries: created.inquiries || 0,
				created_at: created.created_at,
			};
			
			setProperties(prev => [...prev, mapped]);
			
			// Update stats
			setStats(prev => ({
				...prev,
				totalProperties: prev.totalProperties + 1,
				activeListings: (created.status || status) === 'active' ? prev.activeListings + 1 : prev.activeListings,
			}));
			
			setShowAddModal(false);
			show({
				title: "Property created successfully!",
				description: `${title} has been added to your listings.`,
				type: "success",
			});
		} catch (error: any) {
			console.error('Failed to add property', error);
			show({
				title: "Failed to create property",
				description: error?.message || "An error occurred while creating the property. Please try again.",
				type: "error",
			});
		}
	};

	const handleStatusUpdate = async (propertyId: string, newStatus: 'active' | 'pending' | 'sold' | 'draft') => {
		try {
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('kh_token');
				if (token) {
					OpenAPI.TOKEN = token;
				}
			}

			await PropertiesService.updatePropertyApiPropertiesPropertyIdPut(
				Number(propertyId),
				{ status: newStatus }
			);

			setProperties(prev => 
				prev.map(p => 
					p.id === propertyId 
						? { ...p, status: newStatus }
						: p
				)
			);

			// Update stats
			const property = properties.find(p => p.id === propertyId);
			if (property) {
				setStats(prev => {
					const wasActive = property.status === 'active';
					const wasSold = property.status === 'sold';
					const isActive = newStatus === 'active';
					const isSold = newStatus === 'sold';
					
					return {
						...prev,
						activeListings: prev.activeListings + (isActive ? 1 : 0) - (wasActive ? 1 : 0),
						soldProperties: prev.soldProperties + (isSold ? 1 : 0) - (wasSold ? 1 : 0),
					};
				});
			}

			const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
			show({
				title: "Status updated",
				description: `Property status has been updated to "${statusLabel}".`,
				type: "success",
			});
		} catch (error: any) {
			console.error('Failed to update property status', error);
			show({
				title: "Failed to update status",
				description: error?.message || "An error occurred while updating the property status. Please try again.",
				type: "error",
			});
		}
	};

	const handleDeleteProperty = async (propertyId: string) => {
		try {
			await PropertiesService.deletePropertyApiPropertiesPropertyIdDelete(Number(propertyId));
			const deletedProperty = properties.find(p => p.id === propertyId);
			setProperties(prev => prev.filter(p => p.id !== propertyId));
			
			// Update stats
			if (deletedProperty) {
				setStats(prev => ({
					...prev,
					totalProperties: prev.totalProperties - 1,
					activeListings: deletedProperty.status === 'active' ? prev.activeListings - 1 : prev.activeListings,
					soldProperties: deletedProperty.status === 'sold' ? prev.soldProperties - 1 : prev.soldProperties,
					totalViews: prev.totalViews - (deletedProperty.views || 0),
					totalInquiries: prev.totalInquiries - (deletedProperty.inquiries || 0),
				}));
			}
			
			show({
				title: "Property deleted",
				description: "The property has been successfully deleted.",
				type: "success",
			});
		} catch (error) {
			console.error('Failed to delete property', error);
			show({
				title: "Failed to delete property",
				description: "An error occurred while deleting the property. Please try again.",
				type: "error",
			});
		}
	};

	// Format portfolio value
	const formatPortfolioValue = (value: number) => {
		if (value >= 10000000) {
			return `₹${(value / 10000000).toFixed(2)}Cr`;
		} else if (value >= 100000) {
			return `₹${(value / 100000).toFixed(2)}L`;
		} else {
			return `₹${value.toLocaleString('en-IN')}`;
		}
	};

	// Get recent properties (latest 2)
	const recentProperties = [...properties]
		.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
		.slice(0, 2);

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse">
					<div className="h-8 bg-neutral-200 rounded w-64 mb-2"></div>
					<div className="h-4 bg-neutral-200 rounded w-96"></div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map(i => (
						<div key={i} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
							<div className="h-4 bg-neutral-200 rounded w-24 mb-4"></div>
							<div className="h-8 bg-neutral-200 rounded w-16 mb-2"></div>
							<div className="h-3 bg-neutral-200 rounded w-32"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div>
				<h1 className="text-2xl font-bold text-neutral-900">Welcome back, {userName}!</h1>
				<p className="text-neutral-600">Track your property listings and manage inquiries.</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Active Listings"
					value={stats.activeListings}
					change={stats.totalProperties > 0 ? `${stats.activeListings} of ${stats.totalProperties} properties` : "No properties yet"}
					changeType="neutral"
					icon={<MdHome className="text-4xl" />}
					description="Properties currently for sale"
				/>
				<DashboardCard
					title="Total Views"
					value={stats.totalViews.toLocaleString('en-IN')}
					change={stats.totalViews > 0 ? "Across all properties" : "No views yet"}
					changeType="neutral"
					icon={<MdVisibility className="text-4xl" />}
					description="Property views"
				/>
				<DashboardCard
					title="Total Inquiries"
					value={stats.totalInquiries}
					change={stats.totalInquiries > 0 ? "Buyer inquiries received" : "No inquiries yet"}
					changeType="neutral"
					icon={<MdMessage className="text-4xl" />}
					description="Buyer inquiries"
				/>
				<DashboardCard
					title="Portfolio Value"
					value={formatPortfolioValue(stats.portfolioValue)}
					change={stats.activeListings > 0 ? `${stats.activeListings} active properties` : "No active listings"}
					changeType="neutral"
					icon={<MdAttachMoney className="text-4xl" />}
					description="Total active property value"
				/>
			</div>

			{/* Quick Stats Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
							<MdBarChart className="text-blue-600 text-lg" />
						</div>
						<div>
							<p className="text-sm text-neutral-600">Total Properties</p>
							<p className="text-xl font-bold text-neutral-900">{stats.totalProperties}</p>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
							<MdCheckCircle className="text-green-600 text-lg" />
						</div>
						<div>
							<p className="text-sm text-neutral-600">Sold Properties</p>
							<p className="text-xl font-bold text-neutral-900">{stats.soldProperties}</p>
							</div>
								</div>
							</div>
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
							<MdTrendingUp className="text-purple-600 text-lg" />
						</div>
						<div>
							<p className="text-sm text-neutral-600">Avg. Views/Property</p>
							<p className="text-xl font-bold text-neutral-900">
								{stats.totalProperties > 0 
									? Math.round(stats.totalViews / stats.totalProperties) 
									: 0}
							</p>
						</div>
					</div>
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
				{recentProperties.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{recentProperties.map((property) => (
						<PropertyCard
							key={property.id}
							property={property}
							userRole="seller"
								onDelete={handleDeleteProperty}
								onStatusUpdate={handleStatusUpdate}
						/>
					))}
				</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
						<div className="flex justify-center mb-4">
							<FaHome className="text-6xl text-neutral-400" />
						</div>
						<h3 className="text-lg font-semibold text-neutral-900 mb-2">
							No properties yet
						</h3>
						<p className="text-neutral-600 mb-6">
							Get started by adding your first property listing.
						</p>
						<button
							onClick={() => setShowAddModal(true)}
							className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
						>
							Add Your First Property
						</button>
					</div>
				)}
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
