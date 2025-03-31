import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

type EditorMode = "article" | "product";

// Article schema
const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  category: z.string().min(1, "Please select a category"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

// Product schema
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Price must be a positive number" }
  ),
  imageUrl: z.string().url("Please enter a valid image URL"),
  category: z.string().min(1, "Please select a category"),
  isActive: z.boolean().default(true),
  colors: z.string().min(1, "Please enter at least one color"),
  featured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
});

interface ContentEditorProps {
  mode?: EditorMode;
  itemToEdit?: any;
}

export default function ContentEditor({ mode = "article", itemToEdit }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorMode>(mode);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Article form
  const articleForm = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: itemToEdit?.title || "",
      content: itemToEdit?.content || "",
      excerpt: itemToEdit?.excerpt || "",
      imageUrl: itemToEdit?.imageUrl || "",
      category: itemToEdit?.category || "",
      isPublished: itemToEdit?.isPublished || false,
      isFeatured: itemToEdit?.isFeatured || false,
    },
  });

  // Product form
  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: itemToEdit?.name || "",
      description: itemToEdit?.description || "",
      price: itemToEdit?.price ? (itemToEdit.price / 100).toFixed(2) : "",
      imageUrl: itemToEdit?.imageUrl || "",
      category: itemToEdit?.category || "",
      isActive: itemToEdit?.isActive ?? true,
      colors: itemToEdit?.colors ? itemToEdit.colors.join(", ") : "",
      featured: itemToEdit?.featured || false,
      isBestseller: itemToEdit?.isBestseller || false,
      isNew: itemToEdit?.isNew || false,
    },
  });

  const articleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof articleSchema>) => {
      const endpoint = itemToEdit
        ? `/api/articles/${itemToEdit.id}`
        : "/api/articles";
      const method = itemToEdit ? "PUT" : "POST";
      const res = await apiRequest(method, endpoint, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/featured"] });
      toast({
        title: `Article ${itemToEdit ? "updated" : "created"} successfully`,
        description: `The article has been ${itemToEdit ? "updated" : "created"}.`,
      });
      if (!itemToEdit) {
        articleForm.reset();
      }
    },
    onError: (error) => {
      toast({
        title: `Failed to ${itemToEdit ? "update" : "create"} article`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const productMutation = useMutation({
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      // Convert price from dollars to cents
      const priceInCents = Math.round(parseFloat(data.price) * 100);
      // Convert colors from comma-separated string to array
      const colors = data.colors.split(",").map((color) => color.trim());
      
      const transformedData = {
        ...data,
        price: priceInCents,
        colors,
      };
      
      const endpoint = itemToEdit
        ? `/api/products/${itemToEdit.id}`
        : "/api/products";
      const method = itemToEdit ? "PUT" : "POST";
      const res = await apiRequest(method, endpoint, transformedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
      toast({
        title: `Product ${itemToEdit ? "updated" : "created"} successfully`,
        description: `The product has been ${itemToEdit ? "updated" : "created"}.`,
      });
      if (!itemToEdit) {
        productForm.reset();
      }
    },
    onError: (error) => {
      toast({
        title: `Failed to ${itemToEdit ? "update" : "create"} product`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onArticleSubmit = (data: z.infer<typeof articleSchema>) => {
    articleMutation.mutate(data);
  };

  const onProductSubmit = (data: z.infer<typeof productSchema>) => {
    productMutation.mutate(data);
  };

  const articleCategories = [
    "Community",
    "Education",
    "Philosophy",
    "Technology",
    "Science",
    "Art",
    "History",
    "Literature",
    "Other",
  ];

  const productCategories = [
    "Apparel",
    "Accessories",
    "Stationery",
    "Books",
    "Digital",
    "Other",
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
        <CardDescription>
          Create or edit content for the S3vn Studies platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EditorMode)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="article">Article</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
          </TabsList>

          <TabsContent value="article">
            <Form {...articleForm}>
              <form onSubmit={articleForm.handleSubmit(onArticleSubmit)} className="space-y-6">
                <FormField
                  control={articleForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={articleForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {articleCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={articleForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={articleForm.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief summary of the article..."
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed in article previews and search results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={articleForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the article content..."
                          className="h-60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={articleForm.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            Make this article visible to all users.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={articleForm.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured</FormLabel>
                          <FormDescription>
                            Show this article in featured sections.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={articleMutation.isPending}
                >
                  {articleMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {itemToEdit ? "Update Article" : "Create Article"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="product">
            <Form {...productForm}>
              <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-6">
                <FormField
                  control={productForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={productForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="19.99"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={productForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="colors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Colors</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Black, White, Purple"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter colors separated by commas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={productForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={productForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Make this product available for purchase.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured</FormLabel>
                          <FormDescription>
                            Show in featured products sections.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New</FormLabel>
                          <FormDescription>
                            Mark this product as new.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={productForm.control}
                  name="isBestseller"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bestseller</FormLabel>
                        <FormDescription>
                          Mark this product as a bestseller.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={productMutation.isPending}
                >
                  {productMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {itemToEdit ? "Update Product" : "Create Product"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={() => {
            if (activeTab === "article") {
              articleForm.handleSubmit(onArticleSubmit)();
            } else {
              productForm.handleSubmit(onProductSubmit)();
            }
          }}
          disabled={
            (activeTab === "article" && articleMutation.isPending) ||
            (activeTab === "product" && productMutation.isPending)
          }
        >
          {(activeTab === "article" && articleMutation.isPending) ||
           (activeTab === "product" && productMutation.isPending) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save {activeTab === "article" ? "Article" : "Product"}
        </Button>
      </CardFooter>
    </Card>
  );
}
