import { useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import { Article } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ArticlesPage() {
  const { user } = useAuth();

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  // Set page title
  useEffect(() => {
    document.title = "Articles - S3vn Studies";
  }, []);

  // Get unique categories from articles
  const categories = articles
    ? Array.from(new Set(articles.map((article) => article.category)))
    : [];

  // Category information mapping for UI display
  type CategoryInfoType = {
    [key: string]: {
      title: string;
      description: string;
      icon: ReactNode;
      color: string;
    }
  };
  
  const categoryInfo: CategoryInfoType = {
    "self-improvement": {
      title: "Self Improvement",
      description: "Articles to help you grow and develop personally",
      icon: <BookOpen className="h-10 w-10 mb-4 text-primary" />,
      color: "bg-primary-light",
    },
    "anger-management": {
      title: "Anger Management",
      description: "Learn to control anger and improve relationships",
      icon: <BookOpen className="h-10 w-10 mb-4 text-amber-600" />,
      color: "bg-amber-50",
    },
  };

  return (
    <PageLayout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">Article Categories</h1>
          <p className="text-lg opacity-90">
            Explore our collection of insightful articles organized by topic
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Link key={category} href={`/articles/category/${category}`}>
                <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-center mb-4">
                      {categoryInfo[category]?.icon || <BookOpen className="h-10 w-10 mb-4 text-primary" />}
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">
                      {categoryInfo[category]?.title || 
                        category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </h3>
                    <p className="text-neutral-600 text-center mb-4">
                      {categoryInfo[category]?.description || "Explore articles in this category"}
                    </p>
                    <div className="mt-auto flex justify-center">
                      <div className="inline-flex items-center text-primary font-medium">
                        Explore Articles
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600">No article categories found.</p>
          </div>
        )}

        {user && user.membershipTier !== "free" && (
          <div className="mt-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold">Premium Membership Benefits</h2>
              <Lock className="ml-2 h-5 w-5 text-primary" />
            </div>
            <Card className="bg-primary/5 p-6 rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Thank You for Being a Premium Member!</h3>
                <p className="text-neutral-600 mb-4">
                  You have full access to all premium articles across all categories.
                </p>
              </div>
            </Card>
          </div>
        )}

        {!user && (
          <div className="mt-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold">Premium Membership Benefits</h2>
              <Lock className="ml-2 h-5 w-5 text-primary" />
            </div>
            <Card className="bg-primary/5 p-6 rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Unlock All Articles</h3>
                <p className="text-neutral-600 mb-6">
                  Sign up for a premium membership to access our entire library of articles.
                </p>
                <Link
                  href="/auth"
                  className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Join Now
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
