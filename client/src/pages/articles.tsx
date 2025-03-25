import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import ContentCard from "@/components/ContentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { Article } from "@shared/schema";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  
  // Fetch articles
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });
  
  // Filter articles based on search query and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || article.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  // Extract unique categories from articles
  const categories = ["all", ...new Set(articles.map(article => article.category))];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight mb-6">
            Articles & Guides
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Dive into our collection of in-depth articles, tutorials, and guides to expand your knowledge and skills.
          </p>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative md:w-1/2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Articles Grid Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-medium text-slate-700 mb-4">No articles found</h3>
              <p className="text-slate-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-poppins font-bold mb-8">
                {category === "all" 
                  ? "All Articles" 
                  : `${category.charAt(0).toUpperCase() + category.slice(1)} Articles`}
                {searchQuery && ` matching "${searchQuery}"`}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ContentCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    description={article.excerpt}
                    imageUrl={article.imageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    type="article"
                    category={article.category}
                    date={article.createdAt}
                    isPremium={article.isPremium}
                    link={`/articles/${article.id}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-poppins font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto mb-8">
            Stay updated with our latest articles, tutorials, and community news.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Your email address"
              className="w-full"
            />
            <Button className="bg-gradient-to-r from-primary to-secondary text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
