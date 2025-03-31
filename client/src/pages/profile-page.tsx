import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  User, Settings, Package, Calendar, CreditCard, LogOut, Crown, ClipboardList,
  Loader2, Check, AlertCircle, Mail, UserIcon
} from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isUpdateFormSubmitting, setIsUpdateFormSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - My Profile";
  }, []);
  
  // Set initial form values
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);
  
  // Fetch subscription data
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["/api/subscriptions/current"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return apiRequest("PATCH", `/api/users/${user?.id}`, profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/subscriptions/cancel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled. You'll continue to have access until the end of your current billing period.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdateFormSubmitting(true);
    
    updateProfileMutation.mutate(
      { displayName, email, bio, avatar },
      {
        onSettled: () => setIsUpdateFormSubmitting(false),
      }
    );
  };
  
  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.")) {
      setIsCancelling(true);
      cancelSubscriptionMutation.mutate(undefined, {
        onSettled: () => setIsCancelling(false),
      });
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // If there's no user data, show loading state
  if (!user) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.displayName || user.username}</CardTitle>
                  <CardDescription className="text-center mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-center mb-4">
                    <Badge className={`
                      ${user.membershipTier === 'pro' ? 'bg-purple-600' : 
                        user.membershipTier === 'premium' ? 'bg-primary' : 
                        'bg-gray-500'}
                    `}>
                      {user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Member
                    </Badge>
                  </div>
                  
                  <Button variant="outline" className="flex items-center justify-start" asChild>
                    <a href="#profile">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center justify-start" asChild>
                    <a href="#membership">
                      <Crown className="mr-2 h-4 w-4" /> Membership
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center justify-start" asChild>
                    <a href="#orders">
                      <Package className="mr-2 h-4 w-4" /> Orders
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center justify-start" asChild>
                    <a href="#settings">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </a>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                <TabsTrigger value="profile" id="profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger value="membership" id="membership">
                  <Crown className="mr-2 h-4 w-4" /> Membership
                </TabsTrigger>
                <TabsTrigger value="orders" id="orders">
                  <Package className="mr-2 h-4 w-4" /> Orders
                </TabsTrigger>
                <TabsTrigger value="settings" id="settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information visible to other community members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="username" className="text-sm font-medium">
                            Username
                          </label>
                          <Input
                            id="username"
                            value={user.username}
                            disabled
                            placeholder="Username"
                          />
                          <p className="text-xs text-gray-500">
                            Your username cannot be changed
                          </p>
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="displayName" className="text-sm font-medium">
                            Display Name
                          </label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="How you want to be known"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="bio" className="text-sm font-medium">
                            Bio
                          </label>
                          <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the community about yourself"
                            rows={4}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="avatar" className="text-sm font-medium">
                            Avatar URL (optional)
                          </label>
                          <Input
                            id="avatar"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isUpdateFormSubmitting}
                        className="mt-6"
                      >
                        {isUpdateFormSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Membership Tab */}
              <TabsContent value="membership">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Membership</CardTitle>
                    <CardDescription>
                      View and manage your membership status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="mr-4">
                          <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center
                            ${user.membershipTier === 'pro' ? 'bg-purple-100 text-purple-600' : 
                              user.membershipTier === 'premium' ? 'bg-blue-100 text-blue-600' : 
                              'bg-gray-100 text-gray-600'}
                          `}>
                            <Crown className="h-8 w-8" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {user.membershipTier === 'free' ? 'Basic Member' : 
                             user.membershipTier === 'premium' ? 'Premium Member' : 
                             'Pro Member'}
                          </h3>
                          {isLoadingSubscription ? (
                            <p className="text-sm text-gray-500">Loading subscription details...</p>
                          ) : subscription ? (
                            <p className="text-sm text-gray-500">
                              Active since {new Date(subscription.startDate).toLocaleDateString()}
                              {subscription.endDate && ` • Expires on ${new Date(subscription.endDate).toLocaleDateString()}`}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">No active subscription</p>
                          )}
                        </div>
                      </div>
                      
                      {user.membershipTier === 'free' ? (
                        <div className="space-y-4">
                          <div className="bg-primary/10 p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Upgrade to Premium or Pro</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Gain access to exclusive content, community features, and more by upgrading your membership.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button asChild className="flex-1">
                                <a href="/#pricing">View Membership Options</a>
                              </Button>
                            </div>
                          </div>
                          
                          <h3 className="font-medium text-lg mt-6">Benefits of Upgrading</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                              <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                              <div>
                                <h4 className="font-medium">Premium Content</h4>
                                <p className="text-sm text-gray-600">Access all premium articles and videos</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                              <div>
                                <h4 className="font-medium">Chat Access</h4>
                                <p className="text-sm text-gray-600">Join community chat rooms</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                              <div>
                                <h4 className="font-medium">Early Access</h4>
                                <p className="text-sm text-gray-600">Get content before everyone else</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                              <div>
                                <h4 className="font-medium">Store Discounts</h4>
                                <p className="text-sm text-gray-600">Special pricing on merchandise</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-green-50 p-4 rounded-lg flex items-start">
                            <Check className="text-green-500 mr-3 mt-1 h-5 w-5" />
                            <div>
                              <h3 className="font-bold text-green-700">Active Subscription</h3>
                              <p className="text-sm text-gray-600">
                                You have an active {user.membershipTier} membership with all benefits unlocked.
                              </p>
                            </div>
                          </div>
                          
                          <h3 className="font-medium text-lg mt-6">Your Membership Benefits</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                              <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                              <div>
                                <h4 className="font-medium">Premium Content</h4>
                                <p className="text-sm text-gray-600">Access all premium articles and videos</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                              <div>
                                <h4 className="font-medium">Chat Access</h4>
                                <p className="text-sm text-gray-600">Join community chat rooms</p>
                              </div>
                            </div>
                            {user.membershipTier === 'pro' && (
                              <>
                                <div className="flex items-start">
                                  <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                                  <div>
                                    <h4 className="font-medium">1-on-1 Monthly Call</h4>
                                    <p className="text-sm text-gray-600">Schedule your personal consultation</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <Check className="text-green-500 mr-2 mt-1 h-5 w-5" />
                                  <div>
                                    <h4 className="font-medium">15% Store Discount</h4>
                                    <p className="text-sm text-gray-600">Automatically applied at checkout</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="border-t pt-6 mt-6">
                            <h3 className="font-medium text-lg mb-4">Manage Subscription</h3>
                            {user.membershipTier === 'premium' && (
                              <Button className="mr-4">Upgrade to Pro</Button>
                            )}
                            <Button 
                              variant="outline" 
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                              onClick={handleCancelSubscription}
                              disabled={isCancelling}
                            >
                              {isCancelling ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                "Cancel Subscription"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Payment Methods Card */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods for subscriptions and purchases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {subscription ? (
                      <div className="space-y-4">
                        <div className="flex items-center p-4 border rounded-lg">
                          <div className="mr-4">
                            <CreditCard className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {subscription.paymentMethod?.type === 'credit_card' 
                                    ? `•••• •••• •••• ${subscription.paymentMethod?.details.last4}` 
                                    : 'PayPal Account'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {subscription.paymentMethod?.type === 'credit_card' 
                                    ? subscription.paymentMethod?.details.brand
                                    : subscription.paymentMethod?.details.email}
                                </p>
                              </div>
                              <Badge>Default</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline">Add Payment Method</Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No Payment Methods</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          You don't have any payment methods set up yet.
                        </p>
                        <Button variant="outline">Add Payment Method</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View your past orders and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingOrders ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order: any) => (
                          <div key={order.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-4 flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">
                                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge 
                                className={
                                  order.status === 'completed' ? 'bg-green-500' :
                                  order.status === 'processing' ? 'bg-blue-500' :
                                  order.status === 'shipped' ? 'bg-purple-500' :
                                  'bg-gray-500'
                                }
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="p-4">
                              <div className="space-y-4">
                                {order.items.map((item: any, index: number) => (
                                  <div key={index} className="flex items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md mr-4"></div>
                                    <div className="flex-1">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">
                                          Qty: {item.quantity}
                                        </p>
                                        <p className="font-medium">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t mt-4 pt-4 flex justify-between">
                                <span className="font-medium">Total</span>
                                <span className="font-bold">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 border-t">
                              <Button variant="outline" size="sm">View Order Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No Orders Yet</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          You haven't placed any orders yet.
                        </p>
                        <Button asChild>
                          <a href="/store">Browse Store</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" id="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">New Content Alerts</h4>
                              <p className="text-sm text-gray-500">
                                Receive emails when new articles or videos are published
                              </p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="new-content"
                                type="checkbox"
                                defaultChecked
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Community Updates</h4>
                              <p className="text-sm text-gray-500">
                                Updates about community events and announcements
                              </p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="community"
                                type="checkbox"
                                defaultChecked
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Order Updates</h4>
                              <p className="text-sm text-gray-500">
                                Updates about your orders and shipping
                              </p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="orders"
                                type="checkbox"
                                defaultChecked
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Marketing Emails</h4>
                              <p className="text-sm text-gray-500">
                                Special offers, promotions, and surveys
                              </p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="marketing"
                                type="checkbox"
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="font-medium text-lg mb-4">Privacy Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Profile Visibility</h4>
                              <p className="text-sm text-gray-500">
                                Allow other members to view your profile
                              </p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="visibility"
                                type="checkbox"
                                defaultChecked
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Activity Tracking</h4>
                              <p className="text-sm text-gray-500">
                                Allow us to track your activity to improve your experience
                              </p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="tracking"
                                type="checkbox"
                                defaultChecked
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="font-medium text-lg mb-4 text-red-600">Danger Zone</h3>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="text-red-500 mr-3 mt-1 h-5 w-5" />
                            <div>
                              <h4 className="font-medium text-red-600">Delete Account</h4>
                              <p className="text-sm text-gray-600 mb-4">
                                Permanently delete your account and all associated data. This action cannot be undone.
                              </p>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  alert("This feature is not yet implemented");
                                }}
                              >
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// Helper function for query fetching
function getQueryFn({ on401 }: { on401: "returnNull" }) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    
    return await res.json();
  };
}
