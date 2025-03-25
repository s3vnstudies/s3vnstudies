import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Check, X } from "lucide-react";

export default function MembershipSection() {
  const { user, updateMembershipMutation } = useAuth();
  
  const handleSubscribe = (tier: string) => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    
    updateMembershipMutation.mutate({ membershipTier: tier });
  };
  
  return (
    <section className="py-20 text-white relative bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-primary bg-opacity-80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="font-featured inline-block py-1 px-4 bg-white text-primary rounded-full text-sm font-medium mb-4">Premium Membership</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Unlock the Full Experience</h2>
          <p className="text-lg opacity-90">Join our membership community and get access to exclusive content, live events, and connect directly with fellow members.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="bg-white rounded-xl overflow-hidden text-neutral-800 shadow-lg transform transition duration-300 hover:-translate-y-2">
            <CardContent className="p-8">
              <h3 className="font-heading text-xl font-bold mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Access to public content</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Community bulletin board</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Basic profile</span>
                </li>
                <li className="flex items-start text-neutral-400">
                  <X className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Premium content</span>
                </li>
                <li className="flex items-start text-neutral-400">
                  <X className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Community chat access</span>
                </li>
              </ul>
              <Button 
                variant="secondary" 
                className="w-full py-3 bg-neutral-200 text-neutral-800 font-semibold rounded-lg hover:bg-neutral-300 transition"
                onClick={() => handleSubscribe('free')}
              >
                {user?.membershipTier === 'free' ? 'Current Plan' : 'Get Started'}
              </Button>
            </CardContent>
          </Card>

          {/* Standard Tier */}
          <Card className="bg-white rounded-xl overflow-hidden text-neutral-800 shadow-lg transform transition duration-300 hover:-translate-y-2 relative">
            <div className="absolute top-0 left-0 right-0 bg-secondary text-white text-center py-1 text-sm font-medium">
              Most Popular
            </div>
            <CardContent className="p-8 pt-10">
              <h3 className="font-heading text-xl font-bold mb-2">Standard</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Premium content access</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Community chat rooms</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Early access to videos</span>
                </li>
                <li className="flex items-start text-neutral-400">
                  <X className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Private chat rooms</span>
                </li>
              </ul>
              <Button
                className="w-full py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition"
                onClick={() => handleSubscribe('standard')}
              >
                {user?.membershipTier === 'standard' ? 'Current Plan' : 'Join Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="bg-white rounded-xl overflow-hidden text-neutral-800 shadow-lg transform transition duration-300 hover:-translate-y-2">
            <CardContent className="p-8">
              <h3 className="font-heading text-xl font-bold mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Everything in Standard</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Create private chat rooms</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>1-on-1 monthly session</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Exclusive merch discount</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Ad-free experience</span>
                </li>
              </ul>
              <Button
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
                onClick={() => handleSubscribe('premium')}
              >
                {user?.membershipTier === 'premium' ? 'Current Plan' : 'Get Premium'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
