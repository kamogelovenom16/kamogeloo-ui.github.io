import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

interface Reel {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  isSponsored: boolean;
  adNetwork?: string;
}

export function ReelsSection() {
  // Mock reels data with ad integration
  const reels: Reel[] = [
    {
      id: "1",
      title: "Urban Vibes 🌃",
      views: "1.2M views",
      thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=500",
      isSponsored: true,
      adNetwork: "Adsterra"
    },
    {
      id: "2", 
      title: "Adventure Time 🏔️",
      views: "856K views",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=500",
      isSponsored: true,
      adNetwork: "Adsterra"
    }
  ];

  // Initialize Adsterra ads (placeholder for real integration)
  useEffect(() => {
    // In a real implementation, you would load Adsterra script here
    if (typeof window !== 'undefined') {
      console.log('Initializing Adsterra ads for reels...');
      
      // Example Adsterra integration (commented out for demo)
      /*
      const script = document.createElement('script');
      script.src = 'https://pl14429469.profitablecpmrate.com/js/script.js';
      script.async = true;
      document.head.appendChild(script);
      */
    }
  }, []);

  const handleReelClick = (reel: Reel) => {
    console.log('Playing reel:', reel.title);
    if (reel.isSponsored) {
      console.log('Ad impression tracked for:', reel.adNetwork);
      // Track ad impression for Adsterra
    }
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Reels</CardTitle>
        <p className="text-sm text-muted-foreground">Discover trending content</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 aspect-[9/16] cursor-pointer hover-scale"
              onClick={() => handleReelClick(reel)}
              data-testid={`reel-${reel.id}`}
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold text-sm" data-testid={`text-title-${reel.id}`}>
                  {reel.title}
                </p>
                <p className="text-xs opacity-80" data-testid={`text-views-${reel.id}`}>
                  {reel.views}
                </p>
              </div>
              
              <div className="absolute top-4 right-4">
                <Play className="text-white text-2xl" />
              </div>
              
              {/* Adsterra Ad Badge */}
              {reel.isSponsored && (
                <div 
                  className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium"
                  data-testid={`badge-sponsored-${reel.id}`}
                >
                  Sponsored
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full gradient-primary text-primary-foreground hover-scale"
          data-testid="button-view-all-reels"
        >
          View All Reels
        </Button>
        
        {/* Adsterra Attribution */}
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by Adsterra
          </p>
        </div>
        
        {/* Adsterra Ad Slots (placeholder for real integration) */}
        <div className="mt-4 space-y-2">
          {/* Banner Ad Slot */}
          <div 
            className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            data-testid="adsterra-banner-slot"
          >
            <span className="text-xs text-muted-foreground">Adsterra Banner Ad</span>
          </div>
          
          {/* Native Ad Slot */}
          <div 
            className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            data-testid="adsterra-native-slot"
          >
            <span className="text-xs text-muted-foreground">Adsterra Native Ad</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
