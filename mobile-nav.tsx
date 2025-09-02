import { Link, useLocation } from "wouter";
import { Home, Search, Play, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export function MobileNav() {
  const [location] = useLocation();

  const { data: currentUser } = useQuery({
    queryKey: ["/api/users/me"],
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["/api/notifications", currentUser?.id, "unread-count"],
    enabled: !!currentUser?.id,
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border px-4 py-3 z-40">
      <div className="flex items-center justify-around">
        <Link href="/" data-testid="mobile-link-home">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center space-y-1 ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center space-y-1 text-muted-foreground"
          data-testid="mobile-button-search"
        >
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </Button>
        
        <Link href="/reels" data-testid="mobile-link-reels">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center space-y-1 ${location === "/reels" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Play className="h-6 w-6" />
            <span className="text-xs">Reels</span>
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center space-y-1 text-muted-foreground relative"
          data-testid="mobile-button-notifications"
        >
          <Bell className="h-6 w-6" />
          {unreadCount?.count > 0 && (
            <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount.count}
            </span>
          )}
          <span className="text-xs">Alerts</span>
        </Button>
        
        <Link href="/profile" data-testid="mobile-link-profile">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center space-y-1 ${location === "/profile" ? "text-primary" : "text-muted-foreground"}`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
