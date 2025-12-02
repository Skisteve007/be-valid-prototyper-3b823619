-- Create social content rotation table
CREATE TABLE public.social_content_rotation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT NOT NULL,
  content_type TEXT NOT NULL,
  caption_template TEXT NOT NULL,
  hashtags TEXT NOT NULL,
  asset_placeholder TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_content_rotation ENABLE ROW LEVEL SECURITY;

-- Admins can manage social content rotation
CREATE POLICY "Admins can manage social content rotation"
ON public.social_content_rotation
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_social_content_updated_at
BEFORE UPDATE ON public.social_content_rotation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 7-day rotation schedule
INSERT INTO public.social_content_rotation (day_of_week, content_type, caption_template, hashtags, asset_placeholder) VALUES
('Monday', 'Reel / TikTok', 'Confidence is walking in without saying a word. 🟢 The Green Pass is here. #CleanCheck #Nightlife #VIPAccess #DatingLife', '#exclusive #miaminightlife #verify #privatemember', 'Video: Distinguished Gentleman Flashing Phone'),
('Tuesday', 'Static Image / Carousel', 'Stop fumbling with screenshots. Get verified once. Access everywhere. Privacy first. Speed second. 🛡️', '#privacy #security #datingapps #lifestyle', 'Logo: Shield with Checkmark'),
('Wednesday', 'Reel (Text on Screen)', 'POV: You''re stuck at the door scrolling through your camera roll for a PDF from 3 months ago... 📉 Fix it. Link in bio.', '#datingproblems #nightout #checkin #modernlove', 'Background Video: Blurry Club Lights'),
('Thursday', 'Instagram Story (Poll)', 'Poll: How long does it take you to verify a date? [Option A: 3 Seconds] [Option B: 3 Days]', '#datingadvice #safetyfirst', 'Black Background / Green Text'),
('Friday', 'Reel / TikTok', 'Green light means GO. 🚦 Don''t get left outside this weekend. Get your pass before 5 PM.', '#fridayvibes #weekendplans #greenlight #accessgranted', 'Video: Phone Screen Turning Green'),
('Saturday', 'Static Image', 'Table ready. Status verified. 🥂', '#luxury #nightout #standards', 'Photo: Expensive Drink + Phone showing Green Pass'),
('Sunday', 'Story', 'Reset. Recharge. Re-verify. Get your kit ordered for next month.', '#wellness #health #reset', 'Text Only');