import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionPlan } from "@/lib/types";
import { MEMBERSHIP_TIERS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: number) => void;
  isLoading?: boolean;
}

export default function PricingCard({ plan, onSubscribe, isLoading = false }: PricingCardProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  const isCurrentPlan = user?.membershipTier === plan.name.toLowerCase();
  const isFreePlan = plan.price === 0;
  
  // Determine button text
  const getButtonText = () => {
    if (isCurrentPlan) return "Current Plan";
    if (isFreePlan) return "Sign up for free";
    return `Start your ${plan.name} trial`;
  };

  // Determine button style
  const getButtonStyle = () => {
    if (isCurrentPlan) return "bg-gray-100 border border-gray-300 text-gray-700 cursor-not-allowed";
    if (plan.name === "Basic") return "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200";
    if (plan.name === "Pro") return "bg-primary hover:bg-secondary text-white";
    return "bg-gray-800 hover:bg-gray-900 text-white";
  };

  return (
    <Card 
      className={`bg-white divide-y divide-gray-200 h-full flex flex-col ${
        plan.popular 
          ? "border-primary relative shadow-md" 
          : "border-gray-200 shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 h-8 w-8">
          <div className="absolute transform rotate-45 bg-primary text-white text-xs font-semibold py-1 right-[-35px] top-[15px] w-[170px] text-center">
            POPULAR
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
        <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
        <p className="mt-8">
          <span className="text-4xl font-extrabold text-gray-900">{formatCurrency(plan.price)}</span>
          <span className="text-base font-medium text-gray-500">/{plan.interval}</span>
        </p>
        <Button
          className={`mt-8 block w-full py-2 text-sm font-medium text-center ${getButtonStyle()}`}
          onClick={() => onSubscribe(plan.id)}
          disabled={isCurrentPlan || isLoading}
        >
          {getButtonText()}
        </Button>
      </div>
      <div className="pt-6 pb-8 px-6">
        <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase mb-4">What's included</h4>
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex space-x-3">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
