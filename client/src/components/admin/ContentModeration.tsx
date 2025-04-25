import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  FileText, 
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  Megaphone,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BulletinPost, ChatMessage } from '@shared/schema';

interface ReportedContent {
  id: number;
  type: 'bulletin' | 'chat' | 'article' | 'user_content';
  content: string;
  userId: number;
  username: string;
  reportedBy: number;
  reporterName: string;
  reportedAt: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export default function ContentModeration() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [moderationNotes, setModerationNotes] = useState('');
  const [hideContent, setHideContent] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  
  // Fetch reported content
  const { data: reportedContent, isLoading: isLoadingReports } = useQuery<ReportedContent[]>({
    queryKey: ['/api/admin/reports'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/reports');
      return res.json();
    },
    enabled: activeTab === 'reports'
  });

  // Fetch bulletin posts
  const { data: bulletinPosts, isLoading: isLoadingBulletin } = useQuery<BulletinPost[]>({
    queryKey: ['/api/admin/bulletin-posts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/bulletin-posts');
      return res.json();
    },
    enabled: activeTab === 'bulletin'
  });

  // Fetch chat messages that have been flagged or reported
  const { data: chatMessages, isLoading: isLoadingChat } = useQuery<ChatMessage[]>({
    queryKey: ['/api/admin/chat-messages/flagged'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/chat-messages/flagged');
      return res.json();
    },
    enabled: activeTab === 'chat'
  });

  const moderateContentMutation = useMutation({
    mutationFn: async (data: { 
      contentId: number; 
      contentType: string;
      isHidden: boolean;
      reason?: string;
      notes?: string;
    }) => {
      const res = await apiRequest('POST', `/api/admin/content/${data.contentType}/${data.contentId}/moderate`, {
        isHidden: data.isHidden,
        reason: data.reason,
        notes: data.notes
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries based on content type
      if (selectedContent?.type === 'bulletin' || activeTab === 'bulletin') {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/bulletin-posts'] });
      } else if (selectedContent?.type === 'chat' || activeTab === 'chat') {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/chat-messages/flagged'] });
      }
      
      if (activeTab === 'reports') {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      }
      
      toast({
        title: 'Content moderated',
        description: hideContent 
          ? 'The content has been hidden from users.' 
          : 'The content has been approved and is visible to users.',
      });
      setIsActionDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error moderating content',
        description: error.message || 'An error occurred while moderating the content.',
        variant: 'destructive',
      });
    }
  });

  const handleOpenActionDialog = (content: any, type: string) => {
    setSelectedContent({...content, type});
    setHideContent(content.isHidden || false);
    setModerationNotes(content.moderationNotes || '');
    setSelectedReason(content.hiddenReason || '');
    setIsActionDialogOpen(true);
  };

  const handleSaveModeration = () => {
    if (!selectedContent) return;
    
    const contentType = selectedContent.type;
    const contentId = selectedContent.id;
    
    moderateContentMutation.mutate({
      contentId,
      contentType,
      isHidden: hideContent,
      reason: selectedReason,
      notes: moderationNotes
    });
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContentStatusBadge = (isHidden: boolean) => {
    return isHidden ? (
      <Badge variant="destructive" className="flex items-center gap-1">
        <EyeOff size={12} />
        <span>Hidden</span>
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1">
        <Eye size={12} />
        <span>Visible</span>
      </Badge>
    );
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle size={12} />
            <span>Pending Review</span>
          </Badge>
        );
      case 'reviewed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Eye size={12} />
            <span>Reviewed</span>
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <EyeOff size={12} />
            <span>Dismissed</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle size={12} />
            <span>Pending Review</span>
          </Badge>
        );
    }
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
        <CardDescription>
          Review and moderate user-generated content across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="reports" className="flex items-center gap-1">
              <AlertTriangle size={16} />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="bulletin" className="flex items-center gap-1">
              <Megaphone size={16} />
              <span>Bulletin Posts</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>Chat Messages</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>Articles</span>
            </TabsTrigger>
          </TabsList>
        
          {/* Reports Tab */}
          <TabsContent value="reports">
            {isLoadingReports ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportedContent && reportedContent.length > 0 ? (
                      reportedContent.map((report) => (
                        <TableRow key={`${report.type}-${report.id}`}>
                          <TableCell className="max-w-[200px] truncate">
                            {truncateText(report.content)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {report.type === 'bulletin' && 'Bulletin Post'}
                              {report.type === 'chat' && 'Chat Message'}
                              {report.type === 'article' && 'Article'}
                              {report.type === 'user_content' && 'User Content'}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.reporterName}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{formatDate(report.reportedAt)}</TableCell>
                          <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenActionDialog(report, report.type)}
                            >
                              <ChevronRight size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No reported content found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          {/* Bulletin Posts Tab */}
          <TabsContent value="bulletin">
            {isLoadingBulletin ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bulletinPosts && bulletinPosts.length > 0 ? (
                      bulletinPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.userId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{post.category}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(post.postedAt)}</TableCell>
                          <TableCell>{getContentStatusBadge(post.isHidden || false)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => handleOpenActionDialog(post, 'bulletin')}>
                                  Moderate Post
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Full Content
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No bulletin posts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          {/* Chat Messages Tab */}
          <TabsContent value="chat">
            {isLoadingChat ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chatMessages && chatMessages.length > 0 ? (
                      chatMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="max-w-[300px] truncate">
                            {truncateText(message.message)}
                          </TableCell>
                          <TableCell>{message.userId}</TableCell>
                          <TableCell>{message.roomId}</TableCell>
                          <TableCell>{formatDate(message.sentAt)}</TableCell>
                          <TableCell>{getContentStatusBadge(message.isHidden || false)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => handleOpenActionDialog(message, 'chat')}>
                                  Moderate Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  View User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Chat Room
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No flagged chat messages found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          {/* Articles Tab */}
          <TabsContent value="articles">
            <div className="p-8 text-center text-muted-foreground">
              Article moderation to be implemented.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate Content</DialogTitle>
            <DialogDescription>
              Review and take action on this content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border p-3 rounded-md bg-muted">
              <p className="text-sm whitespace-pre-wrap">
                {selectedContent?.content || selectedContent?.message || selectedContent?.title}
              </p>
              {selectedContent?.title && selectedContent?.content && (
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {selectedContent.content}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hide">Hide Content</Label>
                <div className="text-xs text-muted-foreground">
                  Hide this content from users
                </div>
              </div>
              <Switch 
                id="hide" 
                checked={hideContent}
                onCheckedChange={setHideContent}
              />
            </div>
            
            {hideContent && (
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="hate_speech">Hate Speech</SelectItem>
                    <SelectItem value="violation_of_terms">Violation of Terms</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Moderation Notes</Label>
              <Textarea 
                id="notes"
                value={moderationNotes} 
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Add detailed notes about the moderation action"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveModeration} disabled={moderateContentMutation.isPending}>
              {moderateContentMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⧗</span>
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}