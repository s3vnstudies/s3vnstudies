import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  isPopular?: boolean;
  features: PlanFeature[];
}

const plans: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 5,
    features: [
      { text: "Access to all articles", included: true },
      { text: "Community bulletin access", included: true },
      { text: "Monthly newsletter", included: true },
      { text: "Member-only videos", included: false },
      { text: "Chat access", included: false }
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 15,
    isPopular: true,
    features: [
      { text: "Access to all articles", included: true },
      { text: "Community bulletin access", included: true },
      { text: "Monthly newsletter", included: true },
      { text: "Member-only videos", included: true },
      { text: "Chat access", included: true }
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    features: [
      { text: "Everything in Premium", included: true },
      { text: "1-on-1 monthly call", included: true },
      { text: "Early access to content", included: true },
      { text: "Exclusive workshops", included: true },
      { text: "Merchandise discounts", included: true }
    ]
  }
];

const MembershipPlans = () => {
  const { user } = useAuth();

  return (
    <section className="py-16 bg-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-medium">Membership Plans</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">Join Our Community</h2>
          <p className="text-gray-600">
            Choose the membership level that fits your needs and get access to exclusive content, community features, and more.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`overflow-hidden relative ${
                plan.isPopular 
                  ? "shadow-xl scale-105 z-10" 
                  : "shadow-md hover:shadow-lg transition"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardContent className={`p-6 ${plan.isPopular ? "pt-10" : ""}`}>
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      {feature.included ? (
                        <>
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>{feature.text}</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-gray-300 mr-2" />
                          <span className="text-gray-400">{feature.text}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild
                  className={`w-full ${
                    plan.isPopular 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  <Link href={user ? `/profile/subscription?plan=${plan.id}` : "/auth"}>
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
