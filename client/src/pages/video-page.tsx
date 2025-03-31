import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Search, Clock, ExternalLink, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { YouTubeVideo } from "@shared/types";
import {
  fetchYouTubeVideos,
  formatDuration,
  formatViewCount,
  formatPublishedDate,
} from "@/lib/youtube-api";

export default function VideoPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - Videos";
  }, []);
  
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setIsLoading(true);
        const result = await fetchYouTubeVideos(12);
        setVideos(result.videos);
        setFeaturedVideo(result.videos[0] || null);
        setNextPageToken(result.nextPageToken);
      } catch (err) {
        setError("Failed to load videos. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      setIsLoading(true);
      // In a real implementation, this would pass the search term to the YouTube API
      // For now, we'll just filter our existing videos
      const result = await fetchYouTubeVideos(12);
      const filteredVideos = result.videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVideos(filteredVideos.length > 0 ? filteredVideos : result.videos);
      setFeaturedVideo(filteredVideos[0] || result.videos[0] || null);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMoreVideos = async () => {
    if (!nextPageToken) return;
    
    try {
      setIsLoadingMore(true);
      const result = await fetchYouTubeVideos(8, nextPageToken);
      setVideos(prev => [...prev, ...result.videos]);
      setNextPageToken(result.nextPageToken);
    } catch (err) {
      console.error("Error loading more videos:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  const filteredVideos = searchTerm.trim() 
    ? videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : videos;

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="bg-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">S3vn Studies Video Channel</h1>
            <p className="text-xl mb-8">
              Explore our latest videos, tutorials, and educational content
            </p>
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <Input
                placeholder="Search videos..."
                className="pl-10 py-6 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Button type="submit" className="absolute right-1 top-1 bottom-1">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Featured Video Section */}
      {featuredVideo && !isLoading && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured Video</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <a 
                  href={`https://www.youtube.com/watch?v=${featuredVideo.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img 
                    src={featuredVideo.thumbnail} 
                    alt={featuredVideo.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="outline" className="bg-dark/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border-0">
                      {formatDuration(featuredVideo.duration)}
                    </Badge>
                  </div>
                </a>
              </div>
              
              <div>
                <Badge className="mb-2">{formatPublishedDate(featuredVideo.publishedAt)}</Badge>
                <h3 className="text-2xl font-bold mb-4">{featuredVideo.title}</h3>
                <p className="text-gray-600 mb-6">{featuredVideo.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span className="flex items-center mr-4">
                    <Clock className="mr-1 h-4 w-4" /> {formatDuration(featuredVideo.duration)}
                  </span>
                  <span>{formatViewCount(featuredVideo.viewCount)}</span>
                </div>
                <Button asChild>
                  <a 
                    href={`https://www.youtube.com/watch?v=${featuredVideo.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Watch Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Video Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Videos</h2>
            <a 
              href="https://youtube.com/@s3vnstudies" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-primary font-medium"
            >
              <i className="fab fa-youtube text-xl mr-2"></i> Visit Channel <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Videos</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <div className="aspect-video bg-gray-200"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mt-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              ) : filteredVideos.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video) => (
                      <Card 
                        key={video.id} 
                        className="overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="relative aspect-video bg-gray-200">
                          <a 
                            href={`https://www.youtube.com/watch?v=${video.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                                <Play className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2">
                              <Badge variant="outline" className="bg-dark/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border-0">
                                {formatDuration(video.duration)}
                              </Badge>
                            </div>
                          </a>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-2 line-clamp-2">{video.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{formatViewCount(video.viewCount)}</span>
                            <span>{formatPublishedDate(video.publishedAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {nextPageToken && (
                    <div className="text-center mt-8">
                      <Button 
                        onClick={loadMoreVideos} 
                        variant="outline" 
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More Videos <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">No videos found</p>
                  <p className="text-sm text-gray-400 mb-6">Try different search terms</p>
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* These tabs would typically be populated with filtered YouTube API results */}
            {["tutorials", "interviews", "workshops"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Coming soon! Check back for {tab} videos.</p>
                  <Button onClick={() => document.getElementById("all-tab")?.click()}>
                    View All Videos
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* Subscribe Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Channel</h2>
            <p className="text-xl mb-8">
              Never miss a new video - subscribe to our YouTube channel for notifications
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <a 
                href="https://youtube.com/@s3vnstudies?sub_confirmation=1" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-youtube mr-2"></i> Subscribe Now
              </a>
            </Button>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
