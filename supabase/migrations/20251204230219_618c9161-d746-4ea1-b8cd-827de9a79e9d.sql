-- Enable REPLICA IDENTITY FULL for realtime updates on profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Enable REPLICA IDENTITY FULL for realtime updates on lab_orders table  
ALTER TABLE public.lab_orders REPLICA IDENTITY FULL;

-- Enable REPLICA IDENTITY FULL for realtime updates on venue_qr_scans table
ALTER TABLE public.venue_qr_scans REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication for real-time sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.venue_qr_scans;