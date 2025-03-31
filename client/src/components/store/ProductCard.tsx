import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, Star, StarHalf } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  isNew?: boolean;
  onSale?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  isNew,
  onSale
}: ProductCardProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ 
      id, 
      name, 
      price, 
      image,
      quantity: 1
    });
  };

  return (
    <Link href={`/store/product/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition group cursor-pointer h-full flex flex-col">
        <div className="relative">
          <div className="w-full h-56 overflow-hidden">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            />
          </div>
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-purple-500 hover:bg-purple-600">New</Badge>
            )}
            {onSale && (
              <Badge className="bg-green-500 hover:bg-green-600">Sale</Badge>
            )}
          </div>
          {/* Quick add overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              onClick={handleAddToCart}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-bold mb-1">{name}</h3>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-blue-600 font-medium">{formatCurrency(price)}</span>
              {onSale && originalPrice && (
                <span className="text-gray-400 line-through text-sm ml-2">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex">
                {Array(4).fill(0).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500" />
                ))}
                <StarHalf className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
