import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ChatInterface from "@/components/community/chat-interface";
import BulletinBoard from "@/components/community/bulletin-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, BulletinPost, ChatRoom } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, MessageSquare, Users, Bell } from "lucide-react";

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");
  
  // Fetch active users
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users/active"],
    // This endpoint doesn't exist yet, but illustrates how we'd fetch active users
    enabled: false,
  });
  
  // Fetch chat rooms
  const { data: chatRooms } = useQuery<ChatRoom[]>({
    queryKey: ["/api/chat-rooms"],
  });
  
  return (
    <>
      <Helmet>
        <title>Community - S3VN Studies</title>
        <meta name="description" content="Connect with fellow creators in our community. Chat in topic-based rooms, share ideas, and collaborate on projects." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-20">
          {/* Header Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">Community Hub</h1>
                <p className="text-xl opacity-90">
                  Connect with fellow creators, participate in discussions, and grow together in our vibrant community.
                </p>
              </div>
            </div>
          </section>
          
          {/* Member Welcome */}
          <section className="py-8 bg-light-100">
            <div className="container mx-auto px-4">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Welcome, {user?.displayName || user?.username}!</CardTitle>
                  <CardDescription>
                    Connect with {chatRooms?.length || 0} active rooms and our growing community of creators.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-end">
                  <Button variant="outline" className="mr-2">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
          
          {/* Community Tabs */}
          <section className="py-8 bg-light-100">
            <div className="container mx-auto px-4">
              <Tabs 
                defaultValue="chat" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat" className="text-base">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat Rooms
                  </TabsTrigger>
                  <TabsTrigger value="bulletin" className="text-base">
                    <Bell className="h-4 w-4 mr-2" />
                    Bulletin Board
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="border-none p-0">
                  <ChatInterface />
                </TabsContent>
                
                <TabsContent value="bulletin" className="border-none p-0">
                  <BulletinBoard />
                </TabsContent>
              </Tabs>
            </div>
          </section>
          
          {/* Upcoming Events */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-poppins font-bold mb-8">Upcoming Community Events</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm text-gray-500">This Friday, 7:00 PM EST</span>
                    </div>
                    <CardTitle>Live Q&A Session</CardTitle>
                    <CardDescription>
                      Join our monthly Q&A session where we answer your questions about content creation.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                      Add to Calendar
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm text-gray-500">Next Tuesday, 6:00 PM EST</span>
                    </div>
                    <CardTitle>Workshop: Advanced Editing</CardTitle>
                    <CardDescription>
                      Learn advanced editing techniques to take your content to the next level.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                      RSVP Now
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm text-gray-500">Next Saturday, 3:00 PM EST</span>
                    </div>
                    <CardTitle>Community Showcase</CardTitle>
                    <CardDescription>
                      Share your work and get feedback from fellow community members.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                      Submit Work
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>
          
          {/* Featured Members */}
          <section className="py-16 bg-light-100">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-poppins font-bold mb-8">Featured Community Members</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 30}.jpg`} alt="Member" />
                          <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-medium mb-1">
                          {i === 1 ? "Sarah Johnson" : i === 2 ? "Michael Thomas" : i === 3 ? "Emily Chen" : "David Wilson"}
                        </h3>
                        <p className="text-gray-500 mb-3">
                          {i === 1 ? "Content Strategist" : i === 2 ? "Video Editor" : i === 3 ? "Community Leader" : "Photography Expert"}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          {i === 1 
                            ? "Helped over 50 community members with content strategy in the past month." 
                            : i === 2 
                            ? "Created a free resource library of video transitions for the community."
                            : i === 3
                            ? "Organized our most successful community event with over 200 participants."
                            : "Regularly hosts photo critique sessions for community members."}
                        </p>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          
          {/* Community Guidelines */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-bold mb-4">Community Guidelines</h2>
                    <p className="opacity-90 mb-4">
                      Our community thrives on respect, collaboration, and support. Please review our community guidelines to help maintain a positive environment for everyone.
                    </p>
                    <Button className="bg-white text-primary hover:shadow-lg transition-shadow">
                      Read Guidelines
                    </Button>
                  </div>
                  <div className="hidden md:block relative">
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Community collaboration" 
                      className="w-full h-auto rounded-xl relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
