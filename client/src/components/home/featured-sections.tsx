import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Video, Users } from "lucide-react";

// SVG thumbnails for better quality and performance
const ArticleThumbnail = () => (
  <svg
    viewBox="0 0 400 225"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full rounded-md mb-4 h-44 bg-gradient-to-r from-blue-900 to-black"
  >
    <path
      d="M80 70h240c5.523 0 10 4.477 10 10v65c0 5.523-4.477 10-10 10H80c-5.523 0-10-4.477-10-10V80c0-5.523 4.477-10 10-10z"
      fill="#1E40AF"
      opacity="0.7"
    />
    <path
      d="M100 90h200v10H100zM100 110h180v10H100zM100 130h160v10H100z"
      fill="#FFFFFF"
      opacity="0.9"
    />
    <circle cx="320" cy="110" r="25" fill="#FFD700" opacity="0.9" />
    <path
      d="M310 100l20 20M310 120l20-20"
      stroke="#1E3A8A"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
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