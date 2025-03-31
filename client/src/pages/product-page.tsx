import { useParams, Link } from "router";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star,
  StarHalf,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  Truck,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { useCart, CartProvider } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

const ProductPage = () => {
  const { id } = useParams();
  const productId = parseInt(id);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    },
    enabled: !!productId && !isNaN(productId)
  });

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-[400px] bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button asChild variant="outline">
            <Link href="/store">Back to Store</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-16">
        {/* Back to store link */}
        <Link href="/store" className="flex items-center text-blue-600 hover:underline mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Store
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-purple-500 hover:bg-purple-600">New</Badge>
              )}
              {product.onSale && (
                <Badge className="bg-green-500 hover:bg-green-600">Sale</Badge>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(product.price)}</span>
              {product.onSale && product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Ratings */}
            <div className="flex items-center gap-1 mb-6">
              <div className="flex">
                {Array(4).fill(0).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500" />
                ))}
                <StarHalf className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="text-gray-500 ml-2">(42 reviews)</span>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-8">{product.description}</p>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 text-xl font-medium">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                  disabled={product.stock <= quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="ml-4 text-gray-500">
                  {product.stock} available
                </span>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Button 
              onClick={handleAddToCart} 
              className="w-full py-6 text-lg"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            {/* Shipping info */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 mb-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Free Shipping<br />over $50</p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 mb-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">30-Day<br />Returns</p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 mb-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Secure<br />Checkout</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-6 border rounded-b-lg">
              <h3 className="text-lg font-bold mb-4">Product Details</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p>{product.description}</p>
                  <ul className="list-disc ml-6 mt-4 space-y-2">
                    <li>High-quality materials</li>
                    <li>Durable construction</li>
                    <li>Official S3vn Studies merchandise</li>
                    <li>Makes a great gift for community members</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Product Specifications</h4>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-gray-600">Category:</div>
                    <div>{product.category}</div>
                    
                    <div className="text-gray-600">Item Number:</div>
                    <div>S3-{String(product.id).padStart(4, '0')}</div>
                    
                    <div className="text-gray-600">Material:</div>
                    <div>Premium Quality</div>
                    
                    <div className="text-gray-600">Care:</div>
                    <div>See product label</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="p-6 border rounded-b-lg">
              <h3 className="text-lg font-bold mb-4">Shipping Information</h3>
              <p className="mb-4">We ship to most countries worldwide. Shipping times and costs vary based on location.</p>
              
              <h4 className="font-bold mt-6 mb-2">Shipping Times:</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>United States: 3-5 business days</li>
                <li>Canada: 5-7 business days</li>
                <li>Europe: 7-10 business days</li>
                <li>Rest of World: 10-14 business days</li>
              </ul>
              
              <h4 className="font-bold mt-6 mb-2">Return Policy:</h4>
              <p>
                If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund.
                Items must be in original condition with tags attached. Shipping costs for returns are the responsibility of the customer except in cases of defective products.
              </p>
            </TabsContent>
            <TabsContent value="reviews" className="p-6 border rounded-b-lg">
              <h3 className="text-lg font-bold mb-4">Customer Reviews</h3>
              <div className="flex items-center mb-6">
                <div className="flex">
                  {Array(4).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500" />
                  ))}
                  <StarHalf className="h-5 w-5 text-yellow-500" />
                </div>
                <span className="text-gray-700 ml-2">4.5 out of 5</span>
                <span className="text-gray-500 ml-2">(42 reviews)</span>
              </div>
              
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold">Great quality!</h4>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">by Michael T. - June 12, 2023</p>
                  <p>The quality of this product exceeded my expectations. Very happy with my purchase!</p>
                </div>
                
                <div className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold">Love it!</h4>
                    <div className="flex">
                      {Array(4).fill(0).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">by Sarah K. - May 28, 2023</p>
                  <p>This is my second purchase from S3vn Studies and I'm not disappointed. Fast shipping too!</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CartProvider>
  );
};

export default ProductPage;
