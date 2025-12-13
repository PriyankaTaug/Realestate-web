"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppChrome({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isPropertyPage = pathname.startsWith("/property/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kh_token');
      setIsLoggedIn(!!token);
    }
  }, [pathname]);

  useEffect(() => {
    // Handle unhandled promise rejections to prevent console errors
    // when API calls fail and aren't caught
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      // Check if this is an API error that should be suppressed
      const isApiError = error?.name === 'ApiError' || 
                        error?.message?.includes('API') ||
                        error?.message?.includes('Validation Error');
      
      const debugAPI = process.env.NEXT_PUBLIC_DEBUG_API === 'true';
      
      // For other errors, log them if debug mode is on
      if (debugAPI && isApiError) {
        console.warn('[Unhandled API Error]', error);
      }
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (isDashboard) {
    // Dashboard renders its own header/sidebar; do not render public header/footer
    return <>{children}</>;
  }

  // If user is logged in and viewing a property page, don't show public header/footer
  // (property page will show dashboard header/sidebar)
  if (isPropertyPage && isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
