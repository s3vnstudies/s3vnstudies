import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatRoom, ChatMessage, BulletinPost, User } from "@shared/schema";
import { User as UserIcon, Clock, Users, PlayCircle, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CommunityShowcase() {
  const { data: chatRooms } = useQuery<ChatRoom[]>({
    queryKey: ["/api/chat/rooms"],
  });
  
  const { data: bulletinPosts } = useQuery<BulletinPost[]>({
    queryKey: ["/api/bulletin?limit=3"],
  });
  
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Our Community</h2>
          <p className="text-neutral-600 text-lg">Connect with like-minded individuals and grow together in our vibrant community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Community Chat Preview */}
          <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-primary p-4 text-white">
              <h3 className="font-heading text-xl font-bold">Community Chat</h3>
              <p className="text-sm opacity-90">Join discussions in various chat rooms</p>
            </CardHeader>
            <CardContent className="p-4 h-64 overflow-hidden relative">
              {!chatRooms || chatRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-10 w-10 text-neutral-300 mb-2" />
                  <p className="text-neutral-500">No chat messages yet</p>
                  <p className="text-sm text-neutral-400">Be the first to start a conversation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
                      <AvatarFallback className="bg-neutral-200">S</AvatarFallback>
                    </Avatar>
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-[85%]">
                      <div className="font-medium text-sm mb-1">Sarah Johnson</div>
                      <p className="text-sm">Has anyone tried the new creative thinking technique from yesterday's video?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary-light text-white rounded-lg p-3 max-w-[85%]">
                      <div className="font-medium text-sm mb-1">You</div>
                      <p className="text-sm">Yes! It helped me brainstorm some great ideas for my project!</p>
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-neutral-200">
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" />
                      <AvatarFallback className="bg-neutral-200">M</AvatarFallback>
                    </Avatar>
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-[85%]">
                      <div className="font-medium text-sm mb-1">Michael Roberts</div>
                      <p className="text-sm">I'm hosting a study group in Room #3 if anyone wants to join!</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
            </CardContent>
            <CardFooter className="p-4 border-t border-neutral-200">
              <Link href="/chat">
                <a className="w-full">
                  <Button className="w-full py-3 bg-primary text-white text-center font-semibold rounded-lg hover:bg-primary-dark transition">
                    Join Chat Rooms
                  </Button>
                </a>
              </Link>
            </CardFooter>
          </Card>

          {/* Bulletin Board Preview */}
          <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-secondary p-4 text-white">
              <h3 className="font-heading text-xl font-bold">Bulletin Board</h3>
              <p className="text-sm opacity-90">Community announcements and updates</p>
            </CardHeader>
            <CardContent className="p-4 h-64 overflow-y-auto custom-scrollbar">
              {!bulletinPosts || bulletinPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-10 w-10 text-neutral-300 mb-2" />
                  <p className="text-neutral-500">No bulletin posts yet</p>
                  <p className="text-sm text-neutral-400">Check back soon for announcements</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-heading font-bold">Weekend Workshop 🎨</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      Join us for a creative workshop this Saturday at 2 PM EST. We'll be exploring visual storytelling techniques.
                    </p>
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>Posted by Admin</span>
                      <span>Today</span>
                    </div>
                  </div>
                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-heading font-bold">New Course Launch 🚀</h4>
                      <span className="text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded">2d ago</span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      We're excited to announce our new course on "Advanced Data Visualization" launching next week!
                    </p>
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>Posted by Admin</span>
                      <span>2 days ago</span>
                    </div>
                  </div>
                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-heading font-bold">Community Challenge 🏆</h4>
                      <span className="text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded">5d ago</span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      This month's challenge: Create a personal productivity system and share your results with the community.
                    </p>
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>Posted by Admin</span>
                      <span>5 days ago</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 border-t border-neutral-200">
              <Link href="/bulletin">
                <a className="w-full">
                  <Button variant="secondary" className="w-full py-3 text-white text-center font-semibold rounded-lg transition">
                    View Bulletin Board
                  </Button>
                </a>
              </Link>
            </CardFooter>
          </Card>

          {/* Community Stats */}
          <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-accent p-4 text-white">
              <h3 className="font-heading text-xl font-bold">Community Stats</h3>
              <p className="text-sm opacity-90">Our growing community by the numbers</p>
            </CardHeader>
            <CardContent className="p-6 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">5,280+</div>
                  <div className="text-sm text-neutral-600">Community Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">24</div>
                  <div className="text-sm text-neutral-600">Active Chat Rooms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">142</div>
                  <div className="text-sm text-neutral-600">Videos Released</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-800 mb-1">93%</div>
                  <div className="text-sm text-neutral-600">Member Satisfaction</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="text-center">
                  <div className="text-sm text-neutral-600 mb-2">Top Active Members This Month</div>
                  <div className="flex justify-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" />
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" />
                      <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 flex items-center justify-center text-xs font-medium bg-neutral-300">
                      +12
                    </Avatar>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t border-neutral-200">
              <Link href="/membership">
                <a className="w-full">
                  <Button className="w-full py-3 bg-accent text-white text-center font-semibold rounded-lg hover:bg-accent-dark transition">
                    View Community
                  </Button>
                </a>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
