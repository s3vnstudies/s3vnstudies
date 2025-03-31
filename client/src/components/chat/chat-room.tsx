import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "lucide-react";
import MessageList from "./message-list";

export default function ChatRoom() {
  const { user } = useAuth();
  const { connected, connecting, messages, rooms, currentRoom, sendMessage, joinRoom } = useWebSocket();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && connected && currentRoom) {
      sendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  // Get room name from current room ID
  const currentRoomName = rooms.find(room => room.id === currentRoom)?.name || "";

  if (connecting) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center max-w-md px-4">
          <p className="text-neutral-600 mb-4">
            Could not connect to the chat server. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Retry Connection</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white rounded-lg shadow-md border">
      <Tabs defaultValue={currentRoom?.toString() || "rooms"} className="h-full flex flex-col">
        <div className="p-4 border-b">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="rooms" onClick={() => setMessageInput("")}>
              Rooms
            </TabsTrigger>
            {rooms.map((room) => (
              <TabsTrigger 
                key={room.id} 
                value={room.id.toString()}
                onClick={() => joinRoom(room.id)}
              >
                {room.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="rooms" className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div 
                key={room.id} 
                className="p-4 border rounded-lg hover:bg-neutral-50 cursor-pointer"
                onClick={() => {
                  joinRoom(room.id);
                  document.querySelector(`[data-value="${room.id}"]`)?.click();
                }}
              >
                <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                <p className="text-sm text-neutral-600">
                  {room.description || "Join this room to start chatting"}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        {rooms.map((room) => (
          <TabsContent 
            key={room.id} 
            value={room.id.toString()}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList messages={currentRoom === room.id ? messages : []} />
              <div ref={messagesEndRef} />
            </div>

            <form 
              className="p-4 border-t flex items-center space-x-2"
              onSubmit={handleSendMessage}
            >
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${currentRoomName}...`}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!messageInput.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
