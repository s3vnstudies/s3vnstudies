// We need to use browser's WebSocket, not the Node.js one
// No need to import WebSocket since it's built into browser

// A singleton WebSocket connection manager to ensure we only have one connection
class WebSocketManager {
  private static instance: WebSocketManager;
  private sockets: Map<string, WebSocket> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  // Get or create a WebSocket connection with proper error handling
  public getOrCreateSocket(path: string = '/ws'): WebSocket | null {
    // If we already have a socket for this path that's open, return it
    const existingSocket = this.sockets.get(path);
    if (existingSocket && existingSocket.readyState === WebSocket.OPEN) {
      return existingSocket;
    }

    // If there's a socket but it's not open, remove it
    if (existingSocket) {
      this.removeSocket(path);
    }

    try {
      // We need to handle the custom URL format for Replit environment
      // Ignore any Vite client WebSocket connections which use a different format
      if (path.includes('vite') || path.includes('hmr')) {
        console.log("WebSocketManager: Ignoring Vite client WebSocket connection");
        return null;
      }
      
      // Get the current window location 
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      
      // Always use the full current host which includes hostname and port automatically
      // In Replit, window.location.host looks like: 4343a48d-cfcf-4da5-8802-39d3db73a15a-00-qhevoi3duwbd.janeway.replit.dev
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}${path}`;
      
      console.log(`WebSocketManager: Creating new WebSocket connection to ${wsUrl}`);
      
      // Explicitly check URL validity to prevent DOMException
      try {
        // Test URL constructor to validate before creating the WebSocket
        new URL(wsUrl);
      } catch (urlError) {
        console.error(`WebSocketManager: Invalid WebSocket URL: ${wsUrl}`, urlError);
        return null;
      }
      
      const socket = new WebSocket(wsUrl);
      
      // Store the socket
      this.sockets.set(path, socket);
      
      // Set up default error handler
      socket.addEventListener('error', (event) => {
        console.error(`WebSocketManager: Socket error for ${path}`, event);
        this.removeSocket(path);
      });
      
      // Set up default close handler
      socket.addEventListener('close', (event) => {
        console.log(`WebSocketManager: Socket closed for ${path}`, event);
        this.removeSocket(path);
      });
      
      return socket;
    } catch (error) {
      console.error(`WebSocketManager: Failed to create WebSocket for ${path}`, error);
      return null;
    }
  }
  
  // Remove a socket from the manager
  public removeSocket(path: string): void {
    const socket = this.sockets.get(path);
    if (socket) {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      this.sockets.delete(path);
    }
  }
  
  // Close all sockets
  public closeAll(): void {
    this.sockets.forEach((socket, path) => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    });
    this.sockets.clear();
  }
}

export default WebSocketManager.getInstance();