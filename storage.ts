import { type User, type InsertUser, type Post, type InsertPost, type Comment, type InsertComment, type Group, type InsertGroup, type Message, type InsertMessage, type Conversation, type Friendship, type Like, type Notification, type InsertNotification, type PostWithAuthor, type UserWithStats, type ConversationWithParticipants } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  searchUsers(query: string): Promise<User[]>;
  getSuggestedFriends(userId: string): Promise<UserWithStats[]>;

  // Posts
  createPost(post: InsertPost): Promise<Post>;
  getPostById(id: string): Promise<PostWithAuthor | undefined>;
  getFeedPosts(userId: string, limit?: number): Promise<PostWithAuthor[]>;
  getUserPosts(userId: string): Promise<PostWithAuthor[]>;
  getGroupPosts(groupId: string): Promise<PostWithAuthor[]>;
  deletePost(id: string): Promise<boolean>;

  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: string): Promise<(Comment & { author: User })[]>;
  deleteComment(id: string): Promise<boolean>;

  // Likes
  toggleLike(userId: string, targetId: string, targetType: "post" | "comment"): Promise<boolean>;
  isLiked(userId: string, targetId: string): Promise<boolean>;

  // Friendships
  sendFriendRequest(userId: string, friendId: string): Promise<Friendship>;
  acceptFriendRequest(userId: string, friendId: string): Promise<boolean>;
  removeFriend(userId: string, friendId: string): Promise<boolean>;
  getFriends(userId: string): Promise<User[]>;
  getFriendRequests(userId: string): Promise<(Friendship & { user: User })[]>;

  // Groups
  createGroup(group: InsertGroup): Promise<Group>;
  getGroup(id: string): Promise<Group | undefined>;
  getUserGroups(userId: string): Promise<Group[]>;
  joinGroup(userId: string, groupId: string): Promise<boolean>;
  leaveGroup(userId: string, groupId: string): Promise<boolean>;

  // Messages
  createConversation(participantIds: string[]): Promise<Conversation>;
  getConversation(id: string): Promise<ConversationWithParticipants | undefined>;
  getUserConversations(userId: string): Promise<ConversationWithParticipants[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: string): Promise<(Message & { sender: User })[]>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<boolean>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<boolean>;
  getUnreadNotificationsCount(userId: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private comments: Map<string, Comment>;
  private likes: Map<string, Like>;
  private friendships: Map<string, Friendship>;
  private groups: Map<string, Group>;
  private groupMemberships: Map<string, any>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.friendships = new Map();
    this.groups = new Map();
    this.groupMemberships = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.notifications = new Map();

    // Initialize with demo user
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    const demoUser: User = {
      id: "demo-user-1",
      username: "alexjohnson",
      email: "alex@example.com",
      password: "password123",
      displayName: "Alex Johnson",
      bio: "Web Developer & Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      coverPhoto: null,
      location: "San Francisco, CA",
      website: "https://alexjohnson.dev",
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Add some demo groups
    const demoGroup: Group = {
      id: "group-1",
      name: "Web Developers Hub",
      description: "A community for web developers to share knowledge and network",
      avatar: null,
      coverPhoto: null,
      ownerId: demoUser.id,
      membersCount: 12489,
      isPrivate: false,
      createdAt: new Date(),
    };
    this.groups.set(demoGroup.id, demoGroup);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async searchUsers(query: string): Promise<User[]> {
    const users = Array.from(this.users.values());
    return users.filter(user => 
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getSuggestedFriends(userId: string): Promise<UserWithStats[]> {
    const users = Array.from(this.users.values())
      .filter(user => user.id !== userId)
      .slice(0, 5);
    
    return users.map(user => ({
      ...user,
      friendsCount: Math.floor(Math.random() * 100),
      postsCount: Math.floor(Math.random() * 50),
      isFriend: false,
      friendshipStatus: "none",
    }));
  }

  // Posts
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      ...insertPost,
      id,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async getPostById(id: string): Promise<PostWithAuthor | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const author = await this.getUser(post.authorId);
    if (!author) return undefined;
    
    return { ...post, author };
  }

  async getFeedPosts(userId: string, limit = 10): Promise<PostWithAuthor[]> {
    const posts = Array.from(this.posts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    
    const postsWithAuthors: PostWithAuthor[] = [];
    for (const post of posts) {
      const author = await this.getUser(post.authorId);
      if (author) {
        const isLiked = await this.isLiked(userId, post.id);
        postsWithAuthors.push({ ...post, author, isLiked });
      }
    }
    
    return postsWithAuthors;
  }

  async getUserPosts(userId: string): Promise<PostWithAuthor[]> {
    const posts = Array.from(this.posts.values())
      .filter(post => post.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const author = await this.getUser(userId);
    if (!author) return [];
    
    return posts.map(post => ({ ...post, author }));
  }

  async getGroupPosts(groupId: string): Promise<PostWithAuthor[]> {
    const posts = Array.from(this.posts.values())
      .filter(post => post.groupId === groupId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const postsWithAuthors: PostWithAuthor[] = [];
    for (const post of posts) {
      const author = await this.getUser(post.authorId);
      if (author) {
        postsWithAuthors.push({ ...post, author });
      }
    }
    
    return postsWithAuthors;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Comments
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      likesCount: 0,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    
    // Update post comments count
    const post = this.posts.get(insertComment.postId);
    if (post) {
      post.commentsCount++;
      this.posts.set(post.id, post);
    }
    
    return comment;
  }

  async getPostComments(postId: string): Promise<(Comment & { author: User })[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    const commentsWithAuthors: (Comment & { author: User })[] = [];
    for (const comment of comments) {
      const author = await this.getUser(comment.authorId);
      if (author) {
        commentsWithAuthors.push({ ...comment, author });
      }
    }
    
    return commentsWithAuthors;
  }

  async deleteComment(id: string): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment) return false;
    
    // Update post comments count
    const post = this.posts.get(comment.postId);
    if (post && post.commentsCount > 0) {
      post.commentsCount--;
      this.posts.set(post.id, post);
    }
    
    return this.comments.delete(id);
  }

  // Likes
  async toggleLike(userId: string, targetId: string, targetType: "post" | "comment"): Promise<boolean> {
    const likeId = `${userId}-${targetId}`;
    const existingLike = this.likes.get(likeId);
    
    if (existingLike) {
      this.likes.delete(likeId);
      // Decrease like count
      if (targetType === "post") {
        const post = this.posts.get(targetId);
        if (post && post.likesCount > 0) {
          post.likesCount--;
          this.posts.set(targetId, post);
        }
      } else {
        const comment = this.comments.get(targetId);
        if (comment && comment.likesCount > 0) {
          comment.likesCount--;
          this.comments.set(targetId, comment);
        }
      }
      return false;
    } else {
      const like: Like = {
        id: randomUUID(),
        userId,
        targetId,
        targetType,
        createdAt: new Date(),
      };
      this.likes.set(likeId, like);
      // Increase like count
      if (targetType === "post") {
        const post = this.posts.get(targetId);
        if (post) {
          post.likesCount++;
          this.posts.set(targetId, post);
        }
      } else {
        const comment = this.comments.get(targetId);
        if (comment) {
          comment.likesCount++;
          this.comments.set(targetId, comment);
        }
      }
      return true;
    }
  }

  async isLiked(userId: string, targetId: string): Promise<boolean> {
    const likeId = `${userId}-${targetId}`;
    return this.likes.has(likeId);
  }

  // Friendships
  async sendFriendRequest(userId: string, friendId: string): Promise<Friendship> {
    const id = randomUUID();
    const friendship: Friendship = {
      id,
      userId,
      friendId,
      status: "pending",
      createdAt: new Date(),
    };
    this.friendships.set(id, friendship);
    return friendship;
  }

  async acceptFriendRequest(userId: string, friendId: string): Promise<boolean> {
    const friendship = Array.from(this.friendships.values())
      .find(f => f.friendId === userId && f.userId === friendId && f.status === "pending");
    
    if (friendship) {
      friendship.status = "accepted";
      this.friendships.set(friendship.id, friendship);
      return true;
    }
    return false;
  }

  async removeFriend(userId: string, friendId: string): Promise<boolean> {
    const friendships = Array.from(this.friendships.entries())
      .filter(([_, f]) => 
        (f.userId === userId && f.friendId === friendId) || 
        (f.userId === friendId && f.friendId === userId)
      );
    
    friendships.forEach(([id, _]) => this.friendships.delete(id));
    return friendships.length > 0;
  }

  async getFriends(userId: string): Promise<User[]> {
    const friendships = Array.from(this.friendships.values())
      .filter(f => 
        (f.userId === userId || f.friendId === userId) && f.status === "accepted"
      );
    
    const friends: User[] = [];
    for (const friendship of friendships) {
      const friendId = friendship.userId === userId ? friendship.friendId : friendship.userId;
      const friend = await this.getUser(friendId);
      if (friend) friends.push(friend);
    }
    
    return friends;
  }

  async getFriendRequests(userId: string): Promise<(Friendship & { user: User })[]> {
    const requests = Array.from(this.friendships.values())
      .filter(f => f.friendId === userId && f.status === "pending");
    
    const requestsWithUsers: (Friendship & { user: User })[] = [];
    for (const request of requests) {
      const user = await this.getUser(request.userId);
      if (user) {
        requestsWithUsers.push({ ...request, user });
      }
    }
    
    return requestsWithUsers;
  }

  // Groups
  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const group: Group = {
      ...insertGroup,
      id,
      membersCount: 1,
      createdAt: new Date(),
    };
    this.groups.set(id, group);
    
    // Add creator as member
    const membershipId = randomUUID();
    this.groupMemberships.set(membershipId, {
      id: membershipId,
      groupId: id,
      userId: insertGroup.ownerId,
      role: "admin",
      joinedAt: new Date(),
    });
    
    return group;
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const memberships = Array.from(this.groupMemberships.values())
      .filter(m => m.userId === userId);
    
    const groups: Group[] = [];
    for (const membership of memberships) {
      const group = await this.getGroup(membership.groupId);
      if (group) groups.push(group);
    }
    
    return groups;
  }

  async joinGroup(userId: string, groupId: string): Promise<boolean> {
    const membershipId = randomUUID();
    this.groupMemberships.set(membershipId, {
      id: membershipId,
      groupId,
      userId,
      role: "member",
      joinedAt: new Date(),
    });
    
    // Update group members count
    const group = this.groups.get(groupId);
    if (group) {
      group.membersCount++;
      this.groups.set(groupId, group);
    }
    
    return true;
  }

  async leaveGroup(userId: string, groupId: string): Promise<boolean> {
    const memberships = Array.from(this.groupMemberships.entries())
      .filter(([_, m]) => m.userId === userId && m.groupId === groupId);
    
    memberships.forEach(([id, _]) => this.groupMemberships.delete(id));
    
    // Update group members count
    if (memberships.length > 0) {
      const group = this.groups.get(groupId);
      if (group && group.membersCount > 0) {
        group.membersCount--;
        this.groups.set(groupId, group);
      }
    }
    
    return memberships.length > 0;
  }

  // Messages
  async createConversation(participantIds: string[]): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      id,
      participantIds,
      lastMessageId: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<ConversationWithParticipants | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const participants: User[] = [];
    for (const participantId of conversation.participantIds) {
      const participant = await this.getUser(participantId);
      if (participant) participants.push(participant);
    }
    
    let lastMessage;
    if (conversation.lastMessageId) {
      const message = this.messages.get(conversation.lastMessageId);
      if (message) {
        const sender = await this.getUser(message.senderId);
        if (sender) {
          lastMessage = { ...message, sender };
        }
      }
    }
    
    return {
      ...conversation,
      participants,
      lastMessage,
      unreadCount: 0, // TODO: Calculate unread count
    };
  }

  async getUserConversations(userId: string): Promise<ConversationWithParticipants[]> {
    const conversations = Array.from(this.conversations.values())
      .filter(c => c.participantIds.includes(userId))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
    const conversationsWithParticipants: ConversationWithParticipants[] = [];
    for (const conversation of conversations) {
      const convWithParticipants = await this.getConversation(conversation.id);
      if (convWithParticipants) {
        conversationsWithParticipants.push(convWithParticipants);
      }
    }
    
    return conversationsWithParticipants;
  }

  async sendMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      readBy: [insertMessage.senderId],
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    
    // Update conversation
    const conversation = this.conversations.get(insertMessage.conversationId);
    if (conversation) {
      conversation.lastMessageId = id;
      conversation.updatedAt = new Date();
      this.conversations.set(conversation.id, conversation);
    }
    
    return message;
  }

  async getConversationMessages(conversationId: string): Promise<(Message & { sender: User })[]> {
    const messages = Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    const messagesWithSenders: (Message & { sender: User })[] = [];
    for (const message of messages) {
      const sender = await this.getUser(message.senderId);
      if (sender) {
        messagesWithSenders.push({ ...message, sender });
      }
    }
    
    return messagesWithSenders;
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<boolean> {
    const messages = Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId);
    
    messages.forEach(message => {
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
        this.messages.set(message.id, message);
      }
    });
    
    return true;
  }

  // Notifications
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
      return true;
    }
    return false;
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.isRead).length;
  }
}

export const storage = new MemStorage();
