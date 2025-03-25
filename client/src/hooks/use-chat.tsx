import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { ChatRoom, ChatMessage } from "@shared/schema";

// Message with user information
interface EnrichedChatMessage extends ChatMessage {
  user: {
    username: string;
    avatarUrl: string;
    role: string;
  };
}

interface ChatContextType {
  connected: boolean;
  connecting: boolean;
  currentRoom: ChatRoom | null;
  messages: EnrichedChatMessage[];
  sendMessage: (roomId: number, message: string) => void;
  joinRoom: (roomId: number) => void;
  error: string | null;
}

interface ServerMessage {
  type: string;
  payload: any;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<EnrichedChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (user && !socket && !connecting) {
      connectWebSocket();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user]);

  const connectWebSocket = () => {
    setConnecting(true);
    setError(null);

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      setSocket(newSocket);
      setConnecting(false);
      setConnected(true);

      // Authenticate with the WebSocket server
      if (user) {
        const authToken = Buffer.from(
          JSON.stringify({ userId: user.id, username: user.username })
        ).toString("base64");

        newSocket.send(
          JSON.stringify({
            type: "AUTHENTICATE",
            payload: { token: authToken },
          })
        );
      }
    };

    newSocket.onmessage = (event) => {
      try {
        const message: ServerMessage = JSON.parse(event.data);
        handleServerMessage(message);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    newSocket.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error");
      setConnected(false);
      setConnecting(false);
    };

    newSocket.onclose = () => {
      setConnected(false);
      setConnecting(false);
      setSocket(null);

      // Try to reconnect after a delay
      setTimeout(() => {
        if (user) {
          connectWebSocket();
        }
      }, 3000);
    };
  };

  const handleServerMessage = (message: ServerMessage) => {
    switch (message.type) {
      case "CONNECTION_ESTABLISHED":
        console.log("WebSocket connection established");
        break;

      case "AUTHENTICATION_SUCCESS":
        console.log("WebSocket authentication successful");
        break;

      case "ROOM_JOINED":
        setCurrentRoom(message.payload.room);
        setMessages(message.payload.messages);
        break;

      case "NEW_MESSAGE":
        setMessages((prev) => [...prev, message.payload]);
        break;

      case "ERROR":
        setError(message.payload.message);
        toast({
          title: "Chat Error",
          description: message.payload.message,
          variant: "destructive",
        });
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  };

  const joinRoom = (roomId: number) => {
    if (!connected || !socket) {
      setError("Not connected to chat server");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "JOIN_ROOM",
        payload: { roomId },
      })
    );
  };

  const sendMessage = (roomId: number, messageText: string) => {
    if (!connected || !socket) {
      setError("Not connected to chat server");
      return;
    }

    if (!messageText.trim()) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "SEND_MESSAGE",
        payload: { roomId, message: messageText },
      })
    );
  };

  return (
    <ChatContext.Provider
      value={{
        connected,
        connecting,
        currentRoom,
        messages,
        sendMessage,
        joinRoom,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
