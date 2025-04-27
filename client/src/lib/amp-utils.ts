/**
 * Utility functions for AMP compatibility
 * 
 * These functions help detect and handle AMP-specific requirements
 * for Accelerated Mobile Pages support.
 */

/**
 * Check if the current page is being viewed in AMP mode
 */
export function isAmpPage(): boolean {
  // Check if we're in browser context
  if (typeof window === 'undefined') return false;
  
  // AMP pages will have the __AMP__ global
  return typeof (window as any).__AMP__ !== 'undefined';
}

/**
 * Get AMP compatible attributes for an element
 * 
 * @param elementType The type of element (e.g., 'img', 'iframe')
 */
export function getAmpAttributes(elementType: string): Record<string, string> {
  const commonAttrs = {
    'data-amp-bind': 'true',
  };
  
  const typeSpecificAttrs: Record<string, Record<string, string>> = {
    'img': {
      'layout': 'responsive',
    },
    'iframe': {
      'sandbox': 'allow-scripts allow-same-origin',
      'layout': 'responsive',
    },
    'video': {
      'controls': '',
      'layout': 'responsive',
    },
    'audio': {
      'controls': '',
    },
  };
  
  return {
    ...commonAttrs,
    ...(typeSpecificAttrs[elementType] || {}),
  };
}

/**
 * Transform a regular HTML element to its AMP equivalent
 * 
 * @param tagName The HTML tag name
 */
export function getAmpTagName(tagName: string): string {
  const ampTags: Record<string, string> = {
    'img': 'amp-img',
    'iframe': 'amp-iframe',
    'video': 'amp-video',
    'audio': 'amp-audio',
    'youtube': 'amp-youtube',
    'twitter': 'amp-twitter',
    'carousel': 'amp-carousel',
  };
  
  return ampTags[tagName] || tagName;
}

/**
 * Generate AMP-compatible schema.org structured data
 * 
 * @param type Schema type (e.g., 'Article', 'Product')
 * @param data Schema data
 */
export function generateAmpSchema(type: string, data: Record<string, any>): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
  
  return JSON.stringify(schema);
}

/**
 * Utility to construct AMP consent JSON config
 */
export function getAmpConsentConfig() {
  return {
    consentInstanceId: 's3vnstudies-consent',
    consentRequired: 'remote',
    checkConsentHref: '/api/amp/consent',
    promptUI: 'consent-ui',
  };
}