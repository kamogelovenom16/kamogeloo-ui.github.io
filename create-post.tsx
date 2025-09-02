import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Video, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertPost } from "@shared/schema";

interface CreatePostProps {
  currentUser: any;
}

export function CreatePost({ currentUser }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertPost) => {
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setContent("");
      setImages([]);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPostMutation.mutate({
      authorId: currentUser.id,
      content: content.trim(),
      images: images.length > 0 ? images : undefined,
      type: "post",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload to a service like Cloudinary
      // For demo, we'll use placeholder URLs
      const newImages = Array.from(files).map((file, index) => 
        `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&t=${Date.now()}-${index}`
      );
      setImages(prev => [...prev, ...newImages]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={currentUser?.avatar} alt={currentUser?.displayName} />
          <AvatarFallback>
            {currentUser?.displayName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Input
              placeholder={`What's on your mind, ${currentUser?.displayName}?`}
              className="flex-1 bg-secondary border-border rounded-full cursor-pointer"
              readOnly
              data-testid="input-create-post-trigger"
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" data-testid="dialog-create-post">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.displayName} />
                  <AvatarFallback>
                    {currentUser?.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{currentUser?.displayName}</span>
              </div>
              
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-24 resize-none border-none focus:ring-0 text-lg"
                data-testid="textarea-post-content"
              />
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      data-testid="input-image-upload"
                    />
                    <Button type="button" variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                      <Image className="w-5 h-5 mr-2" />
                      Photo
                    </Button>
                  </label>
                  
                  <Button type="button" variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                  
                  <Button type="button" variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50">
                    <Smile className="w-5 h-5 mr-2" />
                    Feeling
                  </Button>
                </div>
                
                <Button
                  type="submit"
                  disabled={!content.trim() || createPostMutation.isPending}
                  className="gradient-primary text-primary-foreground hover-scale"
                  data-testid="button-submit-post"
                >
                  {createPostMutation.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
