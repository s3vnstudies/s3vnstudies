import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ContentCard from "@/components/shared/ContentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Content } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

const ArticlesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const { data: contents = [], isLoading } = useQuery<Content[]>({
    queryKey: ['/api/contents'],
    queryFn: async () => {
      const response = await fetch('/api/contents');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      return await response.json();
    }
  });

  // Filter content for articles only
  const articles = contents.filter(
    (content) => content.contentType === "article"
  );

  // Filter based on search term and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = category === "all" || article.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Split into free and premium articles
  const freeArticles = filteredArticles.filter(article => !article.premium);
  const premiumArticles = filteredArticles.filter(article => article.premium);

  // Get unique categories for filter dropdown
  const categories = ["all", ...new Set(articles.map(article => article.category))];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Articles</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-md"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
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
      
      {/* Articles List */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Articles</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No articles found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ContentCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  image={article.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"}
                  contentType="article"
                  date={new Date(article.createdAt).toLocaleDateString()}
                  category={article.category || "General"}
                  duration={`${Math.ceil(article.content.length / 1000)} min read`}
                  author={{
                    name: article.authorName || "S3vn Studies",
                    avatar: article.authorAvatar || ""
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="free">
          {freeArticles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No free articles found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeArticles.map((article) => (
                <ContentCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  image={article.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"}
                  contentType="article"
                  date={new Date(article.createdAt).toLocaleDateString()}
                  category={article.category || "General"}
                  duration={`${Math.ceil(article.content.length / 1000)} min read`}
                  author={{
                    name: article.authorName || "S3vn Studies",
                    avatar: article.authorAvatar || ""
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="premium">
          {!user ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Premium Content</h3>
              <p className="text-gray-600 mb-4">You need to be a member to access premium articles.</p>
              <a href="/auth" className="text-blue-600 hover:underline">Sign in</a>
              <span className="mx-2 text-gray-400">or</span>
              <a href="/#pricing" className="text-blue-600 hover:underline">Become a member</a>
            </div>
          ) : user.membershipTier === "free" ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Premium Content</h3>
              <p className="text-gray-600 mb-4">Upgrade your membership to access premium articles.</p>
              <a href="/#pricing" className="text-blue-600 hover:underline">View membership options</a>
            </div>
          ) : premiumArticles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No premium articles found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumArticles.map((article) => (
                <ContentCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  image={article.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"}
                  contentType="article"
                  date={new Date(article.createdAt).toLocaleDateString()}
                  category={article.category || "General"}
                  duration={`${Math.ceil(article.content.length / 1000)} min read`}
                  author={{
                    name: article.authorName || "S3vn Studies",
                    avatar: article.authorAvatar || ""
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArticlesPage;
