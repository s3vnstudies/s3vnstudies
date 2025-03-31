import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { storage } from "./storage";
import { ChatMessage, InsertChatMessage } from "@shared/schema";

interface SocketMessage {
  type: string;
  payload: any;
}

interface ConnectedClient {
  socket: WebSocket;
  userId: number;
  rooms: Set<number>;
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Map<WebSocket, ConnectedClient>();

  wss.on('connection', (socket) => {
    console.log('WebSocket client connected');
    
    // Add to clients map without user ID until authenticated
    clients.set(socket, { socket, userId: 0, rooms: new Set() });
    
    socket.on('message', async (data) => {
      try {
        const message: SocketMessage = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'auth':
            handleAuth(socket, message.payload.userId);
            break;
          case 'join_room':
            handleJoinRoom(socket, message.payload.roomId);
            break;
          case 'leave_room':
            handleLeaveRoom(socket, message.payload.roomId);
            break;
          case 'message':
            await handleChatMessage(socket, message.payload);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
    
    socket.on('close', () => {
      const client = clients.get(socket);
      if (client) {
        clients.delete(socket);
        console.log(`WebSocket client disconnected, userId: ${client.userId}`);
      }
    });
  });
  
  function handleAuth(socket: WebSocket, userId: number) {
    const client = clients.get(socket);
    if (client) {
      client.userId = userId;
      sendToClient(socket, {
        type: 'auth_success',
        payload: { userId }
      });
    }
  }
  
  function handleJoinRoom(socket: WebSocket, roomId: number) {
    const client = clients.get(socket);
    if (client && client.userId) {
      client.rooms.add(roomId);
      sendToClient(socket, {
        type: 'room_joined',
        payload: { roomId }
      });
    } else {
      sendToClient(socket, {
        type: 'error',
        payload: { message: 'Authentication required' }
      });
    }
  }
  
  function handleLeaveRoom(socket: WebSocket, roomId: number) {
    const client = clients.get(socket);
    if (client) {
      client.rooms.delete(roomId);
      sendToClient(socket, {
        type: 'room_left',
        payload: { roomId }
      });
    }
  }
  
  async function handleChatMessage(socket: WebSocket, payload: any) {
    const client = clients.get(socket);
    if (!client || !client.userId) {
      sendToClient(socket, {
        type: 'error',
        payload: { message: 'Authentication required' }
      });
      return;
    }
    
    if (!client.rooms.has(payload.roomId)) {
      sendToClient(socket, {
        type: 'error',
        payload: { message: 'You must join the room first' }
      });
      return;
    }
    
    const messageData: InsertChatMessage = {
      roomId: payload.roomId,
      userId: client.userId,
      message: payload.message
    };
    
    try {
      const savedMessage = await storage.createChatMessage(messageData);
      broadcastToRoom(payload.roomId, {
        type: 'new_message',
        payload: savedMessage
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
      sendToClient(socket, {
        type: 'error',
        payload: { message: 'Failed to save message' }
      });
    }
  }
  
  function sendToClient(socket: WebSocket, message: SocketMessage) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }
  
  function broadcastToRoom(roomId: number, message: SocketMessage) {
    clients.forEach(client => {
      if (client.rooms.has(roomId) && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify(message));
      }
    });
  }
  
  return wss;
}
