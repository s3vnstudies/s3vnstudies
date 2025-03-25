import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Eye, Heart, ArrowRight } from "lucide-react";

export default function StorePreview() {
  const { addToCart } = useCart();
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?limit=4"],
  });
  
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2">Merchandise</h2>
            <p className="text-neutral-600">Show your support with official S3VN Studies gear</p>
          </div>
          <Link href="/store">
            <a className="text-primary font-semibold hover:underline hidden md:flex items-center">
              Visit Store <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeleton loaders
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="bg-white rounded-lg overflow-hidden shadow relative group">
                <div className="relative pb-[100%] bg-neutral-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-5 bg-neutral-200 w-3/4 rounded animate-pulse mb-2"></div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-4 bg-neutral-200 w-1/4 rounded animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 w-1/4 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            products?.map((product) => (
              <Card 
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow relative group"
              >
                <div className="relative pb-[100%] bg-neutral-100">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"} 
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4"
                  />
                  {product.isNew && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded">
                      New
                    </div>
                  )}
                  {product.isDiscounted && (
                    <div className="absolute top-2 right-2 bg-accent text-white text-xs py-1 px-2 rounded">
                      {Math.round((1 - (product.discountPrice || 0) / product.price) * 100)}% OFF
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="rounded-full" 
                        onClick={() => handleAddToCart(product)}
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
                      <Link href={`/store/product/${product.id}`}>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link href={`/store/product/${product.id}`}>
                    <a>
                      <h3 className="font-heading font-bold line-clamp-1 hover:text-primary">
                        {product.name}
                      </h3>
                    </a>
                  </Link>
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
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/store">
            <a className="inline-block text-primary font-semibold hover:underline flex items-center justify-center">
              Visit Store <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
