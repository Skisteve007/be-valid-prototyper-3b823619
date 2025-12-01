import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Trash2, Image as ImageIcon, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  name: string;
  url: string;
  type: string;
}

export const MediaGallery = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const { data, error } = await supabase.storage.from("sponsor-logos").list("social-media");

    if (error) {
      console.error("Error loading files:", error);
      return;
    }

    const filesWithUrls = await Promise.all(
      data.map(async (file) => {
        const { data: urlData } = supabase.storage
          .from("sponsor-logos")
          .getPublicUrl(`social-media/${file.name}`);

        return {
          name: file.name,
          url: urlData.publicUrl,
          type: file.metadata?.mimetype || "unknown",
        };
      })
    );

    setFiles(filesWithUrls);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const { error } = await supabase.storage
      .from("sponsor-logos")
      .upload(`social-media/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      loadFiles();
    }

    setUploading(false);
  };

  const handleDelete = async (fileName: string) => {
    const { error } = await supabase.storage
      .from("sponsor-logos")
      .remove([`social-media/${fileName}`]);

    if (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      loadFiles();
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("video")) return <Video className="h-5 w-5" />;
    return <ImageIcon className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
        <CardDescription>Upload and manage social media assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload */}
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*,video/*"
            onChange={handleUpload}
            disabled={uploading}
            className="flex-1"
          />
          <Button disabled={uploading} size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </div>

        {/* File List */}
        <div className="space-y-2">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No files uploaded yet
            </p>
          ) : (
            files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(file.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
