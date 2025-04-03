import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import VideoCard from "@/components/videos/video-card";
import { Video } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Heart, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function VideosPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  // Set page title
  useEffect(() => {
    document.title = "Videos - S3vn Studies";
  }, []);

  // Filter videos based on search query, tab, and sort
  const filteredVideos = videos
    ? videos
        .filter((video) => {
          // Skip videos that require higher membership than user has
          if (tab !== "all") {
            if (tab === "free" && video.membershipRequired !== "free") {
              return false;
            } else if (tab === "premium" && video.membershipRequired === "free") {
              return false;
            }
          }

          // Filter by search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              video.title.toLowerCase().includes(query) ||
              (video.description && video.description.toLowerCase().includes(query))
            );
          }

          return true;
        })
        .sort((a, b) => {
          if (sortBy === "newest") {
            return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
          } else if (sortBy === "oldest") {
            return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
          } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
          }
          return 0;
        })
    : [];

  return (
    <main className="flex-1">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">Videos</h1>
          <p className="text-lg opacity-90">
            Watch our latest educational videos and tutorials
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        {user && (
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/favorites">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>My Favorites</span>
              </Button>
            </Link>
            <Link href="/watch-later">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Watch Later</span>
              </Button>
            </Link>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="mb-8"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="free">Free</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading videos...</p>
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    showLockIcon={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600">No videos found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="free" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading videos...</p>
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    showLockIcon={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600">No free videos found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="premium" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading videos...</p>
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    showLockIcon={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600">No premium videos found matching your criteria.</p>
                {!user && (
                  <p className="mt-2 text-neutral-600">
                    <a href="/auth" className="text-primary hover:underline">
                      Sign in
                    </a>{" "}
                    to access premium content.
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
