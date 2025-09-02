import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { StoryCarousel } from "@/components/story-carousel";
import { CreatePost } from "@/components/create-post";
import { PostCard } from "@/components/post-card";
import { FriendSuggestions } from "@/components/friend-suggestions";
import { ChatPreview } from "@/components/chat-preview";
import { ReelsSection } from "@/components/reels-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostWithAuthor, User, Group } from "@shared/schema";

export default function Home() {
  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { data: feedPosts = [], isLoading: postsLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/feed", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: userGroups = [] } = useQuery<Group[]>({
    queryKey: ["/api/users", currentUser?.id, "groups"],
    enabled: !!currentUser?.id,
  });

  // Mock groups for demo
  const mockGroups: Group[] = [
    {
      id: "group-1",
      name: "Web Developers Hub",
      description: "A community for web developers",
      avatar: null,
      coverPhoto: null,
      ownerId: currentUser?.id || "",
      membersCount: 12489,
      isPrivate: false,
      createdAt: new Date(),
    },
    {
      id: "group-2",
      name: "Design Inspiration",
      description: "Creative design community",
      avatar: null,
      coverPhoto: null,
      ownerId: currentUser?.id || "",
      membersCount: 8924,
      isPrivate: false,
      createdAt: new Date(),
    },
    {
      id: "group-3",
      name: "Startup Network",
      description: "Connect with entrepreneurs",
      avatar: null,
      coverPhoto: null,
      ownerId: currentUser?.id || "",
      membersCount: 5672,
      isPrivate: false,
      createdAt: new Date(),
    },
  ];

  const displayGroups = userGroups.length > 0 ? userGroups : mockGroups;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <Navbar />
        <div className="pt-20 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <aside className="lg:col-span-3">
                <Skeleton className="h-64 w-full rounded-xl" />
              </aside>
              <main className="lg:col-span-6">
                <Skeleton className="h-32 w-full rounded-xl mb-6" />
                <Skeleton className="h-96 w-full rounded-xl" />
              </main>
              <aside className="lg:col-span-3">
                <Skeleton className="h-64 w-full rounded-xl" />
              </aside>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      <div className="pt-20 min-h-screen pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Sidebar */}
            <aside className="lg:col-span-3 space-y-6">
              {/* User Profile Card */}
              {currentUser && (
                <Card className="shadow-lg">
                  <CardContent className="p-6 text-center">
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                      alt="User profile"
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-3 border-primary"
                      data-testid="img-user-avatar"
                    />
                    <h3 className="font-semibold text-lg" data-testid="text-user-name">
                      {currentUser.displayName}
                    </h3>
                    <p className="text-muted-foreground text-sm" data-testid="text-user-bio">
                      {currentUser.bio || "Web Developer & Designer"}
                    </p>
                    <div className="flex justify-center space-x-4 mt-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-primary" data-testid="text-friends-count">
                          1,234
                        </div>
                        <div className="text-muted-foreground">Friends</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-accent" data-testid="text-posts-count">
                          {feedPosts.length}
                        </div>
                        <div className="text-muted-foreground">Posts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary transition-colors" data-testid="link-saved-posts">
                      <i className="fas fa-bookmark text-primary"></i>
                      <span>Saved Posts</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary transition-colors" data-testid="link-manage-groups">
                      <i className="fas fa-users-cog text-accent"></i>
                      <span>Manage Groups</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary transition-colors" data-testid="link-events">
                      <i className="fas fa-calendar text-purple-500"></i>
                      <span>Events</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary transition-colors" data-testid="link-marketplace">
                      <i className="fas fa-store text-green-500"></i>
                      <span>Marketplace</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Trending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2" data-testid="trend-webdevelopment">
                      <span className="text-primary font-semibold">#WebDevelopment</span>
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">12.5k posts</span>
                    </div>
                    <div className="flex items-center space-x-2" data-testid="trend-technews">
                      <span className="text-accent font-semibold">#TechNews</span>
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">8.2k posts</span>
                    </div>
                    <div className="flex items-center space-x-2" data-testid="trend-designtrends">
                      <span className="text-purple-500 font-semibold">#DesignTrends</span>
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">5.1k posts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content Feed */}
            <main className="lg:col-span-6">
              {/* Stories Section */}
              <StoryCarousel />

              {/* Create Post */}
              {currentUser && <CreatePost currentUser={currentUser} />}

              {/* News Feed Posts */}
              {postsLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-20 w-full mb-4" />
                        <Skeleton className="h-64 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : feedPosts.length > 0 ? (
                feedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUser?.id || ""}
                  />
                ))
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">Start by creating your first post or connecting with friends!</p>
                  </CardContent>
                </Card>
              )}

              {/* Reels Section */}
              <ReelsSection />
            </main>

            {/* Right Sidebar */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Friend Suggestions */}
              {currentUser && <FriendSuggestions currentUserId={currentUser.id} />}

              {/* Active Groups */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Your Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayGroups.slice(0, 3).map((group, index) => (
                      <div 
                        key={group.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                        data-testid={`group-${group.id}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                          index === 0 ? "gradient-primary" : 
                          index === 1 ? "bg-gradient-to-br from-pink-500 to-purple-500" :
                          "bg-gradient-to-br from-green-500 to-blue-500"
                        }`}>
                          <i className={`fas ${
                            index === 0 ? "fa-code" :
                            index === 1 ? "fa-palette" :
                            "fa-rocket"
                          }`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate" data-testid={`text-group-name-${group.id}`}>
                            {group.name}
                          </h4>
                          <p className="text-xs text-muted-foreground" data-testid={`text-group-members-${group.id}`}>
                            {group.membersCount.toLocaleString()} members
                          </p>
                        </div>
                        {index < 2 && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat/Messages Preview */}
              {currentUser && <ChatPreview currentUserId={currentUser.id} />}
            </aside>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
