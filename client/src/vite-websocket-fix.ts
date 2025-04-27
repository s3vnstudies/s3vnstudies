// This script patches the Vite HMR WebSocket creation to prevent DOMException errors

// Run this at startup
export function applyViteWebSocketFix() {
  try {
    // Patch WebSocket constructor to handle Vite's special case
    const originalWebSocket = window.WebSocket;
    
    // @ts-ignore - We need to override the WebSocket constructor
    window.WebSocket = function(url: string, protocols?: string | string[]) {
      // Check if this is a Vite HMR WebSocket connection
      if (typeof url === 'string' && (
          url.includes('localhost:undefined') || 
          url.includes('vite-hmr') ||
          url.includes('?token=')
        )) {
        console.log('[WebSocket Fix] Patching invalid Vite WebSocket URL:', url);
        
        // Fix the URL by using the current host instead of localhost:undefined
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const fixedUrl = `${protocol}//${window.location.host}`;
        
        console.log('[WebSocket Fix] Fixed URL:', fixedUrl);
        
        // Use the fixed URL
        return new originalWebSocket(fixedUrl, protocols);
      }
      
      // Otherwise use original constructor
      return new originalWebSocket(url, protocols);
    };
    
    // Copy all prototype methods and properties
    window.WebSocket.prototype = originalWebSocket.prototype;
    
    // Copy static properties
    Object.defineProperties(window.WebSocket, Object.getOwnPropertyDescriptors(originalWebSocket));
    
    console.log('[WebSocket Fix] Successfully applied WebSocket constructor patch');
  } catch (error) {
    console.error('[WebSocket Fix] Failed to apply WebSocket patch:', error);
  }
}