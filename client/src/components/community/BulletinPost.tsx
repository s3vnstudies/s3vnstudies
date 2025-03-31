import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Calendar, Loader2 } from "lucide-react";
import { BulletinPost as BulletinPostType } from "@shared/schema";

interface BulletinPostProps {
  post: BulletinPostType & { username: string };
  canDelete: boolean;
}

export default function BulletinPost({ post, canDelete }: BulletinPostProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/bulletin/${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] });
      toast({
        title: "Post deleted",
        description: "The bulletin post has been deleted successfully.",
      });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate(undefined, {
      onSettled: () => setIsDeleting(false),
    });
  };
  
  // Format the date
  const formattedDate = format(new Date(post.createdAt), "PPP");
  const formattedTime = format(new Date(post.createdAt), "p");
  
  // Get initials for avatar fallback
  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };
  
  // Category to color mapping
  const categoryColors: Record<string, string> = {
    general: "bg-gray-500",
    question: "bg-blue-500",
    announcement: "bg-purple-500",
    event: "bg-green-500",
    resource: "bg-amber-500",
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.username}`} />
              <AvatarFallback>{getInitials(post.username)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <span>{post.username}</span>
                <span className="mx-2">•</span>
                <Badge 
                  className={`${categoryColors[post.category] || "bg-gray-500"} hover:${categoryColors[post.category] || "bg-gray-600"}`}
                >
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          
          {canDelete && (
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the bulletin post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="whitespace-pre-line">{post.content}</div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 pt-0">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formattedDate} at {formattedTime}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
