import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article, Video, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type FeaturedItem = {
  type: "article" | "video" | "membership";
  data: Article | Video | null;
};

export default function FeaturedContent() {
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: videos, isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const isLoading = articlesLoading || videosLoading;

  // Create an array of featured items
  const featuredItems: FeaturedItem[] = [
    { type: "article", data: articles ? articles[0] : null },
    { type: "video", data: videos ? videos[0] : null },
    { type: "membership", data: null }, // Static membership card
  ];

  // Format date for display
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <section className="py-16 bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-poppins text-foreground">Featured Content</h2>
          <p className="mt-3 text-foreground/80 max-w-2xl mx-auto">
            Explore our latest articles, videos, and resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-card border border-border/40">
                    <Skeleton className="h-48 w-full rounded-t-xl" />
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-32 ml-2" />
                      </div>
                      <Skeleton className="h-7 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-10 w-28 mt-4" />
                    </CardContent>
                  </Card>
                ))
            : featuredItems.map((item, index) => {
                if (item.type === "article" && item.data) {
                  const article = item.data as Article;
                  return (
                    <Card key={index} className="bg-card overflow-hidden shadow-md transition-all hover:shadow-lg border border-border/40">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.thumbnail || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <span className="bg-primary/20 text-primary text-xs font-medium px-3 py-1 rounded-full">
                            Article
                          </span>
                          <span className="ml-2 text-foreground/70 text-sm">
                            {formatDate(article.publishDate)}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 font-poppins text-foreground">{article.title}</h3>
                        <p className="text-foreground/80 line-clamp-2">{article.excerpt}</p>
                        <Link href={`/articles/${article.id}`} className="mt-4 inline-flex items-center text-primary font-medium">
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  );
                } else if (item.type === "video" && item.data) {
                  const video = item.data as Video;
                  return (
                    <Card key={index} className="bg-card overflow-hidden shadow-md transition-all hover:shadow-lg border border-border/40">
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={video.thumbnail || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="h-5 w-5 text-primary ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <span className="bg-accent/20 text-accent text-xs font-medium px-3 py-1 rounded-full">
                            Video
                          </span>
                          <span className="ml-2 text-foreground/70 text-sm">
                            {formatDate(video.publishDate)}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 font-poppins text-foreground">{video.title}</h3>
                        <p className="text-foreground/80 line-clamp-2">
                          {video.description || "Watch this exciting video from S3vn Studies."}
                        </p>
                        <Link href={`/videos/${video.id}`} className="mt-4 inline-flex items-center text-accent font-medium">
                          Watch Video
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  );
                } else {
                  // Membership card (static)
                  return (
                    <Card key={index} className="bg-card overflow-hidden shadow-md transition-all hover:shadow-lg border border-border/40">
                      <div className="h-48 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                          alt="Membership feature"
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <span className="bg-secondary/20 text-secondary text-xs font-medium px-3 py-1 rounded-full">
                            Membership
                          </span>
                          <span className="ml-2 text-foreground/70 text-sm">New</span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 font-poppins text-foreground">Join Our Premium Community</h3>
                        <p className="text-foreground/80 line-clamp-2">
                          Get exclusive access to premium content, live events, and connect with like-minded individuals.
                        </p>
                        <Link href="/membership" className="mt-4 inline-flex items-center text-secondary font-medium">
                          Learn More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  );
                }
              })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="inline-flex items-center px-6 py-3 border border-border/60 rounded-lg text-foreground hover:bg-background/80 font-medium transition-colors">
            <Link href="/articles">
              View All Content
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
