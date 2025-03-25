import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ShoppingCart,
  Heart,
  Share,
  Truck,
  RefreshCw,
  Shield,
  Minus,
  Plus,
  Star,
  StarHalf,
  ChevronRight
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/products/${productId}`);
      return res.json();
    }
  });

  // Fetch related products
  const { data: products, isLoading: isRelatedLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/products');
      return res.json();
    }
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to add items to cart");
      
      const res = await apiRequest('POST', '/api/cart/items', {
        productId,
        quantity
      });
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
      
      if (!user) {
        // Redirect to login if not authenticated
        navigate("/auth");
      }
    }
  });

  // Get related products (same category)
  const relatedProducts = product && products ? 
    products.filter((p: any) => 
      p.category === product.category && p.id !== product.id
    ).slice(0, 4) : 
    [];

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/store">
          <Button>Return to Store</Button>
        </Link>
      </div>
    );
  }

  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm">
            <Link href="/">
              <a className="text-muted-foreground hover:text-primary">Home</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <Link href="/store">
              <a className="text-muted-foreground hover:text-primary">Store</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <Link href={`/store?category=${product.category}`}>
              <a className="text-muted-foreground hover:text-primary">{product.category}</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-lg p-8 mb-6">
                <div className="aspect-square relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-medium py-1 px-3 rounded">
                      {discountPercentage}% OFF
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-sm font-medium py-1 px-3 rounded">
                      New
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {/* Thumbnail previews - using the same image multiple times for demo */}
                <button className="bg-white rounded-md p-2 border-2 border-primary">
                  <img 
                    src={product.imageUrl} 
                    alt="Thumbnail 1" 
                    className="w-full h-auto aspect-square object-contain"
                  />
                </button>
                <button className="bg-white rounded-md p-2 border hover:border-primary">
                  <img 
                    src={product.imageUrl} 
                    alt="Thumbnail 2" 
                    className="w-full h-auto aspect-square object-contain"
                  />
                </button>
                <button className="bg-white rounded-md p-2 border hover:border-primary">
                  <img 
                    src={product.imageUrl} 
                    alt="Thumbnail 3" 
                    className="w-full h-auto aspect-square object-contain"
                  />
                </button>
                <button className="bg-white rounded-md p-2 border hover:border-primary">
                  <img 
                    src={product.imageUrl} 
                    alt="Thumbnail 4" 
                    className="w-full h-auto aspect-square object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="font-heading text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500 mr-3">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <StarHalf className="w-5 h-5 fill-current" />
                </div>
                <span className="text-muted-foreground">4.5 (24 reviews)</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary mr-2">${price.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-sm text-green-600 mt-1">You save: ${(product.price - price).toFixed(2)} ({discountPercentage}%)</p>
                )}
              </div>
              
              <p className="text-muted-foreground mb-6">
                {product.description || "High-quality official S3VN Studies merchandise. Perfect for showing your support and representing the community wherever you go."}
              </p>
              
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Availability: <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Category: <span className="text-foreground">{product.category}</span>
                </p>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-4 font-medium">Quantity:</span>
                <div className="flex">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 flex items-center justify-center border-y border-input">
                    {quantity}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={incrementQuantity}
                    disabled={quantity >= (product.stock || 10)}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  className="flex-1 md:flex-none md:min-w-[200px]"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || product.stock <= 0}
                >
                  {addToCartMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Benefits */}
              <div className="space-y-4 border-t border-b py-6 mb-6">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-primary mr-3" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 text-primary mr-3" />
                  <span>Easy 30-day returns</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-3" />
                  <span>Secure checkout</span>
                </div>
              </div>
              
              {/* Premium member note */}
              {user?.membershipLevel !== 'premium' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <span className="font-semibold">Premium members enjoy a 10% discount</span> on all merchandise.{' '}
                    <Link href="/profile?tab=membership">
                      <a className="underline font-medium">Upgrade now</a>
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="max-w-3xl mx-auto">
              <div className="prose prose-lg">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="mb-4">
                  {product.description || "High-quality official S3VN Studies merchandise. Perfect for showing your support and representing the community wherever you go."}
                </p>
                <p className="mb-4">
                  This premium product is designed with both style and functionality in mind. Made from high-quality materials, it's built to last while maintaining a sleek and modern appearance.
                </p>
                <p>
                  Whether you're using it at home, at work, or on the go, this item is a perfect way to show your support for the S3VN Studies community and connect with like-minded individuals.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="max-w-3xl mx-auto">
              <div className="prose prose-lg">
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <ul className="space-y-2">
                  <li><strong>Material:</strong> Premium quality</li>
                  <li><strong>Dimensions:</strong> Varies by product</li>
                  <li><strong>Care:</strong> Follow instructions on product label</li>
                  <li><strong>Origin:</strong> Designed in the USA</li>
                  <li><strong>SKU:</strong> S3VN-{product.id.toString().padStart(4, '0')}</li>
                </ul>
                <h4 className="text-lg font-semibold mt-6 mb-2">Product Features</h4>
                <ul className="space-y-2">
                  <li>Exclusive S3VN Studies design</li>
                  <li>High-quality construction</li>
                  <li>Durable and long-lasting</li>
                  <li>Perfect for daily use</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="max-w-3xl mx-auto">
              <div className="prose prose-lg">
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-500 mr-3">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <StarHalf className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-lg font-medium">4.5 out of 5</span>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                            alt="Reviewer" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">Sarah Johnson</span>
                      </div>
                      <div className="flex text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Verified Purchase - May 15, 2023</p>
                    <p>
                      Absolutely love this product! The quality is exceptional and it's exactly what I was looking for. Shipping was fast and the packaging was secure. Would definitely recommend!
                    </p>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                            alt="Reviewer" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">Michael Roberts</span>
                      </div>
                      <div className="flex text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 stroke-current" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Verified Purchase - April 28, 2023</p>
                    <p>
                      Great product that exceeded my expectations. The only reason I'm giving it 4 stars instead of 5 is because the sizing runs a bit larger than I expected. Otherwise, fantastic quality and design!
                    </p>
                  </div>
                  
                  <Link href="#" className="inline-block text-primary font-medium hover:underline">
                    See all 24 reviews
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold mb-8">You May Also Like</h2>
          
          {isRelatedLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : relatedProducts.length === 0 ? (
            <p className="text-muted-foreground">No related products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Card 
                  key={relatedProduct.id} 
                  className="overflow-hidden shadow product-card relative group"
                >
                  <Link href={`/store/product/${relatedProduct.id}`}>
                    <div className="relative pb-[100%] bg-gray-100">
                      <img 
                        src={relatedProduct.imageUrl} 
                        alt={relatedProduct.name} 
                        className="absolute top-0 left-0 w-full h-full object-contain p-4" 
                      />
                      {relatedProduct.discountPrice && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs py-1 px-2 rounded">
                          {Math.round(((relatedProduct.price - relatedProduct.discountPrice) / relatedProduct.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-heading font-bold line-clamp-1 hover:text-primary">{relatedProduct.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          {relatedProduct.discountPrice ? (
                            <>
                              <span className="font-semibold text-primary">${relatedProduct.discountPrice.toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground line-through ml-1">${relatedProduct.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="font-semibold text-primary">${relatedProduct.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
