import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lightbulb, Music, Video, ShoppingBag, Users, Terminal } from "lucide-react";

interface CategoryItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

export default function CategoryNavigation() {
  const categories: CategoryItem[] = [
    {
      name: "Self Help Studies",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      path: "/articles?category=self-improvement",
      description: "Personal growth and development articles"
    },
    {
      name: "Articles",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      path: "/articles",
      description: "Browse all articles"
    },
    {
      name: "Videos",
      icon: <Video className="h-5 w-5 text-red-500" />,
      path: "/videos",
      description: "Educational and informative videos"
    },
    {
      name: "Store",
      icon: <ShoppingBag className="h-5 w-5 text-green-500" />,
      path: "/store",
      description: "S3vn Studies merchandise"
    },
    {
      name: "Community",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      path: "/community",
      description: "Connect with other members"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-poppins text-foreground">Explore By Category</h2>
          <p className="mt-3 text-foreground/80 max-w-2xl mx-auto">
            Find content that interests you in these categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.path}>
              <Card className="bg-card cursor-pointer transition-all hover:shadow-md border border-border/40 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                  <p className="text-sm text-foreground/70">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}