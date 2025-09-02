import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Users, Lock, Globe } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Group, User } from "@shared/schema";

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { data: userGroups = [], isLoading: userGroupsLoading } = useQuery<Group[]>({
    queryKey: ["/api/users", currentUser?.id, "groups"],
    enabled: !!currentUser?.id,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: typeof newGroup) => {
      const response = await apiRequest("POST", "/api/groups", {
        ...groupData,
        ownerId: currentUser?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUser?.id, "groups"] });
      setNewGroup({ name: "", description: "", isPrivate: false });
      setIsCreateOpen(false);
      toast({
        title: "Success",
        description: "Group created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create group.",
        variant: "destructive",
      });
    },
  });

  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const response = await apiRequest("POST", `/api/groups/${groupId}/join`, {
        userId: currentUser?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUser?.id, "groups"] });
      toast({
        title: "Success",
        description: "Joined group successfully!",
      });
    },
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name.trim()) return;
    createGroupMutation.mutate(newGroup);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for groups:", searchQuery);
    // TODO: Implement group search
  };

  // Mock suggested groups for demo
  const suggestedGroups: Group[] = [
    {
      id: "suggested-1",
      name: "React Developers",
      description: "A community for React developers to share knowledge and collaborate",
      avatar: null,
      coverPhoto: null,
      ownerId: "user-1",
      membersCount: 15420,
      isPrivate: false,
      createdAt: new Date(),
    },
    {
      id: "suggested-2",
      name: "UI/UX Design Hub",
      description: "Share your designs, get feedback, and stay updated with design trends",
      avatar: null,
      coverPhoto: null,
      ownerId: "user-2",
      membersCount: 8934,
      isPrivate: false,
      createdAt: new Date(),
    },
    {
      id: "suggested-3",
      name: "Tech Entrepreneurs",
      description: "Network with fellow entrepreneurs and share startup experiences",
      avatar: null,
      coverPhoto: null,
      ownerId: "user-3",
      membersCount: 5673,
      isPrivate: false,
      createdAt: new Date(),
    },
  ];

  const filteredGroups = userGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      <div className="pt-20 min-h-screen pb-20 lg:pb-6">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Groups</h1>
              <p className="text-muted-foreground">Connect with communities that share your interests</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10"
                  data-testid="input-search-groups"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </form>
              
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-primary-foreground" data-testid="button-create-group">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-create-group">
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupName">Group Name</Label>
                      <Input
                        id="groupName"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter group name..."
                        data-testid="input-group-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groupDescription">Description</Label>
                      <Textarea
                        id="groupDescription"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What is this group about?"
                        data-testid="textarea-group-description"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="groupPrivate"
                        checked={newGroup.isPrivate}
                        onCheckedChange={(checked) => setNewGroup(prev => ({ ...prev, isPrivate: checked }))}
                        data-testid="switch-group-private"
                      />
                      <Label htmlFor="groupPrivate">Private Group</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createGroupMutation.isPending || !newGroup.name.trim()} data-testid="button-submit-group">
                        {createGroupMutation.isPending ? "Creating..." : "Create Group"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="your-groups" className="space-y-6">
            <TabsList>
              <TabsTrigger value="your-groups" data-testid="tab-your-groups">Your Groups</TabsTrigger>
              <TabsTrigger value="discover" data-testid="tab-discover">Discover</TabsTrigger>
            </TabsList>
            
            <TabsContent value="your-groups" className="space-y-6">
              {userGroupsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="shadow-lg">
                      <Skeleton className="h-32 w-full rounded-t-lg" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <Card key={group.id} className="shadow-lg hover-scale cursor-pointer" data-testid={`group-card-${group.id}`}>
                      <div className="relative">
                        <div className="h-32 bg-gradient-to-r from-primary to-accent rounded-t-lg"></div>
                        <div className="absolute top-4 right-4">
                          <Badge variant={group.isPrivate ? "destructive" : "secondary"}>
                            {group.isPrivate ? (
                              <>
                                <Lock className="w-3 h-3 mr-1" />
                                Private
                              </>
                            ) : (
                              <>
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2" data-testid={`text-group-name-${group.id}`}>
                          {group.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-group-description-${group.id}`}>
                          {group.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground" data-testid={`text-group-members-${group.id}`}>
                            <Users className="w-4 h-4 mr-1" />
                            {group.membersCount.toLocaleString()} members
                          </div>
                          <Button variant="outline" size="sm" data-testid={`button-view-group-${group.id}`}>
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "No groups found matching your search." : "Join or create your first group to get started!"}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-group">
                        Create Your First Group
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="discover" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Suggested Groups</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedGroups.map((group) => (
                      <Card key={group.id} className="shadow-lg hover-scale" data-testid={`suggested-group-${group.id}`}>
                        <div className="relative">
                          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary">
                              <Globe className="w-3 h-3 mr-1" />
                              Public
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2" data-testid={`text-suggested-name-${group.id}`}>
                            {group.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-suggested-description-${group.id}`}>
                            {group.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-muted-foreground" data-testid={`text-suggested-members-${group.id}`}>
                              <Users className="w-4 h-4 mr-1" />
                              {group.membersCount.toLocaleString()} members
                            </div>
                            <Button
                              size="sm"
                              onClick={() => joinGroupMutation.mutate(group.id)}
                              disabled={joinGroupMutation.isPending}
                              data-testid={`button-join-group-${group.id}`}
                            >
                              {joinGroupMutation.isPending ? "Joining..." : "Join"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Technology", icon: "fa-laptop-code", count: 142 },
                      { name: "Design", icon: "fa-palette", count: 89 },
                      { name: "Business", icon: "fa-briefcase", count: 76 },
                      { name: "Gaming", icon: "fa-gamepad", count: 58 },
                      { name: "Photography", icon: "fa-camera", count: 45 },
                      { name: "Travel", icon: "fa-plane", count: 38 },
                      { name: "Fitness", icon: "fa-dumbbell", count: 32 },
                      { name: "Music", icon: "fa-music", count: 29 },
                    ].map((category) => (
                      <Card key={category.name} className="shadow-lg hover-scale cursor-pointer" data-testid={`category-${category.name.toLowerCase()}`}>
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-2">
                            <i className={`fas ${category.icon} text-white`}></i>
                          </div>
                          <h3 className="font-medium text-sm" data-testid={`text-category-name-${category.name.toLowerCase()}`}>
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground" data-testid={`text-category-count-${category.name.toLowerCase()}`}>
                            {category.count} groups
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
