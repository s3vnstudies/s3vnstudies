import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShoppingCartProps {
  onClose?: () => void;
}

export default function ShoppingCart({ onClose }: ShoppingCartProps) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };
  
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to complete your purchase",
        variant: "destructive",
      });
      if (onClose) onClose();
      window.location.href = "/auth";
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      // This is a simplified example - in a real app, you would collect shipping info
      const orderData = {
        userId: user.id,
        orderItems: cartItems,
        totalAmount: cartTotal,
        shippingAddress: {
          fullName: user.fullName || user.username,
          address1: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
          country: "USA"
        }
      };
      
      await apiRequest("POST", "/api/orders", orderData);
      
      toast({
        title: "Order placed",
        description: "Your order has been successfully placed",
      });
      
      clearCart();
      if (onClose) onClose();
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
          <h3 className="font-heading text-xl font-bold mb-2">Your cart is empty</h3>
          <p className="text-neutral-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button onClick={onClose}>Continue Shopping</Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-20 h-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-contain p-2"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                          className="w-12 h-7 text-center"
                        />
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 text-neutral-500 hover:text-red-500"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="px-6 py-4 border-t border-neutral-200">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
                <Button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </Button>
              </div>
              
              {user && user.membershipTier === 'premium' && (
                <div className="text-center text-sm text-green-600 font-medium mt-2">
                  Premium member discount: 25% will be applied at checkout
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
