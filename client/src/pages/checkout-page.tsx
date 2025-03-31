import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";
import PageLayout from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CreditCard,
  ShoppingBag,
  MapPin,
  Truck,
  Check,
  AlertTriangle,
} from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expMonth: z.string().min(1, "Expiration month is required"),
  expYear: z.string().min(4, "Expiration year is required"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("shipping");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      cardName: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: "",
    },
  });

  // Set page title
  useEffect(() => {
    document.title = "Checkout - S3vn Studies";
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  // Continue to payment tab
  const continueToPayment = () => {
    setActiveTab("payment");
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        userId: user?.id,
        totalAmount: totalPrice + (totalPrice >= 5000 ? 0 : 799) + Math.round(totalPrice * 0.07),
        status: "pending",
        shippingAddress: `${values.address}, ${values.city}, ${values.state} ${values.zipCode}, ${values.country}`,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      // Submit order to API
      await apiRequest("POST", "/api/orders", orderData);

      // Clear cart and show success message
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your order is being processed.",
        variant: "default",
      });

      // Redirect to success page (in this case, the store page)
      navigate("/store");
    } catch (error) {
      toast({
        title: "Error placing order",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold font-poppins mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shipping">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping
                </TabsTrigger>
                <TabsTrigger value="payment" disabled={activeTab !== "payment" && form.formState.errors.address}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="shipping" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                        <CardDescription>
                          Enter your shipping details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="NY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Zip Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="US">United States</SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="button" 
                          className="w-full bg-primary hover:bg-primary-dark text-white"
                          onClick={() => {
                            form.trigger(["fullName", "email", "address", "city", "state", "zipCode", "country"]);
                            const hasErrors = !!form.formState.errors.fullName || 
                                            !!form.formState.errors.email || 
                                            !!form.formState.errors.address || 
                                            !!form.formState.errors.city || 
                                            !!form.formState.errors.state || 
                                            !!form.formState.errors.zipCode || 
                                            !!form.formState.errors.country;
                            
                            if (!hasErrors) {
                              continueToPayment();
                            }
                          }}
                        >
                          Continue to Payment
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="payment" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                        <CardDescription>
                          Enter your payment details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on Card</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input placeholder="1234 5678 9012 3456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="expMonth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiration Month</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <SelectItem
                                        key={i + 1}
                                        value={(i + 1).toString().padStart(2, "0")}
                                      >
                                        {(i + 1).toString().padStart(2, "0")}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="expYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiration Year</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="YYYY" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from(
                                      { length: 10 },
                                      (_, i) => new Date().getFullYear() + i
                                    ).map((year) => (
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex items-start mt-6 text-sm text-neutral-600">
                          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                          <p>
                            This is a demo checkout. No real transactions will be processed
                            and no actual payment information will be stored.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full sm:w-auto"
                          onClick={() => setActiveTab("shipping")}
                        >
                          Back to Shipping
                        </Button>
                        <Button 
                          type="submit" 
                          className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Place Order"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden sticky top-24">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-neutral-100 rounded-md flex items-center justify-center mr-2">
                          <ShoppingBag className="h-4 w-4 text-neutral-600" />
                        </div>
                        <span>
                          {item.product.name}{" "}
                          {item.quantity > 1 && `(${item.quantity})`}
                        </span>
                      </div>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span>{totalPrice >= 5000 ? "Free" : formatPrice(799)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax</span>
                    <span>{formatPrice(Math.round(totalPrice * 0.07))}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        totalPrice +
                          (totalPrice >= 5000 ? 0 : 799) +
                          Math.round(totalPrice * 0.07)
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 mr-2 text-green-600" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
