import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { useQuery } from "@tanstack/react-query";

interface ChatRoom {
  id: number;
  name: string;
  description: string;
  membersTier: string;
}

interface Message {
  type: 'message' | 'system';
  roomId: number;
  userId: number;
  username?: string;
  avatar?: string;
  content: string;
  timestamp?: Date;
}

export function useChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isJoining, setIsJoining] = useState(false);

  // Fetch available chat rooms
  const { data: chatRooms = [] } = useQuery<ChatRoom[]>({
    queryKey: ["/api/chat/rooms"],
    queryFn: async ({ queryKey }) => {
      if (!user) return [];
      
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      
      return await res.json();
    },
    enabled: !!user,
  });

  // Initialize WebSocket connection using the WebSocketManager
  useEffect(() => {
    if (!user) return;

    try {
      // Import the WebSocketManager to use the shared connection
      import('@/lib/websocket-manager').then((module) => {
        const WebSocketManager = module.default;
        
        // Get or create a WebSocket connection using the manager
        const ws = WebSocketManager.getOrCreateSocket('/ws');
        
        if (!ws) {
          throw new Error('Failed to create WebSocket connection');
        }
        
        const setupSocket = () => {
          console.log("Chat WebSocket connected successfully");
          setSocket(ws);
          setConnected(true);
          
          // Setup message handler
          const messageHandler = (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              
              switch (data.type) {
                case 'message':
                case 'system':
                  setMessages(prev => [...prev, data]);
                  break;
                case 'joined':
                  setIsJoining(false);
                  toast({
                    title: "Joined Chat Room",
                    description: `You have joined ${data.roomName}`,
                  });
                  break;
                case 'error':
                  toast({
                    title: "Chat Error",
                    description: data.content,
                    variant: "destructive",
                  });
                  break;
              }
            } catch (error) {
              console.error("Error processing WebSocket message:", error);
            }
          };
          
          // Setup close handler
          const closeHandler = () => {
            console.log("Chat WebSocket connection closed");
            setSocket(null);
            setConnected(false);
            setCurrentRoom(null);
          };
          
          // Setup error handler
          const errorHandler = (error: Event) => {
            console.error("Chat WebSocket error:", error);
            toast({
              title: "Connection Error",
              description: "Failed to connect to chat server",
              variant: "destructive",
            });
          };
          
          // Add event listeners
          ws.addEventListener('message', messageHandler);
          ws.addEventListener('close', closeHandler);
          ws.addEventListener('error', errorHandler);
          
          // Return cleanup function
          return () => {
            ws.removeEventListener('message', messageHandler);
            ws.removeEventListener('close', closeHandler);
            ws.removeEventListener('error', errorHandler);
          };
        };
        
        // If the socket is already open, setup immediately
        if (ws.readyState === WebSocket.OPEN) {
          const cleanup = setupSocket();
          return () => {
            cleanup && cleanup();
          };
        }
        
        // Otherwise, wait for it to open
        const openHandler = () => {
          const cleanup = setupSocket();
          ws.removeEventListener('open', openHandler);
        };
        
        ws.addEventListener('open', openHandler);
        
        // Return cleanup function
        return () => {
          ws.removeEventListener('open', openHandler);
        };
      }).catch(error => {
        console.error("Error importing WebSocketManager:", error);
        toast({
          title: "Connection Error",
          description: "Failed to setup chat connection",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error("Error setting up chat WebSocket:", error);
      toast({
        title: "Connection Error",
        description: "Failed to setup chat connection",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Join a chat room
  const joinRoom = useCallback((room: ChatRoom) => {
    if (!socket || !user) return;

    setIsJoining(true);
    setMessages([]);
    setCurrentRoom(room);
    
    socket.send(JSON.stringify({
      type: 'join',
      userId: user.id,
      roomId: room.id
    }));
  }, [socket, user]);

  // Leave the current room
  const leaveRoom = useCallback(() => {
    if (!socket || !currentRoom) return;
    
    socket.send(JSON.stringify({
      type: 'leave'
    }));
    
    setCurrentRoom(null);
    setMessages([]);
  }, [socket, currentRoom]);

  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (!socket || !user || !currentRoom || !connected) return;
    
    if (!content.trim()) return;
    
    socket.send(JSON.stringify({
      type: 'message',
      content
    }));
  }, [socket, user, currentRoom, connected]);

  // Get room-specific messages
  const roomMessages = useMemo(() => {
    if (!currentRoom) return [];
    return messages.filter(msg => msg.roomId === currentRoom.id);
  }, [messages, currentRoom]);

  return {
    connected,
    chatRooms,
    currentRoom,
    messages: roomMessages,
    joinRoom,
    leaveRoom,
    sendMessage,
    isJoining
  };
}
