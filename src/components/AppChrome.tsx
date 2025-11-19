"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppChrome({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

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
