import { useEffect, useState } from 'react';
import { Route, Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import ArticleUploader from '@/components/admin/ArticleUploader';
import UserManagement from '@/components/admin/UserManagement';
import ChatModeration from '@/components/admin/ChatModeration';
import ContentModeration from '@/components/admin/ContentModeration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, MessageSquare, AlertCircle, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Article } from '@shared/schema';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');

  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/articles');
      return res.json();
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

      <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab}>
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