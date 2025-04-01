import { useAuth } from "./use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const { user } = useAuth();
  const { toast } = useToast();
  
  const upgradeMembership = useMutation({
    mutationFn: async ({ tier }: { tier: string }) => {
      const res = await apiRequest("POST", "/api/upgrade-membership", { tier });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Membership upgraded",
        description: "Your membership has been successfully upgraded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
      price: 299,
      description: "Full access to premium content and features",
      features: [
        "Everything in Basic",
        "Full community access",
        "Exclusive premium content",
        "Early access to new videos",
        "Member-only chat rooms",
        "Store discounts (15%)",
        "Create custom chat rooms",
        "Priority support"
      ],
      highlighted: true,
      badge: "Best Value"
    }
  ];

  const currentTier = user?.membershipTier || "free";

  const canUpgrade = (tierId: string): boolean => {
    const tierRank = { "free": 0, "pro": 1 };
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
