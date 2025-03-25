import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Order } from "@shared/schema";
import { User, Settings, Package, CreditCard, ShoppingBag, Calendar, Clock, Eye } from "lucide-react";
import { formatDistance } from "date-fns";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  
  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: activeTab === "orders",
  });
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold mb-4">You need to be logged in to view this page</h1>
            <Button onClick={() => window.location.href = "/auth"}>Login or Register</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 lg:w-80">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user.avatarUrl || ""} />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-2">{user.fullName || user.username}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="mt-2">
                    <Badge className={`
                      ${user.membershipTier === 'premium' ? 'bg-primary' : 
                        user.membershipTier === 'standard' ? 'bg-secondary' : 'bg-neutral-500'}
                    `}>
                      {user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Member
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    <Button 
                      variant={activeTab === "account" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("account")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                    <Button 
                      variant={activeTab === "orders" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("orders")}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Orders
                    </Button>
                    <Button 
                      variant={activeTab === "subscription" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("subscription")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Subscription
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {activeTab === "account" && "Account Information"}
                    {activeTab === "orders" && "Order History"}
                    {activeTab === "subscription" && "Subscription Management"}
                    {activeTab === "settings" && "Account Settings"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "account" && "View and edit your account details"}
                    {activeTab === "orders" && "Track and manage your orders"}
                    {activeTab === "subscription" && "Manage your membership subscription"}
                    {activeTab === "settings" && "Customize your account settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Account Tab */}
                  {activeTab === "account" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" value={user.username} disabled className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={user.email} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" value={user.fullName || ""} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="joined">Member Since</Label>
                          <Input 
                            id="joined" 
                            value={new Date(user.createdAt).toLocaleDateString()} 
                            disabled 
                            className="mt-1" 
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Update Profile</Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Orders Tab */}
                  {activeTab === "orders" && (
                    <div>
                      {ordersLoading ? (
                        <div className="space-y-4">
                          {Array(3).fill(0).map((_, index) => (
                            <div key={index} className="border rounded-md p-4">
                              <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4 animate-pulse"></div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : !orders || orders.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                            <Package className="h-8 w-8 text-neutral-400" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No orders yet</h3>
                          <p className="text-neutral-500 mb-6">You haven't placed any orders with us yet.</p>
                          <Button onClick={() => window.location.href = "/store"}>Browse Store</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <Card key={order.id}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-base">Order #{order.id}</CardTitle>
                                    <CardDescription>
                                      Placed {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}
                                    </CardDescription>
                                  </div>
                                  <Badge className={`
                                    ${order.status === 'delivered' ? 'bg-green-500' : 
                                      order.status === 'shipped' ? 'bg-blue-500' : 
                                      order.status === 'processing' ? 'bg-yellow-500' : 
                                      order.status === 'cancelled' ? 'bg-red-500' : 'bg-neutral-500'}
                                  `}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {(order.orderItems as any[]).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 bg-neutral-100 rounded overflow-hidden mr-3">
                                          {item.imageUrl && (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                          )}
                                        </div>
                                        <div>
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                        </div>
                                      </div>
                                      <p className="font-medium">${(item.price * item.quantity / 100).toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t font-bold">
                                  <span>Total:</span>
                                  <span>${(order.totalAmount / 100).toFixed(2)}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Subscription Tab */}
                  {activeTab === "subscription" && (
                    <div>
                      <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-heading text-lg font-bold mb-1">
                              {user.membershipTier === 'premium' ? 'Premium' : 
                               user.membershipTier === 'standard' ? 'Standard' : 'Free'} Membership
                            </h3>
                            <p className="text-neutral-600 mb-2">
                              {user.subscriptionStatus === 'active' ? 'Your subscription is active' : 'You are on the free plan'}
                            </p>
                            {user.membershipTier !== 'free' && (
                              <div className="flex items-center text-sm text-neutral-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Next billing date: June 15, 2023</span>
                              </div>
                            )}
                          </div>
                          {user.membershipTier !== 'free' && user.subscriptionStatus === 'active' && (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {user.membershipTier === 'free' ? (
                        <div className="text-center">
                          <h3 className="font-heading font-bold mb-2">Upgrade Your Experience</h3>
                          <p className="text-neutral-600 mb-4">
                            Unlock premium content and community features with a paid membership.
                          </p>
                          <Button onClick={() => window.location.href = "/membership"}>
                            View Membership Options
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-heading font-medium mb-2">Payment Method</h3>
                            <div className="flex items-center p-3 border rounded-md">
                              <div className="mr-3">
                                <CreditCard className="h-6 w-6 text-neutral-500" />
                              </div>
                              <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-neutral-500">Expires 12/25</p>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-auto">
                                Update
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-heading font-medium mb-2">Billing History</h3>
                            <div className="border rounded-md overflow-hidden">
                              <div className="bg-neutral-50 px-4 py-2 font-medium text-sm grid grid-cols-3">
                                <span>Date</span>
                                <span>Amount</span>
                                <span>Status</span>
                              </div>
                              <div className="divide-y">
                                <div className="px-4 py-3 grid grid-cols-3 text-sm">
                                  <span>May 15, 2023</span>
                                  <span>${user.membershipTier === 'premium' ? '19.99' : '9.99'}</span>
                                  <span className="text-green-600">Successful</span>
                                </div>
                                <div className="px-4 py-3 grid grid-cols-3 text-sm">
                                  <span>April 15, 2023</span>
                                  <span>${user.membershipTier === 'premium' ? '19.99' : '9.99'}</span>
                                  <span className="text-green-600">Successful</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t">
                            <Button 
                              variant="outline" 
                              onClick={() => window.location.href = "/membership"}
                            >
                              {user.membershipTier === 'standard' ? 'Upgrade to Premium' : 'Manage Plan'}
                            </Button>
                            <Button variant="destructive">Cancel Subscription</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Settings Tab */}
                  {activeTab === "settings" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-heading font-medium mb-3">Email Preferences</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="newsletter" defaultChecked className="mr-2" />
                            <Label htmlFor="newsletter">Newsletter and updates</Label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="contentAlerts" defaultChecked className="mr-2" />
                            <Label htmlFor="contentAlerts">New content alerts</Label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="comments" defaultChecked className="mr-2" />
                            <Label htmlFor="comments">Comment notifications</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-heading font-medium mb-3">Security</h3>
                        <Button variant="outline" className="mr-3">Change Password</Button>
                        <Button variant="outline">Two-Factor Authentication</Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-heading font-medium mb-3">Privacy</h3>
                        <p className="text-sm text-neutral-600 mb-3">
                          Control how your information is displayed and shared within the community.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="profileVisibility" defaultChecked className="mr-2" />
                            <Label htmlFor="profileVisibility">Show my profile to other members</Label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="activityVisibility" defaultChecked className="mr-2" />
                            <Label htmlFor="activityVisibility">Show my activity in the community</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-heading font-medium mb-3 text-red-600">Danger Zone</h3>
                        <p className="text-sm text-neutral-600 mb-3">
                          Permanently delete your account and all associated data.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Activity Card */}
              {activeTab === "account" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-neutral-100 rounded-full">
                          <Eye className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div>
                          <p className="font-medium">You viewed "Advanced Data Visualization Techniques"</p>
                          <p className="text-sm text-neutral-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> 2 hours ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-neutral-100 rounded-full">
                          <MessageSquare className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div>
                          <p className="font-medium">You commented on "Creative Problem Solving Workshop"</p>
                          <p className="text-sm text-neutral-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Yesterday
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-neutral-100 rounded-full">
                          <ShoppingBag className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div>
                          <p className="font-medium">You purchased "S3VN Logo Hoodie"</p>
                          <p className="text-sm text-neutral-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> 3 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
