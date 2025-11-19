"use client";

import DashboardCard from "@/components/dashboard/DashboardCard";
import PropertyCard from "@/components/dashboard/PropertyCard";

// Mock data for demonstration
const savedProperties = [
  {
    id: '1',
    title: 'Waterfront Villa',
    price: '₹95,00,000',
    location: 'Marine Drive, Kochi',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '2,800 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property',
    status: 'active' as const
  },
  {
    id: '2',
    title: 'Modern Apartment',
    price: '₹55,00,000',
    location: 'Kakkanad, Kochi',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: '1,600 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property',
    status: 'active' as const
  },
  {
    id: '3',
    title: 'Heritage House',
    price: '₹78,00,000',
    location: 'Fort Kochi',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: '2,100 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property',
    status: 'pending' as const
  }
];

const recentSearches = [
  { id: '1', query: '3 BHK apartment in Kochi', results: 24, time: '2 hours ago' },
  { id: '2', query: 'Villa under 1 crore', results: 12, time: '1 day ago' },
  { id: '3', query: 'House in Fort Kochi', results: 8, time: '3 days ago' },
];

const upcomingAppointments = [
  {
    id: '1',
    propertyTitle: 'Waterfront Villa',
    agentName: 'John Agent',
    date: 'Tomorrow',
    time: '10:00 AM',
    type: 'Site Visit'
  },
  {
    id: '2',
    propertyTitle: 'Modern Apartment',
    agentName: 'Sarah Realtor',
    date: 'Dec 10',
    time: '2:00 PM',
    type: 'Virtual Tour'
  }
];

export default function BuyerDashboard() {
	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div>
				<h1 className="text-2xl font-bold text-neutral-900">Welcome back, Mike!</h1>
				<p className="text-neutral-600">Continue your property search and manage your saved listings.</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Saved Properties"
					value="12"
					change="+3 this week"
					changeType="positive"
					icon="❤️"
					description="Favorite listings"
				/>
				<DashboardCard
					title="Property Alerts"
					value="5"
					change="2 new matches"
					changeType="positive"
					icon="🔔"
					description="Active alerts"
				/>
				<DashboardCard
					title="Appointments"
					value="3"
					change="1 upcoming"
					changeType="neutral"
					icon="📅"
					description="Scheduled visits"
				/>
				<DashboardCard
					title="Budget Range"
					value="₹50L-₹1Cr"
					change="Updated recently"
					changeType="neutral"
					icon="💰"
					description="Search budget"
				/>
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<button className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
						<span className="text-2xl">🔍</span>
						<div className="text-left">
							<p className="font-medium text-neutral-900">Search Properties</p>
							<p className="text-sm text-neutral-600">Find your dream home</p>
						</div>
					</button>
					<button className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
						<span className="text-2xl">🏦</span>
						<div className="text-left">
							<p className="font-medium text-neutral-900">Loan Calculator</p>
							<p className="text-sm text-neutral-600">Calculate EMI</p>
						</div>
					</button>
					<button className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
						<span className="text-2xl">📊</span>
						<div className="text-left">
							<p className="font-medium text-neutral-900">Market Trends</p>
							<p className="text-sm text-neutral-600">View price trends</p>
						</div>
					</button>
				</div>
			</div>

			{/* Recent Searches */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">Recent Searches</h2>
					<button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
						View All
					</button>
				</div>
				<div className="space-y-3">
					{recentSearches.map((search) => (
						<div key={search.id} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 cursor-pointer">
							<div>
								<p className="font-medium text-neutral-900">{search.query}</p>
								<p className="text-sm text-neutral-600">{search.results} results • {search.time}</p>
							</div>
							<button className="text-emerald-600 hover:text-emerald-700">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Upcoming Appointments */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">Upcoming Appointments</h2>
					<button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
						Schedule New
					</button>
				</div>
				<div className="space-y-4">
					{upcomingAppointments.map((appointment) => (
						<div key={appointment.id} className="flex items-center gap-4 p-4 border border-neutral-100 rounded-lg">
							<div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
								<span className="text-emerald-600 text-xl">📅</span>
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-neutral-900">{appointment.propertyTitle}</h3>
								<p className="text-sm text-neutral-600">with {appointment.agentName}</p>
								<p className="text-sm text-neutral-500">{appointment.type} • {appointment.date} at {appointment.time}</p>
							</div>
							<div className="flex gap-2">
								<button className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700">
									Join
								</button>
								<button className="px-3 py-1 border border-neutral-300 text-neutral-700 text-sm rounded-md hover:bg-neutral-50">
									Reschedule
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Saved Properties */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">Saved Properties</h2>
					<button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
						View All (12)
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{savedProperties.map((property) => (
						<PropertyCard
							key={property.id}
							property={property}
							userRole="buyer"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
