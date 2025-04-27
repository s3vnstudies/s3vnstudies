import React from "react";
import AdSenseAd from "./AdSenseAd";
import useAdConsent from "@/hooks/use-ad-consent";

interface AdLayoutProps {
  position: "header" | "footer" | "sidebar" | "in-article" | "responsive";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Ad Layout Component
 * 
 * This component provides standardized ad placements across the site
 * with appropriate sizing and responsive behavior.
 * 
 * @param position - Where the ad should be placed
 * @param className - Additional CSS classes
 * @param style - Additional CSS styles
 */
export const AdLayout: React.FC<AdLayoutProps> = ({
  position,
  className = "",
  style = {},
}) => {
  const { consentStatus } = useAdConsent();
  
  // Only show ads if consent is granted
  if (consentStatus !== "granted") {
    return null;
  }

  // Configuration for different ad positions
  const adConfig = {
    // These are example ad slots - you'll need to replace with actual AdSense slots
    header: {
      adSlot: "1234567890",
      adFormat: "horizontal" as const,
      className: "w-full max-w-6xl mx-auto my-4 overflow-hidden",
    },
    footer: {
      adSlot: "2345678901",
      adFormat: "horizontal" as const,
      className: "w-full max-w-6xl mx-auto my-4 overflow-hidden",
    },
    sidebar: {
      adSlot: "3456789012",
      adFormat: "vertical" as const,
      className: "w-full mb-6 overflow-hidden",
    },
    "in-article": {
      adSlot: "4567890123",
      adFormat: "rectangle" as const,
      className: "w-full my-6 overflow-hidden float-right ml-4 md:ml-6 mb-4",
    },
    responsive: {
      adSlot: "5678901234",
      adFormat: "auto" as const,
      className: "w-full my-6 overflow-hidden",
    },
  };

  const config = adConfig[position];

  return (
    <div className={`ad-layout ad-${position} ${className}`} style={style}>
      {/* Add data-ad-status attribute for AMP compliance */}
      <div data-ad-status="idle">
        <AdSenseAd
          adSlot={config.adSlot}
          adFormat={config.adFormat}
          className={config.className}
          responsive={position === "responsive"}
        />
      </div>
      {/* Optional ad label for transparency */}
      <div className="text-xs text-gray-400 text-center mt-1">Advertisement</div>
    </div>
  );
};

export default AdLayout;