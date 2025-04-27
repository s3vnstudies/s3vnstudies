import React, { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  responsive?: boolean;
}

/**
 * AdSense Advertisement Component
 * 
 * This component renders Google AdSense advertisements with proper
 * initialization and responsive behavior.
 */
const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = 'auto',
  className = '',
  responsive = true,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
  
  useEffect(() => {
    // Skip in dev environment if no client ID is set
    if (clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
      if (adRef.current) {
        adRef.current.innerHTML = '<div style="background-color: #f0f0f0; padding: 16px; text-align: center; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border: 1px dashed #ccc; border-radius: 4px;">Advertisement Placeholder</div>';
      }
      return;
    }
    
    try {
      // Initialize ads when the component mounts
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error initializing AdSense ad:', error);
    }
  }, [clientId]);
  
  // Don't render real ads if we don't have a valid client ID
  if (clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <div
        ref={adRef}
        className={`adsense-placeholder ${className}`}
      />
    );
  }
  
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
      ref={adRef}
    />
  );
};

export default AdSenseAd;