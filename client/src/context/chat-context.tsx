import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { ChatRoom, ChatMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage extends ChatMessage {
  user?: {
    id: number;
    username: string;
    displayName: string | null;
    avatar: string | null;
  } | null;
}

interface ChatContextType {
  isConnected: boolean;
  rooms: ChatRoom[];
  currentRoomId: number | null;
  messages: ChatMessage[];
  isLoadingRooms: boolean;
  isLoadingMessages: boolean;
  createRoom: (name: string, description?: string) => Promise<ChatRoom>;
  joinRoom: (roomId: number) => void;
  sendMessage: (content: string) => void;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  
  // Connect to WebSocket
  useEffect(() => {
    if (!user) {
      // Not authenticated, don't connect
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }
    
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;
        
        socket.onopen = () => {
          setIsConnected(true);
          setError(null);
          
          // Authenticate with the WebSocket server
          socket.send(JSON.stringify({
            type: 'auth',
            payload: { userId: user.id }
          }));
        };
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'new_message':
                setMessages(prev => [...prev, data.payload]);
                break;
              case 'chat_history':
                if (data.payload.roomId === currentRoomId) {
                  setMessages(data.payload.messages);
                  setIsLoadingMessages(false);
                }
                break;
              case 'error':
                setError(data.payload.message);
                toast({
                  title: "Chat Error",
                  description: data.payload.message,
                  variant: "destructive",
                });
                break;
              default:
                break;
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };
        
        socket.onclose = () => {
          setIsConnected(false);
          
          // Attempt to reconnect after a delay
          setTimeout(connectWebSocket, 3000);
        };
        
        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
          setError("Connection error. Please try again later.");
          socket.close();
        };
      } catch (err) {
        console.error("Failed to connect to WebSocket:", err);
        setError("Failed to connect to chat. Please try again later.");
      }
    };
    
    connectWebSocket();
    
    // Fetch rooms
    fetchRooms();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [user]);
  
  // Fetch chat rooms
  const fetchRooms = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingRooms(true);
    try {
      const res = await apiRequest("GET", "/api/chat-rooms");
      const data = await res.json();
      setRooms(data);
      
      // If there's at least one room and no current room, set the first one as current
      if (data.length > 0 && !currentRoomId) {
        setCurrentRoomId(data[0].id);
        joinRoom(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch chat rooms:", err);
      setError("Failed to fetch chat rooms");
    } finally {
      setIsLoadingRooms(false);
    }
  }, [user, currentRoomId]);
  
  const createRoom = async (name: string, description?: string): Promise<ChatRoom> => {
    if (!user) {
      throw new Error("You must be logged in to create a chat room");
    }
    
    try {
      const res = await apiRequest("POST", "/api/chat-rooms", {
        name,
        description,
        isPrivate: false
      });
      
      const newRoom = await res.json();
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      console.error("Failed to create chat room:", err);
      throw new Error("Failed to create chat room");
    }
  };
  
  const joinRoom = useCallback((roomId: number) => {
    if (!user || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    
    setCurrentRoomId(roomId);
    setIsLoadingMessages(true);
    
    socketRef.current.send(JSON.stringify({
      type: 'join_room',
      payload: { roomId, userId: user.id }
    }));
  }, [user]);
  
  const sendMessage = (content: string) => {
    if (!user || !currentRoomId || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    
    socketRef.current.send(JSON.stringify({
      type: 'chat_message',
      payload: {
        roomId: currentRoomId,
        userId: user.id,
        content
      }
    }));
  };
  
  return (
    <ChatContext.Provider
      value={{
        isConnected,
        rooms,
        currentRoomId,
        messages,
        isLoadingRooms,
        isLoadingMessages,
        createRoom,
        joinRoom,
        sendMessage,
        error
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
