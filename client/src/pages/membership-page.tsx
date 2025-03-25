import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Crown, BadgeCheck, BookOpen, Users, Settings, Star, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MembershipPage() {
  const { user, updateMembershipMutation } = useAuth();
  
  const handleSubscribe = (tier: string) => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    
    updateMembershipMutation.mutate({ membershipTier: tier });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Membership Hero */}
        <section className="bg-gradient-to-r from-primary/90 to-secondary/80 text-white py-20 relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="font-featured inline-block py-1 px-4 bg-white text-primary rounded-full text-sm font-medium mb-4">S3VN Studies Membership</span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Unlock the Full Experience</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join our membership community to get exclusive access to premium content, interactive features, and connect directly with fellow members.
              </p>
              {user ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg py-4 px-6 inline-block">
                  <p className="text-white mb-2">
                    Your current membership: <span className="font-bold">{user.membershipTier === 'premium' ? 'Premium' : user.membershipTier === 'standard' ? 'Standard' : 'Free'}</span>
                  </p>
                  {user.membershipTier !== 'free' && (
                    <p className="text-white/80 text-sm">
                      Subscription status: <span className={`font-semibold ${user.subscriptionStatus === 'active' ? 'text-green-300' : 'text-yellow-300'}`}>
                        {user.subscriptionStatus === 'active' ? 'Active' : user.subscriptionStatus}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <Button 
                  className="bg-white text-primary hover:bg-neutral-100 text-lg font-semibold px-8 py-2.5"
                  onClick={() => window.location.href = "/auth"}
                >
                  Sign Up Now
                </Button>
              )}
            </div>
          </div>
        </section>
        
        {/* Pricing Plans */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-neutral-600">
                We offer flexible membership options to suit your needs. Upgrade anytime to get more benefits.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Tier */}
              <Card className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:-translate-y-2">
                <CardHeader className="bg-neutral-100 pb-6">
                  <CardTitle className="font-heading text-xl font-bold">Free</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
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
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-neutral-200 text-neutral-800 font-semibold hover:bg-neutral-300 transition"
                    onClick={() => handleSubscribe('free')}
                    disabled={user?.membershipTier === 'free'}
                  >
                    {user?.membershipTier === 'free' ? 'Current Plan' : 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Standard Tier */}
              <Card className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:-translate-y-2 relative border-secondary">
                <div className="absolute top-0 left-0 right-0 bg-secondary text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
                <CardHeader className="bg-secondary/10 pb-6 pt-8">
                  <CardTitle className="font-heading text-xl font-bold text-secondary">Standard</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
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
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-secondary text-white font-semibold hover:bg-secondary-dark transition"
                    onClick={() => handleSubscribe('standard')}
                    disabled={user?.membershipTier === 'standard'}
                  >
                    {user?.membershipTier === 'standard' ? 'Current Plan' : 'Join Now'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Premium Tier */}
              <Card className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:-translate-y-2 border-primary">
                <CardHeader className="bg-primary/10 pb-6">
                  <CardTitle className="font-heading text-xl font-bold text-primary">Premium</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$19.99</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
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
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-primary text-white font-semibold hover:bg-primary-dark transition"
                    onClick={() => handleSubscribe('premium')}
                    disabled={user?.membershipTier === 'premium'}
                  >
                    {user?.membershipTier === 'premium' ? 'Current Plan' : 'Get Premium'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Membership Benefits */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Membership Benefits</h2>
              <p className="text-neutral-600">
                Discover all the advantages of becoming a member of our growing community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Premium Content</h3>
                <p className="text-neutral-600">
                  Access exclusive articles, videos, and resources not available to non-members.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Community Access</h3>
                <p className="text-neutral-600">
                  Join topic-specific chat rooms and connect with like-minded individuals.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <BadgeCheck className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Early Access</h3>
                <p className="text-neutral-600">
                  Be the first to see new content and features before they're released to the public.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Personalization</h3>
                <p className="text-neutral-600">
                  Customize your profile and tailor your content experience to your interests.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Exclusive Events</h3>
                <p className="text-neutral-600">
                  Participate in member-only live sessions, workshops, and virtual meetups.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Private Rooms</h3>
                <p className="text-neutral-600">
                  Premium members can create and moderate their own private chat rooms.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I upgrade my membership?</AccordionTrigger>
                  <AccordionContent>
                    You can upgrade your membership at any time by visiting this membership page and selecting your desired tier. If you're not logged in, you'll need to create an account or sign in first. Your new benefits will be available immediately after upgrading.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel your subscription at any time from your profile settings. Your premium access will continue until the end of your current billing period. There are no cancellation fees.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept major credit cards (Visa, Mastercard, American Express), PayPal, and in some regions, Apple Pay and Google Pay. All payments are securely processed and your information is never stored on our servers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is there a discount for annual subscriptions?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer a 20% discount for annual subscriptions. You can select the annual billing option during the checkout process to take advantage of this savings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What's included in the Premium membership?</AccordionTrigger>
                  <AccordionContent>
                    Premium membership includes everything in the Standard tier plus the ability to create private chat rooms, a monthly 1-on-1 session with our team, exclusive merchandise discounts (25% off), and a completely ad-free experience across the entire platform.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Do you offer team or educational discounts?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer special pricing for educational institutions and teams of 5 or more members. Please contact our support team at support@s3vnstudies.com for more information on bulk pricing options.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-primary text-white text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-12 w-12 text-white opacity-90" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Unlock the Full Experience?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of members who are already enjoying premium content and community features.
            </p>
            <Button 
              className="bg-white text-primary hover:bg-neutral-100 px-8 py-3 text-lg font-semibold"
              onClick={() => user ? handleSubscribe('standard') : window.location.href = "/auth"}
            >
              {user ? 'Upgrade Now' : 'Get Started'}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
