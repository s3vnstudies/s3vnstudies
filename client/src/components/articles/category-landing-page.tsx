import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, Bookmark, Lock } from 'lucide-react';
import { Article } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/layout/page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface CategoryLandingPageProps {
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export default function CategoryLandingPage({ category, title, description, imageUrl }: CategoryLandingPageProps) {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState('all');

  useEffect(() => {
    document.title = `${title} - S3vn Studies`;
  }, [title]);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    select: (data) => data.filter(article => article.category === category),
  });

  // Logic to group articles by topic/subcategory
  const getTopics = (articles: Article[] | undefined): string[] => {
    if (!articles) return [];
    
    // Extract potential topics from article titles
    const allTopics: string[] = [];
    
    articles.forEach(article => {
      const title = article.title.toLowerCase();
      
      // Add logic here to extract topics based on patterns in titles
      // This is a simple example - you may want to use a more sophisticated approach
      if (title.includes(':')) {
        const parts = title.split(':');
        if (parts.length > 0) {
          const topic = parts[0].trim();
          if (topic.length > 3 && !allTopics.includes(topic)) { // Avoid too short topics
            allTopics.push(topic);
          }
        }
      }
    });
    
    // Return unique topics with at least 2 articles per topic
    return allTopics.filter(topic => {
      const count = articles.filter(article => 
        article.title.toLowerCase().includes(topic.toLowerCase())
      ).length;
      return count >= 2;
    });
  };

  const topics = articles ? getTopics(articles) : [];
  
  const renderArticleCard = (article: Article) => (
    <Link key={article.id} href={`/articles/${article.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer h-full border border-muted hover:border-primary/50">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold line-clamp-2 flex-1">{article.title}</h3>
            {article.membershipRequired !== 'free' && !user?.membershipTier && (
              <Lock className="h-4 w-4 text-primary flex-shrink-0 ml-2 mt-1" />
            )}
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">
            {article.excerpt}
          </p>
          
          <div className="flex justify-between items-center mt-3">
            <Badge variant="outline" className="text-xs">
              {article.membershipRequired === 'free' ? 'Free' : 'Premium'}
            </Badge>
            <div className="text-primary flex items-center text-xs font-medium">
              Read more <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const renderTableOfContents = () => {
    if (!articles || articles.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
        
        <Card className="border border-muted">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.length > 0 ? (
                topics.map(topic => {
                  const topicArticles = articles.filter(article => 
                    article.title.toLowerCase().includes(topic.toLowerCase())
                  );
                  
                  return (
                    <div key={topic} className="mb-4">
                      <h3 className="text-lg font-semibold mb-2 capitalize">
                        {topic}
                      </h3>
                      <ul className="space-y-2">
                        {topicArticles.map(article => (
                          <li key={article.id} className="flex items-start">
                            <Bookmark className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                            <Link href={`/articles/${article.id}`} className="text-sm hover:text-primary transition-colors">
                              {article.title}
                              {article.membershipRequired !== 'free' && !user?.membershipTier && (
                                <Lock className="inline-block h-3 w-3 text-primary ml-1" />
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full">
                  <h3 className="text-lg font-semibold mb-2">All Articles</h3>
                  <ul className="space-y-2">
                    {articles.map(article => (
                      <li key={article.id} className="flex items-start">
                        <Bookmark className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                        <Link href={`/articles/${article.id}`} className="text-sm hover:text-primary transition-colors">
                          {article.title}
                          {article.membershipRequired !== 'free' && !user?.membershipTier && (
                            <Lock className="inline-block h-3 w-3 text-primary ml-1" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <PageLayout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <p className="text-lg opacity-90 mb-4">{description}</p>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {articles?.length || 0} Articles
                </Badge>
                {topics.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {topics.length} Topics
                  </Badge>
                )}
              </div>
            </div>
            {imageUrl && (
              <div className="hidden md:block">
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className="rounded-xl object-cover h-40 w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading articles...</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            {renderTableOfContents()}
            
            <Separator className="my-8" />
            
            <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Articles</h2>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="free">Free</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map(article => renderArticleCard(article))}
                </div>
              </TabsContent>
              
              <TabsContent value="free" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles
                    .filter(article => article.membershipRequired === 'free')
                    .map(article => renderArticleCard(article))}
                </div>
              </TabsContent>
              
              <TabsContent value="premium" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles
                    .filter(article => article.membershipRequired !== 'free')
                    .map(article => renderArticleCard(article))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}