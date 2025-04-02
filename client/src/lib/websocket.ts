import { useEffect, useState, useRef, useCallback } from 'react';

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

// Chat message object structure
export interface ChatMessage {
  id: number;
  content: string;
  roomId: number;
  userId: number;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    profilePicture?: string;
  };
}

// Chat room structure
export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  creatorId: number;
  isPrivate: boolean;
  createdAt: string;
}

// Create a WebSocket connection
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    const cleanup = () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
    
    try {
      // Clean up any existing connection
      cleanup();
      
      // Create WebSocket connection with the correct path
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      
      console.log("Connecting to WebSocket at:", wsUrl);
      
      try {
        socketRef.current = new WebSocket(wsUrl);
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setIsConnected(false);
        return;
      }
      
      if (socketRef.current) {
        // Connection opened
        socketRef.current.addEventListener('open', () => {
          console.log('Connected to WebSocket server');
          setIsConnected(true);
        });
        
        // Listen for messages
        socketRef.current.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketMessage;
            
            // Handle different message types
            switch (data.type) {
              case 'rooms_list':
                setRooms(data.rooms || []);
                break;
              
              case 'room_joined':
                setCurrentRoom(data.room);
                setMessages(data.messages || []);
                break;
              
              case 'new_message':
                setMessages(prevMessages => [...prevMessages, data.message]);
                break;
                
              default:
                console.log('Unknown message type:', data.type);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });
        
        // Connection closed
        socketRef.current.addEventListener('close', () => {
          console.log('Disconnected from WebSocket server');
          setIsConnected(false);
          
          // Try to reconnect after a delay
          setTimeout(() => {
            if (socketRef.current?.readyState === WebSocket.CLOSED) {
              connectWebSocket();
            }
          }, 3000);
        });
        
        // Connection error
        socketRef.current.addEventListener('error', (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        });
      }
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
    }
    
    return cleanup;
  }, []);

  // Initialize WebSocket on component mount
  useEffect(() => {
    // Only connect when explicitly requested
    // Don't auto-connect by default
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Join a chat room
  const joinRoom = useCallback((roomId: number) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'join_room',
        roomId
      }));
    }
  }, []);

  // Send a message
  const sendMessage = useCallback((message: string, roomId: number, userId: number) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat_message',
        message,
        roomId,
        userId
      }));
    }
  }, []);

  return {
    isConnected,
    messages,
    rooms,
    currentRoom,
    joinRoom,
    sendMessage,
    connect: connectWebSocket
  };
}
