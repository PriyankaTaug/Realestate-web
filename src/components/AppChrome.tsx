"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppChrome({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

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

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
