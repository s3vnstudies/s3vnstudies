import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMembership, MembershipTier } from "@/hooks/use-membership";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function MembershipPage() {
  const { user } = useAuth();
  const { membershipTiers, currentTier, canUpgrade, upgradeTo, isProcessing } = useMembership();
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Format price for display
  const formatPrice = (price: number) => {
    if (price === 0) return "$0";
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleUpgrade = (tier: MembershipTier) => {
    setSelectedTier(tier);
    setPaymentDialogOpen(true);
  };

  const confirmUpgrade = () => {
    if (selectedTier) {
      upgradeTo(selectedTier.id);
      setPaymentDialogOpen(false);
    }
  };

  const MembershipCard = ({ tier }: { tier: MembershipTier }) => {
    const isCurrentTier = currentTier === tier.id;
    const canUpgradeToTier = canUpgrade(tier.id);

    return (
      <Card className={`h-full ${tier.highlighted ? "border-2 border-primary" : ""}`}>
        {tier.badge && (
          <div className="bg-primary text-white py-1 text-center text-sm font-medium">
            {tier.badge}
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {tier.name}
            {isCurrentTier && (
              <Badge variant="secondary" className="ml-2">
                Current Plan
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-bold">{formatPrice(tier.price)}</span>
            <span className="text-neutral-500 ml-1">/month</span>
          </div>
          <CardDescription>{tier.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-[#36B37E] mt-0.5 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {!user ? (
            <Link href="/auth" className="w-full">
              <Button className="w-full">Sign Up</Button>
            </Link>
          ) : isCurrentTier ? (
            <Button disabled className="w-full bg-secondary">
              Current Plan
            </Button>
          ) : canUpgradeToTier ? (
            <Button
              onClick={() => handleUpgrade(tier)}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : `Upgrade to ${tier.name}`}
            </Button>
          ) : (
            <Button disabled className="w-full opacity-70">
              Contact Support
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold font-poppins mb-4">Membership Plans</h1>
        <p className="text-lg text-neutral-600">
          Choose the plan that's right for you and get access to exclusive content and features
        </p>
      </div>

      <Tabs defaultValue="monthly" className="max-w-5xl mx-auto mb-16">
        <div className="text-center mb-8">
          <TabsList>
            <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
            <TabsTrigger value="yearly">Yearly Billing (Save 15%)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTiers.map((tier) => (
              <MembershipCard key={tier.id} tier={tier} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="yearly">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTiers.map((tier) => {
              // Apply 15% discount for yearly billing and adjust description
              const yearlyTier = {
                ...tier,
                price: Math.round(tier.price * 12 * 0.85), // 15% off annual price
                description: tier.price === 0 
                  ? tier.description 
                  : `${tier.description} (Billed annually)`,
              };
              return <MembershipCard key={tier.id} tier={yearlyTier} />;
            })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-poppins mb-6 text-center">Membership FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's included in each plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                Each plan level includes all the benefits of the previous levels plus additional exclusive features. 
                The Pro Access adds premium content and community features, while VIP Access includes personalized 
                sessions and the ability to create custom chat rooms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                Yes! You can upgrade your plan at any time. The new rate will be prorated for the remainder of your 
                billing cycle. If you need to downgrade, the change will take effect at the end of your current billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I cancel my subscription?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                You can cancel your subscription at any time from your account settings. Access to premium features will 
                continue until the end of your current billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                While we don't offer a free trial, we do have a Basic Access plan that allows you to experience many of 
                our platform's features at no cost. This lets you explore before committing to a paid subscription.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Membership Upgrade</DialogTitle>
            <DialogDescription>
              You're about to upgrade to {selectedTier?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{selectedTier?.name}</span>
                <span className="font-bold">{selectedTier && formatPrice(selectedTier.price)}/month</span>
              </div>
              <p className="text-sm text-neutral-600 mb-4">{selectedTier?.description}</p>
              <div className="flex items-center text-sm">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                <span>Your card will be charged immediately</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-neutral-600">
              By confirming, you agree to the terms of service and will be charged the amount shown above.
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Upgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
