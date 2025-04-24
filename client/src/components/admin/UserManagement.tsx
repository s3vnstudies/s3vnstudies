import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Shield, 
  ShieldAlert, 
  ShieldQuestion,
  UserCog
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User } from '@shared/schema';

export default function UserManagement() {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [moderationNotes, setModerationNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [selectedReason, setSelectedReason] = useState<string>('');
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/users');
      return res.json();
    }
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status, reason, notes }: { 
      userId: number; 
      status: string;
      reason?: string;
      notes?: string;
    }) => {
      const res = await apiRequest('POST', `/api/admin/users/${userId}/status`, {
        status,
        reason,
        notes
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User status updated',
        description: 'The user status has been successfully updated.',
      });
      setIsStatusDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating user status',
        description: error.message || 'An error occurred while updating the user status.',
        variant: 'destructive',
      });
    }
  });

  const handleOpenStatusDialog = (userId: number) => {
    setSelectedUserId(userId);
    const user = users?.find(u => u.id === userId);
    if (user) {
      setSelectedStatus(user.accountStatus || 'active');
      setModerationNotes(user.moderationNotes || '');
    }
    setIsStatusDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (!selectedUserId) return;
    
    updateUserStatusMutation.mutate({
      userId: selectedUserId,
      status: selectedStatus,
      reason: selectedReason,
      notes: moderationNotes
    });
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center">
            <CheckCircle2 size={16} className="text-green-500 mr-1.5" />
            <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs">Active</span>
          </div>
        );
      case 'suspended':
        return (
          <div className="flex items-center">
            <AlertCircle size={16} className="text-amber-500 mr-1.5" />
            <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-xs">Suspended</span>
          </div>
        );
      case 'banned':
        return (
          <div className="flex items-center">
            <XCircle size={16} className="text-red-500 mr-1.5" />
            <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-xs">Banned</span>
          </div>
        );
      case 'under_review':
        return (
          <div className="flex items-center">
            <Clock size={16} className="text-blue-500 mr-1.5" />
            <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full text-xs">Under Review</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <CheckCircle2 size={16} className="text-green-500 mr-1.5" />
            <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs">Active</span>
          </div>
        );
    }
  };

  const getRoleBadge = (isAdmin: boolean) => {
    return isAdmin ? (
      <div className="flex items-center">
        <Shield size={16} className="text-purple-500 mr-1.5" />
        <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full text-xs">Admin</span>
      </div>
    ) : (
      <div className="flex items-center">
        <UserCog size={16} className="text-gray-500 mr-1.5" />
        <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full text-xs">Member</span>
      </div>
    );
  };

  const getMembershipBadge = (tier: string) => {
    return tier === 'pro' ? (
      <div className="flex items-center">
        <ShieldAlert size={16} className="text-indigo-500 mr-1.5" />
        <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full text-xs">Pro</span>
      </div>
    ) : (
      <div className="flex items-center">
        <ShieldQuestion size={16} className="text-gray-500 mr-1.5" />
        <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full text-xs">Free</span>
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
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View, manage, and moderate user accounts on the platform.
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
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Member Since</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user.avatarUrl ? (
                              <img 
                                src={user.avatarUrl} 
                                alt={user.displayName || user.username} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {(user.displayName || user.username)?.[0]?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.displayName || user.username}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.accountStatus)}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.isAdmin)}
                      </TableCell>
                      <TableCell>
                        {getMembershipBadge(user.membershipTier)}
                      </TableCell>
                      <TableCell>
                        {formatDate(user.memberSince)}
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
                            <DropdownMenuItem onSelect={() => handleOpenStatusDialog(user.id)}>
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Message User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Status</DialogTitle>
            <DialogDescription>
              Update the status for this user account. This will affect the user's ability to interact with the platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedStatus !== 'active' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger>
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
              <label className="text-sm font-medium">Moderation Notes</label>
              <Textarea 
                value={moderationNotes} 
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Add detailed notes about the moderation action"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate} disabled={updateUserStatusMutation.isPending}>
              {updateUserStatusMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⧗</span>
                  Updating...
                </>
              ) : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}