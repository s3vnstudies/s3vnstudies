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
        "Public articles and content",
        "Limited community features",
        "Access to public videos",
      ],
      buttonText: "Get Started",
      buttonLink: user ? "/membership" : "/auth",
    },
    {
      name: "Pro Access",
      price: "$9.99",
      description: "Full access to premium content and features",
      features: [
        "Everything in Basic",
        "Full community access",
        "Exclusive premium content",
        "Early access to new videos",
        "Member-only chat rooms",
      ],
      buttonText: "Subscribe Now",
      buttonLink: user ? "/membership" : "/auth",
      popular: true,
    },
    {
      name: "VIP Access",
      price: "$24.99",
      description: "The ultimate membership experience",
      features: [
        "Everything in Pro Access",
        "1-on-1 monthly sessions",
        "VIP store discounts (15%)",
        "Create custom chat rooms",
        "Exclusive VIP events",
      ],
      buttonText: "Get VIP Access",
      buttonLink: user ? "/membership" : "/auth",
    },
  ];

  return (
    <section id="membership" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
            Membership
          </span>
          <h2 className="mt-4 text-3xl font-bold font-poppins text-neutral-900">
            Join Our Community
          </h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
            Choose the membership tier that's right for you and get access to exclusive content and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg ${
                tier.popular
                  ? "border-2 border-primary transform scale-105"
                  : "border border-neutral-200"
              }`}
            >
              {tier.popular && (
                <div className="bg-primary text-white py-1 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1 font-poppins">{tier.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-neutral-500 ml-1">/month</span>
                </div>
                <p className="text-neutral-600 mb-6">{tier.description}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-secondary h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={
                    tier.popular
                      ? "w-full bg-primary hover:bg-primary-dark text-white"
                      : "w-full border border-primary text-primary hover:bg-primary-light/5"
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
