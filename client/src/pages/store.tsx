import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Loader2, Search, ShoppingCart } from "lucide-react";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeFromCart, cartTotal, cartItemsCount } = useCart();
  
  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ["all", ...new Set(products.map(product => product.category))];
  
  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight mb-6">
            Merchandise Store
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Browse our collection of exclusive merchandise and show your support for S3VN Studies.
          </p>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative md:w-1/2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Drawer open={cartOpen} onOpenChange={setCartOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartItemsCount > 9 ? "9+" : cartItemsCount}
                      </span>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-md">
                    <DrawerHeader>
                      <DrawerTitle>Your Shopping Cart</DrawerTitle>
                      <DrawerDescription>
                        {cartItemsCount === 0 
                          ? "Your cart is empty" 
                          : `You have ${cartItemsCount} item${cartItemsCount !== 1 ? 's' : ''} in your cart`}
                      </DrawerDescription>
                    </DrawerHeader>
                    
                    {cartItems.length > 0 ? (
                      <>
                        <div className="p-4 max-h-[50vh] overflow-y-auto">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center py-4 border-b">
                              <div className="w-16 h-16 rounded bg-slate-100 overflow-hidden flex-shrink-0 mr-4">
                                <img 
                                  src={item.product.imageUrl || 'https://via.placeholder.com/100'} 
                                  alt={item.product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium">{item.product.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                  <div className="flex items-center">
                                    <button 
                                      className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center"
                                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    >
                                      -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button 
                                      className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">
                                      {formatPrice(item.product.price * item.quantity)}
                                    </div>
                                    <button 
                                      className="text-sm text-red-500 hover:underline"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-4 border-t">
                          <div className="flex justify-between mb-6 font-semibold">
                            <span>Total:</span>
                            <span>{formatPrice(cartTotal)}</span>
                          </div>
                          <div className="flex gap-4">
                            <DrawerClose asChild>
                              <Button variant="outline" className="flex-1">Continue Shopping</Button>
                            </DrawerClose>
                            <Button className="flex-1 bg-gradient-to-r from-primary to-secondary">
                              Checkout
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 mb-6">Your cart is empty</p>
                        <DrawerClose asChild>
                          <Button>Continue Shopping</Button>
                        </DrawerClose>
                      </div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-medium text-slate-700 mb-4">No products found</h3>
              <p className="text-slate-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-poppins font-bold mb-8">
                {categoryFilter === "all" 
                  ? "All Products" 
                  : `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Featured Collections</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Explore our curated collections of premium merchandise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Apparel Collection" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Apparel Collection</h3>
                <p className="text-white/80 mb-4">Premium t-shirts, hoodies, and more</p>
                <Link href="/store?category=apparel">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Shop Apparel
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Accessories Collection" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Accessories</h3>
                <p className="text-white/80 mb-4">Mugs, notebooks, phone cases and more</p>
                <Link href="/store?category=accessories">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Shop Accessories
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Limited Edition" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Limited Edition</h3>
                <p className="text-white/80 mb-4">Exclusive items available for a limited time</p>
                <Link href="/store?category=limited">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Shop Limited Edition
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Shipping & Returns Info */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Worldwide Shipping</h3>
              <p className="text-slate-600">
                We ship globally with tracking provided for all orders. Free shipping on orders over $50.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-slate-600">
                Not satisfied? Return within 30 days for a full refund or exchange. No questions asked.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-slate-600">
                Your payment information is processed securely. We do not store credit card details.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Have questions about our products or ordering process? Find answers to common questions below.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">How long does shipping take?</h3>
              <p className="text-slate-600">
                Domestic orders typically take 3-5 business days. International shipping can take 7-14 business days depending on your location and customs processing.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">What sizes are available?</h3>
              <p className="text-slate-600">
                Our apparel is available in sizes XS to 3XL. Each product page has a detailed size guide to help you find the perfect fit.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Can I cancel or modify my order?</h3>
              <p className="text-slate-600">
                Orders can be modified or cancelled within 24 hours of placement. Please contact our support team as soon as possible if you need to make changes.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Do you offer bulk discounts?</h3>
              <p className="text-slate-600">
                Yes, we offer discounts for bulk orders. Please contact us at store@s3vnstudies.com for more information on bulk pricing.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-slate-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
