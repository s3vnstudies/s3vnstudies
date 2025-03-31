import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './use-auth';

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
      setConnecting(true);
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        setConnecting(false);
        
        // Authenticate with the server
        socket.send(JSON.stringify({
          type: 'auth',
          userId: user.id
        }));
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        setConnecting(false);
        
        // Try to reconnect after a delay
        setTimeout(() => {
          if (socketRef.current?.readyState !== WebSocket.OPEN) {
            connect();
          }
        }, 3000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onmessage = (event) => {
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
      };

      socketRef.current = socket;
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [user]);

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
