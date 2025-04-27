import { useRoute } from "wouter";
import { Article } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import PageLayout from "@/components/layout/page-layout";
import CategoryLandingPage from "@/components/articles/category-landing-page";
import ArticleCategoryPage from "@/components/articles/ArticleCategoryPage";

// List of new categories that should use the new ArticleCategoryPage component
const NEW_CATEGORY_PAGES = [
  "hobbies-collecting",
  "arts-crafts",
  "travel-leisure"
];

export default function CategoryPage() {
  const { user } = useAuth();
  const [match, params] = useRoute("/articles/category/:category");
  const category = match ? params.category : null;

  // For new categories, use ArticleCategoryPage component directly
  if (category && NEW_CATEGORY_PAGES.includes(category)) {
    return <ArticleCategoryPage category={category} />;
  }

  // Fetch all articles in this category (for legacy categories)
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    select: (data) => data.filter(article => article.category === category),
    enabled: !!category,
  });

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

  // Get category description based on the category
  const getCategoryInfo = (category: string) => {
    const categoryMap: { [key: string]: { description: string; imageUrl: string } } = {
      "self-improvement": {
        description: "Discover articles and guides to help you grow and develop personally.",
        imageUrl: "/images/categories/self-improvement.svg"
      },
      "anger-management": {
        description: "Learn effective techniques to control anger and improve relationships.",
        imageUrl: "/images/categories/default.svg"
      },
      "financial-insight": {
        description: "Valuable knowledge and strategies for achieving financial success.",
        imageUrl: "/images/categories/financial-insight.svg"
      },
      "self-confidence": {
        description: "Build and maintain self-confidence with these proven strategies.",
        imageUrl: "/images/categories/self-confidence.svg"
      },
      "self-help": {
        description: "Practical advice and techniques for personal growth and success.",
        imageUrl: "/images/categories/default.svg"
      },
      "time-management": {
        description: "Learn effective methods to manage your time and boost productivity.",
        imageUrl: "/images/categories/time-management.svg"
      },
      "self-defeating": {
        description: "Identify and overcome self-sabotaging patterns and behaviors.",
        imageUrl: "/images/categories/default.svg"
      },
      "health": {
        description: "Comprehensive articles on health, medicine, and overall well-being.",
        imageUrl: "/images/categories/health.svg"
      },
      "vitamins": {
        description: "Learn about essential vitamins and dietary supplements for optimal health.",
        imageUrl: "/images/categories/default.svg"
      },
      "finances": {
        description: "Expert tips and strategies for managing your money wisely.",
        imageUrl: "/images/categories/financial-insight.svg"
      },
      "miscellaneous": {
        description: "A diverse collection of interesting and informative articles on various topics.",
        imageUrl: "/images/categories/default.svg"
      },
      "motorhomes": {
        description: "Everything you need to know about motorhomes, RVs, and mobile living.",
        imageUrl: "/images/categories/default.svg"
      },
      "medicinal-remedies": {
        description: "Explore natural and traditional remedies for various health conditions.",
        imageUrl: "/images/categories/health.svg"
      },
      "past-life-regression": {
        description: "Discover techniques and experiences related to past life therapy and exploration.",
        imageUrl: "/images/categories/default.svg"
      },
      "law": {
        description: "Legal insights and educational content on various legal topics and issues.",
        imageUrl: "/images/categories/default.svg"
      },
      "investing": {
        description: "Learn about different investment strategies and opportunities for wealth building.",
        imageUrl: "/images/categories/investing.svg"
      },
      "hiking-and-camping": {
        description: "Tips, guides and advice for successful hiking, camping and outdoor adventures.",
        imageUrl: "/images/categories/hiking-and-camping.svg"
      }
    };

    return categoryMap[category] || {
      description: `Explore our collection of insightful articles on ${formattedCategory.toLowerCase()}.`,
      imageUrl: "/images/categories/default.svg"
    };
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <CategoryLandingPage
      category={category}
      title={formattedCategory}
      description={categoryInfo.description}
      imageUrl={categoryInfo.imageUrl}
    />
  );
}