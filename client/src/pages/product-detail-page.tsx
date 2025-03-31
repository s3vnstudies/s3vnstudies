import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@shared/schema";
import {
  ArrowLeft,
  Star,
  StarHalf,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function ProductDetailPage() {
  const [match, params] = useRoute("/store/:id");
  const productId = match ? parseInt(params.id) : null;
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const { addItem } = useCart();

  // Set page title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} - S3vn Studies Store`;
    } else {
      document.title = "Product - S3vn Studies Store";
    }
  }, [product]);

  // Convert cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
          <div className="mb-8">
            <Link href="/store">
              <Button variant="ghost" className="flex items-center p-0 h-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-8" />
              <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
          <p className="text-neutral-600 mb-6">
            The product you're looking for could not be found or has been removed.
          </p>
          <Button asChild>
            <Link href="/store">Back to Store</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/store">
            <Button variant="ghost" className="flex items-center p-0 h-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden border">
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold font-poppins mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <StarHalf className="h-4 w-4 fill-current" />
              </div>
              <span className="text-sm text-neutral-600">(42 reviews)</span>
            </div>

            <p className="text-2xl font-bold text-neutral-900 mb-4">
              {formatPrice(product.price)}
            </p>

            <p className="text-neutral-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Colors</h3>
              <div className="flex space-x-2">
                <button
                  className={`w-8 h-8 rounded-full bg-black flex items-center justify-center ${
                    selectedColor === "black" ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  onClick={() => setSelectedColor("black")}
                >
                  {selectedColor === "black" && <Check className="h-4 w-4 text-white" />}
                </button>
                <button
                  className={`w-8 h-8 rounded-full bg-white border border-neutral-300 flex items-center justify-center ${
                    selectedColor === "white" ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  onClick={() => setSelectedColor("white")}
                >
                  {selectedColor === "white" && <Check className="h-4 w-4 text-black" />}
                </button>
                <button
                  className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center ${
                    selectedColor === "primary" ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  onClick={() => setSelectedColor("primary")}
                >
                  {selectedColor === "primary" && <Check className="h-4 w-4 text-white" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Quantity</h3>
              <div className="flex items-center border rounded-md max-w-[150px]">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-10 w-10 rounded-r-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="text"
                  className="h-10 w-14 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setQuantity(val);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-10 w-10 rounded-l-none"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                {product.inStock ? (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex items-center justify-center"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-neutral-600" />
                <div>
                  <h3 className="text-sm font-medium">Free Shipping</h3>
                  <p className="text-xs text-neutral-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 mr-2 text-neutral-600" />
                <div>
                  <h3 className="text-sm font-medium">30 Days Return</h3>
                  <p className="text-xs text-neutral-500">Hassle-free returns</p>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-neutral-600" />
                <div>
                  <h3 className="text-sm font-medium">Secure Payment</h3>
                  <p className="text-xs text-neutral-500">100% secure checkout</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="w-full">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <p className="text-neutral-700">
                  {product.description}
                  <br /><br />
                  Show your love for S3vn Studies with our exclusive merchandise.
                  Made with high-quality materials for durability and comfort.
                </p>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                  <li>High-quality materials</li>
                  <li>Exclusive S3vn Studies design</li>
                  <li>Machine washable</li>
                  <li>Available in multiple colors</li>
                  <li>Made with sustainable practices</li>
                </ul>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <p className="text-neutral-700">
                  <span className="font-medium">Shipping:</span> Free standard shipping on all orders over $50. Orders typically ship within 1-2 business days.
                  <br /><br />
                  <span className="font-medium">Returns:</span> We offer a 30-day return policy. If you're not completely satisfied with your purchase, you can return it for a full refund.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
