import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import ChatRoom from "@/components/chat/chat-room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Lock } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Set page title
  useEffect(() => {
    document.title = "Chat - S3vn Studies";
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-neutral-600 mb-6">
              Please sign in to access the chat rooms and connect with other members.
            </p>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout withoutFooter>
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-center mb-2">
            <MessageSquare className="h-6 w-6 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold font-poppins">Chat Rooms</h1>
          </div>
          <p className="text-sm md:text-base opacity-90">
            Connect with other members in real-time conversations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-neutral-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <span>S3vn Studies Community Chat</span>
              {user.membershipTier !== "free" && (
                <div className="flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  <span className="capitalize">{user.membershipTier}</span>
                  <Lock className="h-3 w-3 ml-1" />
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChatRoom />
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-neutral-600">
          <h3 className="font-semibold mb-2">Chat Guidelines:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be respectful and kind to other members</li>
            <li>No harassment, hate speech, or inappropriate content</li>
            <li>Stay on topic in specialized chat rooms</li>
            <li>Do not share personal information in public chats</li>
            <li>Respect the privacy of other members</li>
          </ul>
          <p className="mt-4">
            <strong>Note:</strong> Chat messages are not encrypted and may be monitored by moderators.
            For a full list of community guidelines, please visit our{" "}
            <a href="/policies" className="text-primary hover:underline">
              Policies page
            </a>
            .
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
