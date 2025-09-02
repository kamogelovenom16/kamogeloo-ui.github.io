import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, MessageCircle, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: currentUser } = useQuery({
    queryKey: ["/api/users/me"],
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["/api/notifications", currentUser?.id, "unread-count"],
    enabled: !!currentUser?.id,
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Search */}
        <div className="flex items-center space-x-4">
          {/* Custom SocialSphere Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home-logo">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <div className="w-6 h-6 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L22 8L14.64 12L22 16L13.09 15.74L12 22L10.91 15.74L2 16L9.36 12L2 8L10.91 8.26L12 2Z"/>
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SocialSphere
            </span>
          </Link>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search SocialSphere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 bg-secondary border-border rounded-full"
              data-testid="input-search"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link href="/" data-testid="link-home">
            <Button
              variant={location === "/" ? "default" : "ghost"}
              className={location === "/" ? "gradient-primary text-primary-foreground" : ""}
            >
              <i className="fas fa-home mr-2"></i>
              Home
            </Button>
          </Link>
          <Link href="/groups" data-testid="link-groups">
            <Button variant={location === "/groups" ? "default" : "ghost"}>
              <i className="fas fa-users mr-2"></i>
              Groups
            </Button>
          </Link>
          <Link href="/reels" data-testid="link-reels">
            <Button variant={location === "/reels" ? "default" : "ghost"}>
              <i className="fas fa-play-circle mr-2"></i>
              Reels
            </Button>
          </Link>
          <Button variant="ghost" className="relative" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
            {unreadCount?.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount.count}
              </span>
            )}
            <span className="ml-2">Notifications</span>
          </Button>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <Link href="/messages" data-testid="link-messages">
            <Button variant="ghost" size="sm" className="relative">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm" onClick={toggleTheme} data-testid="button-theme-toggle">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="sm" data-testid="button-settings">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Link href="/profile" data-testid="link-profile">
            <Avatar className="h-10 w-10 border-2 border-primary cursor-pointer hover-scale">
              <AvatarImage 
                src={currentUser?.avatar} 
                alt={currentUser?.displayName || "User"}
              />
              <AvatarFallback>
                {currentUser?.displayName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
}
