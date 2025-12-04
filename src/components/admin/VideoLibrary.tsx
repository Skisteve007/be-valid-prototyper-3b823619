import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video, Plus, Trash2, Edit, ExternalLink, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketingVideo {
  id: string;
  internal_name: string;
  youtube_id: string;
  uploaded_video_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const VideoLibrary = () => {
  const [videos, setVideos] = useState<MarketingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVideo, setEditingVideo] = useState<MarketingVideo | null>(null);
  const [uploadMode, setUploadMode] = useState<"youtube" | "upload">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video must be under 100MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadVideo = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("marketing-videos")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("marketing-videos")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    try {
      let uploadedUrl: string | null = null;

      if (uploadMode === "upload" && selectedFile) {
        uploadedUrl = await uploadVideo();
        if (!uploadedUrl) return;
      }

      const insertData: any = {
        internal_name: formData.internal_name,
        youtube_id: uploadMode === "youtube" ? formData.youtube_id : "uploaded",
        is_active: formData.is_active,
      };

      if (uploadedUrl) {
        insertData.uploaded_video_url = uploadedUrl;
      }

      const { error } = await supabase
        .from("marketing_videos")
        .insert([insertData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video added to library",
      });
      setShowAddDialog(false);
      resetForm();
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
      let uploadedUrl: string | null = null;

      if (uploadMode === "upload" && selectedFile) {
        uploadedUrl = await uploadVideo();
        if (!uploadedUrl) return;
      }

      const updateData: any = {
        internal_name: formData.internal_name,
        is_active: formData.is_active,
      };

      if (uploadMode === "youtube") {
        updateData.youtube_id = formData.youtube_id;
        updateData.uploaded_video_url = null;
      } else if (uploadedUrl) {
        updateData.uploaded_video_url = uploadedUrl;
        updateData.youtube_id = "uploaded";
      }

      const { error } = await supabase
        .from("marketing_videos")
        .update(updateData)
        .eq("id", editingVideo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video updated",
      });
      setEditingVideo(null);
      resetForm();
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

  const resetForm = () => {
    setFormData({ internal_name: "", youtube_id: "", is_active: true });
    setSelectedFile(null);
    setUploadMode("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const openEditDialog = (video: MarketingVideo) => {
    setFormData({
      internal_name: video.internal_name,
      youtube_id: video.youtube_id,
      is_active: video.is_active,
    });
    setUploadMode(video.uploaded_video_url ? "upload" : "youtube");
    setEditingVideo(video);
  };

  const isFormValid = () => {
    if (!formData.internal_name) return false;
    if (uploadMode === "youtube" && formData.youtube_id.length !== 11) return false;
    if (uploadMode === "upload" && !selectedFile && !editingVideo?.uploaded_video_url) return false;
    return true;
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
              <CardDescription>Upload videos or add YouTube links for campaigns</CardDescription>
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
                    {video.uploaded_video_url ? (
                      <video
                        src={video.uploaded_video_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                        alt={video.internal_name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`${video.uploaded_video_url ? 'bg-primary/90' : 'bg-red-600/90'} rounded-lg w-16 h-12 flex items-center justify-center`}>
                        <span className="text-white text-2xl">▶</span>
                      </div>
                    </div>
                    {video.uploaded_video_url && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Uploaded
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm truncate">{video.internal_name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {video.uploaded_video_url ? "Local Upload" : `YT: ${video.youtube_id}`}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (video.uploaded_video_url) {
                            window.open(video.uploaded_video_url, "_blank");
                          } else {
                            window.open(`https://www.youtube.com/watch?v=${video.youtube_id}`, "_blank");
                          }
                        }}
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
        resetForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
            <DialogDescription>
              Upload a video from your device or add a YouTube link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Video Name */}
            <div className="space-y-2">
              <Label htmlFor="internal_name">Video Name</Label>
              <Input
                id="internal_name"
                placeholder="e.g., Elegant Entry, Club Line Demo"
                value={formData.internal_name}
                onChange={(e) => setFormData({ ...formData, internal_name: e.target.value })}
              />
            </div>

            {/* Upload Mode Toggle */}
            <div className="space-y-2">
              <Label>Video Source</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={uploadMode === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadMode("upload")}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
                <Button
                  type="button"
                  variant={uploadMode === "youtube" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadMode("youtube")}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" />
                  YouTube Link
                </Button>
              </div>
            </div>

            {/* Upload Mode */}
            {uploadMode === "upload" && (
              <div className="space-y-2">
                <Label htmlFor="video_file">Select Video File</Label>
                <Input
                  ref={fileInputRef}
                  id="video_file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {editingVideo?.uploaded_video_url && !selectedFile && (
                  <p className="text-xs text-green-600">
                    Current video will be kept unless you select a new one
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Max file size: 100MB. Supported formats: MP4, MOV, WebM
                </p>
              </div>
            )}

            {/* YouTube Mode */}
            {uploadMode === "youtube" && (
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
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingVideo(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingVideo ? handleEdit : handleAdd}
              disabled={!isFormValid() || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                editingVideo ? "Save Changes" : "Add Video"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
