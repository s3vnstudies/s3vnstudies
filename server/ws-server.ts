import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { storage } from "./storage";
import { verify } from "./auth-token";
import { insertChatMessageSchema } from "@shared/schema";

interface WSClientData {
  userId?: number;
  username?: string;
  isAuthenticated: boolean;
}

// Messages from client to server
interface ClientMessage {
  type: string;
  payload: any;
}

// Messages from server to client
interface ServerMessage {
  type: string;
  payload: any;
}

// Utility to verify session token (simplified for demo)
function verify(token: string): { userId: number; username: string } | null {
  // In real app, verify JWT or session token
  // For demo, simply decode Base64
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return { userId: decoded.userId, username: decoded.username };
  } catch {
    return null;
  }
}

export function setupWebSocketServer(server: Server) {
  // Create WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Store connected clients
  const clients = new Map<WebSocket, WSClientData>();

  wss.on('connection', (ws) => {
    // Initialize client data
    clients.set(ws, { isAuthenticated: false });
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'CONNECTION_ESTABLISHED',
      payload: { message: 'Connected to S3VN Studies Chat' }
    } as ServerMessage));

    ws.on('message', async (message) => {
      try {
        const data: ClientMessage = JSON.parse(message.toString());
        const clientData = clients.get(ws);
        
        if (!clientData) {
          ws.close();
          return;
        }

        // Handle different message types
        switch (data.type) {
          case 'AUTHENTICATE':
            // Authenticate user with token
            const authToken = data.payload.token;
            if (!authToken) {
              sendError(ws, 'Authentication required');
              return;
            }
            
            const userData = verify(authToken);
            if (!userData) {
              sendError(ws, 'Invalid authentication token');
              return;
            }
            
            // Update client data
            clients.set(ws, {
              userId: userData.userId,
              username: userData.username,
              isAuthenticated: true
            });
            
            // Send success response
            ws.send(JSON.stringify({
              type: 'AUTHENTICATION_SUCCESS',
              payload: { userId: userData.userId, username: userData.username }
            } as ServerMessage));
            
            break;
            
          case 'JOIN_ROOM':
            // User wants to join a chat room
            if (!clientData.isAuthenticated) {
              sendError(ws, 'Authentication required');
              return;
            }
            
            const roomId = data.payload.roomId;
            if (!roomId) {
              sendError(ws, 'Room ID required');
              return;
            }
            
            // Check if room exists
            const room = await storage.getChatRoomById(roomId);
            if (!room) {
              sendError(ws, 'Chat room not found');
              return;
            }
            
            // Load recent messages
            const messages = await storage.getChatMessages(roomId, 50);
            
            // Enrich messages with user data
            const enrichedMessages = await Promise.all(messages.map(async (message) => {
              const user = await storage.getUser(message.userId);
              return {
                ...message,
                user: user ? {
                  username: user.username,
                  avatarUrl: user.avatarUrl,
                  role: user.role
                } : { username: "Unknown User", avatarUrl: "", role: "member" }
              };
            }));
            
            // Send room info and messages
            ws.send(JSON.stringify({
              type: 'ROOM_JOINED',
              payload: {
                room,
                messages: enrichedMessages
              }
            } as ServerMessage));
            
            break;
            
          case 'SEND_MESSAGE':
            // User is sending a message
            if (!clientData.isAuthenticated || !clientData.userId) {
              sendError(ws, 'Authentication required');
              return;
            }
            
            const { roomId: messageRoomId, message: messageText } = data.payload;
            
            if (!messageRoomId || !messageText) {
              sendError(ws, 'Room ID and message required');
              return;
            }
            
            // Validate and save message
            try {
              const messageData = insertChatMessageSchema.parse({
                roomId: messageRoomId,
                userId: clientData.userId,
                message: messageText
              });
              
              const savedMessage = await storage.createChatMessage(messageData);
              
              // Get user data for enrichment
              const user = await storage.getUser(clientData.userId);
              
              // Broadcast message to all connected clients
              const broadcastMessage: ServerMessage = {
                type: 'NEW_MESSAGE',
                payload: {
                  ...savedMessage,
                  user: user ? {
                    username: user.username,
                    avatarUrl: user.avatarUrl,
                    role: user.role
                  } : { username: "Unknown User", avatarUrl: "", role: "member" }
                }
              };
              
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(broadcastMessage));
                }
              });
            } catch (error) {
              sendError(ws, 'Invalid message data');
            }
            
            break;
            
          default:
            sendError(ws, 'Unknown message type');
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        sendError(ws, 'Invalid message format');
      }
    });

    ws.on('close', () => {
      // Clean up when connection closes
      clients.delete(ws);
    });
  });

  // Helper function to send error messages
  function sendError(ws: WebSocket, message: string) {
    ws.send(JSON.stringify({
      type: 'ERROR',
      payload: { message }
    } as ServerMessage));
  }

  console.log('WebSocket server initialized');
  return wss;
}
