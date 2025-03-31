import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Loader2, SearchIcon } from "lucide-react";

export default function ProductGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  
  const { data: allProducts, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Filter products based on search term and category
  const filteredProducts = allProducts?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === "all" || product.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for the filter dropdown
  const categories = allProducts ? 
    ["all", ...new Set(allProducts.map(product => product.category))] : 
    ["all"];
  
  // Pagination
  const totalPages = filteredProducts ? Math.ceil(filteredProducts.length / productsPerPage) : 0;
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts?.slice(startIndex, startIndex + productsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load products</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <Select 
          value={category} 
          onValueChange={(value) => {
            setCategory(value);
            setCurrentPage(1);
          }}
        >
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
      
      {/* Products Grid */}
      {paginatedProducts?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-2">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paginatedProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show current page, first page, last page, and one page before and after current
              if (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              
              // Show ellipsis if there's a gap
              if (
                (page === 2 && currentPage > 3) || 
                (page === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return <PaginationItem key={page}>...</PaginationItem>;
              }
              
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
