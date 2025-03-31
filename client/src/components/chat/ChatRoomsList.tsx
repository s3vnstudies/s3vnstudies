import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { Lock, Plus, Users } from "lucide-react";

export default function ChatRoomsList() {
  const { user } = useAuth();
  const { rooms, joinRoom, createRoom, currentRoom } = useChat();
  const [open, setOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isPremiumOrAbove = user && 
    (user.membershipTier === "premium" || 
     user.membershipTier === "pro" || 
     user.role === "admin");
  
  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    
    setIsSubmitting(true);
    
    createRoom(newRoomName, newRoomDescription, isPrivate);
    
    // Reset form and close dialog
    setNewRoomName("");
    setNewRoomDescription("");
    setIsPrivate(false);
    setIsSubmitting(false);
    setOpen(false);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden h-[60vh]">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <h3 className="font-bold">Chat Rooms</h3>
        
        {isPremiumOrAbove && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Chat Room</DialogTitle>
                <DialogDescription>
                  Create a new room for discussion. Private rooms are only visible to you and admins.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="General Discussion"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    placeholder="A place to discuss anything..."
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="private" 
                    checked={isPrivate}
                    onCheckedChange={(checked) => setIsPrivate(checked === true)}
                  />
                  <Label htmlFor="private">Make this room private</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleCreateRoom} disabled={!newRoomName.trim() || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Room"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <ScrollArea className="h-[calc(60vh-57px)]">
        <div className="p-2">
          {rooms.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              <p>No chat rooms available.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <Button
                key={room.id}
                variant="ghost"
                className={`w-full justify-start mb-1 ${
                  currentRoom?.id === room.id ? "bg-primary/10 text-primary" : ""
                }`}
                onClick={() => joinRoom(room.id)}
              >
                <div className="flex items-center w-full">
                  <div className="mr-3">
                    {room.isPrivate ? <Lock className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{room.name}</div>
                    {room.description && (
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {room.description}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
