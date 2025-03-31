import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Order, Article, BulletinPost } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  User, 
  Settings, 
  Package, 
  File, 
  MessageSquare, 
  CreditCard,
  Loader2, 
  Clock,
  ExternalLink
} from "lucide-react";

const profileFormSchema = z.object({
  fullName: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  avatar: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  aboutMe: z.string().max(500, "About me must be less than 500 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Get user orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    queryFn: async ({ queryKey }) => {
      if (!user) return [];
      
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      
      return await res.json();
    },
    enabled: !!user,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      avatar: user?.avatar || "",
      aboutMe: user?.aboutMe || "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to view your profile
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/auth">
              <Button className="w-full">Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user.avatar || ""} alt={user.username} />
                  <AvatarFallback className="text-xl bg-primary text-white">
                    {user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.fullName || user.username}</CardTitle>
                <CardDescription>
                  <Badge variant={user.membershipTier === 'vip' ? 'secondary' : user.membershipTier === 'pro' ? 'default' : 'outline'}>
                    {user.membershipTier === 'vip' ? 'VIP Member' : user.membershipTier === 'pro' ? 'Pro Member' : 'Basic Member'}
                  </Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === "membership" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("membership")}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Membership
                </Button>
                <Button
                  variant={activeTab === "favorites" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("favorites")}
                >
                  <File className="h-5 w-5 mr-2" />
                  Saved Content
                </Button>
                <Button
                  variant={activeTab === "messages" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Messages
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the name that will be displayed on your profile
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Your username" {...field} disabled />
                            </FormControl>
                            <FormDescription>
                              Your username cannot be changed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/avatar.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the URL of an image to use as your avatar
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="aboutMe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Me</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself" 
                                className="h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed on your public profile
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit"
                        disabled={updateProfile.isPending}
                      >
                        {updateProfile.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    View your order history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id}>
                          <CardHeader className="pb-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <div>
                                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                <CardDescription>
                                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </CardDescription>
                              </div>
                              <Badge className="mt-2 sm:mt-0">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {(order.items as any[]).map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="font-medium">{item.quantity}x {item.productId}</div>
                                    <div className="ml-2 text-sm text-neutral-500">{item.color}</div>
                                  </div>
                                  <div>${(item.price * item.quantity / 100).toFixed(2)}</div>
                                </div>
                              ))}
                              <Separator className="my-2" />
                              <div className="flex justify-between font-bold">
                                <div>Total</div>
                                <div>${(order.total / 100).toFixed(2)}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-600 mb-4">You haven't placed any orders yet.</p>
                      <Link href="/store">
                        <Button>Browse Store</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Membership Tab */}
            <TabsContent value="membership">
              <Card>
                <CardHeader>
                  <CardTitle>Membership</CardTitle>
                  <CardDescription>
                    Manage your membership and subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Current Plan</h3>
                        <p className="text-neutral-600">
                          {user.membershipTier === 'vip' 
                            ? 'VIP Access' 
                            : user.membershipTier === 'pro' 
                              ? 'Pro Access' 
                              : 'Basic Access'}
                        </p>
                      </div>
                      <Badge variant={user.membershipTier === 'vip' ? 'secondary' : user.membershipTier === 'pro' ? 'default' : 'outline'}>
                        {user.membershipTier === 'vip' ? 'VIP Member' : user.membershipTier === 'pro' ? 'Pro Member' : 'Basic Member'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-neutral-500 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Member since: {new Date(user.memberSince).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <Card className="bg-neutral-50">
                      <CardContent className="py-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Next billing date</h4>
                            <p className="text-sm text-neutral-600">Simulated - no actual billing</p>
                          </div>
                          <Button variant="outline" size="sm">Change Plan</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Membership Benefits</h3>
                    <div className="space-y-2">
                      {user.membershipTier === 'vip' ? (
                        <>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Access to all Pro features</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>1-on-1 monthly sessions</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>VIP store discounts (15%)</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Create custom chat rooms</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Exclusive VIP events</p>
                          </div>
                        </>
                      ) : user.membershipTier === 'pro' ? (
                        <>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Full community access</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Exclusive premium content</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Early access to new videos</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Member-only chat rooms</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Public articles and content</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Limited community features</p>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-secondary/10 p-1 rounded mr-2">
                              <svg className="h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <p>Access to public videos</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-6">
                      <Link href="/membership">
                        <Button>
                          {user.membershipTier === 'vip' 
                            ? 'Manage Membership' 
                            : 'Upgrade Membership'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Content Tab */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Content</CardTitle>
                  <CardDescription>
                    View your saved articles and videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="articles">
                    <TabsList className="mb-6">
                      <TabsTrigger value="articles">Articles</TabsTrigger>
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="articles">
                      <div className="text-center py-8">
                        <p className="text-neutral-600 mb-4">You haven't saved any articles yet.</p>
                        <Link href="/articles">
                          <Button>Browse Articles</Button>
                        </Link>
                      </div>
                    </TabsContent>
                    <TabsContent value="videos">
                      <div className="text-center py-8">
                        <p className="text-neutral-600 mb-4">You haven't saved any videos yet.</p>
                        <Link href="/videos">
                          <Button>Browse Videos</Button>
                        </Link>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    View your personal messages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-neutral-600 mb-4">You don't have any messages yet.</p>
                    <Link href="/community">
                      <Button>Go to Community</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Account Information</h3>
                      <p className="text-neutral-600 mb-4">
                        Email: {user.email}<br />
                        Username: {user.username}<br />
                        Account Type: {user.role}
                      </p>
                      <Button variant="outline">Change Email</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">Password</h3>
                      <p className="text-neutral-600 mb-4">
                        Last changed: Not available
                      </p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">Notification Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="email-notifications" className="text-sm font-medium">
                            Email Notifications
                          </label>
                          <input 
                            type="checkbox" 
                            id="email-notifications" 
                            className="h-4 w-4" 
                            defaultChecked 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="new-content" className="text-sm font-medium">
                            New Content Alerts
                          </label>
                          <input 
                            type="checkbox" 
                            id="new-content" 
                            className="h-4 w-4" 
                            defaultChecked 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="community-updates" className="text-sm font-medium">
                            Community Updates
                          </label>
                          <input 
                            type="checkbox" 
                            id="community-updates" 
                            className="h-4 w-4" 
                            defaultChecked 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-red-600">Danger Zone</h3>
                      <p className="text-neutral-600 mb-4">
                        These actions are irreversible.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
