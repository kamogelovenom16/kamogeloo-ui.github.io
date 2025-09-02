import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertGroupSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      await storage.updateUser(user.id, { isOnline: true, lastSeen: new Date() });
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/me", async (req, res) => {
    // For demo, return the demo user
    const user = await storage.getUser("demo-user-1");
    if (user) {
      res.json({ ...user, password: undefined });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (user) {
      res.json({ ...user, password: undefined });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Don't allow password updates here
      const user = await storage.updateUser(req.params.id, updates);
      if (user) {
        res.json({ ...user, password: undefined });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  app.get("/api/users/search/:query", async (req, res) => {
    const users = await storage.searchUsers(req.params.query);
    res.json(users.map(user => ({ ...user, password: undefined })));
  });

  app.get("/api/users/:id/suggested-friends", async (req, res) => {
    const suggestions = await storage.getSuggestedFriends(req.params.id);
    res.json(suggestions.map(user => ({ ...user, password: undefined })));
  });

  // Posts routes
  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      const postWithAuthor = await storage.getPostById(post.id);
      res.json(postWithAuthor);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.get("/api/posts/feed/:userId", async (req, res) => {
    const { limit } = req.query;
    const posts = await storage.getFeedPosts(
      req.params.userId, 
      limit ? parseInt(limit as string) : undefined
    );
    res.json(posts);
  });

  app.get("/api/posts/user/:userId", async (req, res) => {
    const posts = await storage.getUserPosts(req.params.userId);
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const post = await storage.getPostById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    const deleted = await storage.deletePost(req.params.id);
    if (deleted) {
      res.json({ message: "Post deleted" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });

  // Comments routes
  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.get("/api/posts/:postId/comments", async (req, res) => {
    const comments = await storage.getPostComments(req.params.postId);
    res.json(comments);
  });

  app.delete("/api/comments/:id", async (req, res) => {
    const deleted = await storage.deleteComment(req.params.id);
    if (deleted) {
      res.json({ message: "Comment deleted" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  });

  // Likes routes
  app.post("/api/likes", async (req, res) => {
    try {
      const { userId, targetId, targetType } = req.body;
      const liked = await storage.toggleLike(userId, targetId, targetType);
      res.json({ liked });
    } catch (error) {
      res.status(400).json({ message: "Like failed" });
    }
  });

  app.get("/api/likes/:userId/:targetId", async (req, res) => {
    const isLiked = await storage.isLiked(req.params.userId, req.params.targetId);
    res.json({ isLiked });
  });

  // Friends routes
  app.post("/api/friends/request", async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const friendship = await storage.sendFriendRequest(userId, friendId);
      res.json(friendship);
    } catch (error) {
      res.status(400).json({ message: "Friend request failed" });
    }
  });

  app.post("/api/friends/accept", async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const accepted = await storage.acceptFriendRequest(userId, friendId);
      if (accepted) {
        res.json({ message: "Friend request accepted" });
      } else {
        res.status(404).json({ message: "Friend request not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Accept failed" });
    }
  });

  app.delete("/api/friends/:userId/:friendId", async (req, res) => {
    const removed = await storage.removeFriend(req.params.userId, req.params.friendId);
    if (removed) {
      res.json({ message: "Friend removed" });
    } else {
      res.status(404).json({ message: "Friendship not found" });
    }
  });

  app.get("/api/friends/:userId", async (req, res) => {
    const friends = await storage.getFriends(req.params.userId);
    res.json(friends.map(friend => ({ ...friend, password: undefined })));
  });

  app.get("/api/friends/requests/:userId", async (req, res) => {
    const requests = await storage.getFriendRequests(req.params.userId);
    res.json(requests.map(req => ({ ...req, user: { ...req.user, password: undefined } })));
  });

  // Groups routes
  app.post("/api/groups", async (req, res) => {
    try {
      const groupData = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(groupData);
      res.json(group);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.get("/api/groups/:id", async (req, res) => {
    const group = await storage.getGroup(req.params.id);
    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  });

  app.get("/api/users/:userId/groups", async (req, res) => {
    const groups = await storage.getUserGroups(req.params.userId);
    res.json(groups);
  });

  app.post("/api/groups/:groupId/join", async (req, res) => {
    try {
      const { userId } = req.body;
      const joined = await storage.joinGroup(userId, req.params.groupId);
      if (joined) {
        res.json({ message: "Joined group successfully" });
      } else {
        res.status(400).json({ message: "Failed to join group" });
      }
    } catch (error) {
      res.status(400).json({ message: "Join failed" });
    }
  });

  app.post("/api/groups/:groupId/leave", async (req, res) => {
    try {
      const { userId } = req.body;
      const left = await storage.leaveGroup(userId, req.params.groupId);
      if (left) {
        res.json({ message: "Left group successfully" });
      } else {
        res.status(400).json({ message: "Failed to leave group" });
      }
    } catch (error) {
      res.status(400).json({ message: "Leave failed" });
    }
  });

  app.get("/api/groups/:groupId/posts", async (req, res) => {
    const posts = await storage.getGroupPosts(req.params.groupId);
    res.json(posts);
  });

  // Messages routes
  app.post("/api/conversations", async (req, res) => {
    try {
      const { participantIds } = req.body;
      const conversation = await storage.createConversation(participantIds);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:userId", async (req, res) => {
    const conversations = await storage.getUserConversations(req.params.userId);
    res.json(conversations);
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    const messages = await storage.getConversationMessages(req.params.id);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.sendMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.post("/api/conversations/:id/read", async (req, res) => {
    try {
      const { userId } = req.body;
      const marked = await storage.markMessagesAsRead(req.params.id, userId);
      if (marked) {
        res.json({ message: "Messages marked as read" });
      } else {
        res.status(400).json({ message: "Failed to mark as read" });
      }
    } catch (error) {
      res.status(400).json({ message: "Mark as read failed" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", async (req, res) => {
    const notifications = await storage.getUserNotifications(req.params.userId);
    res.json(notifications);
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    const marked = await storage.markNotificationAsRead(req.params.id);
    if (marked) {
      res.json({ message: "Notification marked as read" });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  });

  app.get("/api/notifications/:userId/unread-count", async (req, res) => {
    const count = await storage.getUnreadNotificationsCount(req.params.userId);
    res.json({ count });
  });

  const httpServer = createServer(app);
  return httpServer;
}
