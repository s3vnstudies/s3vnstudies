import { useState, useEffect, useRef } from "react";
import { Loader2, Send, RefreshCw, Bot, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Presenter {
  id: string;
  name: string;
  gender: string;
  thumbnail_url: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  videoUrl?: string;
  status?: "pending" | "complete" | "error";
}

export function AiAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [selectedPresenter, setSelectedPresenter] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch presenters on component mount
  useEffect(() => {
    fetchPresenters();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "Welcome to S3vn Studies AI Assistant! How can I help you today?",
          sender: "assistant"
        }
      ]);
    }
  }, [messages]);

  async function fetchPresenters() {
    try {
      const response = await apiRequest("GET", "/api/ai/presenters");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API Error");
      }
      
      const data = await response.json();
      
      // Check if we got valid presenter data
      if (!Array.isArray(data) || data.length === 0) {
        setApiError("No AI presenters available. Please check your D-ID API configuration.");
        return;
      }
      
      setPresenters(data);
      setApiError(null);
      
      // Select the first presenter by default
      setSelectedPresenter(data[0].id);
    } catch (error: any) {
      console.error("Error fetching presenters:", error);
      
      // Set a user-friendly error message
      setApiError("Unable to connect to the AI Assistant service. Please check your API configuration.");
      
      toast({
        title: "AI Service Unavailable",
        description: "Our AI assistant is currently unavailable. The administrator has been notified.",
        variant: "destructive",
      });
    }
  }

  async function createTalkRequest(text: string, presenterId: string) {
    try {
      const response = await apiRequest("POST", "/api/ai/talk", {
        text,
        presenter_id: presenterId,
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI response");
      }

      const data = await response.json();
      return data.id; // Return the talk ID for polling
    } catch (error: any) {
      console.error("Error creating talk request:", error);
      throw error;
    }
  }

  async function pollTalkStatus(talkId: string): Promise<string> {
    try {
      const response = await apiRequest("GET", `/api/ai/talk/${talkId}`);
      
      if (!response.ok) {
        throw new Error("Failed to check AI response status");
      }

      const data = await response.json();
      
      if (data.status === "done") {
        return data.result_url;
      } else if (data.status === "failed") {
        throw new Error("AI response generation failed");
      } else {
        // Still in progress, wait and poll again
        await new Promise(resolve => setTimeout(resolve, 2000));
        return pollTalkStatus(talkId);
      }
    } catch (error: any) {
      console.error("Error polling talk status:", error);
      throw error;
    }
  }

  async function handleSendMessage() {
    if (!input.trim() || isLoading || !selectedPresenter) return;

    setIsLoading(true);
    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: `user-${messageId}`,
      text: input.trim(),
      sender: "user",
    };

    const assistantMessage: Message = {
      id: `assistant-${messageId}`,
      text: "Let me think about that...",
      sender: "assistant",
      status: "pending",
    };

    // Add user message and pending assistant message
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    try {
      // Create talk request
      const talkId = await createTalkRequest(input, selectedPresenter);
      
      // Poll for result
      const videoUrl = await pollTalkStatus(talkId);
      
      // Update assistant message with video URL and mark as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, videoUrl, status: "complete" }
            : msg
        )
      );
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Update assistant message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                text: "Sorry, I encountered an error processing your request. Please try again.",
                status: "error",
              }
            : msg
        )
      );
      
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Change selected presenter
  function handlePresenterChange(presenterId: string) {
    setSelectedPresenter(presenterId);
  }

  // Handle Enter key press in textarea
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto border rounded-lg overflow-hidden">
      {/* API Error Alert */}
      {apiError && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Error</AlertTitle>
          <AlertDescription>
            {apiError}
            {user?.isAdmin && (
              <div className="mt-2 text-sm">
                <p>Admin actions:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Check the D_ID_API_KEY environment variable</li>
                  <li>Verify the D-ID API key format and permissions</li>
                  <li>Check server logs for detailed error information</li>
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={fetchPresenters}
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Retry Connection
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Presenter selection */}
      <div className="bg-muted p-4 border-b">
        <h3 className="text-sm font-medium mb-2">Choose an AI presenter:</h3>
        <div className="flex flex-wrap gap-2">
          {presenters.map((presenter) => (
            <button
              key={presenter.id}
              onClick={() => handlePresenterChange(presenter.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                selectedPresenter === presenter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <img
                src={presenter.thumbnail_url}
                alt={presenter.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              {presenter.name}
            </button>
          ))}
          {presenters.length === 0 && !apiError && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-secondary">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading presenters...
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`p-3 max-w-[80%] ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              }`}
            >
              {message.videoUrl ? (
                <div className="space-y-2">
                  <video
                    src={message.videoUrl}
                    controls
                    className="w-full rounded-md"
                    autoPlay
                  />
                  <p className="text-sm opacity-90">{message.text}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p>{message.text}</p>
                  {message.status === "pending" && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {message.status === "error" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => {
                        // Remove the last two messages (user question and error response)
                        setMessages((prev) => prev.slice(0, -2));
                        // Set the input back to the user's question
                        setInput(messages[messages.length - 2].text);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="resize-none"
            disabled={isLoading || !selectedPresenter}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim() || !selectedPresenter}
            size="icon"
            className="h-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {user ? 
            "Ask about membership, articles, or any topic on S3vn Studies." :
            "Sign in to get personalized assistance and access all features."}
        </p>
      </div>
    </div>
  );
}