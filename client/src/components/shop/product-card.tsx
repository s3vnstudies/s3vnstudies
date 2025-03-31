import { Product } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, applyDiscount } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Calculate discounted price if user is logged in with membership
  const displayPrice = user ? applyDiscount(product.price, user.membershipTier) : product.price;
  const hasDiscount = user && displayPrice < product.price;

  return (
    <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
      <Card className="h-full overflow-hidden group transition-all hover:shadow-md cursor-pointer">
        <div className="relative">
          <div className="w-full aspect-square bg-gray-100 overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
            />
          </div>
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-amber-500 text-white">
              {Math.round((1 - displayPrice / product.price) * 100)}% Off
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="font-semibold text-gray-900">
                {formatCurrency(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
