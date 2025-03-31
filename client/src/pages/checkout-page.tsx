import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  CreditCard, Loader2, ShoppingCart, Check, ChevronLeft, 
  Trash2, Package, Gift
} from "lucide-react";

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [step, setStep] = useState("cart"); // "cart", "shipping", "payment", "confirmation"
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "paypal">("credit_card");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });
  
  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  
  // Apply discount for Pro members
  const discount = user?.membershipTier === "pro" ? subtotal * 0.15 : 0; // 15% discount
  const total = subtotal + shipping + tax - discount;
  
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - Checkout";
  }, []);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && step !== "confirmation") {
      navigate("/store");
    }
  }, [cartItems, navigate, step]);
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/orders", {
        total,
        status: "pending",
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        shippingAddress,
      });
    },
    onSuccess: () => {
      clearCart();
      setStep("confirmation");
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: "shipping" | "payment") => {
    const { name, value } = e.target;
    
    if (formType === "shipping") {
      setShippingAddress(prev => ({ ...prev, [name]: value }));
    } else {
      setCardInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleContinue = (nextStep: string) => {
    // Validate current step
    if (step === "cart" && cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    if (step === "shipping") {
      const { fullName, address, city, state, zipCode, country } = shippingAddress;
      if (!fullName || !address || !city || !state || !zipCode || !country) {
        toast({
          title: "Missing information",
          description: "Please fill out all shipping information fields.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === "payment") {
      if (paymentMethod === "credit_card") {
        const { cardNumber, cardName, expiry, cvc } = cardInfo;
        if (!cardNumber || !cardName || !expiry || !cvc) {
          toast({
            title: "Missing information",
            description: "Please fill out all payment information fields.",
            variant: "destructive",
          });
          return;
        }
        
        // Simple validation
        if (cardNumber.replace(/\s/g, "").length !== 16) {
          toast({
            title: "Invalid card number",
            description: "Please enter a valid 16-digit card number.",
            variant: "destructive",
          });
          return;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
          toast({
            title: "Invalid expiry date",
            description: "Please enter expiry date in MM/YY format.",
            variant: "destructive",
          });
          return;
        }
        
        if (cvc.length !== 3) {
          toast({
            title: "Invalid CVC",
            description: "Please enter a valid 3-digit CVC code.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Process order
      setIsProcessingOrder(true);
      createOrderMutation.mutate(undefined, {
        onSettled: () => setIsProcessingOrder(false),
      });
      return;
    }
    
    setStep(nextStep);
  };
  
  if (!user) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Login Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">Please login or create an account to continue with checkout.</p>
              <Button asChild>
                <a href="/auth">Login or Register</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        {/* Checkout Process Indicator */}
        {step !== "confirmation" && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="flex justify-between">
              <div className={`flex flex-col items-center ${step === "cart" ? "text-primary" : "text-gray-500"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === "cart" ? "bg-primary text-white" : "bg-gray-200"}`}>
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <span className="text-sm">Cart</span>
              </div>
              <div className="flex-1 flex items-center">
                <div className={`h-1 w-full ${step === "cart" ? "bg-gray-200" : "bg-primary"}`}></div>
              </div>
              <div className={`flex flex-col items-center ${step === "shipping" ? "text-primary" : "text-gray-500"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === "shipping" ? "bg-primary text-white" : step === "payment" || step === "confirmation" ? "bg-primary text-white" : "bg-gray-200"}`}>
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-sm">Shipping</span>
              </div>
              <div className="flex-1 flex items-center">
                <div className={`h-1 w-full ${step === "cart" || step === "shipping" ? "bg-gray-200" : "bg-primary"}`}></div>
              </div>
              <div className={`flex flex-col items-center ${step === "payment" ? "text-primary" : "text-gray-500"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === "payment" ? "bg-primary text-white" : step === "confirmation" ? "bg-primary text-white" : "bg-gray-200"}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-sm">Payment</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Cart Step */}
        {step === "cart" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Shopping Cart</span>
                    <span>{cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 mb-4">Add items to your cart to proceed with checkout.</p>
                      <Button asChild>
                        <a href="/store">Continue Shopping</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Cart Items */}
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex border-b pb-6">
                          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-4">
                            {item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.name}</h3>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                onClick={() => removeFromCart(item.productId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </Button>
                                <span className="mx-3">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex justify-between pt-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center"
                          asChild
                        >
                          <a href="/store">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Continue Shopping
                          </a>
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex items-center"
                          onClick={clearCart}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Clear Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    {user.membershipTier === "pro" && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center">
                          <Gift className="h-4 w-4 mr-1" /> Pro Discount (15%)
                        </span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleContinue("shipping")}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
        
        {/* Shipping Step */}
        {step === "shipping" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={shippingAddress.fullName} 
                          onChange={(e) => handleInputChange(e, "shipping")} 
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={shippingAddress.address} 
                          onChange={(e) => handleInputChange(e, "shipping")} 
                          placeholder="123 Main St"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={shippingAddress.city} 
                            onChange={(e) => handleInputChange(e, "shipping")} 
                            placeholder="New York"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={shippingAddress.state} 
                            onChange={(e) => handleInputChange(e, "shipping")} 
                            placeholder="NY"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">Postal/Zip Code</Label>
                          <Input 
                            id="zipCode" 
                            name="zipCode" 
                            value={shippingAddress.zipCode} 
                            onChange={(e) => handleInputChange(e, "shipping")} 
                            placeholder="10001"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input 
                            id="country" 
                            name="country" 
                            value={shippingAddress.country} 
                            onChange={(e) => handleInputChange(e, "shipping")} 
                            placeholder="United States"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("cart")}
                  >
                    Back to Cart
                  </Button>
                  <Button 
                    onClick={() => handleContinue("payment")}
                  >
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-gray-500">
                            {item.name} <span className="text-xs">x{item.quantity}</span>
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      
                      {user.membershipTier === "pro" && (
                        <div className="flex justify-between text-green-600">
                          <span className="flex items-center">
                            <Gift className="h-4 w-4 mr-1" /> Pro Discount (15%)
                          </span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Payment Step */}
        {step === "payment" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "credit_card" | "paypal")}>
                    <div className="flex items-center space-x-2 border rounded-md p-4 mb-4">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Credit Card
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center">
                        <i className="fab fa-paypal mr-2 text-blue-500"></i>
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit_card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          name="cardNumber" 
                          value={cardInfo.cardNumber} 
                          onChange={(e) => handleInputChange(e, "payment")} 
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input 
                          id="cardName" 
                          name="cardName" 
                          value={cardInfo.cardName} 
                          onChange={(e) => handleInputChange(e, "payment")} 
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input 
                            id="expiry" 
                            name="expiry" 
                            value={cardInfo.expiry} 
                            onChange={(e) => handleInputChange(e, "payment")} 
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input 
                            id="cvc" 
                            name="cvc" 
                            value={cardInfo.cvc} 
                            onChange={(e) => handleInputChange(e, "payment")} 
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "paypal" && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("shipping")}
                  >
                    Back to Shipping
                  </Button>
                  <Button 
                    onClick={() => handleContinue("confirmation")}
                    disabled={isProcessingOrder}
                  >
                    {isProcessingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-gray-500">
                            {item.name} <span className="text-xs">x{item.quantity}</span>
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      
                      {user.membershipTier === "pro" && (
                        <div className="flex justify-between text-green-600">
                          <span className="flex items-center">
                            <Gift className="h-4 w-4 mr-1" /> Pro Discount (15%)
                          </span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <h3 className="font-medium">Shipping Address</h3>
                      <p className="text-sm text-gray-500">
                        {shippingAddress.fullName}<br />
                        {shippingAddress.address}<br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                        {shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Confirmation Step */}
        {step === "confirmation" && (
          <Card className="max-w-xl mx-auto">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                <h3 className="font-medium mb-2">Order Details</h3>
                <p className="text-sm text-gray-500 mb-1">Order Number: #12345</p>
                <p className="text-sm text-gray-500 mb-1">Order Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Estimated Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              
              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <a href="/store">Continue Shopping</a>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a href="/profile#orders">View Orders</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
