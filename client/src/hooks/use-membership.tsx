import { useAuth } from "./use-auth";

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted: boolean;
  badge: string;
}

export function useMembership() {
  const { user, upgradeMembership } = useAuth();

  const membershipTiers: MembershipTier[] = [
    {
      id: "free",
      name: "Basic Access",
      price: 0,
      description: "Get started with basic access to our content",
      features: [
        "Public articles and content",
        "Limited community features",
        "Access to public videos"
      ],
      highlighted: false,
      badge: ""
    },
    {
      id: "pro",
      name: "Pro Access",
      price: 999,
      description: "Full access to premium content and features",
      features: [
        "Everything in Basic",
        "Full community access",
        "Exclusive premium content",
        "Early access to new videos",
        "Member-only chat rooms"
      ],
      highlighted: true,
      badge: "Most Popular"
    },
    {
      id: "vip",
      name: "VIP Access",
      price: 2499,
      description: "The ultimate membership experience",
      features: [
        "Everything in Pro Access",
        "1-on-1 monthly sessions",
        "VIP store discounts (15%)",
        "Create custom chat rooms",
        "Exclusive VIP events"
      ],
      highlighted: false,
      badge: ""
    }
  ];

  const currentTier = user?.membershipTier || "free";

  const canUpgrade = (tierId: string): boolean => {
    const tierRank = { "free": 0, "pro": 1, "vip": 2 };
    return tierRank[tierId as keyof typeof tierRank] > tierRank[currentTier as keyof typeof tierRank];
  };

  const upgradeTo = (tierId: string) => {
    if (canUpgrade(tierId)) {
      upgradeMembership.mutate({ tier: tierId });
    }
  };

  return {
    membershipTiers,
    currentTier,
    canUpgrade,
    upgradeTo,
    isProcessing: upgradeMembership.isPending
  };
}
