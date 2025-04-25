import express, { Request, Response, NextFunction, Router } from 'express';
import type { Express } from 'express';
import { db } from './db';
import { 
  users, 
  chatRooms, 
  chatMessages, 
  bulletinPosts, 
  accountStatusEnum,
  moderationReasonEnum 
} from '@shared/schema';
import { eq, desc, and, or, isNotNull } from 'drizzle-orm';

// Middleware to check if user is admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  next();
}

export function registerAdminRoutes(app: Express) {
  const router = Router();

  // Get all users
  router.get('/users', async (req: Request, res: Response) => {
    try {
      const allUsers = await db.select().from(users).orderBy(users.memberSince);
      res.json(allUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update user account status
  router.post('/users/:userId/status', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const { status, reason, notes } = req.body;
      
      // Validate input
      if (!status || !Object.values(accountStatusEnum.enumValues).includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      if (status !== 'active' && (!reason || !Object.values(moderationReasonEnum.enumValues).includes(reason))) {
        return res.status(400).json({ error: 'Reason required for non-active status' });
      }

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set({
          accountStatus: status,
          moderationReason: status !== 'active' ? reason : null,
          moderationNotes: notes || null,
          moderatedBy: req.user?.id,
          moderatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all chat rooms
  router.get('/chat-rooms', async (req: Request, res: Response) => {
    try {
      const rooms = await db.select().from(chatRooms).orderBy(desc(chatRooms.createdAt));
      res.json(rooms);
    } catch (error: any) {
      console.error('Error fetching chat rooms:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Moderate a chat room
  router.post('/chat-rooms/:roomId/moderate', async (req: Request, res: Response) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const { isModerated, isMuted, moderationNotes } = req.body;
      
      // Update room
      const [updatedRoom] = await db
        .update(chatRooms)
        .set({
          isModerated: Boolean(isModerated),
          isMuted: Boolean(isMuted),
          moderationNotes: moderationNotes || null,
          moderatorId: req.user?.id,
          moderatedAt: new Date()
        })
        .where(eq(chatRooms.id, roomId))
        .returning();

      if (!updatedRoom) {
        return res.status(404).json({ error: 'Chat room not found' });
      }

      res.json(updatedRoom);
    } catch (error: any) {
      console.error('Error moderating chat room:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get flagged chat messages
  router.get('/chat-messages/flagged', async (req: Request, res: Response) => {
    try {
      const messages = await db
        .select()
        .from(chatMessages)
        .where(
          or(
            eq(chatMessages.isHidden, true),
            isNotNull(chatMessages.hiddenReason)
          )
        )
        .orderBy(desc(chatMessages.sentAt))
        .limit(50);
      
      res.json(messages);
    } catch (error: any) {
      console.error('Error fetching flagged chat messages:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Moderate chat message
  router.post('/content/chat/:messageId/moderate', async (req: Request, res: Response) => {
    try {
      const messageId = parseInt(req.params.messageId);
      const { isHidden, reason, notes } = req.body;
      
      // Update message
      const [updatedMessage] = await db
        .update(chatMessages)
        .set({
          isHidden: Boolean(isHidden),
          hiddenReason: isHidden ? reason : null,
          hiddenBy: isHidden ? req.user?.id : null,
          hiddenAt: isHidden ? new Date() : null
        })
        .where(eq(chatMessages.id, messageId))
        .returning();

      if (!updatedMessage) {
        return res.status(404).json({ error: 'Chat message not found' });
      }

      res.json(updatedMessage);
    } catch (error: any) {
      console.error('Error moderating chat message:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all bulletin posts
  router.get('/bulletin-posts', async (req: Request, res: Response) => {
    try {
      const posts = await db
        .select()
        .from(bulletinPosts)
        .orderBy(desc(bulletinPosts.postedAt));
      
      res.json(posts);
    } catch (error: any) {
      console.error('Error fetching bulletin posts:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Moderate bulletin post
  router.post('/content/bulletin/:postId/moderate', async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      const { isHidden, reason, notes } = req.body;
      
      // Update post
      const [updatedPost] = await db
        .update(bulletinPosts)
        .set({
          isHidden: Boolean(isHidden),
          hiddenReason: isHidden ? reason : null,
          hiddenBy: isHidden ? req.user?.id : null,
          hiddenAt: isHidden ? new Date() : null,
          moderationNotes: notes || null
        })
        .where(eq(bulletinPosts.id, postId))
        .returning();

      if (!updatedPost) {
        return res.status(404).json({ error: 'Bulletin post not found' });
      }

      res.json(updatedPost);
    } catch (error: any) {
      console.error('Error moderating bulletin post:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generic endpoint for content moderation (future use)
  router.post('/content/:type/:id/moderate', async (req: Request, res: Response) => {
    try {
      const { type, id } = req.params;
      const contentId = parseInt(id);
      
      switch (type) {
        case 'chat':
          return await moderateChatMessage(req, res, contentId);
        case 'bulletin':
          return await moderateBulletinPost(req, res, contentId);
        default:
          return res.status(400).json({ error: 'Unsupported content type' });
      }
    } catch (error: any) {
      console.error(`Error moderating ${req.params.type}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Helper function for chat message moderation
  async function moderateChatMessage(req: Request, res: Response, messageId: number) {
    const { isHidden, reason, notes } = req.body;
    
    const [updatedMessage] = await db
      .update(chatMessages)
      .set({
        isHidden: Boolean(isHidden),
        hiddenReason: isHidden ? reason : null,
        hiddenBy: isHidden ? req.user?.id : null,
        hiddenAt: isHidden ? new Date() : null
      })
      .where(eq(chatMessages.id, messageId))
      .returning();

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Chat message not found' });
    }

    res.json(updatedMessage);
  }

  // Helper function for bulletin post moderation
  async function moderateBulletinPost(req: Request, res: Response, postId: number) {
    const { isHidden, reason, notes } = req.body;
    
    const [updatedPost] = await db
      .update(bulletinPosts)
      .set({
        isHidden: Boolean(isHidden),
        hiddenReason: isHidden ? reason : null,
        hiddenBy: isHidden ? req.user?.id : null,
        hiddenAt: isHidden ? new Date() : null,
        moderationNotes: notes || null
      })
      .where(eq(bulletinPosts.id, postId))
      .returning();

    if (!updatedPost) {
      return res.status(404).json({ error: 'Bulletin post not found' });
    }

    res.json(updatedPost);
  }

  // Apply admin middleware to all routes
  app.use('/api/admin', requireAdmin, router);
}