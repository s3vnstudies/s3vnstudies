import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PageLayout from "@/components/layout/page-layout";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Package,
  CreditCard,
  Mail,
  Edit,
  Calendar,
  CheckCircle2,
  UserPlus,
  Tag,
  Clock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Order } from "@shared/schema";

const profileFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  bio: z.string().max(250, "Bio cannot exceed 250 characters"),
  avatarUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Set page title
  useEffect(() => {
    document.title = "My Profile - S3vn Studies";
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Fetch user profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  // Fetch user's orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  // Fetch user's subscription
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["/api/subscriptions"],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof profileFormSchema>) => {
      await apiRequest("PUT", "/api/profile", values);
      return values;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });

  // Form for profile editing
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: profile?.displayName || user?.displayName || "",
      bio: profile?.bio || "",
      avatarUrl: profile?.avatarUrl || "",
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || user?.displayName || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile, user, form]);

  // Handle profile form submission
  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    updateProfileMutation.mutate(values);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  // Format membership name
  const formatMembershipTier = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  if (!user) {
    return null; // Handled by the redirect in useEffect
  }

  return (
    <PageLayout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-center mb-4">
            <User className="h-7 w-7 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold font-poppins">My Profile</h1>
          </div>
          <p className="text-lg opacity-90">
            Manage your account information and view your orders
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="membership">
              <UserPlus className="h-4 w-4 mr-2" />
              Membership
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.displayName || user.username} />
                      <AvatarFallback className="text-2xl bg-primary text-white">
                        {(profile?.displayName?.[0] || user.username[0])?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">
                        {profile?.displayName || user.username}
                      </h3>
                      <Badge className="mt-2 capitalize">
                        {user.membershipTier} Member
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 mt-0.5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Email</p>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 mt-0.5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Member Since</p>
                        <p>{formatDate(user.memberSince)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <UserPlus className="h-5 w-5 mr-3 mt-0.5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Membership</p>
                        <p className="capitalize">{user.membershipTier}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isEditing ? "Edit Profile" : "Profile Information"}
                    </CardTitle>
                    {isEditing && (
                      <CardDescription>
                        Update your profile information below
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your display name" {...field} />
                                </FormControl>
                                <FormDescription>
                                  This is the name that will be displayed to other members.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us a bit about yourself"
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Maximum 250 characters.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profile Picture URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com/your-image.jpg"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter a URL for your profile picture.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                              className="mr-2"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={updateProfileMutation.isPending}
                            >
                              {updateProfileMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-neutral-500">
                            Display Name
                          </h3>
                          <p className="mt-1">
                            {profile?.displayName || user.username}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-neutral-500">
                            Bio
                          </h3>
                          <p className="mt-1">
                            {profile?.bio || "No bio provided yet."}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-neutral-500">
                            Username
                          </h3>
                          <p className="mt-1">{user.username}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Package className="h-8 w-8 text-primary mr-3" />
                          <div>
                            <p className="text-sm text-neutral-500">Orders</p>
                            <p className="text-2xl font-semibold">
                              {isLoadingOrders ? "..." : orders?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <MessageSquare className="h-8 w-8 text-primary mr-3" />
                          <div>
                            <p className="text-sm text-neutral-500">Chat Rooms</p>
                            <p className="text-2xl font-semibold">
                              {user.membershipTier === "free" ? "Basic" : "Full"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="h-8 w-8 text-primary mr-3" />
                          <div>
                            <p className="text-sm text-neutral-500">Member For</p>
                            <p className="text-2xl font-semibold">
                              {formatDistanceToNow(new Date(user.memberSince))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="membership">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-neutral-50 rounded-lg mb-4">
                      <div className="flex items-center mb-2">
                        <UserPlus className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-semibold text-lg capitalize">
                          {user.membershipTier} Membership
                        </h3>
                      </div>
                      {isLoadingSubscription ? (
                        <p className="text-sm text-neutral-600">Loading subscription information...</p>
                      ) : subscription ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Status:</span>
                            <span className={subscription.active ? "text-green-600" : "text-red-600"}>
                              {subscription.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Auto-renew:</span>
                            <span>{subscription.autoRenew ? "Yes" : "No"}</span>
                          </div>
                          {subscription.endDate && (
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Renews on:</span>
                              <span>{formatDate(subscription.endDate)}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-600">
                          {user.membershipTier !== "free" 
                            ? "No subscription information available." 
                            : "You are on the free tier."}
                        </p>
                      )}
                    </div>
                    <Button
                      asChild
                      className={
                        user.membershipTier !== "free"
                          ? "w-full bg-secondary hover:bg-secondary-dark"
                          : "w-full bg-primary hover:bg-primary-dark"
                      }
                    >
                      <a href="/membership">
                        {user.membershipTier !== "free"
                          ? "Manage Subscription"
                          : "Upgrade Membership"}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Benefits</CardTitle>
                    <CardDescription>
                      Current benefits for your {formatMembershipTier(user.membershipTier)} membership
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.membershipTier === "free" && (
                        <>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Public articles and content</p>
                              <p className="text-sm text-neutral-600">
                                Access to all free articles, videos, and resources
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Limited community features</p>
                              <p className="text-sm text-neutral-600">
                                Basic access to community bulletin board and free chat rooms
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Access to public videos</p>
                              <p className="text-sm text-neutral-600">
                                Watch all free videos from the S3vn Studies channel
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {user.membershipTier === "pro" && (
                        <>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Everything in Free tier</p>
                              <p className="text-sm text-neutral-600">
                                All basic access features included
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Full community access</p>
                              <p className="text-sm text-neutral-600">
                                Access to Pro member chat rooms and ability to create new rooms
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Exclusive premium content</p>
                              <p className="text-sm text-neutral-600">
                                Access to Pro-level articles, videos, and educational resources
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Early access to new videos</p>
                              <p className="text-sm text-neutral-600">
                                Watch new content before it's available to free members
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Member-only chat rooms</p>
                              <p className="text-sm text-neutral-600">
                                Access to private discussions and topic-focused communities
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {user.membershipTier === "vip" && (
                        <>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Everything in Pro tier</p>
                              <p className="text-sm text-neutral-600">
                                All Pro membership features included
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">1-on-1 monthly sessions</p>
                              <p className="text-sm text-neutral-600">
                                Schedule personal coaching or Q&A sessions with our experts
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">VIP store discounts (15%)</p>
                              <p className="text-sm text-neutral-600">
                                Exclusive discounts on all merchandise in our store
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Create custom chat rooms</p>
                              <p className="text-sm text-neutral-600">
                                Create and moderate your own chat rooms on any topic
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                            <div>
                              <p className="font-medium">Exclusive VIP events</p>
                              <p className="text-sm text-neutral-600">
                                Invitations to special events, webinars, and early releases
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {user.membershipTier !== "vip" && (
                      <div className="mt-8 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <h3 className="font-semibold mb-2">Upgrade your membership</h3>
                        <p className="text-sm text-neutral-600 mb-4">
                          Get more benefits and exclusive content by upgrading to a higher tier membership.
                        </p>
                        <Button asChild className="bg-primary hover:bg-primary-dark">
                          <a href="/membership">View Membership Options</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>
                  Track and manage your orders and purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-neutral-600">Loading your orders...</p>
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-50 rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-neutral-600 mb-6">
                      You haven't placed any orders yet. Visit our store to discover our merchandise.
                    </p>
                    <Button asChild>
                      <a href="/store">Browse Store</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-neutral-50 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-2 text-primary" />
                              <span className="font-medium">Order #{order.id}</span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-neutral-600">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(order.orderDate)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="capitalize"
                            >
                              {order.status}
                            </Badge>
                            <div className="text-right">
                              <div className="font-medium">
                                ${(order.totalAmount / 100).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-4">
                          <p className="text-sm text-neutral-600 mb-2">
                            <span className="font-medium">Shipping Address:</span>
                          </p>
                          <p className="text-sm">{order.shippingAddress}</p>
                          
                          <Separator className="my-4" />
                          
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-sm"
                              asChild
                            >
                              <a href={`/orders/${order.id}`}>View Details</a>
                            </Button>
                            
                            {order.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm text-neutral-500"
                              >
                                Track Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
