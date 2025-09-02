import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, MapPin, Globe, Edit, UserPlus, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User, PostWithAuthor } from "@shared/schema";

export default function Profile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { data: userPosts = [], isLoading: postsLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/user", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: friends = [] } = useQuery<User[]>({
    queryKey: ["/api/friends", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await apiRequest("PUT", `/api/users/${currentUser?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const handleEditProfile = () => {
    if (currentUser) {
      setEditData({
        displayName: currentUser.displayName,
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        website: currentUser.website || "",
      });
      setIsEditOpen(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(editData);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <Navbar />
        <div className="pt-20 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Skeleton className="h-64 w-full rounded-xl mb-6" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">User not found</h2>
              <p className="text-muted-foreground">Please try logging in again.</p>
            </CardContent>
          </Card>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      <div className="pt-20 min-h-screen pb-20 lg:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <Card className="mb-6 shadow-lg overflow-hidden">
            <div className="relative">
              {/* Cover Photo */}
              <div className="h-48 md:h-64 bg-gradient-to-r from-primary to-accent relative">
                {currentUser.coverPhoto && (
                  <img
                    src={currentUser.coverPhoto}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4"
                  data-testid="button-edit-cover"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Edit Cover
                </Button>
              </div>
              
              {/* Profile Info */}
              <div className="relative px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                  {/* Profile Picture */}
                  <div className="relative -mt-16 mb-4 md:mb-0">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                      <AvatarFallback className="text-2xl">
                        {currentUser.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full"
                      data-testid="button-edit-avatar"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-display-name">
                      {currentUser.displayName}
                    </h1>
                    <p className="text-muted-foreground" data-testid="text-username">
                      @{currentUser.username}
                    </p>
                    {currentUser.bio && (
                      <p className="mt-2" data-testid="text-bio">
                        {currentUser.bio}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {currentUser.location && (
                        <div className="flex items-center" data-testid="text-location">
                          <MapPin className="w-4 h-4 mr-1" />
                          {currentUser.location}
                        </div>
                      )}
                      {currentUser.website && (
                        <div className="flex items-center" data-testid="text-website">
                          <Globe className="w-4 h-4 mr-1" />
                          <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {currentUser.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-4 text-sm">
                      <div data-testid="text-posts-count">
                        <span className="font-semibold">{userPosts.length}</span>
                        <span className="text-muted-foreground ml-1">Posts</span>
                      </div>
                      <div data-testid="text-friends-count">
                        <span className="font-semibold">{friends.length}</span>
                        <span className="text-muted-foreground ml-1">Friends</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleEditProfile} data-testid="button-edit-profile">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-edit-profile">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={editData.displayName}
                              onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                              data-testid="input-display-name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={editData.bio}
                              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                              placeholder="Tell us about yourself..."
                              data-testid="textarea-bio"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={editData.location}
                              onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Where are you located?"
                              data-testid="input-location"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={editData.website}
                              onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://your-website.com"
                              data-testid="input-website"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={updateProfileMutation.isPending} data-testid="button-save-profile">
                              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts" data-testid="tab-posts">Posts</TabsTrigger>
              <TabsTrigger value="friends" data-testid="tab-friends">Friends</TabsTrigger>
              <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="space-y-6">
              {postsLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="shadow-lg">
                      <CardContent className="p-4">
                        <Skeleton className="h-64 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUser.id}
                  />
                ))
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">Start sharing your thoughts with your first post!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="friends" className="space-y-6">
              {friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <Card key={friend.id} className="shadow-lg" data-testid={`friend-card-${friend.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={friend.avatar} alt={friend.displayName} />
                            <AvatarFallback>
                              {friend.displayName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate" data-testid={`text-friend-name-${friend.id}`}>
                              {friend.displayName}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              @{friend.username}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" data-testid={`button-message-friend-${friend.id}`}>
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">No friends yet</h3>
                    <p className="text-muted-foreground">Start connecting with people to build your network!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About {currentUser.displayName}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Bio</h4>
                      <p data-testid="text-about-bio">
                        {currentUser.bio || "No bio provided"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Location</h4>
                      <p data-testid="text-about-location">
                        {currentUser.location || "Location not specified"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Website</h4>
                      <p data-testid="text-about-website">
                        {currentUser.website ? (
                          <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {currentUser.website}
                          </a>
                        ) : (
                          "No website provided"
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Member Since</h4>
                      <p data-testid="text-about-joined">
                        {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
