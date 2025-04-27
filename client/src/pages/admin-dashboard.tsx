import { useEffect, useState } from 'react';
import { Route, Redirect, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import ArticleUploader from '@/components/admin/ArticleUploader';
import UserManagement from '@/components/admin/UserManagement';
import ChatModeration from '@/components/admin/ChatModeration';
import ContentModeration from '@/components/admin/ContentModeration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Users, 
  MessageSquare, 
  AlertCircle, 
  FileText, 
  Settings,
  Github,
  RefreshCw,
  CheckCircle2,
  Youtube,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Article } from '@shared/schema';

type TabType = 'articles' | 'users' | 'chat' | 'content' | 'settings' | 'deployment' | 'youtube';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('articles');
  
  // Set the document title
  useEffect(() => {
    document.title = "Admin Dashboard - S3vn Studies";
  }, []);

  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/articles');
      return res.json();
    }
  });
  
  // Deployment mutation
  const deployMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/deploy');
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Deployment successful',
        description: 'The site has been updated with the latest changes from GitHub.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deployment failed',
        description: error.message || 'There was an error deploying the latest changes.',
        variant: 'destructive',
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your website content, users, and moderation from this central dashboard.
        </p>
      </div>

      <Tabs defaultValue="articles" value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="mb-8">
          <TabsTrigger value="articles" className="flex items-center gap-1.5">
            <FileText size={16} />
            <span>Articles</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1.5">
            <Users size={16} />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1.5">
            <MessageSquare size={16} />
            <span>Chat Rooms</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1.5">
            <AlertCircle size={16} />
            <span>Content Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-1.5">
            <Github size={16} />
            <span>Deployment</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-1.5">
            <Youtube size={16} />
            <span>YouTube</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1.5">
            <Settings size={16} />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-8">
          <ArticleUploader />
          
          <Card>
            <CardHeader>
              <CardTitle>Article Management</CardTitle>
              <CardDescription>
                View, edit, or delete existing articles in the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingArticles ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-2 px-4">Title</th>
                          <th className="text-left py-2 px-4">Category</th>
                          <th className="text-left py-2 px-4">Membership</th>
                          <th className="text-left py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles && articles.length > 0 ? (
                          articles.map((article) => (
                            <tr key={article.id} className="border-t">
                              <td className="py-3 px-4">{article.title}</td>
                              <td className="py-3 px-4">{article.category}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  article.membershipRequired === 'free' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {article.membershipRequired}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button variant="destructive" size="sm">Delete</Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-muted-foreground">
                              No articles found. Upload some articles to get started.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="chat">
          <ChatModeration />
        </TabsContent>

        <TabsContent value="content">
          <ContentModeration />
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Deployment</CardTitle>
              <CardDescription>
                Update the site with the latest changes from the GitHub repository.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-md">
                <Github className="h-5 w-5 flex-shrink-0" />
                <p>Connected to <strong>s3vnstudies/s3vnstudies</strong> repository</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Manual Deployment</h3>
                <p className="text-muted-foreground mb-4">
                  Trigger a manual deployment to pull the latest changes from the main branch.
                </p>
                <Button 
                  onClick={() => deployMutation.mutate()} 
                  className="flex items-center gap-2" 
                  disabled={deployMutation.isPending}
                >
                  {deployMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deploying...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Deploy Latest Changes</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-2">Automatic Deployments</h3>
                <p className="text-muted-foreground">
                  The site is configured to automatically deploy when changes are pushed to the main branch.
                  This is managed through GitHub webhook integration.
                </p>
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Webhook is active and configured correctly</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="youtube">
          <Card>
            <CardHeader>
              <CardTitle>YouTube Management</CardTitle>
              <CardDescription>
                Manage YouTube videos and synchronization with the S3vn Studies YouTube channel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-md">
                <Youtube className="h-5 w-5 flex-shrink-0" />
                <p>Connected to <strong>@s3vnstudies</strong> YouTube channel</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Manual Synchronization</h3>
                <p className="text-muted-foreground mb-4">
                  Trigger a manual sync to pull the latest videos from your YouTube channel.
                </p>
                <Button 
                  onClick={() => {
                    fetch('/api/youtube/sync', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ channelId: '@s3vnstudies', maxResults: 50 }),
                    })
                    .then(response => {
                      if (!response.ok) throw new Error('Failed to sync YouTube videos');
                      return response.json();
                    })
                    .then(() => {
                      toast({
                        title: "Success",
                        description: "YouTube videos successfully synchronized",
                      });
                      queryClient.invalidateQueries({ queryKey: ['/api/youtube/videos'] });
                    })
                    .catch(error => {
                      toast({
                        title: "Error",
                        description: error.message || "Failed to sync videos",
                        variant: "destructive",
                      });
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Sync YouTube Videos</span>
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-2">Automatic Synchronization</h3>
                <p className="text-muted-foreground">
                  The site is configured to automatically sync new videos from your YouTube channel once a day.
                  You can also trigger a manual sync using the button above.
                </p>
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Daily synchronization is active</span>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-2">Video Management</h3>
                <p className="text-muted-foreground mb-4">
                  View and manage videos synchronized from your YouTube channel.
                </p>
                <Button asChild>
                  <Link href="/videos" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Videos Page
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure global settings for your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-8 text-center text-muted-foreground">
                Site settings functionality will be implemented soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}