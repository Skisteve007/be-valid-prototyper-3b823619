-- Create admin strategy checklist table
CREATE TABLE public.admin_strategy_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL,
  task_name TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT false,
  template_id_ref UUID REFERENCES public.marketing_templates(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_strategy_checklist ENABLE ROW LEVEL SECURITY;

-- Admins can manage strategy checklist
CREATE POLICY "Admins can manage strategy checklist"
ON public.admin_strategy_checklist
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create sales assets table
CREATE TABLE public.admin_sales_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_video_url TEXT,
  calendly_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_sales_assets ENABLE ROW LEVEL SECURITY;

-- Admins can manage sales assets
CREATE POLICY "Admins can manage sales assets"
ON public.admin_sales_assets
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_strategy_updated_at
BEFORE UPDATE ON public.admin_strategy_checklist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_assets_updated_at
BEFORE UPDATE ON public.admin_sales_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();