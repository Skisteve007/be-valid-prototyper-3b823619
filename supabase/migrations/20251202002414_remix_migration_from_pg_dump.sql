CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'guest',
    'registered',
    'paid',
    'active_member',
    'administrator'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'sample_collected',
    'result_received'
);


--
-- Name: result_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.result_status AS ENUM (
    'negative',
    'positive',
    'inconclusive'
);


--
-- Name: test_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.test_type AS ENUM (
    'STD_PANEL',
    'TOX_10_PANEL'
);


--
-- Name: cleanup_expired_qr_tokens(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_qr_tokens() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  DELETE FROM qr_access_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$;


--
-- Name: generate_member_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_member_id() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character member ID (e.g., CC-12345678)
    new_id := 'CC-' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
    
    -- Check if this ID already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE member_id = new_id) INTO id_exists;
    
    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_id;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, member_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', generate_member_id());
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'guest');
  
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


--
-- Name: has_valid_qr_token(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_valid_qr_token(_profile_id uuid, _token text) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.qr_access_tokens
    WHERE profile_id = _profile_id
      AND token = _token
      AND expires_at > now()
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: admin_sales_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_sales_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    demo_video_url text,
    calendly_link text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_strategy_checklist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_strategy_checklist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    day_number integer NOT NULL,
    task_name text NOT NULL,
    status boolean DEFAULT false NOT NULL,
    template_id_ref uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    issuer text,
    issue_date date,
    expiry_date date,
    document_url text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_campaign_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_campaign_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    campaign_name text NOT NULL,
    template_id uuid,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    email_address text NOT NULL
);


--
-- Name: exception_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exception_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    exception_type text NOT NULL,
    exception_reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    notified_at timestamp with time zone,
    resolved_at timestamp with time zone,
    resolved_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: interest_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interest_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    label text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lab_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    order_status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    lab_requisition_id text,
    barcode_value text NOT NULL,
    result_status public.result_status,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    test_type public.test_type DEFAULT 'STD_PANEL'::public.test_type NOT NULL
);


--
-- Name: lab_partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_partners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    contact_email text,
    api_key text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


--
-- Name: marketing_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_name text NOT NULL,
    subject_line text NOT NULL,
    body_content text NOT NULL,
    target_segment text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: marketing_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    internal_name text NOT NULL,
    youtube_id text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: member_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_references (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referrer_user_id uuid NOT NULL,
    referee_user_id uuid NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    verified_at timestamp with time zone
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text,
    phone text,
    company_name text,
    profile_image_url text,
    qr_code_url text,
    payment_status text DEFAULT 'unpaid'::text,
    payment_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    member_id text,
    status_color text DEFAULT 'green'::text,
    where_from text,
    current_home_city text,
    birthday date,
    gender_identity text,
    sexual_orientation text,
    relationship_status text,
    partner_preferences jsonb DEFAULT '[]'::jsonb,
    covid_vaccinated boolean DEFAULT false,
    circumcised boolean,
    smoker boolean DEFAULT false,
    instagram_handle text,
    tiktok_handle text,
    facebook_handle text,
    onlyfans_handle text,
    twitter_handle text,
    std_acknowledgment text,
    user_references text,
    sexual_preferences text,
    health_document_url text,
    health_document_uploaded_at timestamp with time zone,
    disclaimer_accepted boolean DEFAULT false,
    user_interests jsonb DEFAULT '{}'::jsonb,
    selected_interests uuid[] DEFAULT '{}'::uuid[],
    email_shareable boolean DEFAULT false,
    references_locked boolean DEFAULT true,
    std_acknowledgment_locked boolean DEFAULT true,
    lab_disclaimer_accepted boolean DEFAULT false,
    lab_disclaimer_accepted_at timestamp with time zone,
    last_marketing_email_sent_at timestamp with time zone,
    last_campaign_received text,
    vices text[] DEFAULT '{}'::text[],
    lab_certified boolean DEFAULT false,
    lab_logo_url text,
    CONSTRAINT profiles_status_color_check CHECK ((status_color = ANY (ARRAY['green'::text, 'yellow'::text, 'red'::text, 'gray'::text])))
);


--
-- Name: qr_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qr_access_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    used_at timestamp with time zone
);


--
-- Name: qr_code_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qr_code_views (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid NOT NULL,
    viewed_by_ip text,
    viewed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: safety_certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safety_certificates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid NOT NULL,
    token text NOT NULL,
    test_type public.test_type NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    used_at timestamp with time zone
);


