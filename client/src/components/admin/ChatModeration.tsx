import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MoreHorizontal, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChatRoom } from '@shared/schema';

export default function ChatModeration() {
  const { toast } = useToast();
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [moderationNotes, setModerationNotes] = useState('');
  const [isModerated, setIsModerated] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const { data: chatRooms, isLoading } = useQuery<ChatRoom[]>({
    queryKey: ['/api/admin/chat-rooms'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/chat-rooms');
      return res.json();
    }
  });

  const updateChatRoomMutation = useMutation({
    mutationFn: async (data: { 
      roomId: number; 
      isModerated: boolean;
      isMuted: boolean;
      moderationNotes?: string;
    }) => {
      const res = await apiRequest('POST', `/api/admin/chat-rooms/${data.roomId}/moderate`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/chat-rooms'] });
      toast({
        title: 'Chat room updated',
        description: 'The chat room moderation settings have been updated.',
      });
      setIsRoomDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating chat room',
        description: error.message || 'An error occurred while updating the chat room.',
        variant: 'destructive',
      });
    }
  });

  const handleOpenModerateDialog = (room: ChatRoom) => {
    setSelectedChatRoom(room);
    setIsModerated(room.isModerated || false);
    setIsMuted(room.isMuted || false);
    setModerationNotes(room.moderationNotes || '');
    setIsRoomDialogOpen(true);
  };

  const handleSaveModeration = () => {
    if (!selectedChatRoom) return;
    
    updateChatRoomMutation.mutate({
      roomId: selectedChatRoom.id,
      isModerated,
      isMuted,
      moderationNotes
    });
  };

  const getMembershipLabel = (tier: string) => {
    switch (tier) {
      case 'pro':
        return (
          <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full text-xs">
            Pro Members
          </span>
        );
      case 'free':
      default:
        return (
          <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs">
            All Members
          </span>
        );
    }
  };

  const getPrivacyLabel = (isPrivate: boolean) => {
    return isPrivate ? (
      <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-xs">
        Private
      </span>
    ) : (
      <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
        Public
      </span>
    );
  };

  const getModerationStatus = (room: ChatRoom) => {
    if (room.isMuted) {
      return (
        <div className="flex items-center">
          <VolumeX size={16} className="text-red-500 mr-1.5" />
          <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-xs">Muted</span>
        </div>
      );
    }
    
    if (room.isModerated) {
      return (
        <div className="flex items-center">
          <Shield size={16} className="text-amber-500 mr-1.5" />
          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-xs">Moderated</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <Volume2 size={16} className="text-green-500 mr-1.5" />
        <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs">Normal</span>
      </div>
    );
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Room Moderation</CardTitle>
        <CardDescription>
          Moderate chat rooms to manage community discussions and enforce appropriate content standards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chatRooms && chatRooms.length > 0 ? (
                  chatRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MessageSquare size={18} className="text-primary" />
                          <div>
                            <div className="font-medium">{room.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{room.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getModerationStatus(room)}
                      </TableCell>
                      <TableCell>
                        {getPrivacyLabel(room.isPrivate)}
                      </TableCell>
                      <TableCell>
                        {getMembershipLabel(room.membershipRequired)}
                      </TableCell>
                      <TableCell>
                        {formatDate(room.createdAt)}
                      </TableCell>
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
                            <DropdownMenuItem onSelect={() => handleOpenModerateDialog(room)}>
                              Moderate Room
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              View Messages
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Archive Room
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No chat rooms found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate Chat Room</DialogTitle>
            <DialogDescription>
              Adjust moderation settings for {selectedChatRoom?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="moderated">Enable Moderation</Label>
                <div className="text-xs text-muted-foreground">
                  Message content will be monitored by administrators
                </div>
              </div>
              <Switch 
                id="moderated" 
                checked={isModerated}
                onCheckedChange={setIsModerated}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="muted">Mute Room</Label>
                <div className="text-xs text-muted-foreground">
                  Temporarily disable all messages in this room
                </div>
              </div>
              <Switch 
                id="muted" 
                checked={isMuted}
                onCheckedChange={setIsMuted}
              />
            </div>
            
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
            <Button variant="outline" onClick={() => setIsRoomDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveModeration} disabled={updateChatRoomMutation.isPending}>
              {updateChatRoomMutation.isPending ? (
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