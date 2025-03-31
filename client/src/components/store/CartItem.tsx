import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItem = ({ id, name, price, image, quantity }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{name}</h3>
            <p className="ml-4">{formatCurrency(price)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center">
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input 
              type="number" 
              min="1" 
              className="h-8 w-16 text-center mx-2"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex">
            <Button
              type="button"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              onClick={() => removeItem(id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
