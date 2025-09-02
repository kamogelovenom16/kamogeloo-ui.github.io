import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { UserWithStats } from "@shared/schema";

interface FriendSuggestionsProps {
  currentUserId: string;
}

export function FriendSuggestions({ currentUserId }: FriendSuggestionsProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: suggestions = [] } = useQuery<UserWithStats[]>({
    queryKey: ["/api/users", currentUserId, "suggested-friends"],
  });

  const addFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      const response = await apiRequest("POST", "/api/friends/request", {
        userId: currentUserId,
        friendId
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "suggested-friends"] });
      toast({
        title: "Success",
        description: "Friend request sent!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send friend request.",
        variant: "destructive",
      });
    },
  });

  const handleAddFriend = (friendId: string) => {
    addFriendMutation.mutate(friendId);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>People You May Know</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center space-x-3" data-testid={`friend-suggestion-${user.id}`}>
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback>
                  {user.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate" data-testid={`text-name-${user.id}`}>
                  {user.displayName}
                </h4>
                <p className="text-xs text-muted-foreground truncate" data-testid={`text-mutual-${user.id}`}>
                  {user.friendsCount} mutual friends
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddFriend(user.id)}
                disabled={addFriendMutation.isPending}
                data-testid={`button-add-friend-${user.id}`}
              >
                {addFriendMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4 text-primary" data-testid="button-see-all-suggestions">
          See All Suggestions
        </Button>
      </CardContent>
    </Card>
  );
}
