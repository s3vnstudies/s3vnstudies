import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Eye, ThumbsUp, Filter, Calendar } from "lucide-react";
import { useRoute } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

export default function VideoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [match, params] = useRoute("/videos/:id");
  const { user } = useAuth();
  
  // Fetch all videos for the listing view
  const { data: videos, isLoading: isLoadingVideos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
    enabled: !match,
  });
  
  // Fetch single video if viewing a specific video
  const { data: video, isLoading: isLoadingVideo } = useQuery<Video>({
    queryKey: [`/api/videos/${params?.id}`],
    enabled: !!match && !!params?.id,
  });
  
  const filteredVideos = videos?.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    video.description?.toLowerCase().includes(searchQuery.toLowerCase() || "")
  );
  
  const displayedVideos = filteredVideos?.filter(video => {
    if (activeTab === "premium") return video.isPremium;
    if (activeTab === "free") return !video.isPremium;
    return true;
  });
  
  // Single video details view
  if (match && params?.id) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            {isLoadingVideo ? (
              <div className="w-full max-w-4xl mx-auto">
                <div className="aspect-video bg-neutral-200 rounded-lg animate-pulse mb-6"></div>
                <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ) : !video ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Video not found</h3>
                <p className="text-neutral-500 mb-6">The video you're looking for doesn't exist or requires premium access.</p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
              </div>
            ) : (
              <div className="w-full max-w-4xl mx-auto">
                {video.isPremium && !user?.membershipTier?.includes("premium") && !user?.membershipTier?.includes("standard") ? (
                  <div className="aspect-video bg-neutral-800 rounded-lg flex flex-col items-center justify-center text-white mb-6">
                    <div className="bg-primary p-3 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <line x1="9" x2="15" y1="9" y2="15"></line>
                        <line x1="15" x2="9" y1="9" y2="15"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Premium Content</h3>
                    <p className="text-neutral-300 mb-4 text-center max-w-md">
                      This video is available to Standard and Premium members only.
                    </p>
                    <Button className="bg-primary hover:bg-primary-dark">Upgrade Membership</Button>
                  </div>
                ) : (
                  <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden mb-6">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    {video.isPremium && (
                      <Badge className="mr-2 bg-primary">Premium</Badge>
                    )}
                    <h1 className="font-heading text-2xl font-bold">{video.title}</h1>
                  </div>
                  
                  <div className="flex items-center text-neutral-500 text-sm mb-4">
                    <span className="flex items-center mr-4">
                      <Eye className="h-4 w-4 mr-1" /> {video.viewCount?.toLocaleString() || 0} views
                    </span>
                    {video.publishedAt && (
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> 
                        {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3 mb-6">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" /> Like
                    </Button>
                    <Button variant="outline" size="sm">Share</Button>
                    <Button variant="outline" size="sm">Save</Button>
                  </div>
                  
                  <div className="border-t border-b border-neutral-200 py-4 mb-4">
                    <p className="text-neutral-700 whitespace-pre-line">
                      {video.description || "No description available."}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="font-heading text-xl font-bold mb-4">Related Videos</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos?.filter(v => v.id !== video.id).slice(0, 3).map((relatedVideo) => (
                      <Card key={relatedVideo.id} className="overflow-hidden">
                        <div className="relative">
                          <div className="aspect-video bg-neutral-200">
                            <img 
                              src={relatedVideo.thumbnailUrl || `https://img.youtube.com/vi/${relatedVideo.youtubeId}/hqdefault.jpg`} 
                              alt={relatedVideo.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                          {relatedVideo.isPremium && (
                            <Badge className="absolute top-2 left-2 bg-primary">Premium</Badge>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-2 text-sm">{relatedVideo.title}</h3>
                          <div className="flex items-center text-neutral-500 text-xs mt-1">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" /> {relatedVideo.viewCount?.toLocaleString() || 0} views
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Videos listing view
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Videos Hero */}
        <section className="bg-gradient-to-r from-primary/90 to-secondary/80 text-white py-16 relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Videos</h1>
              <p className="text-lg md:text-xl opacity-90">
                Watch our latest videos, tutorials, and insights to expand your knowledge.
              </p>
            </div>
          </div>
        </section>
        
        {/* Videos Content */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <h2 className="font-heading text-2xl font-bold">Latest Videos</h2>
                <p className="text-neutral-600">Fresh content from our channel</p>
              </div>
              
              <div className="relative w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All Videos</TabsTrigger>
                <TabsTrigger value="free">Free Content</TabsTrigger>
                <TabsTrigger value="premium">Premium Content</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {isLoadingVideos ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow">
                    <div className="aspect-video bg-neutral-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-neutral-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !displayedVideos?.length ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No videos found</h3>
                <p className="text-neutral-500">
                  {searchQuery 
                    ? "Try adjusting your search to find what you're looking for." 
                    : activeTab === "premium" 
                      ? "Premium videos will appear here once published." 
                      : "Videos will appear here once published."}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedVideos.map((video) => (
                  <Card 
                    key={video.id}
                    className="overflow-hidden shadow hover:shadow-md transition duration-300 cursor-pointer"
                    onClick={() => window.location.href = `/videos/${video.id}`}
                  >
                    <div className="relative">
                      <div className="aspect-video bg-neutral-200">
                        <img 
                          src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                        <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                          <Play className="text-primary h-5 w-5 ml-1" />
                        </div>
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {video.duration}
                        </div>
                      )}
                      {video.isPremium && (
                        <Badge className="absolute top-2 left-2 bg-primary">Premium</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-heading font-bold mb-1 line-clamp-2 hover:text-primary">
                        {video.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-neutral-500">
                        <span className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" /> {video.viewCount?.toLocaleString() || 0} views
                        </span>
                        <span>
                          {video.publishedAt ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true }) : 'Recently'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {displayedVideos && displayedVideos.length > 0 && (
              <div className="mt-12 text-center">
                <Button>Load More Videos</Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
