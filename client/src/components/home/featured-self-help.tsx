import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function FeaturedSelfHelp() {
  const { user } = useAuth();

  // Fetch all articles
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  // Filter only Self-Help & Personal Development articles
  const selfHelpArticles = articles?.filter(
    (article) => 
      article.category === "Self-Help & Personal Development" ||
      article.category?.toLowerCase() === "self-help & personal development"
  ).slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/20">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!selfHelpArticles || selfHelpArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Personal Growth Library</h2>
            <p className="text-muted-foreground">
              Our latest collection of premium self-help articles
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/articles/category/self-help & personal development">
              <span>View All</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selfHelpArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.thumbnail || "/images/articles/placeholder.jpg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                {article.membershipRequired === "pro" && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </div>
                )}
              </div>
              <CardHeader className="pb-2 flex-none">
                <CardTitle className="line-clamp-2 text-lg">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.excerpt}
                </p>
              </CardContent>
              <CardFooter className="flex-none">
                <Button 
                  asChild 
                  variant={article.membershipRequired === "pro" && !user?.membershipTier?.includes("pro") ? "outline" : "default"}
                  className="w-full"
                >
                  <Link to={`/articles/${article.id}`}>
                    {article.membershipRequired === "pro" && !user?.membershipTier?.includes("pro") 
                      ? "Upgrade to Read" 
                      : "Read Article"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}