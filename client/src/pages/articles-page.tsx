import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ArticleCard from "@/components/articles/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Article } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });
  
  // Filter articles based on search term and category
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Extract unique categories for filter dropdown
  const categories = articles 
    ? ["all", ...new Set(articles.map(article => article.category))]
    : ["all"];
  
  return (
    <>
      <Helmet>
        <title>Articles - S3VN Studies</title>
        <meta name="description" content="Explore our collection of in-depth articles covering content creation, digital storytelling, community building, and more." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-20">
          {/* Header Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">Articles & Guides</h1>
                <p className="text-xl opacity-90">
                  Dive deep into our collection of in-depth articles, tutorials, and guides designed to help you grow as a creator.
                </p>
              </div>
            </div>
          </section>
          
          {/* Filter Section */}
          <section className="py-8 bg-light-100">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>
          
          {/* Articles Grid */}
          <section className="py-12 bg-light-100">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading articles</h3>
                  <p className="text-gray-600">Please try again later.</p>
                </div>
              ) : filteredArticles?.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles?.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
              
              {filteredArticles && filteredArticles.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-shadow">
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>
          </section>
          
          {/* Premium Content CTA */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-bold mb-4">Unlock Premium Content</h2>
                    <p className="opacity-90 mb-6">
                      Join our membership to access exclusive premium articles, early access to new content, and join our community of creators.
                    </p>
                    <Button className="bg-white text-primary hover:shadow-lg transition-shadow">
                      Join Membership
                    </Button>
                  </div>
                  <div className="hidden md:block relative">
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Premium content" 
                      className="w-full h-auto rounded-xl relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
