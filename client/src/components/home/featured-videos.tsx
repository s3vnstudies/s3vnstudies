import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play, Clock, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function FeaturedVideos() {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Function to format duration from seconds
  const formatDuration = (duration: string) => {
    if (!duration) return "00:00";
    return duration;
  };

  return (
    <section id="videos" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <span className="bg-accent/10 text-accent text-sm font-medium px-4 py-1.5 rounded-full">
              Videos
            </span>
            <h2 className="mt-4 text-3xl font-bold font-poppins text-neutral-900">
              Latest Videos
            </h2>
            <p className="mt-2 text-neutral-600 max-w-2xl">
              Check out our latest video content from the S3vn Studies channel
            </p>
          </div>
          <a
            href="https://youtube.com/@s3vnstudies"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center text-accent font-medium hover:underline"
          >
            View YouTube Channel
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-neutral-50">
                    <div className="aspect-video relative">
                      <Skeleton className="absolute inset-0" />
                    </div>
                    <CardContent className="p-5">
                      <Skeleton className="h-6 w-full mb-3 mt-2" />
                      <div className="flex items-center text-sm text-neutral-500 mb-3">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                  </Card>
                ))
            : videos?.slice(0, 3).map((video) => (
                <Card
                  key={video.id}
                  className="bg-neutral-50 rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg"
                >
                  <div className="aspect-video relative">
                    <img
                      src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <Link href={`/videos/${video.id}`}>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary ml-1" />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg line-clamp-2 mb-2 font-poppins">
                      {video.title}
                    </h3>
                    <div className="flex items-center text-sm text-neutral-500 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(video.duration || "")}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(video.publishDate)}</span>
                      {/* Example view count */}
                      <span className="mx-2">•</span>
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{Math.floor(Math.random() * 5000) + 500} views</span>
                    </div>
                    <p className="text-neutral-600 text-sm line-clamp-2">
                      {video.description || "Watch this exciting video from S3vn Studies."}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Link href="/videos">
              See All Videos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
