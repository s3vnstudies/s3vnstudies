import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Eye, ArrowRight } from "lucide-react";
import { formatDistance } from "date-fns";

export default function LatestVideos() {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos?limit=4"],
  });
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2">Latest Videos</h2>
            <p className="text-neutral-600">Fresh content from our YouTube channel</p>
          </div>
          <Link href="/videos">
            <a className="text-primary font-semibold hover:underline hidden md:flex items-center">
              View All Videos <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeleton loaders
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300">
                <div className="relative pb-[56.25%] bg-neutral-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="bg-neutral-200 h-5 w-3/4 rounded mb-1 animate-pulse"></div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="bg-neutral-200 h-4 w-16 rounded animate-pulse"></div>
                    <div className="bg-neutral-200 h-4 w-16 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            videos?.map((video) => (
              <Card 
                key={video.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="pb-[56.25%] bg-neutral-200">
                    <img 
                      src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link href={`/videos/${video.id}`}>
                      <a className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition">
                        <Play className="text-primary h-5 w-5 ml-1" />
                      </a>
                    </Link>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                      {video.duration}
                    </div>
                  )}
                  {video.isPremium && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      Premium
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <Link href={`/videos/${video.id}`}>
                    <a>
                      <h3 className="font-heading font-bold mb-1 line-clamp-2 hover:text-primary">
                        {video.title}
                      </h3>
                    </a>
                  </Link>
                  <div className="flex justify-between items-center text-sm text-neutral-500">
                    <span className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" /> {video.viewCount || 0} views
                    </span>
                    <span>
                      {video.publishedAt ? formatDistance(new Date(video.publishedAt), new Date(), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/videos">
            <a className="inline-block text-primary font-semibold hover:underline flex items-center justify-center">
              View All Videos <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
