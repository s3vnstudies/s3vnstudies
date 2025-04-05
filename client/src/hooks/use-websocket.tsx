import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import WebSocketManager from '@/lib/websocket-manager';

interface Message {
  id?: number;
  roomId: number;
  content: string;
  sentAt: Date;
  sender: {
    id?: number;
    username?: string;
    displayName: string;
  };
}

interface Room {
  id: number;
  name: string;
  description?: string;
}

interface WebSocketHook {
  connected: boolean;
  connecting: boolean;
  messages: Message[];
  rooms: Room[];
  currentRoom: number | null;
  sendMessage: (content: string) => void;
  joinRoom: (roomId: number) => void;
}

export function useWebSocket(): WebSocketHook {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;

    const connect = () => {
      try {
        setConnecting(true);
        
        // Use the WebSocketManager instead of creating a new WebSocket directly
        const socket = WebSocketManager.getOrCreateSocket('/ws');
        
        if (!socket) {
          console.error('Failed to create WebSocket connection');
          setConnecting(false);
          
          // Try to reconnect after a delay
          setTimeout(connect, 5000);
          return;
        }
        
        const setupHandlers = () => {
          // Authenticate with the server
          socket.send(JSON.stringify({
            type: 'auth',
            userId: user.id
          }));
          
          console.log('WebSocket connected and authenticated');
          setConnected(true);
          setConnecting(false);
        };
        
        // Message handler function
        const messageHandler = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'welcome':
                console.log('Welcome message:', data.message);
                break;
                
              case 'rooms':
                if (data.rooms && Array.isArray(data.rooms)) {
                  setRooms(data.rooms);
                }
                break;
                
              case 'joined':
                if (data.roomId) {
                  setCurrentRoom(data.roomId);
                }
                break;
                
              case 'history':
                if (data.messages && Array.isArray(data.messages)) {
                  setMessages(data.messages);
                }
                break;
                
              case 'message':
                if (data.roomId === currentRoom && data.message) {
                  setMessages(prev => [...prev, data.message]);
                }
                break;
                
              case 'error':
                console.error('WebSocket error message:', data.error);
                break;
                
              default:
                console.log('Unknown message type:', data);
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };
        
        const closeHandler = () => {
          console.log('WebSocket disconnected');
          setConnected(false);
          setConnecting(false);
          
          // Try to reconnect after a delay
          setTimeout(connect, 3000);
        };

        const errorHandler = (error: Event) => {
          console.error('WebSocket error:', error);
          setConnected(false);
          setConnecting(false);
        };
        
        // Handle connection already being open
        if (socket.readyState === WebSocket.OPEN) {
          setupHandlers();
        } else {
          // If socket is still connecting, set up handlers for when it opens
          const openHandler = () => {
            setupHandlers();
            socket.removeEventListener('open', openHandler);
          };
          socket.addEventListener('open', openHandler);
        }
        
        socket.addEventListener('close', closeHandler);
        socket.addEventListener('error', errorHandler);
        socket.addEventListener('message', messageHandler);

        socketRef.current = socket;
        
        // Cleanup function to remove event listeners
        return () => {
          if (socket.readyState !== WebSocket.OPEN) {
            const openHandler = () => { setupHandlers(); };
            socket.removeEventListener('open', openHandler);
          }
          socket.removeEventListener('close', closeHandler);
          socket.removeEventListener('error', errorHandler);
          socket.removeEventListener('message', messageHandler);
        };
      } catch (error) {
        console.error('Error setting up WebSocket connection:', error);
        setConnecting(false);
        
        // Try to reconnect after a delay
        setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      // We don't manually close the socket here since WebSocketManager handles the lifecycle
      socketRef.current = null;
    };
  }, [user, currentRoom]);

  // Join a chat room
  const joinRoom = useCallback((roomId: number) => {
    if (!connected || !socketRef.current) return;
    
    socketRef.current.send(JSON.stringify({
      type: 'join',
      roomId
    }));
    
    // Clear previous messages when joining a new room
    setMessages([]);
  }, [connected]);

  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (!connected || !socketRef.current || !currentRoom) return;
    
    socketRef.current.send(JSON.stringify({
      type: 'message',
      roomId: currentRoom,
      content
    }));
  }, [connected, currentRoom]);

  return {
    connected,
    connecting,
    messages,
    rooms,
    currentRoom,
    sendMessage,
    joinRoom
  };
}
