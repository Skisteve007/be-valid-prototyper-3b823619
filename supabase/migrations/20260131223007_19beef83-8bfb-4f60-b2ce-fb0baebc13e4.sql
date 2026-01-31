-- Add wearable integration detail fields to ghost_pass_event_intakes
ALTER TABLE public.ghost_pass_event_intakes
ADD COLUMN wearable_use_ghost_pass boolean DEFAULT false,
ADD COLUMN wearable_vendor_contact_name text,
ADD COLUMN wearable_vendor_contact_email text,
ADD COLUMN wearable_vendor_company text,
ADD COLUMN wearable_api_endpoint text,
ADD COLUMN wearable_api_notes text;