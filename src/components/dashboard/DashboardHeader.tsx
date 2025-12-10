"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/api/clientConfig";
import { AuthService } from "@/api/client";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import type { UserOut } from "@/api/client";

type UserRole = 'agent' | 'admin' | 'seller' | 'buyer';

interface HeaderProps {
  userRole: UserRole;
}

export default function DashboardHeader({ userRole }: HeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('kh_token');
          if (token) {
            OpenAPI.TOKEN = token;
            const userData = await AuthService.readMeApiAuthMeGet();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Call logout API
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
        // Clear token from localStorage
        localStorage.removeItem('kh_token');
        // Clear OpenAPI token
        OpenAPI.TOKEN = '';
      }
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Error during sign out', error);
      // Even if logout fails, clear local storage and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kh_token');
        OpenAPI.TOKEN = '';
      }
      router.push('/login');
    }
  };

  const userName = user?.full_name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-[30] h-16 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm border-b border-neutral-200">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Search */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties, users, or anything..."
                  className="w-96 rounded-lg border border-neutral-300 bg-white px-4 py-2 pl-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  suppressHydrationWarning
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-full p-2 text-neutral-600 hover:bg-neutral-100 hover:text-emerald-700"
                suppressHydrationWarning
              >
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">3</span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                        <div>
                          <p className="text-sm text-neutral-900">New inquiry received</p>
                          <p className="text-xs text-neutral-500">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                        <div>
                          <p className="text-sm text-neutral-900">Property listing approved</p>
                          <p className="text-xs text-neutral-500">1 hour ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2"></div>
                        <div>
                          <p className="text-sm text-neutral-900">Appointment scheduled</p>
                          <p className="text-xs text-neutral-500">3 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 rounded-full bg-neutral-100 p-1 pr-3 text-sm hover:bg-neutral-200"
                suppressHydrationWarning
              >
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                  {loading ? '...' : userInitial}
                </div>
                <span className="hidden md:block font-medium text-neutral-700">
                  {loading ? 'Loading...' : userName}
                </span>
                <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link 
                      href={`/dashboard/${userRole}/profile`} 
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setShowProfile(false)}
                    >
                      Your Profile
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
