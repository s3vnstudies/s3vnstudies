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
      // Get the current window location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // Always use host which includes hostname and port automatically
      const wsUrl = `${protocol}//${window.location.host}${path}`;
      
      console.log(`WebSocketManager: Creating new WebSocket connection to ${wsUrl}`);
      
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