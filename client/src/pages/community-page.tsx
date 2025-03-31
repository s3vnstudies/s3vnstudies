import { useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatRoomsList from "@/components/chat/ChatRoomsList";
import ChatRoom from "@/components/chat/ChatRoom";
import BulletinBoard from "@/components/community/BulletinBoard";
import { useAuth } from "@/hooks/use-auth";
import { ChatProvider } from "@/hooks/use-chat";
import { Users, MessageSquare, PenTool, Crown, Calendar, Link } from "lucide-react";

export default function CommunityPage() {
  const { user } = useAuth();
  
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - Community";
  }, []);

  // Upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Live Q&A Session",
      date: "June 15, 2023",
      time: "3:00 PM EST",
      description: "Join us for a live Q&A with our experts. Bring your questions!",
    },
    {
      id: 2,
      title: "Community Showcase",
      date: "June 28, 2023",
      time: "5:00 PM EST",
      description: "Members will share their projects and get feedback from the community.",
    },
    {
      id: 3,
      title: "Monthly Workshop",
      date: "July 10, 2023",
      time: "2:00 PM EST",
      description: "An interactive workshop on advanced techniques. Pro members only.",
    },
  ];

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
            <p className="text-xl mb-8">
              Connect with like-minded individuals, share ideas, and grow together
            </p>
            {!user && (
              <Button 
                className="bg-white text-primary hover:bg-gray-100"
                asChild
              >
                <a href="/auth">Sign In to Participate</a>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Membership Required Notice (for non-members) */}
      {!user && (
        <div className="bg-yellow-50 border-y border-yellow-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <Crown className="text-yellow-500 mr-2 h-5 w-5" />
              <p className="text-yellow-700">
                Some community features require membership.{" "}
                <a href="/auth" className="font-medium underline">
                  Sign up or login
                </a>{" "}
                to gain full access.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Community Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="bulletin" className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
              <TabsTrigger value="bulletin" className="flex items-center">
                <PenTool className="h-4 w-4 mr-2" /> Bulletin Board
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat Rooms
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center">
                <Users className="h-4 w-4 mr-2" /> Active Members
              </TabsTrigger>
            </TabsList>
            
            {/* Bulletin Board */}
            <TabsContent value="bulletin">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <BulletinBoard />
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>
                        Join these community events to connect with other members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-start mb-2">
                              <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <h4 className="font-bold">{event.title}</h4>
                                <p className="text-sm text-gray-500">
                                  {event.date} at {event.time}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <Button variant="outline" size="sm" className="w-full">
                              Add to Calendar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Community Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Be respectful and supportive of other members
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          No self-promotion without prior approval
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Keep discussions on-topic and constructive
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Report inappropriate content to moderators
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Respect intellectual property and cite sources
                        </li>
                      </ul>
                      <Button variant="link" className="px-0 mt-2">
                        <Link className="h-4 w-4 mr-1" /> 
                        Read Full Guidelines
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Chat Rooms */}
            <TabsContent value="chat">
              {user ? (
                <ChatProvider>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <ChatRoomsList />
                    </div>
                    <div className="md:col-span-2">
                      <ChatRoom />
                    </div>
                  </div>
                </ChatProvider>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Join the Conversation</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Sign in to participate in chat discussions with other community members.
                  </p>
                  <Button asChild>
                    <a href="/auth">Sign In to Chat</a>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Active Members */}
            <TabsContent value="members">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Leaders</CardTitle>
                    <CardDescription>
                      Meet our dedicated moderators and top contributors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                          <Avatar className="h-20 w-20 mb-3">
                            <AvatarFallback>{`L${index + 1}`}</AvatarFallback>
                          </Avatar>
                          <h4 className="font-bold text-lg">Community Leader</h4>
                          <Badge className="mt-1 mb-2 bg-primary">Moderator</Badge>
                          <p className="text-sm text-gray-500 text-center">
                            Dedicated member since Jan 2023
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Active Members</CardTitle>
                    <CardDescription>
                      Meet the people who make our community vibrant
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="grid md:grid-cols-4 gap-4">
                        {[...Array(12)].map((_, index) => (
                          <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                            <Avatar className="h-16 w-16 mb-2">
                              <AvatarFallback>{`M${index + 1}`}</AvatarFallback>
                            </Avatar>
                            <h4 className="font-medium">Member Name</h4>
                            <Badge className="mt-1" variant="outline">
                              {index % 3 === 0 ? "Pro" : index % 3 === 1 ? "Premium" : "Basic"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          Sign in to see and interact with other community members
                        </p>
                        <Button asChild>
                          <a href="/auth">Sign In</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Resources Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Community Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  New to the community? Learn how to make the most of your membership with our beginner's guide.
                </p>
                <Button variant="outline" className="w-full">Read Guide</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Share Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get constructive feedback from community members by sharing your work in progress or completed projects.
                </p>
                <Button variant="outline" className="w-full">Submit Project</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Suggest Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Help shape our content by suggesting topics for future articles, videos, and workshops.
                </p>
                <Button variant="outline" className="w-full">Submit Ideas</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community to connect with like-minded individuals, share ideas, and grow together.
          </p>
          {user ? (
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-accent hover:bg-gray-100"
              onClick={() => document.getElementById("bulletin-tab")?.click()}
            >
              Start Participating
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-accent hover:bg-gray-100"
              asChild
            >
              <a href="/auth">Join the Community</a>
            </Button>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
