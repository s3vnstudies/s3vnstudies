import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import ContentCard from "@/components/ContentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, PlayCircle } from "lucide-react";
import { Video } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function VideosPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, free, premium
  
  // Fetch videos
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });
  
  // Filter videos based on search query and filter
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = 
      filter === "all" || 
      (filter === "free" && !video.isPremium) || 
      (filter === "premium" && video.isPremium);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight mb-6">
            Video Library
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Explore our collection of educational videos, tutorials, and webinars to boost your knowledge and skills.
          </p>
          <div className="mt-8 flex justify-center">
            <a 
              href="https://youtube.com/@s3vnstudies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-medium hover:shadow-lg transition-shadow"
            >
              <PlayCircle className="h-5 w-5" />
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative md:w-1/2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search videos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Videos</SelectItem>
                  <SelectItem value="free">Free Videos</SelectItem>
                  <SelectItem value="premium">Premium Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Premium Banner */}
      {!user && (
        <section className="py-8 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Unlock Premium Videos</h3>
                  <p className="opacity-90">Join our membership to access exclusive premium content and tutorials.</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/membership">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      Become a Member
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Videos Grid Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-medium text-slate-700 mb-4">No videos found</h3>
              <p className="text-slate-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-poppins font-bold">
                  {filter === "all" 
                    ? "All Videos" 
                    : filter === "free" 
                      ? "Free Videos" 
                      : "Premium Videos"}
                  {searchQuery && ` matching "${searchQuery}"`}
                </h2>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <ContentCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    description={video.description || ""}
                    imageUrl={video.thumbnailUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    type="video"
                    date={video.publishedAt || video.createdAt}
                    isPremium={video.isPremium}
                    duration={video.duration}
                    link={`/videos/${video.id}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Featured Playlists */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-poppins font-bold mb-8">Featured Playlists</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-100 rounded-xl overflow-hidden shadow-md">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Beginner's Guide Playlist" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <PlayCircle className="h-12 w-12" />
                    <span className="text-lg font-semibold">10 Videos</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-poppins font-semibold mb-2">Beginner's Guide</h3>
                <p className="text-slate-700 mb-4">Start your journey with these foundational tutorials designed for beginners.</p>
                <Button variant="outline" className="w-full">View Playlist</Button>
              </div>
            </div>
            
            <div className="bg-slate-100 rounded-xl overflow-hidden shadow-md">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Advanced Techniques Playlist" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <PlayCircle className="h-12 w-12" />
                    <span className="text-lg font-semibold">8 Videos</span>
                  </div>
                </div>
                <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary">Premium</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-poppins font-semibold mb-2">Advanced Techniques</h3>
                <p className="text-slate-700 mb-4">Take your skills to the next level with these advanced tutorials and techniques.</p>
                <Button variant="outline" className="w-full">View Playlist</Button>
              </div>
            </div>
            
            <div className="bg-slate-100 rounded-xl overflow-hidden shadow-md">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Community Spotlight Playlist" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <PlayCircle className="h-12 w-12" />
                    <span className="text-lg font-semibold">6 Videos</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-poppins font-semibold mb-2">Community Spotlight</h3>
                <p className="text-slate-700 mb-4">Featuring success stories and projects from our community members.</p>
                <Button variant="outline" className="w-full">View Playlist</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
