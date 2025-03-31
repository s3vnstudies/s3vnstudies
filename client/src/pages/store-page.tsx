import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/store/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CartProvider } from "@/hooks/use-cart";

const StorePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

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

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = category === "all" || product.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Get products on sale
  const saleProducts = filteredProducts.filter(product => product.onSale);
  
  // Get new products
  const newProducts = filteredProducts.filter(product => product.isNew);

  // Get unique categories for filter dropdown
  const categories = ["all", ...new Set(products.map(product => product.category))];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Store</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Store</h1>
        
        {/* Featured banner */}
        <div className="mb-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="bg-white text-blue-600 mb-4">NEW COLLECTION</Badge>
            <h2 className="text-3xl font-bold mb-4">S3vn Studies Official Merchandise</h2>
            <p className="mb-6 text-purple-100">
              Show your support with our high-quality merchandise. From comfortable t-shirts to handy accessories, explore the full collection.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#all-products" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                Shop Now
              </a>
              <a href="#sale" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition">
                View Sale Items
              </a>
            </div>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:max-w-md"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Products Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all" id="all-products">All Products</TabsTrigger>
            <TabsTrigger value="new">New Arrivals</TabsTrigger>
            <TabsTrigger value="sale" id="sale">On Sale</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found matching your search criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
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
            )}
          </TabsContent>
          
          <TabsContent value="new">
            {newProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No new products found matching your search criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map((product) => (
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
            )}
          </TabsContent>
          
          <TabsContent value="sale">
            {saleProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No sale items found matching your search criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {saleProducts.map((product) => (
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
            )}
          </TabsContent>
        </Tabs>
        
        {/* Shipping Info */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-xl font-bold mb-6 text-center">Shipping & Returns</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-truck text-blue-600"></i>
              </div>
              <h3 className="font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exchange-alt text-blue-600"></i>
              </div>
              <h3 className="font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free return policy</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-blue-600"></i>
              </div>
              <h3 className="font-bold mb-2">Secure Checkout</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default StorePage;
