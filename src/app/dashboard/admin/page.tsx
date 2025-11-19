"use client";

import DashboardCard from "@/components/dashboard/DashboardCard";
import PropertyCard from "@/components/dashboard/PropertyCard";

// Mock data for demonstration
const recentProperties = [
  {
    id: '1',
    title: 'Luxury Villa - Pending Approval',
    price: '₹1,25,00,000',
    location: 'Panampilly Nagar, Kochi',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: '3,200 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property',
    status: 'draft' as const
  },
  {
    id: '2',
    title: 'Commercial Space',
    price: '₹85,00,000',
    location: 'MG Road, Kochi',
    type: 'Commercial',
    area: '1,800 sq ft',
    image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Property',
    status: 'active' as const
  }
];

const systemStats = [
  { label: 'Total Users', value: '2,847', change: '+12%', period: 'this month' },
  { label: 'Active Agents', value: '156', change: '+8%', period: 'this month' },
  { label: 'Properties Listed', value: '1,234', change: '+15%', period: 'this month' },
  { label: 'Transactions', value: '89', change: '+22%', period: 'this month' }
];

const recentUsers = [
  { id: '1', name: 'Rajesh Kumar', role: 'Buyer', joinDate: '2 hours ago', status: 'active' },
  { id: '2', name: 'Priya Nair', role: 'Seller', joinDate: '5 hours ago', status: 'active' },
  { id: '3', name: 'Arun Menon', role: 'Agent', joinDate: '1 day ago', status: 'pending' },
  { id: '4', name: 'Deepa Raj', role: 'Buyer', joinDate: '2 days ago', status: 'active' }
];

const pendingApprovals = [
  { id: '1', type: 'Property Listing', title: 'Modern Apartment in Kakkanad', user: 'John Agent', time: '2 hours ago' },
  { id: '2', type: 'Agent Verification', title: 'Sarah Realtor - License Verification', user: 'Sarah Realtor', time: '4 hours ago' },
  { id: '3', type: 'Property Update', title: 'Price change for Villa in Marine Drive', user: 'Jane Seller', time: '6 hours ago' }
];

export default function AdminDashboard() {
	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div>
				<h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
				<p className="text-neutral-600">Monitor platform activity and manage system operations.</p>
			</div>

			{/* System Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Users"
					value="2,847"
					change="+12% this month"
					changeType="positive"
					icon="👥"
					description="Platform users"
				/>
				<DashboardCard
					title="Active Properties"
					value="1,234"
					change="+15% this month"
					changeType="positive"
					icon="🏠"
					description="Listed properties"
				/>
				<DashboardCard
					title="Monthly Revenue"
					value="₹12.5L"
					change="+18% this month"
					changeType="positive"
					icon="💰"
					description="Platform earnings"
				/>
				<DashboardCard
					title="System Health"
					value="99.9%"
					change="Excellent uptime"
					changeType="positive"
					icon="⚡"
					description="Server uptime"
				/>
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<button className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
						<span className="text-2xl">👥</span>
						<div className="text-left">
							<p className="font-medium text-neutral-900">Manage Users</p>
							<p className="text-sm text-neutral-600">View all users</p>
						</div>
					</button>
					<button className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
						<span className="text-2xl">🏠</span>
						<div className="text-left">
							<p className="font-medium text-neutral-900">Properties</p>
							<p className="text-sm text-neutral-600">Review listings</p>
						</div>
					</button>
					<button className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
						<span className="text-2xl">📊</span>
						<div className="text-left">
							<p className="font-medium text-neutral-900">Analytics</p>
							<p className="text-sm text-neutral-600">View reports</p>
						</div>
					</button>
					<button className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
						<span className="text-2xl">⚙️</span>
						<div className="text-left">
							<p className="font-medium text-neutral-900">Settings</p>
							<p className="text-sm text-neutral-600">System config</p>
						</div>
					</button>
				</div>
			</div>

			{/* Pending Approvals */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">Pending Approvals</h2>
					<span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
						{pendingApprovals.length} pending
					</span>
				</div>
				<div className="space-y-4">
					{pendingApprovals.map((item) => (
						<div key={item.id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-lg">
							<div className="flex items-start gap-3">
								<div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
								<div>
									<p className="font-medium text-neutral-900">{item.title}</p>
									<p className="text-sm text-neutral-600">{item.type} by {item.user}</p>
									<p className="text-xs text-neutral-500">{item.time}</p>
								</div>
							</div>
							<div className="flex gap-2">
								<button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
									Approve
								</button>
								<button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
									Reject
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Recent Users */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">Recent Users</h2>
					<button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
						View All Users
					</button>
				</div>
				<div className="space-y-3">
					{recentUsers.map((user) => (
						<div key={user.id} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
									<span className="text-emerald-600 font-semibold text-sm">
										{user.name.charAt(0)}
									</span>
								</div>
								<div>
									<p className="font-medium text-neutral-900">{user.name}</p>
									<p className="text-sm text-neutral-600">{user.role} • Joined {user.joinDate}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${
									user.status === 'active' 
										? 'bg-green-100 text-green-800' 
										: 'bg-yellow-100 text-yellow-800'
								}`}>
									{user.status}
								</span>
								<button className="text-neutral-400 hover:text-neutral-600">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
									</svg>
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Recent Properties */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-neutral-900">Recent Property Submissions</h2>
					<button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
						View All Properties
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{recentProperties.map((property) => (
						<PropertyCard
							key={property.id}
							property={property}
							userRole="admin"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
