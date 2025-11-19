"use client";

import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Extract user role from pathname
  const getUserRole = () => {
    if (pathname.includes('/agent')) return 'agent';
    if (pathname.includes('/admin')) return 'admin';
    if (pathname.includes('/seller')) return 'seller';
    if (pathname.includes('/buyer')) return 'buyer';
    return 'agent'; // default
  };

  const userRole = getUserRole();

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <DashboardSidebar userRole={userRole} />
      <div className="lg:pl-64">
        <DashboardHeader userRole={userRole} />
        <main className="pt-2 pb-8 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
