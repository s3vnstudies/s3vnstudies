import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type CommunityMessage = {
  author: {
    name: string;
    initials: string;
    avatarBg: string;
    membership: string;
  };
  content: string;
  timestamp: string;
  chatRoom: string;
};

export default function CommunitySection() {
  // Example community messages
  const communityMessages: CommunityMessage[] = [
    {
      author: {
        name: "John Smith",
        initials: "JS",
        avatarBg: "bg-primary",
        membership: "Pro Member",
      },
      content:
        "The discussion on critical thinking last week was eye-opening! Can't wait for the follow-up session.",
      timestamp: "2 days ago",
      chatRoom: "Philosophy Chat Room",
    },
    {
      author: {
        name: "Amanda Rodriguez",
        initials: "AR",
        avatarBg: "bg-accent",
        membership: "VIP Member",
      },
      content:
        "Just created a new chat room for anyone interested in epistemology! Join us for weekly discussions.",
      timestamp: "1 week ago",
      chatRoom: "Announcements",
    },
    {
      author: {
        name: "Michael Thomas",
        initials: "MT",
        avatarBg: "bg-neutral-700",
        membership: "Pro Member",
      },
      content:
        "The new merchandise is amazing! Just got my notebook and the quality is superb.",
      timestamp: "3 days ago",
      chatRoom: "General Discussion",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
            Community
          </span>
          <h2 className="mt-4 text-3xl font-bold font-poppins text-neutral-900">
            Join the Conversation
          </h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
            Connect with other members, share ideas, and participate in discussions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Community members"
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="space-y-6">
            {communityMessages.map((message, index) => (
              <div key={index} className="bg-neutral-50 p-6 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full ${message.author.avatarBg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-medium">{message.author.initials}</span>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{message.author.name}</h4>
                      <span 
                        className={`ml-2 text-xs ${
                          message.author.membership.includes("VIP") 
                            ? "bg-primary/10 text-primary" 
                            : "bg-secondary/10 text-secondary"
                        } px-2 py-0.5 rounded`}
                      >
                        {message.author.membership}
                      </span>
                    </div>
                    <p className="mt-1 text-neutral-600">{message.content}</p>
                    <div className="mt-2 text-sm text-neutral-500">
                      {message.timestamp} • {message.chatRoom}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center">
              <Button
                asChild
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
              >
                <Link href="/community">
                  Join Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
