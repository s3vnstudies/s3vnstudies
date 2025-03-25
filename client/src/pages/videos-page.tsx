import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import VideoCard from "@/components/videos/video-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchYouTubeVideos } from "@/lib/youtube-api";
import { Video } from "@shared/schema";
import { Loader2 } from "lucide-react";

// Define a type for YouTube videos
interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration?: string;
  viewCount?: string;
}

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch platform videos
  const { 
    data: platformVideos, 
    isLoading: isPlatformLoading, 
    error: platformError 
  } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });
  
  // Fetch YouTube videos
  const {
    data: youtubeVideos,
    isLoading: isYoutubeLoading,
    error: youtubeError
  } = useQuery<YouTubeVideo[]>({
    queryKey: ["youtube-videos"],
    queryFn: () => fetchYouTubeVideos(12),
  });
  
  // Filter videos based on search term
  const filteredPlatformVideos = platformVideos?.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredYoutubeVideos = youtubeVideos?.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter premium videos
  const premiumVideos = platformVideos?.filter(video => video.isPremium);
  
  return (
    <>
      <Helmet>
        <title>Videos - S3VN Studies</title>
        <meta name="description" content="Watch our latest videos on content creation, digital marketing, and creative techniques. Access premium tutorials and in-depth guidance." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-20">
          {/* Header Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">Videos & Tutorials</h1>
                <p className="text-xl opacity-90">
                  Explore our collection of videos, tutorials, and guides to enhance your skills and knowledge.
                </p>
              </div>
            </div>
          </section>
          
          {/* Search Section */}
          <section className="py-8 bg-light-100">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-grow">
                  <Input
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Tabs 
                    defaultValue="all" 
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 w-[300px]">
                      <TabsTrigger value="all">All Videos</TabsTrigger>
                      <TabsTrigger value="platform">Exclusive</TabsTrigger>
                      <TabsTrigger value="youtube">YouTube</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </section>
          
          {/* Videos Grid */}
          <section className="py-12 bg-light-100">
            <div className="container mx-auto px-4">
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                className="w-full"
              >
                <TabsContent value="all">
                  {(isPlatformLoading || isYoutubeLoading) ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : (platformError || youtubeError) ? (
                    <div className="text-center py-20">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading videos</h3>
                      <p className="text-gray-600">Please try again later.</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-poppins font-bold mb-6">Latest Videos</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {/* Display platform videos first, then YouTube videos */}
                        {filteredPlatformVideos?.slice(0, 3).map(video => (
                          <VideoCard 
                            key={`platform-${video.id}`} 
                            video={video} 
                            type="platform"
                          />
                        ))}
                        {filteredYoutubeVideos?.slice(0, 6 - (filteredPlatformVideos?.slice(0, 3).length || 0)).map(video => (
                          <VideoCard 
                            key={`youtube-${video.id}`} 
                            video={video as any} 
                            type="youtube"
                          />
                        ))}
                      </div>
                      
                      {premiumVideos && premiumVideos.length > 0 && (
                        <>
                          <h2 className="text-2xl font-poppins font-bold mb-6">Premium Content</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {premiumVideos.slice(0, 3).map(video => (
                              <VideoCard 
                                key={`premium-${video.id}`} 
                                video={video} 
                                type="platform"
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="platform">
                  {isPlatformLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : platformError ? (
                    <div className="text-center py-20">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading videos</h3>
                      <p className="text-gray-600">Please try again later.</p>
                    </div>
                  ) : filteredPlatformVideos?.length === 0 ? (
                    <div className="text-center py-20">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No videos found</h3>
                      <p className="text-gray-600">Try adjusting your search term.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredPlatformVideos?.map(video => (
                        <VideoCard 
                          key={`platform-${video.id}`} 
                          video={video} 
                          type="platform"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="youtube">
                  {isYoutubeLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : youtubeError ? (
                    <div className="text-center py-20">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading YouTube videos</h3>
                      <p className="text-gray-600">Please try again later.</p>
                    </div>
                  ) : filteredYoutubeVideos?.length === 0 ? (
                    <div className="text-center py-20">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No videos found</h3>
                      <p className="text-gray-600">Try adjusting your search term.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredYoutubeVideos?.map(video => (
                        <VideoCard 
                          key={`youtube-${video.id}`} 
                          video={video as any} 
                          type="youtube"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="mt-12 flex justify-center">
                <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-shadow">
                  Load More Videos
                </Button>
              </div>
            </div>
          </section>
          
          {/* Subscribe CTA */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-accent to-accent/80 text-white rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-bold mb-4">Get Exclusive Content</h2>
                    <p className="opacity-90 mb-6">
                      Join our membership to get access to premium video tutorials, behind-the-scenes content, and early access to new releases.
                    </p>
                    <Button className="bg-white text-accent hover:shadow-lg transition-shadow">
                      Become a Member
                    </Button>
                  </div>
                  <div className="hidden md:block relative">
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Content creators collaborating" 
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
