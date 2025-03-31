import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

interface CartDropdownProps {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleQuantityChange = (productId: number, delta: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-gray-500"
            onClick={clearCart}
            disabled={cartItems.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <Separator />
      
      {cartItems.length === 0 ? (
        <div className="p-6 text-center">
          <div className="flex justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
          <p className="mt-4 text-gray-500">Your cart is empty</p>
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-72">
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.product.price)} × {item.quantity}
                    </p>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(item.productId, -1, item.quantity)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(item.productId, 1, item.quantity)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <Separator />
          
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-base font-medium">Total</span>
              <span className="text-base font-semibold">{formatCurrency(cartTotal)}</span>
            </div>
            <Link href={ROUTES.CHECKOUT} onClick={handleCheckout}>
              <Button className="w-full">
                Checkout
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
