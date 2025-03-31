import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface CartItemProps {
  product: Product;
  quantity: number;
}

export default function CartItem({ product, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [itemQuantity, setItemQuantity] = useState(quantity);

  // Convert cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    setItemQuantity(newQuantity);
    updateQuantity(product.id, newQuantity);
  };

  const incrementQuantity = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    updateQuantity(product.id, newQuantity);
  };

  const decrementQuantity = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-b">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <Link href={`/store/${product.id}`}>
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
            alt={product.name}
            className="h-full w-full object-cover object-center cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>
            <Link href={`/store/${product.id}`} className="hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="ml-4">{formatPrice(product.price * quantity)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8 rounded-r-none"
              onClick={decrementQuantity}
              disabled={itemQuantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="text"
              className="h-8 w-12 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={itemQuantity}
              onChange={handleQuantityChange}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8 rounded-l-none"
              onClick={incrementQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeItem(product.id)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
