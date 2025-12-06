export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_sales_assets: {
        Row: {
          calendly_link: string | null
          created_at: string
          demo_video_url: string | null
          id: string
          updated_at: string
        }
        Insert: {
          calendly_link?: string | null
          created_at?: string
          demo_video_url?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          calendly_link?: string | null
          created_at?: string
          demo_video_url?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_strategy_checklist: {
        Row: {
          created_at: string
          day_number: number
          id: string
          status: boolean
          task_name: string
          template_id_ref: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_number: number
          id?: string
          status?: boolean
          task_name: string
          template_id_ref?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_number?: number
          id?: string
          status?: boolean
          task_name?: string
          template_id_ref?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_strategy_checklist_template_id_ref_fkey"
            columns: ["template_id_ref"]
            isOneToOne: false
            referencedRelation: "marketing_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          id_back_url: string | null
          id_front_url: string | null
          payout_method: string | null
          paypal_email: string | null
          pending_earnings: number | null
          phone_number: string | null
          referral_code: string
          status: string | null
          total_clicks: number | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          payout_method?: string | null
          paypal_email?: string | null
          pending_earnings?: number | null
          phone_number?: string | null
          referral_code: string
          status?: string | null
          total_clicks?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          payout_method?: string | null
          paypal_email?: string | null
          pending_earnings?: number | null
          phone_number?: string | null
          referral_code?: string
          status?: string | null
          total_clicks?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          bounce_count: number
          campaign_id: string | null
          click_count: number
          created_at: string
          delivered_count: number
          id: string
          last_sent_at: string | null
          open_count: number
          sent_count: number
          unsubscribe_count: number
          updated_at: string
        }
        Insert: {
          bounce_count?: number
          campaign_id?: string | null
          click_count?: number
          created_at?: string
          delivered_count?: number
          id?: string
          last_sent_at?: string | null
          open_count?: number
          sent_count?: number
          unsubscribe_count?: number
          updated_at?: string
        }
        Update: {
          bounce_count?: number
          campaign_id?: string | null
          click_count?: number
          created_at?: string
          delivered_count?: number
          id?: string
          last_sent_at?: string | null
          open_count?: number
          sent_count?: number
          unsubscribe_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: true
            referencedRelation: "marketing_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          discount_percent: number
          id: string
          is_active: boolean
          updated_at: string
          usage_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          updated_at?: string
          usage_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      email_campaign_log: {
        Row: {
          campaign_name: string
          email_address: string
          id: string
          sent_at: string
          template_id: string | null
          user_id: string
        }
        Insert: {
          campaign_name: string
          email_address: string
          id?: string
          sent_at?: string
          template_id?: string | null
          user_id: string
        }
        Update: {
          campaign_name?: string
          email_address?: string
          id?: string
          sent_at?: string
          template_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaign_log_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "marketing_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_tracking_events: {
        Row: {
          campaign_log_id: string | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_log_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_log_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_tracking_events_campaign_log_id_fkey"
            columns: ["campaign_log_id"]
            isOneToOne: false
            referencedRelation: "email_campaign_log"
            referencedColumns: ["id"]
          },
        ]
      }
      exception_queue: {
        Row: {
          created_at: string
          exception_reason: string
          exception_type: string
          id: string
          notes: string | null
          notified_at: string | null
          order_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exception_reason: string
          exception_type: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          order_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exception_reason?: string
          exception_type?: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          order_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exception_queue_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      incognito_transactions: {
        Row: {
          cleancheck_share: number
          created_at: string
          id: string
          payment_method_id: string | null
          payment_reference: string | null
          payment_status: string
          processed_at: string | null
          promoter_id: string | null
          promoter_share: number
          total_amount: number
          user_id: string
          venue_id: string | null
          venue_share: number
        }
        Insert: {
          cleancheck_share?: number
          created_at?: string
          id?: string
          payment_method_id?: string | null
          payment_reference?: string | null
          payment_status?: string
          processed_at?: string | null
          promoter_id?: string | null
          promoter_share?: number
          total_amount?: number
          user_id: string
          venue_id?: string | null
          venue_share?: number
        }
        Update: {
          cleancheck_share?: number
          created_at?: string
          id?: string
          payment_method_id?: string | null
          payment_reference?: string | null
          payment_status?: string
          processed_at?: string | null
          promoter_id?: string | null
          promoter_share?: number
          total_amount?: number
          user_id?: string
          venue_id?: string | null
          venue_share?: number
        }
        Relationships: [
          {
            foreignKeyName: "incognito_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "user_payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incognito_transactions_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incognito_transactions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_tags: {
        Row: {
          category: string
          created_at: string
          id: string
          label: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          label: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      lab_orders: {
        Row: {
          barcode_value: string
          created_at: string
          id: string
          lab_requisition_id: string | null
          order_status: Database["public"]["Enums"]["order_status"]
          result_status: Database["public"]["Enums"]["result_status"] | null
          test_type: Database["public"]["Enums"]["test_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          barcode_value: string
          created_at?: string
          id?: string
          lab_requisition_id?: string | null
          order_status?: Database["public"]["Enums"]["order_status"]
          result_status?: Database["public"]["Enums"]["result_status"] | null
          test_type?: Database["public"]["Enums"]["test_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          barcode_value?: string
          created_at?: string
          id?: string
          lab_requisition_id?: string | null
          order_status?: Database["public"]["Enums"]["order_status"]
          result_status?: Database["public"]["Enums"]["result_status"] | null
          test_type?: Database["public"]["Enums"]["test_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lab_partners: {
        Row: {
          active: boolean
          api_key: string
          contact_email: string | null
          created_at: string
          id: string
          last_used_at: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          api_key: string
          contact_email?: string | null
          created_at?: string
          id?: string
          last_used_at?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          api_key?: string
          contact_email?: string | null
          created_at?: string
          id?: string
          last_used_at?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_leads: {
        Row: {
          category: string
          company_name: string
          contact_email: string
          created_at: string
          id: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category?: string
          company_name: string
          contact_email: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          company_name?: string
          contact_email?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_templates: {
        Row: {
          body_content: string
          campaign_name: string
          created_at: string
          id: string
          subject_line: string
          target_segment: string
          updated_at: string
        }
        Insert: {
          body_content: string
          campaign_name: string
          created_at?: string
          id?: string
          subject_line: string
          target_segment: string
          updated_at?: string
        }
        Update: {
          body_content?: string
          campaign_name?: string
          created_at?: string
          id?: string
          subject_line?: string
          target_segment?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_videos: {
        Row: {
          created_at: string
          id: string
          internal_name: string
          is_active: boolean
          updated_at: string
          uploaded_video_url: string | null
          youtube_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          internal_name: string
          is_active?: boolean
          updated_at?: string
          uploaded_video_url?: string | null
          youtube_id: string
        }
        Update: {
          created_at?: string
          id?: string
          internal_name?: string
          is_active?: boolean
          updated_at?: string
          uploaded_video_url?: string | null
          youtube_id?: string
        }
        Relationships: []
      }
      member_references: {
        Row: {
          created_at: string
          id: string
          referee_user_id: string
          referrer_user_id: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          referee_user_id: string
          referrer_user_id: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          referee_user_id?: string
          referrer_user_id?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_references_referee_user_id_fkey"
            columns: ["referee_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "member_references_referrer_user_id_fkey"
            columns: ["referrer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      organizations: {
        Row: {
          compliance_interval_days: number | null
          contact_email: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          compliance_interval_days?: number | null
          contact_email?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          compliance_interval_days?: number | null
          contact_email?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_beta_surveys: {
        Row: {
          created_at: string
          deployment_barrier: string | null
          id: string
          missing_feature: string | null
          partner_id: string | null
          revenue_share_rating: string
          staff_efficiency: string
          zero_trust_liability: string
        }
        Insert: {
          created_at?: string
          deployment_barrier?: string | null
          id?: string
          missing_feature?: string | null
          partner_id?: string | null
          revenue_share_rating: string
          staff_efficiency: string
          zero_trust_liability: string
        }
        Update: {
          created_at?: string
          deployment_barrier?: string | null
          id?: string
          missing_feature?: string | null
          partner_id?: string | null
          revenue_share_rating?: string
          staff_efficiency?: string
          zero_trust_liability?: string
        }
        Relationships: []
      }
      partner_venues: {
        Row: {
          bank_endpoint: string | null
          category: Database["public"]["Enums"]["venue_category"]
          city: string
          country: string
          created_at: string
          custom_logo_url: string | null
          gm_email: string | null
          id: string
          industry_type: string | null
          paypal_email: string | null
          pending_earnings: number | null
          status: string
          total_earnings: number | null
          updated_at: string
          venue_name: string
        }
        Insert: {
          bank_endpoint?: string | null
          category: Database["public"]["Enums"]["venue_category"]
          city: string
          country?: string
          created_at?: string
          custom_logo_url?: string | null
          gm_email?: string | null
          id?: string
          industry_type?: string | null
          paypal_email?: string | null
          pending_earnings?: number | null
          status?: string
          total_earnings?: number | null
          updated_at?: string
          venue_name: string
        }
        Update: {
          bank_endpoint?: string | null
          category?: Database["public"]["Enums"]["venue_category"]
          city?: string
          country?: string
          created_at?: string
          custom_logo_url?: string | null
          gm_email?: string | null
          id?: string
          industry_type?: string | null
          paypal_email?: string | null
          pending_earnings?: number | null
          status?: string
          total_earnings?: number | null
          updated_at?: string
          venue_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birthday: string | null
          circumcised: boolean | null
          company_name: string | null
          covid_vaccinated: boolean | null
          created_at: string
          current_home_city: string | null
          disclaimer_accepted: boolean | null
          email: string | null
          email_shareable: boolean | null
          employer_id: string | null
          facebook_handle: string | null
          full_name: string | null
          gender_identity: string | null
          health_document_uploaded_at: string | null
          health_document_url: string | null
          id: string
          instagram_handle: string | null
          is_valid: boolean | null
          lab_certified: boolean | null
          lab_disclaimer_accepted: boolean | null
          lab_disclaimer_accepted_at: string | null
          lab_logo_url: string | null
          last_campaign_received: string | null
          last_marketing_email_sent_at: string | null
          member_id: string | null
          onlyfans_handle: string | null
          partner_preferences: Json | null
          payment_date: string | null
          payment_status: string | null
          phone: string | null
          profile_image_url: string | null
          qr_code_url: string | null
          references_locked: boolean | null
          referred_by_code: string | null
          relationship_status: string | null
          selected_interests: string[] | null
          sexual_orientation: string | null
          sexual_preferences: string | null
          sharing_interests_enabled: boolean | null
          sharing_orientation_enabled: boolean | null
          sharing_social_enabled: boolean | null
          sharing_vices_enabled: boolean | null
          signup_discount_code: string | null
          smoker: boolean | null
          status_color: string | null
          status_expiry: string | null
          std_acknowledgment: string | null
          std_acknowledgment_locked: boolean | null
          tiktok_handle: string | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          user_interests: Json | null
          user_references: string | null
          validity_expires_at: string | null
          vices: string[] | null
          where_from: string | null
        }
        Insert: {
          birthday?: string | null
          circumcised?: boolean | null
          company_name?: string | null
          covid_vaccinated?: boolean | null
          created_at?: string
          current_home_city?: string | null
          disclaimer_accepted?: boolean | null
          email?: string | null
          email_shareable?: boolean | null
          employer_id?: string | null
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          instagram_handle?: string | null
          is_valid?: boolean | null
          lab_certified?: boolean | null
          lab_disclaimer_accepted?: boolean | null
          lab_disclaimer_accepted_at?: string | null
          lab_logo_url?: string | null
          last_campaign_received?: string | null
          last_marketing_email_sent_at?: string | null
          member_id?: string | null
          onlyfans_handle?: string | null
          partner_preferences?: Json | null
          payment_date?: string | null
          payment_status?: string | null
          phone?: string | null
          profile_image_url?: string | null
          qr_code_url?: string | null
          references_locked?: boolean | null
          referred_by_code?: string | null
          relationship_status?: string | null
          selected_interests?: string[] | null
          sexual_orientation?: string | null
          sexual_preferences?: string | null
          sharing_interests_enabled?: boolean | null
          sharing_orientation_enabled?: boolean | null
          sharing_social_enabled?: boolean | null
          sharing_vices_enabled?: boolean | null
          signup_discount_code?: string | null
          smoker?: boolean | null
          status_color?: string | null
          status_expiry?: string | null
          std_acknowledgment?: string | null
          std_acknowledgment_locked?: boolean | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          user_interests?: Json | null
          user_references?: string | null
          validity_expires_at?: string | null
          vices?: string[] | null
          where_from?: string | null
        }
        Update: {
          birthday?: string | null
          circumcised?: boolean | null
          company_name?: string | null
          covid_vaccinated?: boolean | null
          created_at?: string
          current_home_city?: string | null
          disclaimer_accepted?: boolean | null
          email?: string | null
          email_shareable?: boolean | null
          employer_id?: string | null
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          instagram_handle?: string | null
          is_valid?: boolean | null
          lab_certified?: boolean | null
          lab_disclaimer_accepted?: boolean | null
          lab_disclaimer_accepted_at?: string | null
          lab_logo_url?: string | null
          last_campaign_received?: string | null
          last_marketing_email_sent_at?: string | null
          member_id?: string | null
          onlyfans_handle?: string | null
          partner_preferences?: Json | null
          payment_date?: string | null
          payment_status?: string | null
          phone?: string | null
          profile_image_url?: string | null
          qr_code_url?: string | null
          references_locked?: boolean | null
          referred_by_code?: string | null
          relationship_status?: string | null
          selected_interests?: string[] | null
          sexual_orientation?: string | null
          sexual_preferences?: string | null
          sharing_interests_enabled?: boolean | null
          sharing_orientation_enabled?: boolean | null
          sharing_social_enabled?: boolean | null
          sharing_vices_enabled?: boolean | null
          signup_discount_code?: string | null
          smoker?: boolean | null
          status_color?: string | null
          status_expiry?: string | null
          std_acknowledgment?: string | null
          std_acknowledgment_locked?: boolean | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          user_interests?: Json | null
          user_references?: string | null
          validity_expires_at?: string | null
          vices?: string[] | null
          where_from?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_payout_ledger: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          promoter_id: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          paid_at?: string | null
          promoter_id: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          promoter_id?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promoter_payout_ledger_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_payout_ledger_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "incognito_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_sessions: {
        Row: {
          commission_earned: number | null
          commission_rate: number | null
          commission_status: string | null
          created_at: string
          gross_revenue_tracked: number | null
          id: string
          promoter_id: string
          session_end: string | null
          session_start: string
          transaction_id: string | null
          updated_at: string
          user_id: string
          venue_id: string
        }
        Insert: {
          commission_earned?: number | null
          commission_rate?: number | null
          commission_status?: string | null
          created_at?: string
          gross_revenue_tracked?: number | null
          id?: string
          promoter_id: string
          session_end?: string | null
          session_start?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
          venue_id: string
        }
        Update: {
          commission_earned?: number | null
          commission_rate?: number | null
          commission_status?: string | null
          created_at?: string
          gross_revenue_tracked?: number | null
          id?: string
          promoter_id?: string
          session_end?: string | null
          session_start?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_sessions_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_sessions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "incognito_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_sessions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_access_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          profile_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          profile_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          profile_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_access_tokens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_code_views: {
        Row: {
          id: string
          profile_id: string
          viewed_at: string
          viewed_by_ip: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          viewed_at?: string
          viewed_by_ip?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          viewed_at?: string
          viewed_by_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_code_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number
          created_at: string | null
          id: string
          paid_at: string | null
          referred_user_id: string
          status: string
          transaction_amount: number
        }
        Insert: {
          affiliate_id: string
          commission_amount?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          referred_user_id: string
          status?: string
          transaction_amount?: number
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          referred_user_id?: string
          status?: string
          transaction_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      safety_certificates: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          profile_id: string
          test_type: Database["public"]["Enums"]["test_type"]
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          profile_id: string
          test_type: Database["public"]["Enums"]["test_type"]
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          profile_id?: string
          test_type?: Database["public"]["Enums"]["test_type"]
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_certificates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shadow_leads: {
        Row: {
          city: string
          created_at: string
          id: string
          inquiry_subject: string | null
          name: string
          phone: string
          role: string
          venue_name: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          inquiry_subject?: string | null
          name: string
          phone: string
          role: string
          venue_name: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          inquiry_subject?: string | null
          name?: string
          phone?: string
          role?: string
          venue_name?: string
        }
        Relationships: []
      }
      social_content_rotation: {
        Row: {
          asset_placeholder: string
          caption_template: string
          content_type: string
          created_at: string
          day_of_week: string
          hashtags: string
          id: string
          updated_at: string
        }
        Insert: {
          asset_placeholder: string
          caption_template: string
          content_type: string
          created_at?: string
          day_of_week: string
          hashtags: string
          id?: string
          updated_at?: string
        }
        Update: {
          asset_placeholder?: string
          caption_template?: string
          content_type?: string
          created_at?: string
          day_of_week?: string
          hashtags?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sponsor_analytics: {
        Row: {
          event_type: string
          id: string
          page_url: string | null
          sponsor_id: string
          user_ip: string | null
          viewed_at: string
        }
        Insert: {
          event_type: string
          id?: string
          page_url?: string | null
          sponsor_id: string
          user_ip?: string | null
          viewed_at?: string
        }
        Update: {
          event_type?: string
          id?: string
          page_url?: string | null
          sponsor_id?: string
          user_ip?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_analytics_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          display_order: number | null
          id: string
          logo_url: string | null
          name: string
          section: number | null
          tier: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          logo_url?: string | null
          name: string
          section?: number | null
          tier?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          section?: number | null
          tier?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      user_agreements: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          signed_at: string
          user_agent: string | null
          user_id: string
          waiver_version: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          signed_at?: string
          user_agent?: string | null
          user_id: string
          waiver_version?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          signed_at?: string
          user_agent?: string | null
          user_id?: string
          waiver_version?: string
        }
        Relationships: []
      }
      user_checkins: {
        Row: {
          checkin_date: string
          created_at: string
          id: string
          user_id: string
          venue_id: string
        }
        Insert: {
          checkin_date?: string
          created_at?: string
          id?: string
          user_id: string
          venue_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string
          id?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checkins_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_payment_methods: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          payment_identifier: string
          payment_type: string
          token_reference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_identifier: string
          payment_type: string
          token_reference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_identifier?: string
          payment_type?: string
          token_reference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venue_gross_revenue_log: {
        Row: {
          amount: number
          id: string
          pos_reference: string | null
          recorded_at: string
          revenue_type: string
          session_id: string
          venue_id: string
        }
        Insert: {
          amount: number
          id?: string
          pos_reference?: string | null
          recorded_at?: string
          revenue_type?: string
          session_id: string
          venue_id: string
        }
        Update: {
          amount?: number
          id?: string
          pos_reference?: string | null
          recorded_at?: string
          revenue_type?: string
          session_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_gross_revenue_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "promoter_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_gross_revenue_log_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_operators: {
        Row: {
          access_level: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          venue_id: string
        }
        Insert: {
          access_level?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          venue_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_operators_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_payout_ledger: {
        Row: {
          amount: number
          bank_endpoint: string | null
          created_at: string
          id: string
          paid_at: string | null
          payout_reference: string | null
          status: string
          transaction_id: string | null
          venue_id: string
        }
        Insert: {
          amount: number
          bank_endpoint?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          payout_reference?: string | null
          status?: string
          transaction_id?: string | null
          venue_id: string
        }
        Update: {
          amount?: number
          bank_endpoint?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          payout_reference?: string | null
          status?: string
          transaction_id?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_payout_ledger_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "incognito_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_payout_ledger_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_qr_scans: {
        Row: {
          id: string
          notes: string | null
          scan_result: string | null
          scanned_at: string
          scanned_by_operator_id: string | null
          scanned_member_id: string | null
          scanned_user_id: string | null
          venue_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          scan_result?: string | null
          scanned_at?: string
          scanned_by_operator_id?: string | null
          scanned_member_id?: string | null
          scanned_user_id?: string | null
          venue_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          scan_result?: string | null
          scanned_at?: string
          scanned_by_operator_id?: string | null
          scanned_member_id?: string | null
          scanned_user_id?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_qr_scans_scanned_user_id_fkey"
            columns: ["scanned_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "venue_qr_scans_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          lab_partner_id: string | null
          payload: Json
          related_order_id: string | null
          response_body: Json | null
          response_status: number
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          lab_partner_id?: string | null
          payload: Json
          related_order_id?: string | null
          response_body?: Json | null
          response_status: number
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          lab_partner_id?: string | null
          payload?: Json
          related_order_id?: string | null
          response_body?: Json | null
          response_status?: number
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_lab_partner_id_fkey"
            columns: ["lab_partner_id"]
            isOneToOne: false
            referencedRelation: "lab_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      workplace_roster: {
        Row: {
          created_at: string
          date_added: string
          id: string
          notes: string | null
          status: string | null
          updated_at: string
          user_id: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          date_added?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          venue_id: string
        }
        Update: {
          created_at?: string
          date_added?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workplace_roster_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_status_expiry: { Args: never; Returns: undefined }
      cleanup_expired_qr_tokens: { Args: never; Returns: undefined }
      generate_member_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_valid_qr_token: {
        Args: { _profile_id: string; _token: string }
        Returns: boolean
      }
      increment_affiliate_clicks: {
        Args: { _referral_code: string }
        Returns: undefined
      }
      increment_campaign_stat: {
        Args: { _campaign_id: string; _stat_type: string }
        Returns: undefined
      }
      increment_discount_usage: { Args: { _code: string }; Returns: undefined }
      is_venue_operator: {
        Args: { _user_id: string; _venue_id: string }
        Returns: boolean
      }
      restore_stevieg_profile: { Args: never; Returns: undefined }
      update_affiliate_pending_earnings: {
        Args: { _affiliate_id: string; _amount: number }
        Returns: undefined
      }
      update_venue_earnings: {
        Args: { _amount: number; _venue_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "guest"
        | "registered"
        | "paid"
        | "active_member"
        | "administrator"
      order_status:
        | "pending"
        | "sample_collected"
        | "result_received"
        | "result_received_locked"
        | "verified_active"
      result_status: "negative" | "positive" | "inconclusive"
      test_type: "STD_PANEL" | "TOX_10_PANEL"
      venue_category: "Nightlife" | "Gentlemen" | "Lifestyle" | "Resort" | "Spa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "guest",
        "registered",
        "paid",
        "active_member",
        "administrator",
      ],
      order_status: [
        "pending",
        "sample_collected",
        "result_received",
        "result_received_locked",
        "verified_active",
      ],
      result_status: ["negative", "positive", "inconclusive"],
      test_type: ["STD_PANEL", "TOX_10_PANEL"],
      venue_category: ["Nightlife", "Gentlemen", "Lifestyle", "Resort", "Spa"],
    },
  },
} as const
