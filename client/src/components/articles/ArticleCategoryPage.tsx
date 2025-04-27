import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  Calendar, 
  User,
  ChevronRight,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import PageLayout from "@/components/layout/page-layout";
import AdLayout from "@/components/ads/AdLayout";
import useAdConsent from "@/hooks/use-ad-consent";

// Category information for UI display with S3vn brand colors
const categoryInfo = {
  "hobbies-collecting": {
    title: "Hobbies & Collecting",
    description: "Explore interesting hobbies and collection ideas that can enrich your life and home",
    headerImage: "/static/images/category-headers/hobbies-collecting.svg",
    color: "bg-blue-600", // S3vn blue
    icon: "Trophy"
  },
  "arts-crafts": {
    title: "Arts & Crafts",
    description: "Creative hands-on projects for all ages and skill levels",
    headerImage: "/static/images/category-headers/arts-crafts.svg",
    color: "bg-blue-600", // S3vn blue
    icon: "Palette"
  },
  "travel-leisure": {
    title: "Travel & Leisure",
    description: "Tips and guides for making the most of your vacation and leisure time",
    headerImage: "/static/images/category-headers/travel-leisure.svg",
    color: "bg-blue-600", // S3vn blue
    icon: "Palmtree"
  },
  // Fallback for other categories
  "default": {
    title: "Articles",
    description: "Explore our collection of informative articles",
    headerImage: "/static/images/category-headers/default.svg",
    color: "bg-blue-600", // S3vn blue
    icon: "BookOpen"
  }
};

interface ArticleCategoryPageProps {
  category: string;
}

export default function ArticleCategoryPage({ category }: ArticleCategoryPageProps) {
  const { user } = useAuth();
  const { consentStatus } = useAdConsent();
  const adsEnabled = consentStatus === "granted";

  // Query articles in this category
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles/category", category],
  });

  // Get category information (with fallback)
  const categoryData = categoryInfo[category] || categoryInfo.default;

  // Set page title
  useEffect(() => {
    document.title = `${categoryData.title} - S3vn Studies`;
  }, [categoryData.title]);

  // Format the display category name
  const displayCategory = categoryData.title;

  return (
    <PageLayout>
      <div className={`${categoryData.color} text-white py-12`}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{displayCategory}</h1>
          <p className="text-lg opacity-90">
            {categoryData.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/articles" className="hover:text-primary">
            Articles
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="font-medium text-foreground">{displayCategory}</span>
        </div>

        {/* AdSense placement - top of category page */}
        {adsEnabled && (
          <div className="mb-8">
            <AdLayout position="responsive" />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading articles...</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Article Card (first article) */}
            {articles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
                <Card className="overflow-hidden shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(${articles[0].thumbnail || '/static/images/article-placeholder.jpg'})` 
                        }}
                      ></div>
                      {articles[0].membershipRequired === "pro" && !user?.isAdmin && user?.membershipTier !== "pro" && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="bg-primary/90 text-white px-3 py-1 rounded-full flex items-center text-sm font-medium">
                            <Lock className="mr-1 h-3 w-3" />
                            Premium Content
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="md:w-2/3 p-6">
                      <CardHeader className="p-0 pb-3">
                        <div className="flex items-center mb-2">
                          <Badge variant="outline" className="mr-2">
                            {displayCategory}
                          </Badge>
                          {articles[0].membershipRequired === "pro" && (
                            <Badge variant="default" className="bg-primary">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2">
                          {articles[0].title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pb-4">
                        <CardDescription className="text-base text-muted-foreground line-clamp-3 mb-4">
                          {articles[0].excerpt}
                        </CardDescription>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="mr-1 h-4 w-4" />
                          <span className="mr-4">{articles[0].author}</span>
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{formatDate(articles[0].publishDate)}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-0">
                        <Link href={`/articles/${articles[0].id}`}>
                          <Button>
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* More Articles Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-6">More Articles in {displayCategory}</h2>
              
              {/* In-content ad placement */}
              {adsEnabled && articles.length > 3 && (
                <div className="mb-8">
                  <AdLayout position="in-article" />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article) => (
                  <Card 
                    key={article.id} 
                    className="overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
                  >
                    <div className="h-48 relative">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(${article.thumbnail || '/static/images/article-placeholder.jpg'})` 
                        }}
                      ></div>
                      {article.membershipRequired === "pro" && !user?.isAdmin && user?.membershipTier !== "pro" && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="bg-primary/90 text-white px-3 py-1 rounded-full flex items-center text-sm font-medium">
                            <Lock className="mr-1 h-3 w-3" />
                            Premium Content
                          </div>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">
                          {displayCategory}
                        </Badge>
                        {article.membershipRequired === "pro" && (
                          <Badge variant="default" className="bg-primary">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 text-lg">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="line-clamp-3 text-sm">
                        {article.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-4">
                      <div className="flex w-full justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(article.publishDate)}
                        </div>
                        <Link href={`/articles/${article.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Read More
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Bottom ad placement */}
            {adsEnabled && (
              <div className="mt-12">
                <AdLayout position="responsive" />
              </div>
            )}
            
            {/* Pro Membership CTA if user is not pro */}
            {(!user || user.membershipTier !== "pro") && (
              <div className="mt-12 bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Get Access to Premium Articles</h3>
                <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
                  Upgrade to a Pro membership to unlock all premium content in this category and across the entire site. Expand your knowledge with our exclusive articles.
                </p>
                <Link href={user ? "/subscribe" : "/auth"}>
                  <Button size="lg">
                    {user ? "Upgrade to Pro" : "Sign Up Now"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600">No articles found in this category.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}