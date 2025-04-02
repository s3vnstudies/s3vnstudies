import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Extract the payment_intent and payment_intent_client_secret from URL
    const params = new URLSearchParams(location.split('?')[1]);
    const paymentIntentId = params.get('payment_intent');
    
    if (!paymentIntentId) {
      toast({
        title: "Error",
        description: "Payment information missing. Please try again.",
        variant: "destructive"
      });
      setLocation('/subscribe');
      return;
    }

    // Verify and complete the subscription process
    apiRequest("POST", "/api/complete-subscription", { paymentIntentId })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || "Failed to complete subscription");
          });
        }
        return res.json();
      })
      .then(() => {
        // Invalidate the user query to refresh the user's membership status
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        
        toast({
          title: "Success!",
          description: "Your Pro membership is now active!",
        });
      })
      .catch(error => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      });
  }, [location, setLocation, toast]);

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your Pro membership subscription has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              You now have full access to all premium content on S3vn Studies, including:
            </p>
            <ul className="list-disc list-inside text-left space-y-2 mb-6">
              <li>All premium articles and guides</li>
              <li>Exclusive video content</li>
              <li>Member-only chat rooms</li>
              <li>Priority support</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setLocation('/articles')}>
              Browse Articles
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}