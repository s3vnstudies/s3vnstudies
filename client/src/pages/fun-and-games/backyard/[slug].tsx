import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import PageLayout from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { LockIcon, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const articles = [
  "Planning a Pool Party",
  "Popular Backyard Activities for Adults",
  "Popular Backyard Activities for Teens",
  "Popular Backyard Activities for Toddlers",
  "Popular Water Activities for the Backyard",
  "Sunbathing: A Relaxing Backyard Activity",
  "The Benefits of Taking Your Child Outdoors",
  "Backyard Play Structures for Children",
  "Building a Tree House or Fort",
  "Exploring Nature with Your Child",
  "Family-Friendly Backyard Accessories",
  "Great Backyard Snacks for Children", 
  "Own a Pool? Have a Pool Party!",
  "Planning a Backyard Barbeque Party",
  "Planning a Backyard Campout",
];

// Placeholder content for now - in production, this would come from the backend
const articleContent = `
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultrices luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl nec nisl. Sed euismod, nisl vel ultrices luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl nec nisl.
</p>
<p>
Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.
</p>
<h2>Key Points</h2>
<ul>
  <li>Plan ahead and make a list of activities</li>
  <li>Consider the age groups of participants</li>
  <li>Have backup activities in case of weather changes</li>
  <li>Ensure safety measures are in place</li>
  <li>Don't forget to have fun yourself!</li>
</ul>
<p>
Donec ullamcorper nulla non metus auctor fringilla. Maecenas sed diam eget risus varius blandit sit amet non magna. Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus. Nullam quis risus eget urna mollis ornare vel eu leo.
</p>
<h2>Recommended Equipment</h2>
<p>
Depending on the specific activities you choose, you might need various equipment. Here's a general list to consider:
</p>
<ul>
  <li>Comfortable outdoor furniture</li>
  <li>Shade structures (umbrellas, canopies)</li>
  <li>Outdoor games and toys</li>
  <li>Safety equipment</li>
  <li>First aid kit</li>
  <li>Refreshments and snacks</li>
</ul>
<p>
Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper.
</p>
<h2>Final Thoughts</h2>
<p>
Remember that the most important part of any backyard activity is to create memorable experiences. Focus on engaging with your family and friends, and don't stress too much about everything being perfect. The joy comes from the shared experience rather than flawless execution.
</p>
`;

export default function BackyardArticlePage() {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const isPremiumMember = user?.membershipTier === "pro";
  
  // Find the article title based on the slug
  const articleTitle = articles.find(title => {
    const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return titleSlug === slug;
  });

  useEffect(() => {
    // Simulate loading the article content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // If the article doesn't exist, redirect to the backyard activities page
  useEffect(() => {
    if (!articleTitle && !loading) {
      navigate("/fun-and-games/backyard");
    }
  }, [articleTitle, loading, navigate]);

  if (!articleTitle) {
    return (
      <PageLayout>
        <div className="container py-12">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate("/fun-and-games/backyard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Backyard Activities
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{articleTitle}</h1>
          
          {!isPremiumMember ? (
            <div className="mt-8">
              <Alert className="mb-8 border-primary/50 bg-primary/10">
                <LockIcon className="h-4 w-4" />
                <AlertTitle>Premium Content</AlertTitle>
                <AlertDescription>
                  This article is available exclusively to Pro members.
                  <Link href="/membership">
                    <Button variant="link" className="p-0 h-auto mb-2 ml-2">
                      Upgrade now
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </AlertDescription>
              </Alert>
              
              <div className="blur-sm pointer-events-none">
                <div className="prose prose-lg dark:prose-invert" 
                  dangerouslySetInnerHTML={{ __html: articleContent }} 
                />
              </div>
            </div>
          ) : (
            <div className="mt-6">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-6 w-5/6 mb-4" />
                  <Skeleton className="h-6 w-4/6 mb-8" />
                  <Skeleton className="h-5 w-full mb-3" />
                  <Skeleton className="h-5 w-full mb-3" />
                  <Skeleton className="h-5 w-3/4 mb-8" />
                </>
              ) : (
                <div className="prose prose-lg dark:prose-invert" 
                  dangerouslySetInnerHTML={{ __html: articleContent }} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}