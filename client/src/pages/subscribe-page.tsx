import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Make sure to call loadStripe outside of a component's render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscriptionForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscribe-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An unknown error occurred");
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (e: any) {
      setErrorMessage(e.message || "An unknown error occurred");
      toast({
        title: "Payment Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-50 p-4 rounded-md flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Subscribe Now - $2.99/month"
        )}
      </Button>
    </form>
  );
};

export default function SubscribePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingSecret, setIsLoadingSecret] = useState(true);

  useEffect(() => {
    document.title = "Subscribe to Pro Membership - S3vn Studies";
  }, []);

  // Get client secret for Stripe
  useEffect(() => {
    if (user) {
      // Create subscription
      fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create subscription');
        }
        return response.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      })
      .catch(error => {
        toast({
          title: "Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingSecret(false);
      });
    }
  }, [user, toast]);

  // If user is already on pro plan
  if (user?.membershipTier === 'pro') {
    return (
      <PageLayout>
        <div className="container max-w-4xl mx-auto py-16 px-4">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-4">You're Already a Pro Member!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              You already have access to all premium content and features.
            </p>
            <Button asChild size="lg">
              <a href="/articles">Browse Premium Content</a>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // If loading auth
  if (isAuthLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  // If not logged in
  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please log in to subscribe to Pro membership",
    });
    return <Redirect to="/auth" />;
  }

  return (
    <PageLayout>
      <div className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold mb-4">Upgrade to Pro Membership</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Unlock all premium content and features with our Pro membership.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Full Access to Premium Articles</h3>
                  <p className="text-sm text-muted-foreground">Read all our expert content across all categories</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Enhanced Profile Features</h3>
                  <p className="text-sm text-muted-foreground">Upload and share your own content with the community</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Premium Chat Rooms</h3>
                  <p className="text-sm text-muted-foreground">Connect with like-minded individuals in our exclusive chat rooms</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Ad-Free Experience</h3>
                  <p className="text-sm text-muted-foreground">Enjoy an uninterrupted browsing experience</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h3 className="font-bold text-lg mb-2">Your Satisfaction Guaranteed</h3>
              <p className="text-sm">
                You can cancel your subscription at any time. If you're not completely satisfied with your Pro membership, 
                contact our support team for assistance.
              </p>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pro Membership</CardTitle>
                <CardDescription>
                  Subscribe today for full access to exclusive content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold">
                    $2.99<span className="text-lg text-muted-foreground font-normal">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Billed monthly, cancel anytime</p>
                </div>

                {isLoadingSecret || !clientSecret ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <SubscriptionForm />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}