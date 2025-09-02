import { Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Story {
  id: string;
  user: {
    id: string;
    displayName: string;
    avatar: string;
  };
}

interface StoryCarouselProps {
  stories?: Story[];
}

export function StoryCarousel({ stories = [] }: StoryCarouselProps) {
  // Mock stories for demo
  const mockStories: Story[] = [
    {
      id: "1",
      user: {
        id: "1",
        displayName: "Sarah",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
      }
    },
    {
      id: "2", 
      user: {
        id: "2",
        displayName: "Mike",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
      }
    },
    {
      id: "3",
      user: {
        id: "3", 
        displayName: "Emma",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
      }
    }
  ];

  const displayStories = stories.length > 0 ? stories : mockStories;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-lg">
      <div className="flex space-x-4 overflow-x-auto custom-scrollbar pb-2">
        {/* Add Story */}
        <div className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer" data-testid="button-add-story">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Plus className="text-white text-xl" />
          </div>
          <span className="text-xs text-center">Add Story</span>
        </div>
        
        {/* User Stories */}
        {displayStories.map((story) => (
          <div 
            key={story.id}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer hover-scale"
            data-testid={`story-${story.id}`}
          >
            <div className="w-16 h-16 p-1 story-ring rounded-full">
              <Avatar className="w-full h-full">
                <AvatarImage src={story.user.avatar} alt={`${story.user.displayName}'s story`} />
                <AvatarFallback>
                  {story.user.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-center">{story.user.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
