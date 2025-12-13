"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "@/api/clientConfig";
import { AuthService } from "@/api/client";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import { useToast } from "@/components/ui/toast";
import type { UserOut } from "@/api/client";

export default function BuyerProfile() {
	const { show } = useToast();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [user, setUser] = useState<UserOut | null>(null);
	const [formData, setFormData] = useState({
		full_name: "",
		email: "",
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [showPasswordSection, setShowPasswordSection] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
				if (typeof window !== 'undefined') {
					const token = localStorage.getItem('kh_token');
					if (token) {
						OpenAPI.TOKEN = token;
					}
				}

				const userData = await AuthService.readMeApiAuthMeGet();
				setUser(userData);
				setFormData({
					full_name: userData.full_name || "",
					email: userData.email || "",
				});
			} catch (error: any) {
				console.error('Failed to load user data', error);
				show({
					title: "Failed to load profile",
					description: "Could not fetch your profile information. Please try again.",
					type: "error",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('kh_token');
				if (token) {
					OpenAPI.TOKEN = token;
				}
			}

			// Update profile using the API
			const updateData: any = {};
			if (formData.full_name && formData.full_name !== user?.full_name) {
				updateData.full_name = formData.full_name;
			}
			if (formData.email && formData.email !== user?.email) {
				updateData.email = formData.email;
			}

			if (Object.keys(updateData).length === 0) {
				show({
					title: "No changes",
					description: "No changes were made to your profile.",
					type: "info",
				});
				setSaving(false);
				return;
			}

			// Use the update endpoint
			const response = await fetch(`${OpenAPI.BASE}/api/auth/me`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${OpenAPI.TOKEN}`,
				},
				body: JSON.stringify(updateData),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.detail || 'Failed to update profile');
			}

			const updatedUser = await response.json();
			setUser(updatedUser);
			setFormData({
				full_name: updatedUser.full_name || "",
				email: updatedUser.email || "",
			});

			show({
				title: "Profile updated",
				description: "Your profile information has been updated successfully.",
				type: "success",
			});
		} catch (error: any) {
			console.error('Failed to update profile', error);
			show({
				title: "Failed to update profile",
				description: error?.message || "An error occurred while updating your profile. Please try again.",
				type: "error",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleUpdatePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			show({
				title: "Password mismatch",
				description: "New password and confirm password do not match.",
				type: "error",
			});
			return;
		}

		if (passwordData.newPassword.length < 6) {
			show({
				title: "Password too short",
				description: "Password must be at least 6 characters long.",
				type: "error",
			});
			return;
		}

		setSaving(true);

		try {
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('kh_token');
				if (token) {
					OpenAPI.TOKEN = token;
				}
			}

			// Update password using the API
			const response = await fetch(`${OpenAPI.BASE}/api/auth/me`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${OpenAPI.TOKEN}`,
				},
				body: JSON.stringify({
					password: passwordData.newPassword,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.detail || 'Failed to update password');
			}

			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			setShowPasswordSection(false);

			show({
				title: "Password updated",
				description: "Your password has been updated successfully.",
				type: "success",
			});
		} catch (error: any) {
			console.error('Failed to update password', error);
			show({
				title: "Failed to update password",
				description: error?.message || "An error occurred while updating your password. Please try again.",
				type: "error",
			});
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse">
					<div className="h-8 bg-neutral-200 rounded w-64 mb-2"></div>
					<div className="h-4 bg-neutral-200 rounded w-96"></div>
				</div>
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
					<div className="space-y-4">
						<div className="h-4 bg-neutral-200 rounded w-32"></div>
						<div className="h-10 bg-neutral-200 rounded"></div>
						<div className="h-4 bg-neutral-200 rounded w-32"></div>
						<div className="h-10 bg-neutral-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
					<p className="text-neutral-600">Manage your account information and preferences.</p>
				</div>
				<Link
					href="/dashboard/buyer"
					className="text-emerald-600 hover:text-emerald-700 text-sm font-medium px-4 py-2 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
				>
					Back to Dashboard
				</Link>
			</div>

			{/* Profile Information Card */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<h2 className="text-lg font-semibold text-neutral-900 mb-6">Profile Information</h2>
				
				<form onSubmit={handleUpdateProfile} className="space-y-6">
					<div>
						<label htmlFor="full_name" className="block text-sm font-medium text-neutral-700 mb-2">
							Full Name
						</label>
						<input
							type="text"
							id="full_name"
							name="full_name"
							value={formData.full_name}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							required
						/>
					</div>

					<div className="flex items-center gap-4 pt-4">
						<button
							type="submit"
							disabled={saving}
							className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
						<button
							type="button"
							onClick={() => {
								setFormData({
									full_name: user?.full_name || "",
									email: user?.email || "",
								});
							}}
							className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>

			{/* Account Information Card */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<h2 className="text-lg font-semibold text-neutral-900 mb-4">Account Information</h2>
				
				<div className="space-y-4">
					<div className="flex items-center justify-between py-3 border-b border-neutral-100">
						<div>
							<p className="text-sm font-medium text-neutral-700">User ID</p>
							<p className="text-sm text-neutral-600">#{user?.id}</p>
						</div>
					</div>
					
					<div className="flex items-center justify-between py-3 border-b border-neutral-100">
						<div>
							<p className="text-sm font-medium text-neutral-700">Role</p>
							<p className="text-sm text-neutral-600 capitalize">{user?.role}</p>
						</div>
					</div>
					
					<div className="flex items-center justify-between py-3 border-b border-neutral-100">
						<div>
							<p className="text-sm font-medium text-neutral-700">Account Status</p>
							<p className="text-sm text-neutral-600">
								{user?.is_active ? (
									<span className="text-green-600 font-medium">Active</span>
								) : (
									<span className="text-red-600 font-medium">Inactive</span>
								)}
							</p>
						</div>
					</div>
					
					<div className="flex items-center justify-between py-3">
						<div>
							<p className="text-sm font-medium text-neutral-700">Member Since</p>
							<p className="text-sm text-neutral-600">
								{user?.created_at 
									? new Date(user.created_at).toLocaleDateString('en-US', { 
										year: 'numeric', 
										month: 'long', 
										day: 'numeric' 
									})
									: 'N/A'}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Password Change Card */}
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-neutral-900">Change Password</h2>
					<button
						onClick={() => setShowPasswordSection(!showPasswordSection)}
						className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
					>
						{showPasswordSection ? 'Cancel' : 'Change Password'}
					</button>
				</div>

				{showPasswordSection && (
					<form onSubmit={handleUpdatePassword} className="space-y-6">
						<div>
							<label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-2">
								New Password
							</label>
							<input
								type="password"
								id="newPassword"
								name="newPassword"
								value={passwordData.newPassword}
								onChange={handlePasswordChange}
								className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
								placeholder="Enter new password"
								required
								minLength={6}
							/>
							<p className="text-xs text-neutral-500 mt-1">Password must be at least 6 characters long.</p>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
								Confirm New Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								value={passwordData.confirmPassword}
								onChange={handlePasswordChange}
								className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
								placeholder="Confirm new password"
								required
								minLength={6}
							/>
						</div>

						<div className="flex items-center gap-4 pt-4">
							<button
								type="submit"
								disabled={saving}
								className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{saving ? 'Updating...' : 'Update Password'}
							</button>
							<button
								type="button"
								onClick={() => {
									setShowPasswordSection(false);
									setPasswordData({
										currentPassword: "",
										newPassword: "",
										confirmPassword: "",
									});
								}}
								className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
							>
								Cancel
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

