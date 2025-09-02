import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Send, Search, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ConversationWithParticipants, Message, User } from "@shared/schema";

export default function Messages() {
  const { id: conversationId } = useParams();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversationId || null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<ConversationWithParticipants[]>({
    queryKey: ["/api/conversations", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<(Message & { sender: User })[]>({
    queryKey: ["/api/conversations", selectedConversation, "messages"],
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        conversationId: selectedConversation,
        senderId: currentUser?.id,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", selectedConversation, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", currentUser?.id] });
      setNewMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    },
  });

  // Mock conversations for demo
  const mockConversations: ConversationWithParticipants[] = [
    {
      id: "conv-1",
      participantIds: [currentUser?.id || "", "user-2"],
      lastMessageId: "msg-1",
      updatedAt: new Date(Date.now() - 5 * 60000),
      createdAt: new Date(),
      participants: [
        {
          id: "user-2",
          username: "marcusc",
          email: "marcus@example.com",
          password: "",
          displayName: "Marcus Chen",
          bio: "Software Engineer",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
          coverPhoto: null,
          location: null,
          website: null,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        }
      ],
      lastMessage: {
        id: "msg-1",
        conversationId: "conv-1",
        senderId: "user-2",
        content: "Hey! Did you check out that new framework we discussed?",
        type: "text",
        readBy: [],
        createdAt: new Date(Date.now() - 5 * 60000),
        sender: {
          id: "user-2",
          username: "marcusc",
          email: "marcus@example.com",
          password: "",
          displayName: "Marcus Chen",
          bio: "Software Engineer",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
          coverPhoto: null,
          location: null,
          website: null,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        }
      },
      unreadCount: 1
    },
    {
      id: "conv-2",
      participantIds: [currentUser?.id || "", "user-3"],
      lastMessageId: "msg-2",
      updatedAt: new Date(Date.now() - 60 * 60000),
      createdAt: new Date(),
      participants: [
        {
          id: "user-3",
          username: "sophie",
          email: "sophie@example.com",
          password: "",
          displayName: "Sophie Miller",
          bio: "UI/UX Designer",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
          coverPhoto: null,
          location: null,
          website: null,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        }
      ],
      lastMessage: {
        id: "msg-2",
        conversationId: "conv-2",
        senderId: "user-3",
        content: "Love the new design concepts! When can we schedule a review?",
        type: "text",
        readBy: [],
        createdAt: new Date(Date.now() - 60 * 60000),
        sender: {
          id: "user-3",
          username: "sophie",
          email: "sophie@example.com",
          password: "",
          displayName: "Sophie Miller",
          bio: "UI/UX Designer",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
          coverPhoto: null,
          location: null,
          website: null,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        }
      },
      unreadCount: 0
    }
  ];

  // Mock messages for demo
  const mockMessages: (Message & { sender: User })[] = [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-2",
      content: "Hey! How's the project going?",
      type: "text",
      readBy: [],
      createdAt: new Date(Date.now() - 60 * 60000),
      sender: {
        id: "user-2",
        username: "marcusc",
        email: "marcus@example.com",
        password: "",
        displayName: "Marcus Chen",
        bio: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
        coverPhoto: null,
        location: null,
        website: null,
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      }
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: currentUser?.id || "",
      content: "Going great! Just finished the new component library.",
      type: "text",
      readBy: [],
      createdAt: new Date(Date.now() - 45 * 60000),
      sender: currentUser || {
        id: "",
        username: "",
        email: "",
        password: "",
        displayName: "You",
        bio: "",
        avatar: "",
        coverPhoto: null,
        location: null,
        website: null,
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      }
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "user-2",
      content: "That's awesome! Can you share the docs when you're ready?",
      type: "text",
      readBy: [],
      createdAt: new Date(Date.now() - 30 * 60000),
      sender: {
        id: "user-2",
        username: "marcusc",
        email: "marcus@example.com",
        password: "",
        displayName: "Marcus Chen",
        bio: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
        coverPhoto: null,
        location: null,
        website: null,
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      }
    }
  ];

  const displayConversations = conversations.length > 0 ? conversations : mockConversations;
  const displayMessages = messages.length > 0 ? messages : (selectedConversation === "conv-1" ? mockMessages : []);

  useEffect(() => {
    if (conversationId && !selectedConversation) {
      setSelectedConversation(conversationId);
    }
  }, [conversationId, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const selectedConversationData = displayConversations.find(c => c.id === selectedConversation);
  const otherParticipant = selectedConversationData?.participants.find(p => p.id !== currentUser?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      <div className="pt-20 min-h-screen pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
            
            {/* Conversations List */}
            <div className={`lg:col-span-4 ${selectedConversation ? 'hidden lg:block' : ''}`}>
              <Card className="h-full shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold" data-testid="text-messages-title">Messages</h2>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-conversations"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto">
                  {conversationsLoading ? (
                    <div className="space-y-3 p-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {displayConversations
                        .filter(conv => {
                          const participant = conv.participants.find(p => p.id !== currentUser?.id);
                          return !searchQuery || participant?.displayName.toLowerCase().includes(searchQuery.toLowerCase());
                        })
                        .map((conversation) => {
                          const participant = conversation.participants.find(p => p.id !== currentUser?.id);
                          if (!participant) return null;

                          return (
                            <div
                              key={conversation.id}
                              className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-secondary transition-colors ${
                                selectedConversation === conversation.id ? 'bg-secondary' : ''
                              }`}
                              onClick={() => setSelectedConversation(conversation.id)}
                              data-testid={`conversation-${conversation.id}`}
                            >
                              <div className="relative">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={participant.avatar} alt={participant.displayName} />
                                  <AvatarFallback>
                                    {participant.displayName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {participant.isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium truncate" data-testid={`text-participant-name-${conversation.id}`}>
                                    {participant.displayName}
                                  </h3>
                                  <span className="text-xs text-muted-foreground" data-testid={`text-last-message-time-${conversation.id}`}>
                                    {conversation.lastMessage ? formatLastSeen(new Date(conversation.lastMessage.createdAt)) : ""}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground truncate" data-testid={`text-last-message-${conversation.id}`}>
                                    {conversation.lastMessage?.content || "No messages yet"}
                                  </p>
                                  {conversation.unreadCount > 0 && (
                                    <div className="w-2 h-2 bg-primary rounded-full ml-2" data-testid={`indicator-unread-${conversation.id}`}></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className={`lg:col-span-8 ${!selectedConversation ? 'hidden lg:block' : ''}`}>
              {selectedConversation ? (
                <Card className="h-full shadow-lg flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="lg:hidden"
                          onClick={() => setSelectedConversation(null)}
                          data-testid="button-back-to-conversations"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        {otherParticipant && (
                          <>
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.displayName} />
                                <AvatarFallback>
                                  {otherParticipant.displayName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {otherParticipant.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold" data-testid="text-chat-participant-name">
                                {otherParticipant.displayName}
                              </h3>
                              <p className="text-sm text-muted-foreground" data-testid="text-chat-participant-status">
                                {otherParticipant.isOnline ? "Online" : `Last seen ${formatLastSeen(otherParticipant.lastSeen)}`}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" data-testid="button-voice-call">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid="button-video-call">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid="button-chat-options">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                            <Skeleton className={`h-12 rounded-lg ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'}`} />
                          </div>
                        ))}
                      </div>
                    ) : displayMessages.length > 0 ? (
                      <div className="space-y-4">
                        {displayMessages.map((message) => {
                          const isCurrentUser = message.senderId === currentUser?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                              data-testid={`message-${message.id}`}
                            >
                              <div className={`flex items-end space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {!isCurrentUser && (
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={message.sender.avatar} alt={message.sender.displayName} />
                                    <AvatarFallback className="text-xs">
                                      {message.sender.displayName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div className={`rounded-lg px-4 py-2 ${
                                  isCurrentUser 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-secondary text-secondary-foreground'
                                }`}>
                                  <p className="text-sm" data-testid={`text-message-content-${message.id}`}>
                                    {message.content}
                                  </p>
                                  <p className={`text-xs mt-1 opacity-70 ${isCurrentUser ? 'text-right' : 'text-left'}`} data-testid={`text-message-time-${message.id}`}>
                                    {formatTime(new Date(message.createdAt))}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                          <p className="text-muted-foreground">Start a conversation!</p>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        data-testid="input-new-message"
                      />
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="gradient-primary text-primary-foreground"
                        data-testid="button-send-message"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              ) : (
                <Card className="h-full shadow-lg flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose from your existing conversations or start a new one</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
