import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { storage } from "./storage";
import { InsertChatMessage } from "@shared/schema";

// Message types
interface ClientMessage {
  type: string;
  roomId: number;
  content?: string;
  userId?: number;
}

interface ServerMessage {
  type: string;
  roomId?: number;
  message?: any;
  messages?: any[];
  rooms?: any[];
  error?: string;
}

// Client connections store
interface ConnectedClient {
  ws: WebSocket;
  userId?: number;
  username?: string;
}

// Helper function to safely send a message to a client
const sendMessage = (ws: WebSocket, message: ServerMessage) => {
  try {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
  }
};

// Helper function to broadcast a message to all clients
const broadcastMessage = (clients: ConnectedClient[], message: ServerMessage) => {
  try {
    clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        sendMessage(client.ws, message);
      }
    });
  } catch (error) {
    console.error('Error broadcasting WebSocket message:', error);
  }
};

export function setupWebsockets(server: Server) {
  try {
    console.log('Setting up WebSocket server on path /ws');
    // Create WebSocket server on /ws path, not conflicting with Vite HMR which uses /@vite/client
    const wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      // Improve handling of errors at the server level
      clientTracking: true
    });
    
    // Keep track of all connected clients
    const clients: ConnectedClient[] = [];

    // Handle server errors
    wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
    
    // Setup heartbeat mechanism to detect stale connections
    const pingInterval = 30000; // 30 seconds
    const pingClients = () => {
      clients.forEach((client, i) => {
        if (client.ws.readyState !== WebSocket.OPEN) {
          clients.splice(i, 1);
          return;
        }
        
        // Set up a "pong" expectation
        // @ts-ignore - ws doesn't expose isAlive in types but it works
        if (client.ws.isAlive === false) {
          client.ws.terminate();
          clients.splice(i, 1);
          return;
        }
        
        // @ts-ignore
        client.ws.isAlive = false;
        client.ws.ping();
      });
    };
    
    // Start heartbeat interval
    const interval = setInterval(pingClients, pingInterval);
    
    // Clean up interval on server close
    wss.on('close', () => {
      clearInterval(interval);
    });
    
    wss.on('connection', (ws, req) => {
      console.log(`Client connected to websocket from ${req.socket.remoteAddress}`);
      
      // @ts-ignore - ws doesn't expose isAlive in types but it works
      ws.isAlive = true;
      
      // Handle pong messages
      ws.on('pong', () => {
        // @ts-ignore
        ws.isAlive = true;
      });
      
      // Add to clients
      const client: ConnectedClient = { ws };
      clients.push(client);
      
      // Send welcome message
      sendMessage(ws, {
        type: 'welcome',
        message: 'Connected to S3vn Studies chat server'
      });
    
      ws.on('message', async (data) => {
        try {
          const message: ClientMessage = JSON.parse(data.toString());
          
          // Handle different message types
          switch (message.type) {
            case 'auth':
              // Associate this connection with the user
              if (message.userId) {
                const user = await storage.getUser(message.userId);
                if (user) {
                  client.userId = user.id;
                  client.username = user.username;
                  
                  // Send available chat rooms
                  const tier = user.membershipTier;
                  const rooms = await storage.getChatRoomsByMembershipTier(tier);
                  sendMessage(ws, {
                    type: 'rooms',
                    rooms: rooms.map(room => ({
                      id: room.id,
                      name: room.name,
                      description: room.description
                    }))
                  });
                }
              }
              break;
              
            case 'join':
              // Join a chat room
              if (!client.userId) {
                sendMessage(ws, { type: 'error', error: 'Authentication required' });
                return;
              }
              
              try {
                const roomId = message.roomId;
                const room = await storage.getChatRoomById(roomId);
                
                if (!room) {
                  sendMessage(ws, { type: 'error', error: 'Room not found' });
                  return;
                }
                
                // Check if user has access to this room
                const user = await storage.getUser(client.userId);
                if (!user) {
                  sendMessage(ws, { type: 'error', error: 'User not found' });
                  return;
                }
                
                // Only use free and pro tiers since VIP was removed
                const tierLevels: Record<string, number> = {
                  "free": 0,
                  "pro": 1
                };
                
                const userTierLevel = tierLevels[user.membershipTier];
                const roomTierLevel = tierLevels[room.membershipRequired];
                
                if (userTierLevel < roomTierLevel) {
                  sendMessage(ws, { 
                    type: 'error', 
                    error: `This room requires ${room.membershipRequired} membership` 
                  });
                  return;
                }
                
                // Get recent messages
                const messages = await storage.getChatMessages(roomId);
                
                // Send messages to client
                sendMessage(ws, {
                  type: 'history',
                  roomId,
                  messages: await Promise.all(messages.map(async msg => {
                    const sender = await storage.getUser(msg.userId);
                    return {
                      id: msg.id,
                      content: msg.message,
                      sentAt: msg.sentAt,
                      sender: {
                        id: sender?.id,
                        username: sender?.username,
                        displayName: sender?.displayName || sender?.username
                      }
                    };
                  }))
                });
                
                // Notify client
                sendMessage(ws, {
                  type: 'joined',
                  roomId,
                  message: {
                    name: room.name,
                    description: room.description
                  }
                });
              } catch (err) {
                sendMessage(ws, { type: 'error', error: 'Failed to join room' });
              }
              break;
              
            case 'message':
              // Handle chat message
              if (!client.userId) {
                sendMessage(ws, { type: 'error', error: 'Authentication required' });
                return;
              }
              
              if (!message.content || !message.roomId) {
                sendMessage(ws, { type: 'error', error: 'Invalid message format' });
                return;
              }
              
              try {
                const roomId = message.roomId;
                const room = await storage.getChatRoomById(roomId);
                
                if (!room) {
                  sendMessage(ws, { type: 'error', error: 'Room not found' });
                  return;
                }
                
                // Save message to storage
                const chatMessage: InsertChatMessage = {
                  roomId,
                  userId: client.userId,
                  message: message.content
                };
                
                const savedMessage = await storage.createChatMessage(chatMessage);
                const sender = await storage.getUser(client.userId);
                
                // Broadcast message to all clients in the room
                broadcastMessage(clients, {
                  type: 'message',
                  roomId,
                  message: {
                    id: savedMessage.id,
                    content: savedMessage.message,
                    sentAt: savedMessage.sentAt,
                    sender: {
                      id: sender?.id,
                      username: sender?.username,
                      displayName: sender?.displayName || sender?.username
                    }
                  }
                });
              } catch (err) {
                sendMessage(ws, { type: 'error', error: 'Failed to send message' });
              }
              break;
              
            default:
              sendMessage(ws, { type: 'error', error: 'Unknown message type' });
          }
        } catch (err) {
          console.error('WebSocket error:', err);
          sendMessage(ws, { type: 'error', error: 'Invalid message format' });
        }
      });
      
      ws.on('close', () => {
        try {
          // Remove client from clients array
          const index = clients.findIndex(c => c.ws === ws);
          if (index !== -1) {
            clients.splice(index, 1);
          }
          console.log('Client disconnected from websocket');
        } catch (error) {
          console.error('Error handling WebSocket close:', error);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket connection error:', error);
        try {
          // Remove client on error
          const index = clients.findIndex(c => c.ws === ws);
          if (index !== -1) {
            clients.splice(index, 1);
          }
        } catch (err) {
          console.error('Error cleaning up after WebSocket error:', err);
        }
      });
    });
    
    return wss;
  } catch (error) {
    console.error('Fatal error setting up WebSocket server:', error);
    throw error; // Re-throw to allow server to handle this critical error
  }
}
