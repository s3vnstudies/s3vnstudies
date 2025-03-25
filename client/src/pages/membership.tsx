import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import MainLayout from "@/layouts/MainLayout";
import MembershipTier from "@/components/MembershipTier";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Loader2, Check } from "lucide-react";

interface MembershipPlan {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  badge?: string;
  features: {
    name: string;
    included: boolean;
  }[];
  highlighted?: boolean;
}

export default function MembershipPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Fetch subscription data if user is logged in
  const { 
    data: subscription, 
    isLoading: isLoadingSubscription 
  } = useQuery({
    queryKey: ["/api/subscriptions/me"],
    enabled: !!user,
  });
  
  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async (tier: string) => {
      const res = await apiRequest("POST", "/api/subscriptions", {
        tier,
        startDate: new Date(),
        autoRenew: true,
        status: "active"
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Subscription successful",
        description: "Thank you for becoming a member! Your subscription is now active.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
  
  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/subscriptions/cancel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/me"] });
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled. You will have access until the end of your billing period.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubscribe = (tier: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      toast({
        title: "Authentication required",
        description: "Please login or create an account to subscribe.",
      });
      return;
    }
    
    setSelectedPlan(tier);
    subscribeMutation.mutate(tier);
  };
  
  const handleCancelSubscription = () => {
    cancelSubscriptionMutation.mutate();
  };
  
  // Membership plans data
  const membershipPlans: MembershipPlan[] = [
    {
      id: "basic",
      name: "Basic",
      price: {
        amount: 9.99,
        currency: "USD",
        period: "month"
      },
      badge: "Most Popular",
      features: [
        { name: "Access to exclusive videos", included: true },
        { name: "Community chat access", included: true },
        { name: "Monthly newsletter", included: true },
        { name: "Live Q&A sessions", included: false },
        { name: "Early access to content", included: false }
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: {
        amount: 19.99,
        currency: "USD",
        period: "month"
      },
      badge: "Best Value",
      highlighted: true,
      features: [
        { name: "Access to exclusive videos", included: true },
        { name: "Community chat access", included: true },
        { name: "Monthly newsletter", included: true },
        { name: "Live Q&A sessions", included: true },
        { name: "Early access to content", included: true }
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: {
        amount: 179.99,
        currency: "USD",
        period: "year"
      },
      badge: "Annual",
      features: [
        { name: "All Premium features", included: true },
        { name: "Exclusive merchandise", included: true },
        { name: "Private community access", included: true },
        { name: "Priority support", included: true },
        { name: "2 months free", included: true }
      ]
    }
  ];
  
  // FAQs data
  const faqs = [
    {
      question: "What are the benefits of membership?",
      answer: "Membership provides access to exclusive content not available to the public, including premium videos, in-depth tutorials, community features like chat rooms, and more. Different tiers offer different levels of access and perks."
    },
    {
      question: "Can I change my membership tier?",
      answer: "Yes, you can upgrade or downgrade your membership tier at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your current billing cycle."
    },
    {
      question: "How do I cancel my membership?",
      answer: "You can cancel your membership at any time from your account settings page. Your access will remain active until the end of your current billing period."
    },
    {
      question: "Is there a free trial?",
      answer: "We occasionally offer free trial periods for new members. Keep an eye on our homepage and newsletter for announcements about free trial opportunities."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, PayPal, and certain regional payment methods. All payments are processed securely, and we don't store your full payment information."
    }
  ];

  // Current user subscription status
  const userSubscriptionTier = subscription?.tier || (user?.membershipTier !== "free" ? user?.membershipTier : null);
  const isSubscribed = !!userSubscriptionTier;
  const subscriptionStatus = subscription?.status || "active";
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight mb-6">
            Join Our Membership
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Get exclusive access to premium content, community features, and special perks when you become a member.
          </p>
          {isSubscribed && (
            <div className="mt-8">
              <Badge className="px-3 py-2 text-md bg-white text-primary">
                Current Plan: {userSubscriptionTier?.charAt(0).toUpperCase() + userSubscriptionTier?.slice(1)}
              </Badge>
            </div>
          )}
        </div>
      </section>
      
      {/* Current Subscription Status (for subscribed users) */}
      {isSubscribed && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-slate-50 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Membership: {userSubscriptionTier?.charAt(0).toUpperCase() + userSubscriptionTier?.slice(1)}</h2>
                  <p className="text-slate-600">
                    Status: <span className={subscriptionStatus === "active" ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                      {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                    </span>
                  </p>
                  {subscription?.endDate && (
                    <p className="text-slate-600 mt-1">
                      {subscriptionStatus === "active" 
                        ? "Next billing date: " 
                        : "Access until: "}
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  {subscriptionStatus === "active" && (
                    <Button 
                      variant="outline" 
                      className="text-red-500 border-red-500 hover:bg-red-50"
                      onClick={handleCancelSubscription}
                      disabled={cancelSubscriptionMutation.isPending}
                    >
                      {cancelSubscriptionMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Subscription"
                      )}
                    </Button>
                  )}
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    Manage Membership
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Membership Plans Section */}
      <section id="plans" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              {isSubscribed ? "Upgrade Your Membership" : "Choose Your Membership Plan"}
            </h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              {isSubscribed 
                ? "Looking for more features? Upgrade to a higher tier to unlock additional benefits."
                : "Select the plan that best fits your needs and start enjoying exclusive content and features."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {membershipPlans.map((plan) => (
              <MembershipTier
                key={plan.id}
                name={plan.name}
                price={plan.price}
                badge={plan.badge}
                features={plan.features}
                highlighted={plan.highlighted}
                onSelect={() => handleSubscribe(plan.id)}
                className={userSubscriptionTier === plan.id ? "border-4 border-primary" : ""}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Membership Benefits</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Discover all the exclusive features and perks that come with your membership.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Exclusive Content</h3>
              <p className="text-slate-600">
                Access premium videos, tutorials, and articles not available to the public. New content added weekly.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Access</h3>
              <p className="text-slate-600">
                Join our private community of like-minded individuals. Ask questions, share ideas, and network.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Q&A Sessions</h3>
              <p className="text-slate-600">
                Participate in regular live sessions where you can ask questions and get direct answers from our experts.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Resource Library</h3>
              <p className="text-slate-600">
                Download templates, guides, and resources to help you implement what you've learned.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Early Access</h3>
              <p className="text-slate-600">
                Be the first to access new content and features before they're released to the public.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Member Discounts</h3>
              <p className="text-slate-600">
                Enjoy special discounts on merchandise, paid workshops, and future courses.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Comparison Table */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Plan Comparison</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Compare our membership plans to find the perfect fit for your needs.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b">Features</th>
                  <th className="p-4 text-center border-b">Basic</th>
                  <th className="p-4 text-center border-b bg-primary/5">Premium</th>
                  <th className="p-4 text-center border-b">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b">Exclusive Videos</td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b bg-primary/5"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Community Chat</td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b bg-primary/5"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Monthly Newsletter</td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b bg-primary/5"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Live Q&A Sessions</td>
                  <td className="p-4 text-center border-b">—</td>
                  <td className="p-4 text-center border-b bg-primary/5"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Early Access</td>
                  <td className="p-4 text-center border-b">—</td>
                  <td className="p-4 text-center border-b bg-primary/5"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Private Community</td>
                  <td className="p-4 text-center border-b">—</td>
                  <td className="p-4 text-center border-b bg-primary/5">—</td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Exclusive Merchandise</td>
                  <td className="p-4 text-center border-b">—</td>
                  <td className="p-4 text-center border-b bg-primary/5">—</td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Priority Support</td>
                  <td className="p-4 text-center border-b">—</td>
                  <td className="p-4 text-center border-b bg-primary/5">—</td>
                  <td className="p-4 text-center border-b"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Price</td>
                  <td className="p-4 text-center font-semibold">$9.99/month</td>
                  <td className="p-4 text-center font-semibold bg-primary/5">$19.99/month</td>
                  <td className="p-4 text-center font-semibold">$179.99/year <br /><span className="text-sm text-green-500">Save $60</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">What Our Members Say</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Hear from our community members about their experiences with our membership.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-slate-700 mb-6">
                "The content and community here have been instrumental in helping me develop my skills. The premium tutorials are well worth the subscription, and the community is incredibly supportive."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/28.jpg" 
                  alt="Jessica Martinez" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium">Jessica Martinez</h4>
                  <p className="text-slate-500 text-sm">Premium Member, 1 year</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-slate-700 mb-6">
                "I've been a member for six months, and the quality of content keeps improving. The chat rooms have connected me with other creators who have become collaborators on various projects."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Michael Thompson" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium">Michael Thompson</h4>
                  <p className="text-slate-500 text-sm">Basic Member, 6 months</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-slate-700 mb-6">
                "The exclusive tutorials and community access have been game-changing for my creative journey. I appreciate the attention to detail and the responsiveness of the team to community feedback."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/64.jpg" 
                  alt="Sophia Rodriguez" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium">Sophia Rodriguez</h4>
                  <p className="text-slate-500 text-sm">Pro Member, 2 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section id="faq" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Find answers to common questions about our membership plans.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="px-6 text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-8 text-center">
              <p className="text-slate-600 mb-4">
                Have more questions? We're here to help.
              </p>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="support" className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Get exclusive access to premium content, connect with like-minded creators, and take your skills to the next level.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!isSubscribed ? (
              <>
                <Button 
                  className="bg-white text-primary font-montserrat font-semibold text-lg px-8 py-6 rounded-full hover:shadow-xl transition-shadow"
                  size="lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Choose a Plan
                </Button>
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-2 border-white text-white font-montserrat font-semibold text-lg px-8 py-6 rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
                    size="lg"
                  >
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/profile">
                <Button 
                  className="bg-white text-primary font-montserrat font-semibold text-lg px-8 py-6 rounded-full hover:shadow-xl transition-shadow"
                  size="lg"
                >
                  Manage Your Membership
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
