"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/api/client/services/AuthService";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import type { UserOut } from "@/api/client/models/UserOut";

export default function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [user, setUser] = useState<UserOut | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				if (typeof window !== 'undefined') {
					const token = localStorage.getItem('kh_token');
					if (token) {
						OpenAPI.TOKEN = token;
						try {
							const userData = await AuthService.readMeApiAuthMeGet();
							setUser(userData);
						} catch (error) {
							// Token might be invalid, clear it
							localStorage.removeItem('kh_token');
							OpenAPI.TOKEN = '';
							setUser(null);
						}
					} else {
						setUser(null);
					}
				}
			} catch (error) {
				console.error('Error checking auth:', error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();

		// Listen for storage changes (e.g., when user logs in/out in another tab)
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'kh_token') {
				checkAuth();
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, [pathname]); // Re-check when pathname changes

	const handleSignOut = async () => {
		try {
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('kh_token');
				if (token) {
					OpenAPI.TOKEN = token;
					try {
						await AuthService.logoutApiAuthLogoutPost();
					} catch (error) {
						console.error('Logout API error (non-critical):', error);
					}
				}
				localStorage.removeItem('kh_token');
				OpenAPI.TOKEN = '';
			}
			setUser(null);
			router.push('/');
		} catch (error) {
			console.error('Error during sign out', error);
			if (typeof window !== 'undefined') {
				localStorage.removeItem('kh_token');
				OpenAPI.TOKEN = '';
			}
			setUser(null);
			router.push('/');
		}
	};

	const getUserDashboardPath = (role: string | undefined) => {
		const roleLower = role?.toLowerCase() || 'agent';
		return `/dashboard/${roleLower}`;
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<img
							src="/images/kh.png"
							alt="KeralaHomez logo"
							className="h-8 w-8 rounded-md object-contain"
						/>
						<span className="text-lg font-semibold tracking-tight">KeralaHomez</span>
					</Link>
				</div>

				<nav className="hidden items-center gap-8 md:flex">
					<Link href="#home" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">Home</Link>
					<Link href="#about" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">About Us</Link>
					<Link href="#properties" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">Properties</Link>
					<Link href="#agents" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">Agents</Link>
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					{loading ? (
						<div className="h-9 w-20 animate-pulse bg-neutral-200 rounded-md"></div>
					) : user ? (
						<div className="flex items-center gap-3">
							<Link 
								href={getUserDashboardPath(user.role)}
								className="rounded-md px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-emerald-700"
							>
								Dashboard
							</Link>
							<div className="relative group">
								<button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
									<div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
										<span className="text-emerald-600 font-semibold text-xs">
											{user.full_name.charAt(0).toUpperCase()}
										</span>
									</div>
									<span className="hidden lg:inline">{user.full_name}</span>
								</button>
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
									<div className="py-1">
										<Link
											href={`${getUserDashboardPath(user.role)}/profile`}
											className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
										>
											Profile
										</Link>
										<button
											onClick={handleSignOut}
											className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
										>
											Sign Out
										</button>
									</div>
								</div>
							</div>
						</div>
					) : (
						<>
							<Link href="/login" className="rounded-md px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-emerald-700">Login</Link>
							<Link href="/signup" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Sign Up</Link>
						</>
					)}
				</div>

				<button
					aria-label="Toggle Menu"
					className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
					onClick={() => setMobileOpen((v) => !v)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="h-6 w-6"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</button>
			</div>

			{/* Mobile menu */}
			<div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
				<div className="space-y-1 border-t border-neutral-200/60 px-4 pb-4 pt-2">
					<Link onClick={() => setMobileOpen(false)} href="#home" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Home</Link>
					<Link onClick={() => setMobileOpen(false)} href="#about" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">About Us</Link>
					<Link onClick={() => setMobileOpen(false)} href="#properties" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Properties</Link>
					<Link onClick={() => setMobileOpen(false)} href="#agents" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Agents</Link>
					{loading ? (
						<div className="mt-2 h-10 animate-pulse bg-neutral-200 rounded-md"></div>
					) : user ? (
						<div className="mt-2 space-y-2">
							<Link
								onClick={() => setMobileOpen(false)}
								href={getUserDashboardPath(user.role)}
								className="block rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
							>
								Dashboard
							</Link>
							<Link
								onClick={() => setMobileOpen(false)}
								href={`${getUserDashboardPath(user.role)}/profile`}
								className="block rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
							>
								Profile
							</Link>
							<button
								onClick={() => {
									setMobileOpen(false);
									handleSignOut();
								}}
								className="w-full rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
							>
								Sign Out
							</button>
						</div>
					) : (
						<div className="mt-2 flex gap-2">
							<Link href="/login" className="flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-100">Login</Link>
							<Link href="/signup" className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700">Sign Up</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}


