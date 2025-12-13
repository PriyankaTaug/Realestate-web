"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  MdDashboard, 
  MdHome, 
  MdPeople, 
  MdBusiness, 
  MdTrendingUp, 
  MdSettings, 
  MdMessage, 
  MdPerson,
  MdFavorite 
} from "react-icons/md";

type UserRole = 'agent' | 'admin' | 'seller' | 'buyer';

interface SidebarProps {
  userRole: UserRole;
}

const navigationConfig = {
  agent: [
    { name: 'Dashboard', href: '/dashboard/agent', icon: MdDashboard },
    { name: 'My Listings', href: '/dashboard/agent/listings', icon: MdHome },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: MdDashboard },
    { name: 'Users', href: '/dashboard/admin/users', icon: MdPeople },
    { name: 'Properties', href: '/dashboard/admin/properties', icon: MdHome },
    { name: 'Agents', href: '/dashboard/admin/agents', icon: MdBusiness },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: MdTrendingUp },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: MdSettings },
  ],
  seller: [
    { name: 'Dashboard', href: '/dashboard/seller', icon: MdDashboard },
    { name: 'My Properties', href: '/dashboard/seller/properties', icon: MdHome },
    { name: 'Inquiries', href: '/dashboard/seller/inquiries', icon: MdMessage },
    { name: 'Profile', href: '/dashboard/seller/profile', icon: MdPerson },
  ],
  buyer: [
    { name: 'Dashboard', href: '/dashboard/buyer', icon: MdDashboard },
    { name: 'Saved Properties', href: '/dashboard/buyer/saved', icon: MdFavorite },
    { name: 'Profile', href: '/dashboard/buyer/profile', icon: MdPerson },
  ],
};

export default function DashboardSidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = navigationConfig[userRole];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-[60] rounded-md bg-white p-2 shadow-lg"
        >
          <span className="sr-only">Open sidebar</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[50] w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-neutral-200">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/kh.png"
              alt="KeralaHomez logo"
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold tracking-tight">KeralaHomez</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-emerald-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="text-lg" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User role badge */}
        <div className="absolute bottom-4 left-3 right-3">
          <div className="rounded-lg bg-neutral-100 p-3">
            <p className="text-xs font-medium text-neutral-600">Logged in as</p>
            <p className="text-sm font-semibold capitalize text-neutral-900">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[40] bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