--
-- Name: social_content_rotation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social_content_rotation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    day_of_week text NOT NULL,
    content_type text NOT NULL,
    caption_template text NOT NULL,
    hashtags text NOT NULL,
    asset_placeholder text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sponsor_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sponsor_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sponsor_id uuid NOT NULL,
    event_type text NOT NULL,
    viewed_at timestamp with time zone DEFAULT now() NOT NULL,
    user_ip text,
    page_url text,
    CONSTRAINT sponsor_analytics_event_type_check CHECK ((event_type = ANY (ARRAY['view'::text, 'click'::text])))
);


--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sponsors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo_url text,
    website_url text,
    display_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tier text DEFAULT 'silver'::text,
    section integer DEFAULT 1,
    category text DEFAULT 'general'::text,
    CONSTRAINT sponsors_category_check CHECK ((category = ANY (ARRAY['general'::text, 'lab_certified'::text, 'toxicology'::text]))),
    CONSTRAINT sponsors_section_check CHECK (((section >= 1) AND (section <= 3))),
    CONSTRAINT sponsors_tier_check CHECK ((tier = ANY (ARRAY['platinum'::text, 'gold'::text, 'silver'::text])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'guest'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: webhook_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhook_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    response_status integer NOT NULL,
    response_body jsonb,
    error_message text,
    lab_partner_id uuid,
    related_order_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_sales_assets admin_sales_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_sales_assets
    ADD CONSTRAINT admin_sales_assets_pkey PRIMARY KEY (id);


--
-- Name: admin_strategy_checklist admin_strategy_checklist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_strategy_checklist
    ADD CONSTRAINT admin_strategy_checklist_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: email_campaign_log email_campaign_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_log
    ADD CONSTRAINT email_campaign_log_pkey PRIMARY KEY (id);


--
-- Name: exception_queue exception_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exception_queue
    ADD CONSTRAINT exception_queue_pkey PRIMARY KEY (id);


--
-- Name: interest_tags interest_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interest_tags
    ADD CONSTRAINT interest_tags_pkey PRIMARY KEY (id);


--
-- Name: lab_orders lab_orders_barcode_value_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_barcode_value_key UNIQUE (barcode_value);


--
-- Name: lab_orders lab_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_pkey PRIMARY KEY (id);


--
-- Name: lab_partners lab_partners_api_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_partners
    ADD CONSTRAINT lab_partners_api_key_key UNIQUE (api_key);


--
-- Name: lab_partners lab_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_partners
    ADD CONSTRAINT lab_partners_pkey PRIMARY KEY (id);


--
-- Name: marketing_templates marketing_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_templates
    ADD CONSTRAINT marketing_templates_pkey PRIMARY KEY (id);


--
-- Name: marketing_videos marketing_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_videos
    ADD CONSTRAINT marketing_videos_pkey PRIMARY KEY (id);


--
-- Name: member_references member_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_references
    ADD CONSTRAINT member_references_pkey PRIMARY KEY (id);


--
-- Name: member_references member_references_referrer_user_id_referee_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_references
    ADD CONSTRAINT member_references_referrer_user_id_referee_user_id_key UNIQUE (referrer_user_id, referee_user_id);


--
-- Name: profiles profiles_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_member_id_key UNIQUE (member_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: qr_access_tokens qr_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qr_access_tokens
    ADD CONSTRAINT qr_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: qr_access_tokens qr_access_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qr_access_tokens
    ADD CONSTRAINT qr_access_tokens_token_key UNIQUE (token);


--
-- Name: qr_code_views qr_code_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qr_code_views
    ADD CONSTRAINT qr_code_views_pkey PRIMARY KEY (id);


--
-- Name: safety_certificates safety_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safety_certificates
    ADD CONSTRAINT safety_certificates_pkey PRIMARY KEY (id);


--
-- Name: safety_certificates safety_certificates_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safety_certificates
    ADD CONSTRAINT safety_certificates_token_key UNIQUE (token);


--
-- Name: social_content_rotation social_content_rotation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_content_rotation
    ADD CONSTRAINT social_content_rotation_pkey PRIMARY KEY (id);


--
-- Name: sponsor_analytics sponsor_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sponsor_analytics
    ADD CONSTRAINT sponsor_analytics_pkey PRIMARY KEY (id);


--
-- Name: sponsors sponsors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sponsors
    ADD CONSTRAINT sponsors_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: webhook_events webhook_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_events
    ADD CONSTRAINT webhook_events_pkey PRIMARY KEY (id);


--
-- Name: idx_exception_queue_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exception_queue_created_at ON public.exception_queue USING btree (created_at DESC);


--
-- Name: idx_exception_queue_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exception_queue_status ON public.exception_queue USING btree (status);


--
-- Name: idx_exception_queue_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exception_queue_user_id ON public.exception_queue USING btree (user_id);


--
-- Name: idx_lab_orders_barcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_orders_barcode ON public.lab_orders USING btree (barcode_value);


--
-- Name: idx_lab_orders_requisition; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_orders_requisition ON public.lab_orders USING btree (lab_requisition_id);


--
-- Name: idx_lab_orders_test_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_orders_test_type ON public.lab_orders USING btree (test_type);


--
-- Name: idx_lab_orders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_orders_user_id ON public.lab_orders USING btree (user_id);


--
-- Name: idx_lab_partners_api_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_partners_api_key ON public.lab_partners USING btree (api_key);


--
-- Name: idx_member_references_referee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_member_references_referee ON public.member_references USING btree (referee_user_id);


--
-- Name: idx_member_references_referrer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_member_references_referrer ON public.member_references USING btree (referrer_user_id);


--
-- Name: idx_profiles_member_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_member_id ON public.profiles USING btree (member_id);


--
-- Name: idx_profiles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_user_id ON public.profiles USING btree (user_id);


--
-- Name: idx_qr_tokens_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qr_tokens_expires ON public.qr_access_tokens USING btree (expires_at);


--
-- Name: idx_qr_tokens_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qr_tokens_expires_at ON public.qr_access_tokens USING btree (expires_at);


--
-- Name: idx_qr_tokens_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qr_tokens_token ON public.qr_access_tokens USING btree (token);


--
-- Name: idx_safety_certificates_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safety_certificates_expires ON public.safety_certificates USING btree (expires_at);


--
-- Name: idx_safety_certificates_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safety_certificates_token ON public.safety_certificates USING btree (token);


--
-- Name: idx_sponsor_analytics_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sponsor_analytics_event_type ON public.sponsor_analytics USING btree (event_type);


--
-- Name: idx_sponsor_analytics_sponsor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sponsor_analytics_sponsor_id ON public.sponsor_analytics USING btree (sponsor_id);


--
-- Name: idx_sponsor_analytics_viewed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sponsor_analytics_viewed_at ON public.sponsor_analytics USING btree (viewed_at DESC);


--
-- Name: idx_sponsors_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sponsors_category ON public.sponsors USING btree (category);


--
-- Name: idx_user_roles_user_id_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id_role ON public.user_roles USING btree (user_id, role);


--
-- Name: idx_webhook_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_webhook_events_created_at ON public.webhook_events USING btree (created_at DESC);


--
-- Name: idx_webhook_events_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_webhook_events_event_type ON public.webhook_events USING btree (event_type);


--
-- Name: idx_webhook_events_lab_partner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_webhook_events_lab_partner ON public.webhook_events USING btree (lab_partner_id);


--
-- Name: certifications update_certifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: exception_queue update_exception_queue_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_exception_queue_updated_at BEFORE UPDATE ON public.exception_queue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lab_orders update_lab_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lab_orders_updated_at BEFORE UPDATE ON public.lab_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lab_partners update_lab_partners_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lab_partners_updated_at BEFORE UPDATE ON public.lab_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: marketing_templates update_marketing_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_marketing_templates_updated_at BEFORE UPDATE ON public.marketing_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: marketing_videos update_marketing_videos_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_marketing_videos_updated_at BEFORE UPDATE ON public.marketing_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_sales_assets update_sales_assets_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_sales_assets_updated_at BEFORE UPDATE ON public.admin_sales_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: social_content_rotation update_social_content_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_social_content_updated_at BEFORE UPDATE ON public.social_content_rotation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sponsors update_sponsors_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON public.sponsors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_strategy_checklist update_strategy_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_strategy_updated_at BEFORE UPDATE ON public.admin_strategy_checklist FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_strategy_checklist admin_strategy_checklist_template_id_ref_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_strategy_checklist
    ADD CONSTRAINT admin_strategy_checklist_template_id_ref_fkey FOREIGN KEY (template_id_ref) REFERENCES public.marketing_templates(id);


--
-- Name: certifications certifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: email_campaign_log email_campaign_log_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_log
    ADD CONSTRAINT email_campaign_log_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.marketing_templates(id);


--
-- Name: exception_queue exception_queue_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exception_queue
    ADD CONSTRAINT exception_queue_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.lab_orders(id) ON DELETE CASCADE;


--
-- Name: lab_orders lab_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: member_references member_references_referee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_references
    ADD CONSTRAINT member_references_referee_user_id_fkey FOREIGN KEY (referee_user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;


--
-- Name: member_references member_references_referrer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_references
    ADD CONSTRAINT member_references_referrer_user_id_fkey FOREIGN KEY (referrer_user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: qr_access_tokens qr_access_tokens_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qr_access_tokens
    ADD CONSTRAINT qr_access_tokens_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: qr_code_views qr_code_views_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qr_code_views
    ADD CONSTRAINT qr_code_views_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: safety_certificates safety_certificates_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safety_certificates
    ADD CONSTRAINT safety_certificates_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: sponsor_analytics sponsor_analytics_sponsor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sponsor_analytics
    ADD CONSTRAINT sponsor_analytics_sponsor_id_fkey FOREIGN KEY (sponsor_id) REFERENCES public.sponsors(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webhook_events webhook_events_lab_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_events
    ADD CONSTRAINT webhook_events_lab_partner_id_fkey FOREIGN KEY (lab_partner_id) REFERENCES public.lab_partners(id) ON DELETE SET NULL;


--
-- Name: webhook_events webhook_events_related_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_events
    ADD CONSTRAINT webhook_events_related_order_id_fkey FOREIGN KEY (related_order_id) REFERENCES public.lab_orders(id) ON DELETE SET NULL;


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: interest_tags Admins can manage interest tags; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage interest tags" ON public.interest_tags USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: lab_partners Admins can manage lab partners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage lab partners" ON public.lab_partners TO authenticated USING (public.has_role(auth.uid(), 'administrator'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: marketing_templates Admins can manage marketing templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage marketing templates" ON public.marketing_templates USING (public.has_role(auth.uid(), 'administrator'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: marketing_videos Admins can manage marketing videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage marketing videos" ON public.marketing_videos USING (public.has_role(auth.uid(), 'administrator'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: admin_sales_assets Admins can manage sales assets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage sales assets" ON public.admin_sales_assets USING (public.has_role(auth.uid(), 'administrator'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: social_content_rotation Admins can manage social content rotation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage social content rotation" ON public.social_content_rotation USING (public.has_role(auth.uid(), 'administrator'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: sponsors Admins can manage sponsors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage sponsors" ON public.sponsors USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: admin_strategy_checklist Admins can manage strategy checklist; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage strategy checklist" ON public.admin_strategy_checklist USING (public.has_role(auth.uid(), 'administrator'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: certifications Admins can update all certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all certifications" ON public.certifications FOR UPDATE USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: lab_orders Admins can update all lab orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all lab orders" ON public.lab_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: profiles Admins can update all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'administrator'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: exception_queue Admins can update exceptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update exceptions" ON public.exception_queue FOR UPDATE USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: sponsor_analytics Admins can view all analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all analytics" ON public.sponsor_analytics FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'administrator'::public.app_role)))));


--
-- Name: certifications Admins can view all certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all certifications" ON public.certifications FOR SELECT USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: exception_queue Admins can view all exceptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all exceptions" ON public.exception_queue FOR SELECT USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: lab_orders Admins can view all lab orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all lab orders" ON public.lab_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: member_references Admins can view all references; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all references" ON public.member_references FOR SELECT USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: email_campaign_log Admins can view campaign logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view campaign logs" ON public.email_campaign_log FOR SELECT USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: webhook_events Admins can view webhook events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view webhook events" ON public.webhook_events FOR SELECT USING (public.has_role(auth.uid(), 'administrator'::public.app_role));


--
-- Name: qr_code_views Anyone can insert QR views; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert QR views" ON public.qr_code_views FOR INSERT WITH CHECK (true);


--
-- Name: sponsor_analytics Anyone can insert analytics events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert analytics events" ON public.sponsor_analytics FOR INSERT WITH CHECK (true);


--
-- Name: qr_access_tokens Anyone can mark token as used; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can mark token as used" ON public.qr_access_tokens FOR UPDATE TO authenticated, anon USING ((expires_at > now())) WITH CHECK ((expires_at > now()));


--
-- Name: sponsors Everyone can view active sponsors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view active sponsors" ON public.sponsors FOR SELECT USING ((active = true));


--
-- Name: interest_tags Everyone can view interest tags; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view interest tags" ON public.interest_tags FOR SELECT USING (true);


--
-- Name: certifications Only owners and admins can view certifications (restrictive); Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only owners and admins can view certifications (restrictive)" ON public.certifications AS RESTRICTIVE FOR SELECT TO authenticated USING (((auth.uid() = user_id) OR public.has_role(auth.uid(), 'administrator'::public.app_role)));


--
-- Name: member_references Referees can verify references; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Referees can verify references" ON public.member_references FOR UPDATE USING ((auth.uid() = referee_user_id)) WITH CHECK ((auth.uid() = referee_user_id));


--
-- Name: email_campaign_log System can insert campaign logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert campaign logs" ON public.email_campaign_log FOR INSERT WITH CHECK (true);


--
-- Name: exception_queue System can insert exceptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert exceptions" ON public.exception_queue FOR INSERT WITH CHECK (true);


--
-- Name: webhook_events System can insert webhook events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert webhook events" ON public.webhook_events FOR INSERT WITH CHECK (true);


--
-- Name: safety_certificates Users can create certificates for own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create certificates for own profile" ON public.safety_certificates FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = safety_certificates.profile_id) AND (profiles.user_id = auth.uid())))));


--
-- Name: member_references Users can create references; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create references" ON public.member_references FOR INSERT WITH CHECK ((auth.uid() = referrer_user_id));


--
-- Name: certifications Users can create their own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own certifications" ON public.certifications FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: lab_orders Users can create their own lab orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own lab orders" ON public.lab_orders FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: qr_access_tokens Users can create tokens for own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create tokens for own profile" ON public.qr_access_tokens FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = qr_access_tokens.profile_id) AND (profiles.user_id = auth.uid())))));


--
-- Name: certifications Users can delete their own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own certifications" ON public.certifications FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: member_references Users can delete their own references; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own references" ON public.member_references FOR DELETE USING ((auth.uid() = referrer_user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: certifications Users can update their own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own certifications" ON public.certifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: member_references Users can view references to them; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view references to them" ON public.member_references FOR SELECT USING ((auth.uid() = referee_user_id));


--
-- Name: qr_code_views Users can view their own QR views; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own QR views" ON public.qr_code_views FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = qr_code_views.profile_id) AND (profiles.user_id = auth.uid())))));


--
-- Name: safety_certificates Users can view their own certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own certificates" ON public.safety_certificates FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = safety_certificates.profile_id) AND (profiles.user_id = auth.uid())))));


--
-- Name: certifications Users can view their own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own certifications" ON public.certifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: exception_queue Users can view their own exceptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own exceptions" ON public.exception_queue FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: lab_orders Users can view their own lab orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own lab orders" ON public.lab_orders FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: qr_access_tokens Users can view their own profile tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile tokens" ON public.qr_access_tokens FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = qr_access_tokens.profile_id) AND (profiles.user_id = auth.uid())))));


--
-- Name: member_references Users can view their own references; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own references" ON public.member_references FOR SELECT USING ((auth.uid() = referrer_user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: admin_sales_assets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_sales_assets ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_strategy_checklist; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_strategy_checklist ENABLE ROW LEVEL SECURITY;

--
-- Name: certifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: email_campaign_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_campaign_log ENABLE ROW LEVEL SECURITY;

--
-- Name: exception_queue; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.exception_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: interest_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.interest_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: lab_orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: lab_partners; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lab_partners ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_videos ENABLE ROW LEVEL SECURITY;

--
-- Name: member_references; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.member_references ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: qr_access_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.qr_access_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: qr_code_views; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.qr_code_views ENABLE ROW LEVEL SECURITY;

--
-- Name: safety_certificates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safety_certificates ENABLE ROW LEVEL SECURITY;

--
-- Name: social_content_rotation; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.social_content_rotation ENABLE ROW LEVEL SECURITY;

--
-- Name: sponsor_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sponsor_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: sponsors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: webhook_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


