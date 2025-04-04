import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type MembershipTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  popular?: boolean;
};

export default function MembershipTiers() {
  const { user } = useAuth();

  const tiers: MembershipTier[] = [
    {
      name: "Basic Access",
      price: "$0",
      description: "Get started with basic access to our content",
      features: [
        "Access to free articles",
        "Basic community features",
        "Preview select videos",
      ],
      buttonText: "Get Started",
      buttonLink: user ? "/membership" : "/auth",
    },
    {
      name: "Pro Access",
      price: "$2.99",
      description: "Full access to premium content and features",
      features: [
        "Everything in Basic",
        "Unlimited article access",
        "Full community access",
        "Member-only chat rooms",
        "Early access to new content",
      ],
      buttonText: "Subscribe Now",
      buttonLink: user ? "/membership" : "/auth",
      popular: true,
    },
  ];

  return (
    <section id="membership" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="bg-primary/20 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
            Membership
          </span>
          <h2 className="mt-4 text-3xl font-bold font-poppins text-white">
            Join Our Community
          </h2>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
            Choose the membership tier that's right for you and get access to exclusive content and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl ${
                tier.popular
                  ? "border-2 border-primary bg-gradient-to-br from-gray-800 to-gray-900 transform md:scale-105"
                  : "border border-gray-700 bg-gray-800"
              }`}
            >
              {tier.popular && (
                <div className="bg-primary text-gray-900 py-1.5 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1 font-poppins text-white">{tier.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <p className="text-gray-300 mb-6">{tier.description}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-primary h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={
                    tier.popular
                      ? "w-full bg-primary hover:bg-primary/90 text-gray-900 font-medium"
                      : "w-full border border-primary text-primary hover:bg-primary/10"
                  }
                  variant={tier.popular ? "default" : "outline"}
                >
                  <Link href={tier.buttonLink}>{tier.buttonText}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
