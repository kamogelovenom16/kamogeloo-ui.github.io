import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PostWithAuthor } from "@shared/schema";

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/likes", {
        userId: currentUserId,
        targetId: post.id,
        targetType: "post"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/comments", {
        postId: post.id,
        authorId: currentUserId,
        content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment.trim());
  };

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
    <Card className="mb-6 shadow-lg hover-scale" data-testid={`post-${post.id}`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
              <AvatarFallback>
                {post.author.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold" data-testid={`text-author-${post.id}`}>
                {post.author.displayName}
              </h4>
              <p className="text-sm text-muted-foreground" data-testid={`text-time-${post.id}`}>
                {formatTime(new Date(post.createdAt))}
              </p>
            </div>
            <Button variant="ghost" size="sm" data-testid={`button-menu-${post.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="mb-4" data-testid={`text-content-${post.id}`}>
            {post.content}
          </p>
          
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 gap-2 mb-4">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-80 object-cover rounded-lg"
                  data-testid={`img-post-${post.id}-${index}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span data-testid={`text-likes-${post.id}`}>
              ❤️ {post.likesCount} likes
            </span>
            <span data-testid={`text-stats-${post.id}`}>
              {post.commentsCount} comments • {post.sharesCount} shares
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              className={`flex-1 flex items-center justify-center space-x-2 py-2 ${
                post.isLiked ? "text-red-500" : ""
              }`}
              onClick={handleLike}
              disabled={likeMutation.isPending}
              data-testid={`button-like-${post.id}`}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
              <span>Like</span>
            </Button>
            
            <Button
              variant="ghost"
              className="flex-1 flex items-center justify-center space-x-2 py-2"
              onClick={() => setShowComments(!showComments)}
              data-testid={`button-comment-${post.id}`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Button>
            
            <Button
              variant="ghost"
              className="flex-1 flex items-center justify-center space-x-2 py-2"
              data-testid={`button-share-${post.id}`}
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
          
          {showComments && (
            <div className="mt-4 pt-4 border-t border-border">
              <form onSubmit={handleComment} className="flex space-x-2 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt="You" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-8 resize-none"
                    data-testid={`textarea-comment-${post.id}`}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || commentMutation.isPending}
                    className="mt-2"
                    data-testid={`button-submit-comment-${post.id}`}
                  >
                    {commentMutation.isPending ? "Posting..." : "Comment"}
                  </Button>
                </div>
              </form>
              
              {/* Comments would be loaded here */}
              <div className="space-y-3" data-testid={`comments-${post.id}`}>
                {/* TODO: Load and display comments */}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
