import React, { useEffect, useRef } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

/**
 * AdSense Ad Component
 * 
 * Use this component to display Google AdSense ads throughout the site.
 * You must have a valid AdSense account and have been approved by Google.
 * 
 * @param adSlot - The ad slot ID from your AdSense account
 * @param adFormat - Ad format (auto, rectangle, horizontal, vertical)
 * @param style - Additional CSS styles
 * @param className - CSS class names
 * @param responsive - Whether the ad should be responsive
 */
export const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = "auto",
  style = {},
  className = "",
  responsive = true,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      // Add ad after component mounts
      if (window.adsbygoogle && adRef.current) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [adSlot]);

  const formatMap = {
    auto: { height: 90, width: 728 },
    rectangle: { height: 250, width: 300 },
    horizontal: { height: 90, width: 728 },
    vertical: { height: 600, width: 160 },
  };

  const { height, width } = formatMap[adFormat];

  return (
    <div ref={adRef} className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          height: responsive ? "auto" : height,
          width: responsive ? "100%" : width,
          ...style,
        }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={adSlot}
        data-ad-format={responsive ? "auto" : ""}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdSenseAd;