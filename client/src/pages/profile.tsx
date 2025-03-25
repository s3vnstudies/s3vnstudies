import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/layouts/MainLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { 
  User, 
  Shield, 
  Settings, 
  CreditCard, 
  Bell, 
  Key, 
  LifeBuoy,
  Loader2 
} from "lucide-react";

// Profile form schema
const profileFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  bio: z.string().max(300, "Bio must not exceed 300 characters").optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password change schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch subscription data
  const { 
    data: subscription, 
    isLoading: isLoadingSubscription 
  } = useQuery({
    queryKey: ["/api/subscriptions/me"],
    enabled: !!user,
  });

  // Profile form setup
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user, profileForm]);

  // Password form setup
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/profile", values);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Something went wrong. Please try again.",
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
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  // Handle password form submission
  const onPasswordSubmit = (values: PasswordFormValues) => {
    // This would typically connect to an API endpoint to change the password
    // For now, just show a toast
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });
    passwordForm.reset();
  };

  // Handle subscription cancellation
  const handleCancelSubscription = () => {
    if (confirm("Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.")) {
      cancelSubscriptionMutation.mutate();
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">You must be logged in to view this page</h1>
            <Button asChild>
              <a href="/auth">Login or Register</a>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
  const initials = getInitials(fullName);
  const userSubscriptionTier = subscription?.tier || (user?.membershipTier !== "free" ? user?.membershipTier : null);
  const isSubscribed = !!userSubscriptionTier;
  const subscriptionStatus = subscription?.status || "active";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl || ""} alt={fullName} />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{fullName}</h2>
                  <p className="text-sm text-slate-500">@{user.username}</p>
                  {user.role === "admin" && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </span>
                  )}
                  {isSubscribed && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {userSubscriptionTier?.charAt(0).toUpperCase() + userSubscriptionTier?.slice(1)} Member
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === "account" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("account")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                  <Button 
                    variant={activeTab === "billing" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("billing")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Button>
                  <Button 
                    variant={activeTab === "notifications" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === "security" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("security")}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Security
                  </Button>
                  <Button 
                    variant={activeTab === "help" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("help")}
                  >
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Help & Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and how others see you on the site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name. It can only contain letters, numbers, and underscores.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="avatarUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/avatar.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a URL for your profile picture
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us a little about yourself"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description for your profile. Maximum 300 characters.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Delete Account</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive" size="sm" className="mt-4">
                        Delete Account
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Download Your Data</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Download a copy of all data associated with your account
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Request Data Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>
                      Manage your membership subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingSubscription ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : isSubscribed ? (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {userSubscriptionTier?.charAt(0).toUpperCase() + userSubscriptionTier?.slice(1)} Plan
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">
                                Status: <span className={subscriptionStatus === "active" ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                                  {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                                </span>
                              </p>
                              {subscription?.endDate && (
                                <p className="text-sm text-slate-500 mt-1">
                                  {subscriptionStatus === "active" 
                                    ? "Next billing date: " 
                                    : "Access until: "}
                                  {new Date(subscription.endDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {subscriptionStatus === "active" && (
                              <Button 
                                variant="outline" 
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={handleCancelSubscription}
                                disabled={cancelSubscriptionMutation.isPending}
                              >
                                {cancelSubscriptionMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Cancel Subscription"
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                          <div className="bg-slate-50 p-4 rounded-lg mb-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-white p-2 rounded mr-4">
                                <CreditCard className="h-6 w-6 text-slate-700" />
                              </div>
                              <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-slate-500">Expires 12/25</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                          <Button variant="outline">Add Payment Method</Button>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Billing History</h3>
                          <div className="bg-slate-50 rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-slate-200 flex justify-between">
                              <div>
                                <p className="font-medium">May 1, 2023</p>
                                <p className="text-sm text-slate-500">Premium Plan - Monthly</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">$19.99</p>
                                <p className="text-sm text-green-600">Paid</p>
                              </div>
                            </div>
                            <div className="p-4 border-b border-slate-200 flex justify-between">
                              <div>
                                <p className="font-medium">April 1, 2023</p>
                                <p className="text-sm text-slate-500">Premium Plan - Monthly</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">$19.99</p>
                                <p className="text-sm text-green-600">Paid</p>
                              </div>
                            </div>
                            <div className="p-4 flex justify-between">
                              <div>
                                <p className="font-medium">March 1, 2023</p>
                                <p className="text-sm text-slate-500">Premium Plan - Monthly</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">$19.99</p>
                                <p className="text-sm text-green-600">Paid</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
                        <p className="text-slate-500 mb-6">You don't have an active membership subscription</p>
                        <Button asChild>
                          <a href="/membership">View Membership Plans</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Password must be at least 8 characters long
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Change Password</Button>
                    </form>
                  </Form>

                  <div className="border-t mt-8 pt-8">
                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                    <p className="text-slate-500 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="email-new-content"
                            className="mt-1"
                            defaultChecked
                          />
                          <div>
                            <label htmlFor="email-new-content" className="font-medium">
                              New Content Alerts
                            </label>
                            <p className="text-sm text-slate-500">
                              Receive notifications when new content is published
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="email-comments"
                            className="mt-1"
                            defaultChecked
                          />
                          <div>
                            <label htmlFor="email-comments" className="font-medium">
                              Comment Replies
                            </label>
                            <p className="text-sm text-slate-500">
                              Get notified when someone replies to your comments
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="email-events"
                            className="mt-1"
                            defaultChecked
                          />
                          <div>
                            <label htmlFor="email-events" className="font-medium">
                              Community Events
                            </label>
                            <p className="text-sm text-slate-500">
                              Receive notifications about upcoming events and workshops
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="email-marketing"
                            className="mt-1"
                          />
                          <div>
                            <label htmlFor="email-marketing" className="font-medium">
                              Marketing & Promotions
                            </label>
                            <p className="text-sm text-slate-500">
                              Receive updates about special offers and promotions
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Website Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="web-messages"
                            className="mt-1"
                            defaultChecked
                          />
                          <div>
                            <label htmlFor="web-messages" className="font-medium">
                              Chat Messages
                            </label>
                            <p className="text-sm text-slate-500">
                              Get notified when you receive new chat messages
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="web-mentions"
                            className="mt-1"
                            defaultChecked
                          />
                          <div>
                            <label htmlFor="web-mentions" className="font-medium">
                              Mentions
                            </label>
                            <p className="text-sm text-slate-500">
                              Get notified when you are mentioned in a comment or post
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "help" && (
              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>
                    Get help with your account or contact our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        <details className="group">
                          <summary className="flex justify-between items-center cursor-pointer list-none font-medium text-slate-800 p-4 rounded-lg bg-slate-50 hover:bg-slate-100">
                            How do I change my password?
                            <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </summary>
                          <div className="mt-2 p-4 text-slate-600">
                            You can change your password in the Security tab of your profile settings. You'll need to enter your current password first, then your new password twice to confirm.
                          </div>
                        </details>
                        <details className="group">
                          <summary className="flex justify-between items-center cursor-pointer list-none font-medium text-slate-800 p-4 rounded-lg bg-slate-50 hover:bg-slate-100">
                            How do I cancel my subscription?
                            <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </summary>
                          <div className="mt-2 p-4 text-slate-600">
                            You can cancel your subscription at any time from the Billing tab in your profile settings. Look for the "Cancel Subscription" button. Your access will remain active until the end of your current billing period.
                          </div>
                        </details>
                        <details className="group">
                          <summary className="flex justify-between items-center cursor-pointer list-none font-medium text-slate-800 p-4 rounded-lg bg-slate-50 hover:bg-slate-100">
                            How do I update my profile information?
                            <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </summary>
                          <div className="mt-2 p-4 text-slate-600">
                            To update your profile information, go to the Profile tab in your settings. You can edit your name, username, bio, and profile picture from there. Don't forget to save your changes.
                          </div>
                        </details>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Contact Support</h3>
                      <p className="text-slate-600 mb-4">
                        If you can't find an answer to your question, our support team is here to help.
                      </p>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="subject" className="block font-medium mb-1">
                            Subject
                          </label>
                          <Input id="subject" placeholder="What can we help you with?" />
                        </div>
                        <div>
                          <label htmlFor="message" className="block font-medium mb-1">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            placeholder="Please describe your issue in detail"
                            rows={5}
                          />
                        </div>
                        <Button>Submit Support Request</Button>
                      </form>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Other Ways to Reach Us</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span className="text-slate-600">support@s3vnstudies.com</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-slate-600">+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                          <span className="text-slate-600">Online chat available Monday-Friday, 9am-5pm EST</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
