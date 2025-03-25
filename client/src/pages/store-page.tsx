import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@shared/schema";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Link } from "wouter";

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { cartItems } = useCart();
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Filter products based on search term and category
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Extract unique categories for filter dropdown
  const categories = products 
    ? ["all", ...new Set(products.map(product => product.category))]
    : ["all"];
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <>
      <Helmet>
        <title>Store - S3VN Studies</title>
        <meta name="description" content="Shop our collection of merchandise including t-shirts, hoodies, mugs, and more. Support our community and show your S3VN Studies pride." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-20">
          {/* Header Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">Merchandise Store</h1>
                <p className="text-xl opacity-90">
                  Browse our collection of exclusive merchandise and show your support for S3VN Studies.
                </p>
              </div>
            </div>
          </section>
          
          {/* Filter & Cart Section */}
          <section className="py-8 bg-light-100">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="flex-grow">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Link href="/store/cart">
                  <Button className="bg-primary text-white hover:bg-primary/90 flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Cart ({totalItems})
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          {/* Featured Products */}
          <section className="py-12 bg-light-100">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading products</h3>
                  <p className="text-gray-600">Please try again later.</p>
                </div>
              ) : filteredProducts?.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <>
                  {/* New Arrivals */}
                  {filteredProducts.some(product => product.isNew) && (
                    <div className="mb-12">
                      <h2 className="text-2xl font-poppins font-bold mb-6">New Arrivals</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts
                          .filter(product => product.isNew)
                          .map(product => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* All Products */}
                  <div>
                    <h2 className="text-2xl font-poppins font-bold mb-6">All Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
          
          {/* Membership Discount CTA */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-bold mb-4">Member Exclusive: 15% Off</h2>
                    <p className="opacity-90 mb-6">
                      Join our membership program to receive exclusive discounts on all merchandise, early access to new products, and more!
                    </p>
                    <Button className="bg-white text-primary hover:shadow-lg transition-shadow">
                      Join Now
                    </Button>
                  </div>
                  <div className="hidden md:block relative">
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Member discount" 
                      className="w-full h-auto rounded-xl relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Shipping & Returns Info */}
          <section className="py-16 bg-light-100">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Free Shipping</h3>
                  <p className="text-gray-600">
                    Free standard shipping on all orders over $50. International shipping available.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Easy Returns</h3>
                  <p className="text-gray-600">
                    Not satisfied? Return or exchange within 30 days of delivery.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Secure Checkout</h3>
                  <p className="text-gray-600">
                    Our payment processing is secure and your information is protected.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
