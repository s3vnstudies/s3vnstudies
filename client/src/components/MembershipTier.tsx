import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Feature {
  name: string;
  included: boolean;
}

interface MembershipTierProps {
  name: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  badge?: string;
  features: Feature[];
  highlighted?: boolean;
  onSelect: () => void;
  className?: string;
}

export default function MembershipTier({
  name,
  price,
  badge,
  features,
  highlighted = false,
  onSelect,
  className,
}: MembershipTierProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-lg overflow-hidden text-slate-800 transform transition-transform hover:-translate-y-2",
        highlighted && "shadow-xl ring-4 ring-accent",
        className
      )}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-poppins font-bold">{name}</h3>
          {badge && (
            <Badge className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              highlighted ? "bg-accent text-white" : "bg-slate-100 text-slate-800"
            )}>
              {badge}
            </Badge>
          )}
        </div>
        
        <div className="mb-6">
          <span className="text-3xl font-bold">
            {price.currency === "USD" ? "$" : price.currency}
            {price.amount}
          </span>
          <span className="text-slate-600 opacity-70">/{price.period}</span>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <>
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>{feature.name}</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="opacity-50">{feature.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onSelect}
          className={cn(
            "w-full py-3 rounded-full font-montserrat font-semibold hover:shadow-lg transition-shadow",
            highlighted ? "bg-gradient-to-r from-accent to-orange-400 text-white" : "bg-gradient-to-r from-primary to-secondary text-white"
          )}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
