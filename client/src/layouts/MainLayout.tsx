import { ReactNode } from "react";
import Header from "@/components/Header";
import MainFooter from "@/components/MainFooter";
import AdLayout from "@/components/ads/AdLayout";
import useAdConsent from "@/hooks/use-ad-consent";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function MainLayout({ children, className = "" }: MainLayoutProps) {
  const { consentStatus } = useAdConsent();
  const adsEnabled = consentStatus === "granted";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Header ad placement */}
      {adsEnabled && (
        <div className="w-full mt-28 mb-4">
          <AdLayout position="header" />
        </div>
      )}
      
      <main className={`flex-1 pt-4 pb-16 px-4 sm:px-6 md:px-8 ${className}`}>
        <div className="container mx-auto">
          {/* Main content with optional sidebar ad */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {children}
            </div>
            
            {/* Sidebar ad placement (desktop only) */}
            {adsEnabled && (
              <div className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-32">
                  <AdLayout position="sidebar" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer ad placement */}
      {adsEnabled && (
        <div className="w-full mb-8">
          <AdLayout position="footer" />
        </div>
      )}
      
      <MainFooter />
    </div>
  );
}