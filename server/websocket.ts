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

export function setupWebsockets(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  // Keep track of all connected clients
  const clients: ConnectedClient[] = [];
  
  wss.on('connection', (ws) => {
    console.log('Client connected to websocket');
    
    // Add to clients
    const client: ConnectedClient = { ws };
    clients.push(client);
    
    // Send welcome message
    send(ws, {
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
                send(ws, {
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
              send(ws, { type: 'error', error: 'Authentication required' });
              return;
            }
            
            try {
              const roomId = message.roomId;
              const room = await storage.getChatRoomById(roomId);
              
              if (!room) {
                send(ws, { type: 'error', error: 'Room not found' });
                return;
              }
              
              // Check if user has access to this room
              const user = await storage.getUser(client.userId);
              if (!user) {
                send(ws, { type: 'error', error: 'User not found' });
                return;
              }
              
              const tierLevels: Record<string, number> = {
                "free": 0,
                "pro": 1,
                "vip": 2
              };
              
              const userTierLevel = tierLevels[user.membershipTier];
              const roomTierLevel = tierLevels[room.membershipRequired];
              
              if (userTierLevel < roomTierLevel) {
                send(ws, { 
                  type: 'error', 
                  error: `This room requires ${room.membershipRequired} membership` 
                });
                return;
              }
              
              // Get recent messages
              const messages = await storage.getChatMessages(roomId);
              
              // Send messages to client
              send(ws, {
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
              send(ws, {
                type: 'joined',
                roomId,
                message: {
                  name: room.name,
                  description: room.description
                }
              });
            } catch (err) {
              send(ws, { type: 'error', error: 'Failed to join room' });
            }
            break;
            
          case 'message':
            // Handle chat message
            if (!client.userId) {
              send(ws, { type: 'error', error: 'Authentication required' });
              return;
            }
            
            if (!message.content || !message.roomId) {
              send(ws, { type: 'error', error: 'Invalid message format' });
              return;
            }
            
            try {
              const roomId = message.roomId;
              const room = await storage.getChatRoomById(roomId);
              
              if (!room) {
                send(ws, { type: 'error', error: 'Room not found' });
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
              broadcast({
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
              send(ws, { type: 'error', error: 'Failed to send message' });
            }
            break;
            
          default:
            send(ws, { type: 'error', error: 'Unknown message type' });
        }
      } catch (err) {
        console.error('WebSocket error:', err);
        send(ws, { type: 'error', error: 'Invalid message format' });
      }
    });
    
    ws.on('close', () => {
      // Remove client from clients array
      const index = clients.findIndex(c => c.ws === ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log('Client disconnected from websocket');
    });
  });
  
  // Helper functions
  function send(ws: WebSocket, message: ServerMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
  
  function broadcast(message: ServerMessage) {
    clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        send(client.ws, message);
      }
    });
  }
  
  return wss;
}
