import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import ArticleCard from "@/components/articles/article-card";
import { Article } from "@shared/schema";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CategoryPage() {
  const { user } = useAuth();
  const [match, params] = useRoute("/articles/category/:category");
  const category = match ? params.category : null;

  // Fetch all articles in this category
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    select: (data) => data.filter(article => article.category === category),
    enabled: !!category,
  });

  // Set page title
  useEffect(() => {
    if (category) {
      // Format category name for display (capitalize, replace hyphens with spaces)
      const formattedCategory = category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
        
      document.title = `${formattedCategory} Articles - S3vn Studies`;
    } else {
      document.title = "Articles - S3vn Studies";
    }
  }, [category]);

  if (!category) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Category Not Found</h1>
          <p className="text-neutral-600 mb-6">
            The category you requested could not be found.
          </p>
        </div>
      </PageLayout>
    );
  }

  // Format category name for display
  const formattedCategory = category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Separate free and premium articles
  const freeArticles = articles?.filter(article => article.membershipRequired === "free") || [];
  const premiumArticles = articles?.filter(article => article.membershipRequired !== "free") || [];

  // For free articles, we want to show only one per category
  const freeArticleToShow = freeArticles.length > 0 ? [freeArticles[0]] : [];

  return (
    <PageLayout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{formattedCategory}</h1>
          <p className="text-lg opacity-90">
            Explore our collection of insightful articles on {formattedCategory.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading articles...</p>
          </div>
        ) : (
          <>
            {/* Free Articles Section */}
            {freeArticleToShow.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Free Articles</h2>
                <div className="grid grid-cols-1 gap-8">
                  {freeArticleToShow.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      showLockIcon={false}
                      featured={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Premium Articles Section */}
            {premiumArticles.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold">Premium Articles</h2>
                  <Lock className="ml-2 h-5 w-5 text-primary" />
                </div>
                
                {!user || user.membershipTier === "free" ? (
                  <div className="bg-primary/5 p-8 rounded-lg text-center mb-8">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                    <p className="text-neutral-600 mb-6">
                      These articles require a premium membership to access.
                    </p>
                    <a 
                      href={user ? "/membership" : "/auth"} 
                      className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      {user ? "Upgrade Membership" : "Sign In"}
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {premiumArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        showLockIcon={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {freeArticleToShow.length === 0 && premiumArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-600">No articles found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}