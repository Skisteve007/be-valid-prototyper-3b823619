import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video, Plus, Trash2, Edit, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketingVideo {
  id: string;
  internal_name: string;
  youtube_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const VideoLibrary = () => {
  const [videos, setVideos] = useState<MarketingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVideo, setEditingVideo] = useState<MarketingVideo | null>(null);
  const [formData, setFormData] = useState({
    internal_name: "",
    youtube_id: "",
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("marketing_videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const { error } = await supabase
        .from("marketing_videos")
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video added to library",
      });
      setShowAddDialog(false);
      setFormData({ internal_name: "", youtube_id: "", is_active: true });
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingVideo) return;

    try {
      const { error } = await supabase
        .from("marketing_videos")
        .update(formData)
        .eq("id", editingVideo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video updated",
      });
      setEditingVideo(null);
      setFormData({ internal_name: "", youtube_id: "", is_active: true });
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error } = await supabase
        .from("marketing_videos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted",
      });
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setFormData({ internal_name: "", youtube_id: "", is_active: true });
    setShowAddDialog(true);
  };

  const openEditDialog = (video: MarketingVideo) => {
    setFormData({
      internal_name: video.internal_name,
      youtube_id: video.youtube_id,
      is_active: video.is_active,
    });
    setEditingVideo(video);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Video Library</CardTitle>
          <CardDescription>Loading videos...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Library
              </CardTitle>
              <CardDescription>Manage YouTube videos for email campaigns</CardDescription>
            </div>
            <Button onClick={openAddDialog} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No videos in library yet. Add your first video!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt={video.internal_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600/90 rounded-lg w-16 h-12 flex items-center justify-center">
                        <span className="text-white text-2xl">▶</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm truncate">{video.internal_name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">ID: {video.youtube_id}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtube_id}`, "_blank")}
                        className="flex-1 h-8"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Watch
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(video)}
                        className="h-8 px-2"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(video.id)}
                        className="h-8 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || !!editingVideo} onOpenChange={() => {
        setShowAddDialog(false);
        setEditingVideo(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
            <DialogDescription>
              Enter the video details below. You can find the YouTube ID in the video URL.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="internal_name">Video Name</Label>
              <Input
                id="internal_name"
                placeholder="e.g., Elegant Entry, Club Line Demo"
                value={formData.internal_name}
                onChange={(e) => setFormData({ ...formData, internal_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_id">YouTube Video ID</Label>
              <Input
                id="youtube_id"
                placeholder="e.g., dQw4w9WgXcQ (11 characters)"
                value={formData.youtube_id}
                onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                maxLength={11}
              />
              <p className="text-xs text-muted-foreground">
                Find this in the YouTube URL: youtube.com/watch?v=<span className="font-mono font-semibold">dQw4w9WgXcQ</span>
              </p>
            </div>

            {/* Preview */}
            {formData.youtube_id.length === 11 && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${formData.youtube_id}/hqdefault.jpg`}
                    alt="Preview"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingVideo(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingVideo ? handleEdit : handleAdd}
              disabled={!formData.internal_name || formData.youtube_id.length !== 11}
            >
              {editingVideo ? "Save Changes" : "Add Video"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
