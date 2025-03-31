import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChatRoomProps {
  className?: string;
}

export default function ChatRoom({ className }: ChatRoomProps) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const {
    connected,
    chatRooms,
    currentRoom,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    isJoining,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Chat Rooms</CardTitle>
          <CardDescription>
            You need to be logged in to access the chat rooms.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Chat Rooms</CardTitle>
        <CardDescription>
          Connect with other members in real-time discussions.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-[600px] border-t">
          {/* Rooms list */}
          <div className="w-full md:w-64 border-r">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="font-medium text-sm mb-2">Available Rooms</h3>
                <div className="space-y-2">
                  {chatRooms.length === 0 ? (
                    <p className="text-sm text-neutral-500">No chat rooms available.</p>
                  ) : (
                    chatRooms.map((room) => (
                      <Button
                        key={room.id}
                        variant={currentRoom?.id === room.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => joinRoom(room)}
                        disabled={isJoining}
                      >
                        <span className="truncate">{room.name}</span>
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {currentRoom ? (
              <>
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{currentRoom.name}</h3>
                      <p className="text-sm text-neutral-500">
                        {currentRoom.description || "No description"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={leaveRoom}
                    >
                      Leave
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  {isJoining ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Joining chat room...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-neutral-500">
                      <p>No messages yet. Be the first to start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'system' ? 'justify-center' : 'items-start'}`}>
                          {msg.type === 'system' ? (
                            <div className="bg-neutral-100 px-3 py-1 rounded-full text-sm text-neutral-600">
                              {msg.content}
                            </div>
                          ) : (
                            <>
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>
                                  {msg.username ? msg.username.substring(0, 2).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium text-sm">{msg.username}</span>
                                  <span className="ml-2 text-xs text-neutral-500">
                                    {msg.timestamp
                                      ? new Date(msg.timestamp).toLocaleTimeString()
                                      : new Date().toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="bg-neutral-100 p-3 rounded-lg mt-1 inline-block">
                                  {msg.content}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <CardFooter className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex w-full">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 mr-2"
                      disabled={!connected}
                    />
                    <Button
                      type="submit"
                      disabled={!connected || message.trim() === ""}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </form>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-500">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Select a chat room</h3>
                  <p className="text-sm">Choose a room from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
