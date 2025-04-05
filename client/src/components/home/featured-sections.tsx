import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Video, Users } from "lucide-react";

// Thumbnail for Articles section
const ArticleThumbnail = () => (
  <img 
    src="/images/articles-thumbnail.gif" 
    alt="Transformative Articles"
    className="w-full rounded-md mb-4 h-44 object-cover"
  />
);

const VideoThumbnail = () => (
  <img 
    src="/images/video-thumbnail.gif" 
    alt="Inspiring Video Content"
    className="w-full rounded-md mb-4 h-44 object-cover"
  />
);

const CommunityThumbnail = () => (
  <img 
    src="/images/community-thumbnail.gif" 
    alt="Supportive Community"
    className="w-full rounded-md mb-4 h-44 object-cover"
  />
);

const featuredSections = [
  {
    title: "Transformative Articles",
    description: "Dive into our expertly crafted articles on personal development, self-improvement techniques, and mindfulness practices. Each piece is meticulously researched to provide actionable insights that can help you create meaningful change in your life.",
    path: "/articles",
    icon: <BookOpen className="h-5 w-5" />,
    thumbnail: <ArticleThumbnail />,
  },
  {
    title: "Inspiring Video Content",
    description: "Watch our collection of engaging videos featuring guided meditation sessions, motivational talks, and step-by-step tutorials on various self-help techniques. Our visual content is designed to inspire and guide your personal growth journey.",
    path: "/videos",
    icon: <Video className="h-5 w-5" />,
    thumbnail: <VideoThumbnail />,
  },
  {
    title: "Supportive Community",
    description: "Join our thriving community of like-minded individuals on a shared journey of self-improvement. Connect with others, share experiences, participate in discussions, and receive support from people who understand your challenges and aspirations.",
    path: "/community",
    icon: <Users className="h-5 w-5" />,
    thumbnail: <CommunityThumbnail />,
  },
];

export default function FeaturedSections() {
  return (
    <section className="py-12 bg-background/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Discover Our Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSections.map((section) => (
            <Card key={section.title} className="overflow-hidden border-2 border-primary/20 hover:border-primary/70 transition-all bg-gradient-to-b from-background to-background/80">
              <div className="overflow-hidden">
                {section.thumbnail}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm mb-4">
                  {section.description}
                </CardDescription>
                <Button asChild variant="outline" className="w-full group">
                  <Link to={section.path}>
                    <span>Explore</span>
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}