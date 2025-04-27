import { useState, useEffect } from 'react';

type ConsentStatus = 'pending' | 'granted' | 'denied';

/**
 * Hook for managing ad consent in compliance with privacy regulations
 * This hook helps manage user consent for personalized ads
 */
export function useAdConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => {
    // Check local storage for saved consent
    const savedConsent = localStorage.getItem('ad_consent');
    return savedConsent ? (savedConsent as ConsentStatus) : 'pending';
  });

  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  // Initialize consent modal if status is pending
  useEffect(() => {
    if (consentStatus === 'pending') {
      setIsConsentModalOpen(true);
    }
  }, [consentStatus]);

  // Save consent status to local storage when it changes
  useEffect(() => {
    localStorage.setItem('ad_consent', consentStatus);
    
    // If consent is granted, initialize personalized ads
    if (consentStatus === 'granted') {
      try {
        // Set consent for Google's Additional Consent Mode
        // @ts-ignore
        if (window.googlefc && window.googlefc.setConsent) {
          // @ts-ignore
          window.googlefc.setConsent({
            ad_storage: 'granted',
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'granted',
            security_storage: 'granted',
          });
        }
      } catch (error) {
        console.error('Error setting ad consent:', error);
      }
    }
  }, [consentStatus]);

  // Function to grant consent
  const grantConsent = () => {
    setConsentStatus('granted');
    setIsConsentModalOpen(false);
  };

  // Function to deny consent
  const denyConsent = () => {
    setConsentStatus('denied');
    setIsConsentModalOpen(false);
  };

  // Function to open consent modal
  const openConsentModal = () => {
    setIsConsentModalOpen(true);
  };

  return {
    consentStatus,
    isConsentModalOpen,
    grantConsent,
    denyConsent,
    openConsentModal,
    setIsConsentModalOpen,
  };
}

export default useAdConsent;