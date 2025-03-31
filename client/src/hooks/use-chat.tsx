import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, ChatRoom } from "@shared/schema";

interface UseChatOptions {
  autoConnect?: boolean;
}

interface CreateRoomData {
  name: string;
  description?: string;
  isPrivate: boolean;
}

export function useChat(options: UseChatOptions = {}) {
  const { autoConnect = true } = options;
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Connect to WebSocket
  useEffect(() => {
    if (!autoConnect || !user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      // Authenticate with the WebSocket server
      ws.send(JSON.stringify({
        type: "auth",
        payload: { userId: user.id }
      }));
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat. Please try again later.",
        variant: "destructive",
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "auth_success":
          console.log("WebSocket authenticated");
          break;
        case "room_joined":
          console.log(`Joined room ${data.payload.roomId}`);
          break;
        case "new_message":
          handleNewMessage(data.payload);
          break;
        case "error":
          toast({
            title: "Chat Error",
            description: data.payload.message,
            variant: "destructive",
          });
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [autoConnect, user, toast]);

  // Load rooms on initialization
  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/chat/rooms");
        if (!response.ok) throw new Error("Failed to fetch chat rooms");
        const data = await response.json();
        setRooms(data);

        // If we have rooms and no current room, set the first one
        if (data.length > 0 && !currentRoomId) {
          setCurrentRoomId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        toast({
          title: "Error",
          description: "Failed to load chat rooms.",
          variant: "destructive",
        });
      }
    };

    fetchRooms();
  }, [user, toast, currentRoomId]);

  // Load messages when changing rooms
  useEffect(() => {
    if (!currentRoomId || !user) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/chat/rooms/${currentRoomId}/messages`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);

        // Join the room via WebSocket
        if (socket && connected) {
          socket.send(JSON.stringify({
            type: "join_room",
            payload: { roomId: currentRoomId }
          }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentRoomId, user, socket, connected, toast]);

  const handleNewMessage = useCallback((message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const sendMessage = useCallback((roomId: number, message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "Not connected to chat. Please try again.",
        variant: "destructive",
      });
      return;
    }

    socket.send(JSON.stringify({
      type: "message",
      payload: {
        roomId,
        message
      }
    }));
  }, [socket, toast]);

  const createRoom = async (data: CreateRoomData): Promise<ChatRoom> => {
    try {
      const response = await apiRequest("POST", "/api/chat/rooms", data);
      const newRoom = await response.json();
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      return newRoom;
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  };

  const joinRoom = useCallback((roomId: number) => {
    setCurrentRoomId(roomId);
  }, []);

  return {
    connected,
    messages,
    rooms,
    currentRoomId,
    loading,
    sendMessage,
    createRoom,
    joinRoom,
  };
}
