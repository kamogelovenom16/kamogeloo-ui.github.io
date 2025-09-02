import { useEffect, useState } from "react";
import { Play, Heart, MessageCircle, Share, Volume2, VolumeX } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Reel {
  id: string;
  title: string;
  description: string;
  views: string;
  likes: string;
  comments: string;
  thumbnail: string;
  video?: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  isSponsored: boolean;
  adNetwork?: string;
  duration: string;
}

export default function Reels() {
  const [currentReel, setCurrentReel] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Mock reels data with ad integration
  const reels: Reel[] = [
    {
      id: "1",
      title: "Urban Night Vibes",
      description: "Exploring the city after dark 🌃✨ #UrbanVibes #NightPhotography #CityLife",
      views: "1.2M",
      likes: "45.2K",
      comments: "2.1K",
      thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=700",
      creator: {
        id: "user-1",
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        username: "@alexchen"
      },
      isSponsored: true,
      adNetwork: "Adsterra",
      duration: "0:15"
    },
    {
      id: "2",
      title: "Mountain Adventure",
      description: "Nothing beats the view from the top 🏔️ #Adventure #Mountains #Nature #Hiking",
      views: "856K",
      likes: "32.1K",
      comments: "1.8K",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=700",
      creator: {
        id: "user-2",
        name: "Sarah Martinez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        username: "@sarahm"
      },
      isSponsored: true,
      adNetwork: "Adsterra",
      duration: "0:22"
    },
    {
      id: "3",
      title: "Tech Setup Tour",
      description: "My 2024 coding setup is finally complete! 💻⚡ #Tech #Setup #Developer #Workspace",
      views: "654K",
      likes: "28.7K",
      comments: "3.2K",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=700",
      creator: {
        id: "user-3",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        username: "@davidk"
      },
      isSponsored: false,
      duration: "0:18"
    },
    {
      id: "4",
      title: "Coffee Art Magic",
      description: "Creating latte art one cup at a time ☕🎨 #Coffee #LatteArt #Barista #CoffeeLovers",
      views: "432K",
      likes: "19.5K",
      comments: "892",
      thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=700",
      creator: {
        id: "user-4",
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        username: "@emmaw"
      },
      isSponsored: true,
      adNetwork: "Adsterra",
      duration: "0:12"
    },
  ];

  // Initialize Adsterra ads
  useEffect(() => {
    console.log('Initializing Adsterra ads for reels...');
    
    // Track page view for analytics
    const trackPageView = () => {
      console.log('Reels page view tracked');
      // In real implementation, track with Adsterra analytics
    };
    
    trackPageView();
    
    // Example Adsterra integration (commented for demo)
    /*
    const script = document.createElement('script');
    script.src = 'https://pl14429469.profitablecpmrate.com/js/script.js';
    script.async = true;
    script.onload = () => {
      console.log('Adsterra script loaded');
    };
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
    */
  }, []);

  const handleReelClick = (reel: Reel, index: number) => {
    setCurrentReel(index);
    setIsPlaying(true);
    
    if (reel.isSponsored) {
      console.log(`Ad impression tracked for ${reel.adNetwork}:`, reel.title);
      // Track ad impression for revenue
    }
  };

  const handleLike = (reelId: string) => {
    console.log('Liked reel:', reelId);
    // TODO: Implement like functionality
  };

  const handleComment = (reelId: string) => {
    console.log('Comment on reel:', reelId);
    // TODO: Open comment modal
  };

  const handleShare = (reelId: string) => {
    console.log('Share reel:', reelId);
    // TODO: Implement share functionality
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 min-h-screen pb-20 lg:pb-6">
        <div className="max-w-md mx-auto">
          {/* Main Reel Viewer */}
          <div className="relative h-[calc(100vh-10rem)] bg-black rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={reels[currentReel]?.thumbnail}
                alt={reels[currentReel]?.title}
                className="w-full h-full object-cover"
                data-testid={`img-reel-${reels[currentReel]?.id}`}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Play/Pause overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-black/50 text-white hover:bg-black/70 rounded-full p-6"
                    onClick={togglePlay}
                    data-testid="button-play-reel"
                  >
                    <Play className="w-12 h-12" />
                  </Button>
                </div>
              )}
              
              {/* Top controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-medium">Reels</span>
                  {reels[currentReel]?.isSponsored && (
                    <Badge variant="secondary" className="bg-yellow-400 text-black" data-testid="badge-sponsored">
                      Sponsored
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={toggleMute}
                    data-testid="button-toggle-mute"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              
              {/* Bottom content */}
              <div className="absolute bottom-4 left-4 right-16">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage src={reels[currentReel]?.creator.avatar} alt={reels[currentReel]?.creator.name} />
                    <AvatarFallback>
                      {reels[currentReel]?.creator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold text-sm" data-testid={`text-creator-name-${reels[currentReel]?.id}`}>
                      {reels[currentReel]?.creator.name}
                    </h3>
                    <p className="text-white/80 text-xs" data-testid={`text-creator-username-${reels[currentReel]?.id}`}>
                      {reels[currentReel]?.creator.username}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black">
                    Follow
                  </Button>
                </div>
                
                <h2 className="text-white font-semibold mb-1" data-testid={`text-reel-title-${reels[currentReel]?.id}`}>
                  {reels[currentReel]?.title}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed" data-testid={`text-reel-description-${reels[currentReel]?.id}`}>
                  {reels[currentReel]?.description}
                </p>
                
                <div className="flex items-center space-x-4 mt-2 text-white/80 text-xs">
                  <span data-testid={`text-reel-views-${reels[currentReel]?.id}`}>
                    {reels[currentReel]?.views} views
                  </span>
                  <span data-testid={`text-reel-duration-${reels[currentReel]?.id}`}>
                    {reels[currentReel]?.duration}
                  </span>
                </div>
              </div>
              
              {/* Side actions */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-3 flex flex-col items-center"
                  onClick={() => handleLike(reels[currentReel]?.id)}
                  data-testid={`button-like-reel-${reels[currentReel]?.id}`}
                >
                  <Heart className="w-6 h-6 mb-1" />
                  <span className="text-xs">{reels[currentReel]?.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-3 flex flex-col items-center"
                  onClick={() => handleComment(reels[currentReel]?.id)}
                  data-testid={`button-comment-reel-${reels[currentReel]?.id}`}
                >
                  <MessageCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">{reels[currentReel]?.comments}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-3 flex flex-col items-center"
                  onClick={() => handleShare(reels[currentReel]?.id)}
                  data-testid={`button-share-reel-${reels[currentReel]?.id}`}
                >
                  <Share className="w-6 h-6 mb-1" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
              {reels.map((_, index) => (
                <button
                  key={index}
                  className={`w-1 h-8 rounded-full transition-colors ${
                    index === currentReel ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentReel(index)}
                  data-testid={`button-reel-nav-${index}`}
                />
              ))}
            </div>
          </div>
          
          {/* Reel thumbnail list */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {reels.map((reel, index) => (
              <Card
                key={reel.id}
                className={`cursor-pointer hover-scale transition-all ${
                  index === currentReel ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleReelClick(reel, index)}
                data-testid={`card-reel-${reel.id}`}
              >
                <div className="relative">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-white text-sm font-medium truncate" data-testid={`text-thumbnail-title-${reel.id}`}>
                      {reel.title}
                    </h4>
                    <p className="text-white/80 text-xs" data-testid={`text-thumbnail-views-${reel.id}`}>
                      {reel.views} views
                    </p>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  {reel.isSponsored && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-yellow-400 text-black text-xs">
                        Ad
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          {/* Adsterra Ad Slots */}
          <div className="mt-6 space-y-4">
            {/* Native Ad Slot */}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600" data-testid="adsterra-native-ad">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground mb-2">Advertisement</div>
                <div className="h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">Adsterra Native Ad Slot</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">Powered by Adsterra</div>
              </CardContent>
            </Card>
            
            {/* Banner Ad Slot */}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600" data-testid="adsterra-banner-ad">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground mb-2">Advertisement</div>
                <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm">Adsterra Banner 320x50</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
