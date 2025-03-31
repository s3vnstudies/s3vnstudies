import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, StarHalf } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

const StorePreview = () => {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    }
  });
  
  // Display only the first 4 products
  const displayProducts = products.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-blue-600 font-medium">Merchandise</span>
            <h2 className="text-3xl font-bold mt-2 mb-4">Featured Products</h2>
            <p className="text-gray-600">Show your support and get some awesome merchandise to represent the community.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl animate-pulse h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-medium">Merchandise</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">Featured Products</h2>
          <p className="text-gray-600">Show your support and get some awesome merchandise to represent the community.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              isNew={product.isNew}
              onSale={product.onSale}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="link" asChild className="text-blue-600 flex items-center gap-2 mx-auto">
            <Link href="/store">
              Visit Store <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StorePreview;
