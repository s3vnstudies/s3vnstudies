import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Heart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <Card 
      className="bg-white rounded-lg overflow-hidden shadow product-card relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/store/product/${product.id}`}>
        <div className="relative pb-[100%] bg-neutral-100">
          <img 
            src={product.imageUrl || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"} 
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-contain p-4"
          />
          {product.isNew && (
            <Badge className="absolute top-2 right-2 bg-primary">
              New
            </Badge>
          )}
          {product.isDiscounted && (
            <Badge className="absolute top-2 right-2 bg-accent">
              {Math.round((1 - (product.discountPrice || 0) / product.price) * 100)}% OFF
            </Badge>
          )}
          <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex space-x-2">
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full"
                asChild
              >
                <Link href={`/store/product/${product.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-heading font-bold line-clamp-1 hover:text-primary">{product.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <div>
              {product.discountPrice ? (
                <>
                  <span className="font-semibold text-primary">${(product.discountPrice / 100).toFixed(2)}</span>
                  <span className="text-sm text-neutral-500 line-through ml-1">${(product.price / 100).toFixed(2)}</span>
                </>
              ) : (
                <span className="font-semibold text-primary">${(product.price / 100).toFixed(2)}</span>
              )}
            </div>
            <div className="text-sm text-yellow-500">
              <span>★★★★</span>
              <span className="text-yellow-300">★</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
