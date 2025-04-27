import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, StarHalf } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  // Convert cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg group">
      <Link href={`/store/${product.id}`}>
        <div className="h-64 overflow-hidden relative cursor-pointer">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {product.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded">
                Featured
              </span>
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-neutral-900/80 text-white px-3 py-1 rounded-md font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-2 font-poppins">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-900 font-bold">
            {formatPrice(product.price)}
          </span>
          <div className="flex text-neutral-400">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <StarHalf className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm text-neutral-500">
              ({Math.floor(Math.random() * 50) + 10})
            </span>
          </div>
        </div>
        <div className="text-xs text-neutral-500 mb-2">
          By: {product.creator || "S3vn Studies"}
        </div>
        <div className="flex space-x-2 mb-4">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black"></span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-neutral-300"></span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary"></span>
        </div>
        <div className="flex space-x-2">
          <Button
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            disabled={!product.inStock}
            onClick={() => addItem(product)}
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-300 hover:bg-neutral-100"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
