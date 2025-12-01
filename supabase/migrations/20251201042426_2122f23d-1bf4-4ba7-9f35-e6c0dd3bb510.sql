-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'sample_collected', 'result_received');

-- Create enum for result status
CREATE TYPE public.result_status AS ENUM ('negative', 'positive', 'inconclusive');

-- Create lab_orders table
CREATE TABLE public.lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_status order_status NOT NULL DEFAULT 'pending',
  lab_requisition_id TEXT,
  barcode_value TEXT UNIQUE NOT NULL,
  result_status result_status,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own lab orders
CREATE POLICY "Users can view their own lab orders"
ON public.lab_orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own lab orders
CREATE POLICY "Users can create their own lab orders"
ON public.lab_orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view all lab orders
CREATE POLICY "Admins can view all lab orders"
ON public.lab_orders
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Admins can update all lab orders
CREATE POLICY "Admins can update all lab orders"
ON public.lab_orders
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_lab_orders_updated_at
BEFORE UPDATE ON public.lab_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_lab_orders_user_id ON public.lab_orders(user_id);
CREATE INDEX idx_lab_orders_barcode ON public.lab_orders(barcode_value);
CREATE INDEX idx_lab_orders_requisition ON public.lab_orders(lab_requisition_id);