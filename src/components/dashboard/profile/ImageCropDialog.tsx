import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Move, Loader2 } from "lucide-react";

interface ImageCropDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (blob: Blob) => void;
}

export const ImageCropDialog = ({ open, onClose, imageUrl, onSave }: ImageCropDialogProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPosition({ x: 0, y: 0 });
      setScale(1);
      setImageLoaded(false);
    }
  }, [open, imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!imageRef.current || !imageLoaded) return;
    
    setSaving(true);
    
    try {
      const canvas = document.createElement('canvas');
      const outputSize = 256;
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const img = imageRef.current;
      const containerSize = 200;
      
      // Calculate dimensions
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawWidth = containerSize * scale;
      let drawHeight = drawWidth / imgAspect;
      
      if (drawHeight < containerSize * scale) {
        drawHeight = containerSize * scale;
        drawWidth = drawHeight * imgAspect;
      }

      // Scale factor from container to output
      const outputScale = outputSize / containerSize;
      
      // Draw circular clip
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Fill background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, outputSize, outputSize);

      // Draw the image at the correct position and scale
      const drawX = position.x * outputScale;
      const drawY = position.y * outputScale;
      const scaledWidth = drawWidth * outputScale;
      const scaledHeight = drawHeight * outputScale;

      ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
          onClose();
        } else {
          throw new Error('Failed to create image blob');
        }
        setSaving(false);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error saving cropped image:', error);
      setSaving(false);
    }
  };

  const handleClose = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
    setImageLoaded(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Adjust Your Photo
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Drag to reposition • Use slider to zoom
          </p>
          
          {/* Crop container */}
          <div 
            ref={containerRef}
            className="relative w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-primary/50 cursor-move bg-muted"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              crossOrigin="anonymous"
              className="absolute select-none pointer-events-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'top left',
                width: '200px',
                height: 'auto',
                minHeight: '200px',
                objectFit: 'cover'
              }}
              draggable={false}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Zoom control */}
          <div className="flex items-center gap-3 w-full max-w-[250px]">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              min={0.5}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700"
            disabled={saving || !imageLoaded}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Photo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
