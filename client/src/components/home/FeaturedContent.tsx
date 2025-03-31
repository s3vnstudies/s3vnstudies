import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import ContentCard from "@/components/shared/ContentCard";
import { useQuery } from "@tanstack/react-query";

interface FeaturedContent {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  contentType: string;
  author: {
    name: string;
    avatar: string;
  };
  duration: string;
  date: string;
  category: string;
}

const FeaturedContent = () => {
  const { data: contents = [], isLoading } = useQuery<FeaturedContent[]>({
    queryKey: ['/api/contents'],
    queryFn: async () => {
      // In a real application, this would be a proper API call
      // but for this demo, we'll just simulate some featured content data
      return [
        {
          id: 1,
          title: "The Evolution of Web Development in 2023",
          description: "Explore the latest trends and technologies shaping the future of web development this year.",
          thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
          contentType: "article",
          author: {
            name: "Alex Johnson",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
          },
          duration: "10 min read",
          date: "May 20, 2023",
          category: "Technology"
        },
        {
          id: 2,
          title: "Advanced CSS Techniques for Modern Websites",
          description: "Learn powerful CSS techniques to create stunning animations and layouts for your web projects.",
          thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          contentType: "video",
          author: {
            name: "Sarah Miller",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
          },
          duration: "25:14",
          date: "June 5, 2023",
          category: "Tutorial"
        },
        {
          id: 3,
          title: "Building Your First Machine Learning Model",
          description: "Join this hands-on workshop to build and deploy your first machine learning model from scratch.",
          thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          contentType: "workshop",
          author: {
            name: "Mark Wilson",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
          },
          duration: "July 15",
          date: "Upcoming",
          category: "Live Session"
        }
      ];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white" id="featured">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Content</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-96"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white" id="featured">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Content</h2>
          <Button variant="link" asChild className="text-blue-600 flex items-center gap-2">
            <Link href="/articles">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.map((content) => (
            <ContentCard 
              key={content.id}
              id={content.id}
              title={content.title}
              description={content.description}
              image={content.thumbnail}
              contentType={content.contentType}
              date={content.date}
              category={content.category}
              duration={content.duration}
              author={{
                name: content.author.name,
                avatar: content.author.avatar
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
