import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export default function ProductCard({ 
  product, 
  onAddToCart,
  className 
}: ProductCardProps) {
  const { id, name, description, price, imageUrl, isNew, rating, inventory } = product;
  
  // Generate rating stars
  const renderRating = () => {
    const stars = [];
    const ratingValue = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        // Full star
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
      } else if (i - 0.5 <= ratingValue) {
        // Half star
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
      } else {
        // Empty star
        stars.push(<Star key={i} className="h-4 w-4 text-slate-300" />);
      }
    }
    
    return stars;
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const isOutOfStock = inventory === 0;

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow",
      className
    )}>
      <div className="relative">
        <img 
          src={imageUrl || 'https://via.placeholder.com/500x500?text=Product+Image'} 
          alt={name} 
          className="w-full h-56 object-cover"
        />
        {isNew && (
          <div className="absolute top-3 right-3 bg-accent text-white text-xs px-2 py-1 rounded-full">
            New
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-lg mb-1">{name}</h3>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold">{formatPrice(price)}</span>
          <div className="flex">
            {renderRating()}
          </div>
        </div>
        <Button 
          onClick={handleAddToCart} 
          className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-colors"
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
