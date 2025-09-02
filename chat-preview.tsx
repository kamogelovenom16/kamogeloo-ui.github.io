import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConversationWithParticipants } from "@shared/schema";

interface ChatPreviewProps {
  currentUserId: string;
}

export function ChatPreview({ currentUserId }: ChatPreviewProps) {
  const { data: conversations = [] } = useQuery<ConversationWithParticipants[]>({
    queryKey: ["/api/conversations", currentUserId],
  });

  // Mock conversations for demo
  const mockConversations: ConversationWithParticipants[] = [
    {
      id: "1",
      participantIds: [currentUserId, "user-2"],
      lastMessageId: "msg-1",
      updatedAt: new Date(),
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
        conversationId: "1",
        senderId: "user-2",
        content: "Hey! Did you check out that new framework...",
        type: "text",
        readBy: [],
        createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
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
    }
  ];

  const displayConversations = conversations.length > 0 ? conversations : mockConversations;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Messages</CardTitle>
        <Link href="/messages">
          <Button variant="ghost" size="sm" className="text-primary" data-testid="button-see-all-messages">
            See All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayConversations.slice(0, 3).map((conversation) => {
            const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
            if (!otherParticipant) return null;

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block"
                data-testid={`link-conversation-${conversation.id}`}
              >
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
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
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm" data-testid={`text-participant-${conversation.id}`}>
                      {otherParticipant.displayName}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate" data-testid={`text-preview-${conversation.id}`}>
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground" data-testid={`text-time-${conversation.id}`}>
                      {conversation.lastMessage ? formatTime(new Date(conversation.lastMessage.createdAt)) : ""}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-1" data-testid={`indicator-unread-${conversation.id}`}></div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
