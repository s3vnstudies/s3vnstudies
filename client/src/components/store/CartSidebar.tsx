import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { Trash2, Plus, Minus, ShoppingCart, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

export default function CartSidebar() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = getCartTotal();
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-5">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 
              ? "Your cart is empty" 
              : `You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              asChild
            >
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-15rem)]">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                        <h4 className="font-medium line-clamp-1">{item.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-primary font-medium mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="mx-2 text-sm w-8 text-center">{item.quantity}</span>
                        
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-6">
              <Separator className="mb-4" />
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                
                <Button variant="outline" onClick={() => setOpen(false)} asChild>
                  <Link href="/store">Continue Shopping</Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
