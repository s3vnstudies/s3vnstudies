import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, MessageSquare, ArrowRight } from "lucide-react";
import { formatDistance } from "date-fns";

export default function FeaturedContent() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles?limit=3"],
  });
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2">Featured Content</h2>
            <p className="text-neutral-600">The latest and greatest from S3VN Studies</p>
          </div>
          <Link href="/articles">
            <a className="text-primary font-semibold hover:underline hidden md:flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="relative pb-[56.25%] bg-neutral-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-neutral-200 h-6 w-16 rounded animate-pulse"></div>
                    <div className="ml-2 bg-neutral-200 h-4 w-24 rounded animate-pulse"></div>
                  </div>
                  <div className="bg-neutral-200 h-7 w-3/4 rounded mb-2 animate-pulse"></div>
                  <div className="bg-neutral-200 h-4 w-full rounded mb-1 animate-pulse"></div>
                  <div className="bg-neutral-200 h-4 w-2/3 rounded mb-4 animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="bg-neutral-200 h-5 w-24 rounded animate-pulse"></div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-neutral-200 h-4 w-16 rounded animate-pulse"></div>
                      <div className="bg-neutral-200 h-4 w-16 rounded animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            articles?.map((article) => (
              <Card 
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                <div className="relative pb-[56.25%] bg-neutral-200">
                  <img 
                    src={article.imageUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8"} 
                    alt={article.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <span className={`bg-${article.isPremium ? 'primary-light' : 'secondary'} text-white text-xs py-1 px-2 rounded`}>
                      {article.isPremium ? 'Premium' : 'Article'}
                    </span>
                    <span className="ml-2 text-neutral-500 text-sm">
                      {formatDistance(new Date(article.createdAt), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2 hover:text-primary">
                    <Link href={`/articles/${article.id}`}>
                      <a>{article.title}</a>
                    </Link>
                  </h3>
                  <p className="text-neutral-600 mb-4 line-clamp-2">
                    {article.content.substring(0, 120)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <Link href={`/articles/${article.id}`}>
                      <a className="text-primary font-semibold hover:underline">Read Article</a>
                    </Link>
                    <div className="flex items-center space-x-3 text-neutral-500">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" /> 1.4k
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" /> 24
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/articles">
            <a className="inline-block text-primary font-semibold hover:underline">
              View All Content <ArrowRight className="ml-1 h-4 w-4 inline" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
