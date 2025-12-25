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
      audit_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          failed: number | null
          id: string
          passed: number | null
          status: string
          timestamp: string | null
          trigger_type: string | null
          warned: number | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          failed?: number | null
          id?: string
          passed?: number | null
          status: string
          timestamp?: string | null
          trigger_type?: string | null
          warned?: number | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          failed?: number | null
          id?: string
          passed?: number | null
          status?: string
          timestamp?: string | null
          trigger_type?: string | null
          warned?: number | null
        }
        Relationships: []
      }
      bar_tab_charges: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          pos_reference: string | null
          transaction_id: string
          venue_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          pos_reference?: string | null
          transaction_id: string
          venue_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          pos_reference?: string | null
          transaction_id?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bar_tab_charges_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "incognito_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bar_tab_charges_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      billable_scan_events: {
        Row: {
          created_at: string
          event_type: string
          fee_amount: number
          id: string
          idempotency_key: string
          pos_transaction_id: string | null
          scan_log_id: string | null
          settled_at: string | null
          settlement_ledger_id: string | null
          user_id: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          fee_amount?: number
          id?: string
          idempotency_key: string
          pos_transaction_id?: string | null
          scan_log_id?: string | null
          settled_at?: string | null
          settlement_ledger_id?: string | null
          user_id?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          fee_amount?: number
          id?: string
          idempotency_key?: string
          pos_transaction_id?: string | null
          scan_log_id?: string | null
          settled_at?: string | null
          settlement_ledger_id?: string | null
          user_id?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billable_scan_events_pos_transaction_id_fkey"
            columns: ["pos_transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billable_scan_events_scan_log_id_fkey"
            columns: ["scan_log_id"]
            isOneToOne: false
            referencedRelation: "door_scan_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billable_scan_events_settlement_ledger_id_fkey"
            columns: ["settlement_ledger_id"]
            isOneToOne: false
            referencedRelation: "venue_ledger_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billable_scan_events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
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
      compliance_certifications: {
        Row: {
          auditor_name: string | null
          certificate_url: string | null
          certification_status: string | null
          certification_type: string
          created_at: string | null
          expiry_date: string | null
          id: string
          issued_date: string | null
          updated_at: string | null
        }
        Insert: {
          auditor_name?: string | null
          certificate_url?: string | null
          certification_status?: string | null
          certification_type: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          updated_at?: string | null
        }
        Update: {
          auditor_name?: string | null
          certificate_url?: string | null
          certification_status?: string | null
          certification_type?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          contract_terms: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          package_id: string | null
          template_content: string | null
          template_name: string
          updated_at: string | null
        }
        Insert: {
          contract_terms?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
          template_content?: string | null
          template_name: string
          updated_at?: string | null
        }
        Update: {
          contract_terms?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
          template_content?: string | null
          template_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_templates_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "industry_packages"
            referencedColumns: ["id"]
          },
        ]
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
      door_scan_log: {
        Row: {
          created_at: string | null
          deny_reason: string | null
          device_id: string | null
          id: string
          operator_label: string | null
          scan_result: string
          scanned_user_id: string | null
          staff_user_id: string | null
          station_label: string | null
          synced_at: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          deny_reason?: string | null
          device_id?: string | null
          id?: string
          operator_label?: string | null
          scan_result: string
          scanned_user_id?: string | null
          staff_user_id?: string | null
          station_label?: string | null
          synced_at?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          deny_reason?: string | null
          device_id?: string | null
          id?: string
          operator_label?: string | null
          scan_result?: string
          scanned_user_id?: string | null
          staff_user_id?: string | null
          station_label?: string | null
          synced_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "door_scan_log_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "venue_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "door_scan_log_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_profiles: {
        Row: {
          created_at: string
          footprint_session_id: string | null
          footprint_user_id: string | null
          full_name: string | null
          id: string
          license_number: string | null
          phone_number: string
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          footprint_session_id?: string | null
          footprint_user_id?: string | null
          full_name?: string | null
          id?: string
          license_number?: string | null
          phone_number: string
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          footprint_session_id?: string | null
          footprint_user_id?: string | null
          full_name?: string | null
          id?: string
          license_number?: string | null
          phone_number?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
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
      email_verification_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          ip_address: string | null
          token: string
          user_agent: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          token: string
          user_agent?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          token?: string
          user_agent?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
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
      global_stats: {
        Row: {
          id: string
          last_updated: string | null
          stat_key: string
          stat_value: number | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          stat_key: string
          stat_value?: number | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          stat_key?: string
          stat_value?: number | null
        }
        Relationships: []
      }
      idv_verifications: {
        Row: {
          created_at: string
          document_type: string | null
          expires_at: string | null
          id: string
          payment_status: string | null
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          tier: string
          updated_at: string
          user_id: string
          verification_provider: string | null
          verification_reference: string | null
          verified_at: string | null
          verified_hash: string | null
        }
        Insert: {
          created_at?: string
          document_type?: string | null
          expires_at?: string | null
          id?: string
          payment_status?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          tier: string
          updated_at?: string
          user_id: string
          verification_provider?: string | null
          verification_reference?: string | null
          verified_at?: string | null
          verified_hash?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string | null
          expires_at?: string | null
          id?: string
          payment_status?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
          verification_provider?: string | null
          verification_reference?: string | null
          verified_at?: string | null
          verified_hash?: string | null
        }
        Relationships: []
      }
      incognito_transactions: {
        Row: {
          cleancheck_share: number
          created_at: string
          current_spend: number | null
          id: string
          payment_method_id: string | null
          payment_reference: string | null
          payment_status: string
          processed_at: string | null
          promoter_id: string | null
          promoter_share: number
          spending_limit: number | null
          total_amount: number
          transaction_type: string | null
          user_id: string
          venue_id: string | null
          venue_share: number
        }
        Insert: {
          cleancheck_share?: number
          created_at?: string
          current_spend?: number | null
          id?: string
          payment_method_id?: string | null
          payment_reference?: string | null
          payment_status?: string
          processed_at?: string | null
          promoter_id?: string | null
          promoter_share?: number
          spending_limit?: number | null
          total_amount?: number
          transaction_type?: string | null
          user_id: string
          venue_id?: string | null
          venue_share?: number
        }
        Update: {
          cleancheck_share?: number
          created_at?: string
          current_spend?: number | null
          id?: string
          payment_method_id?: string | null
          payment_reference?: string | null
          payment_status?: string
          processed_at?: string | null
          promoter_id?: string | null
          promoter_share?: number
          spending_limit?: number | null
          total_amount?: number
          transaction_type?: string | null
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
      industry_packages: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          included_events: string[] | null
          is_active: boolean | null
          package_key: string
          payout_cadence_default: string | null
          payout_cadence_options: string[] | null
          saas_annual_fee: number | null
          saas_monthly_fee: number | null
          sort_order: number | null
          target_audience: string | null
          updated_at: string | null
          volume_tiers: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          included_events?: string[] | null
          is_active?: boolean | null
          package_key: string
          payout_cadence_default?: string | null
          payout_cadence_options?: string[] | null
          saas_annual_fee?: number | null
          saas_monthly_fee?: number | null
          sort_order?: number | null
          target_audience?: string | null
          updated_at?: string | null
          volume_tiers?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          included_events?: string[] | null
          is_active?: boolean | null
          package_key?: string
          payout_cadence_default?: string | null
          payout_cadence_options?: string[] | null
          saas_annual_fee?: number | null
          saas_monthly_fee?: number | null
          sort_order?: number | null
          target_audience?: string | null
          updated_at?: string | null
          volume_tiers?: Json | null
        }
        Relationships: []
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
      investor_leads: {
        Row: {
          accredited_confirmed: boolean
          created_at: string
          email: string
          id: string
          linkedin_url: string | null
          name: string
          tranche_interest: string
          utm_source: string | null
        }
        Insert: {
          accredited_confirmed?: boolean
          created_at?: string
          email: string
          id?: string
          linkedin_url?: string | null
          name: string
          tranche_interest?: string
          utm_source?: string | null
        }
        Update: {
          accredited_confirmed?: boolean
          created_at?: string
          email?: string
          id?: string
          linkedin_url?: string | null
          name?: string
          tranche_interest?: string
          utm_source?: string | null
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
      manual_check_evidence: {
        Row: {
          created_at: string | null
          evidence_confirmed: boolean | null
          final_decision: string
          id: string
          notes: string
          photo_url: string | null
          scan_log_id: string
          staff_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          evidence_confirmed?: boolean | null
          final_decision: string
          id?: string
          notes: string
          photo_url?: string | null
          scan_log_id: string
          staff_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          evidence_confirmed?: boolean | null
          final_decision?: string
          id?: string
          notes?: string
          photo_url?: string | null
          scan_log_id?: string
          staff_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manual_check_evidence_scan_log_id_fkey"
            columns: ["scan_log_id"]
            isOneToOne: false
            referencedRelation: "door_scan_log"
            referencedColumns: ["id"]
          },
        ]
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
      member_active_sessions: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          created_at: string
          ghost_pass_activated: boolean | null
          id: string
          is_active: boolean | null
          user_id: string
          venue_id: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          ghost_pass_activated?: boolean | null
          id?: string
          is_active?: boolean | null
          user_id: string
          venue_id: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          ghost_pass_activated?: boolean | null
          id?: string
          is_active?: boolean | null
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_active_sessions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      member_beta_surveys: {
        Row: {
          created_at: string
          ease_of_use: string
          id: string
          missing_feature: string | null
          qr_sharing_experience: string
          recommendation_likelihood: string | null
          trust_in_security: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          ease_of_use: string
          id?: string
          missing_feature?: string | null
          qr_sharing_experience: string
          recommendation_likelihood?: string | null
          trust_in_security: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          ease_of_use?: string
          id?: string
          missing_feature?: string | null
          qr_sharing_experience?: string
          recommendation_likelihood?: string | null
          trust_in_security?: string
          user_id?: string | null
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
      operator_events: {
        Row: {
          created_at: string
          current_station_label: string | null
          device_id: string | null
          event_type: Database["public"]["Enums"]["operator_event_type"]
          from_station_label: string | null
          id: string
          metadata: Json | null
          operator_label: string
          operator_verification: Database["public"]["Enums"]["operator_verification_type"]
          scan_log_id: string | null
          timestamp: string
          to_station_label: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string
          current_station_label?: string | null
          device_id?: string | null
          event_type: Database["public"]["Enums"]["operator_event_type"]
          from_station_label?: string | null
          id?: string
          metadata?: Json | null
          operator_label: string
          operator_verification?: Database["public"]["Enums"]["operator_verification_type"]
          scan_log_id?: string | null
          timestamp?: string
          to_station_label?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string
          current_station_label?: string | null
          device_id?: string | null
          event_type?: Database["public"]["Enums"]["operator_event_type"]
          from_station_label?: string | null
          id?: string
          metadata?: Json | null
          operator_label?: string
          operator_verification?: Database["public"]["Enums"]["operator_verification_type"]
          scan_log_id?: string | null
          timestamp?: string
          to_station_label?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operator_events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "venue_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_events_scan_log_id_fkey"
            columns: ["scan_log_id"]
            isOneToOne: false
            referencedRelation: "door_scan_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
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
      page_views: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          os: string | null
          page_path: string
          referrer: string | null
          region: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          os?: string | null
          page_path?: string
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          os?: string | null
          page_path?: string
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          user_agent?: string | null
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
          age_policy: string | null
          bank_endpoint: string | null
          bar_commission_rate: number | null
          category: Database["public"]["Enums"]["venue_category"]
          city: string
          country: string
          created_at: string
          custom_logo_url: string | null
          door_commission_rate: number | null
          gm_email: string | null
          id: string
          industry_type: string | null
          paypal_email: string | null
          pending_earnings: number | null
          promoter_spend_commission_rate: number | null
          status: string
          total_earnings: number | null
          updated_at: string
          venue_name: string
        }
        Insert: {
          age_policy?: string | null
          bank_endpoint?: string | null
          bar_commission_rate?: number | null
          category: Database["public"]["Enums"]["venue_category"]
          city: string
          country?: string
          created_at?: string
          custom_logo_url?: string | null
          door_commission_rate?: number | null
          gm_email?: string | null
          id?: string
          industry_type?: string | null
          paypal_email?: string | null
          pending_earnings?: number | null
          promoter_spend_commission_rate?: number | null
          status?: string
          total_earnings?: number | null
          updated_at?: string
          venue_name: string
        }
        Update: {
          age_policy?: string | null
          bank_endpoint?: string | null
          bar_commission_rate?: number | null
          category?: Database["public"]["Enums"]["venue_category"]
          city?: string
          country?: string
          created_at?: string
          custom_logo_url?: string | null
          door_commission_rate?: number | null
          gm_email?: string | null
          id?: string
          industry_type?: string | null
          paypal_email?: string | null
          pending_earnings?: number | null
          promoter_spend_commission_rate?: number | null
          status?: string
          total_earnings?: number | null
          updated_at?: string
          venue_name?: string
        }
        Relationships: []
      }
      pos_transactions: {
        Row: {
          affiliate_id: string | null
          base_amount: number
          created_at: string
          fbo_account_id: string | null
          id: string
          member_confirmed_at: string | null
          pos_confirmed_at: string | null
          staff_shift_id: string | null
          station_id: string | null
          status: string
          tip_amount: number | null
          tip_percentage: number | null
          total_amount: number
          transaction_type: string
          updated_at: string
          user_id: string
          venue_id: string
          wallet_transaction_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          base_amount: number
          created_at?: string
          fbo_account_id?: string | null
          id?: string
          member_confirmed_at?: string | null
          pos_confirmed_at?: string | null
          staff_shift_id?: string | null
          station_id?: string | null
          status?: string
          tip_amount?: number | null
          tip_percentage?: number | null
          total_amount: number
          transaction_type?: string
          updated_at?: string
          user_id: string
          venue_id: string
          wallet_transaction_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          base_amount?: number
          created_at?: string
          fbo_account_id?: string | null
          id?: string
          member_confirmed_at?: string | null
          pos_confirmed_at?: string | null
          staff_shift_id?: string | null
          station_id?: string | null
          status?: string
          tip_amount?: number | null
          tip_percentage?: number | null
          total_amount?: number
          transaction_type?: string
          updated_at?: string
          user_id?: string
          venue_id?: string
          wallet_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_transactions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_staff_shift_id_fkey"
            columns: ["staff_shift_id"]
            isOneToOne: false
            referencedRelation: "staff_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "venue_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_wallet_transaction_id_fkey"
            columns: ["wallet_transaction_id"]
            isOneToOne: false
            referencedRelation: "wallet_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_catalog: {
        Row: {
          billing_cadence: string | null
          created_at: string | null
          description: string | null
          event_code: string
          event_name: string
          id: string
          is_active: boolean | null
          markup: number | null
          payer: string
          unit_price: number
          updated_at: string | null
          vendor_cost: number | null
        }
        Insert: {
          billing_cadence?: string | null
          created_at?: string | null
          description?: string | null
          event_code: string
          event_name: string
          id?: string
          is_active?: boolean | null
          markup?: number | null
          payer: string
          unit_price?: number
          updated_at?: string | null
          vendor_cost?: number | null
        }
        Update: {
          billing_cadence?: string | null
          created_at?: string | null
          description?: string | null
          event_code?: string
          event_name?: string
          id?: string
          is_active?: boolean | null
          markup?: number | null
          payer?: string
          unit_price?: number
          updated_at?: string | null
          vendor_cost?: number | null
        }
        Relationships: []
      }
      pricing_models: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          idv_premium_markup: number | null
          idv_premium_passthrough: number | null
          idv_standard_markup: number | null
          idv_standard_passthrough: number | null
          instant_load_fee_flat: number | null
          instant_load_fee_percent: number | null
          is_active: boolean | null
          model_key: string
          payout_cadence_default: string | null
          payout_cadence_options: string[] | null
          saas_annual_discount_percent: number | null
          saas_monthly_fee: number | null
          scan_fee_door_default: number | null
          scan_fee_door_max: number | null
          scan_fee_door_min: number | null
          scan_fee_purchase_default: number | null
          scan_fee_purchase_max: number | null
          scan_fee_purchase_min: number | null
          updated_at: string | null
          volume_tiers: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          idv_premium_markup?: number | null
          idv_premium_passthrough?: number | null
          idv_standard_markup?: number | null
          idv_standard_passthrough?: number | null
          instant_load_fee_flat?: number | null
          instant_load_fee_percent?: number | null
          is_active?: boolean | null
          model_key: string
          payout_cadence_default?: string | null
          payout_cadence_options?: string[] | null
          saas_annual_discount_percent?: number | null
          saas_monthly_fee?: number | null
          scan_fee_door_default?: number | null
          scan_fee_door_max?: number | null
          scan_fee_door_min?: number | null
          scan_fee_purchase_default?: number | null
          scan_fee_purchase_max?: number | null
          scan_fee_purchase_min?: number | null
          updated_at?: string | null
          volume_tiers?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          idv_premium_markup?: number | null
          idv_premium_passthrough?: number | null
          idv_standard_markup?: number | null
          idv_standard_passthrough?: number | null
          instant_load_fee_flat?: number | null
          instant_load_fee_percent?: number | null
          is_active?: boolean | null
          model_key?: string
          payout_cadence_default?: string | null
          payout_cadence_options?: string[] | null
          saas_annual_discount_percent?: number | null
          saas_monthly_fee?: number | null
          scan_fee_door_default?: number | null
          scan_fee_door_max?: number | null
          scan_fee_door_min?: number | null
          scan_fee_purchase_default?: number | null
          scan_fee_purchase_max?: number | null
          scan_fee_purchase_min?: number | null
          updated_at?: string | null
          volume_tiers?: Json | null
        }
        Relationships: []
      }
      privacy_consent_log: {
        Row: {
          consent_given: boolean | null
          consent_timestamp: string | null
          consent_type: string
          consent_version: string | null
          created_at: string | null
          id: string
          ip_hash: string | null
          user_id: string
        }
        Insert: {
          consent_given?: boolean | null
          consent_timestamp?: string | null
          consent_type: string
          consent_version?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          user_id: string
        }
        Update: {
          consent_given?: boolean | null
          consent_timestamp?: string | null
          consent_type?: string
          consent_version?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_approved_by: string | null
          birthday: string | null
          circumcised: boolean | null
          company_name: string | null
          covid_vaccinated: boolean | null
          created_at: string
          current_home_city: string | null
          disclaimer_accepted: boolean | null
          email: string | null
          email_shareable: boolean | null
          email_verified: boolean | null
          employer_id: string | null
          facebook_handle: string | null
          full_name: string | null
          gender_identity: string | null
          health_document_uploaded_at: string | null
          health_document_url: string | null
          id: string
          idv_status: string | null
          idv_tier: string | null
          idv_verified_at: string | null
          idv_verified_hash: string | null
          instagram_handle: string | null
          investor_access_approved: boolean | null
          investor_access_approved_at: string | null
          investor_access_requested_at: string | null
          is_valid: boolean | null
          lab_certified: boolean | null
          lab_disclaimer_accepted: boolean | null
          lab_disclaimer_accepted_at: string | null
          lab_logo_url: string | null
          last_campaign_received: string | null
          last_marketing_email_sent_at: string | null
          linkedin_handle: string | null
          member_id: string | null
          onlyfans_handle: string | null
          originator_id: string | null
          partner_access_approved: boolean | null
          partner_access_approved_at: string | null
          partner_access_requested_at: string | null
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
          sharing_relationship_style_enabled: boolean | null
          sharing_sensory_prefs_enabled: boolean | null
          sharing_social_dynamic_enabled: boolean | null
          sharing_social_enabled: boolean | null
          sharing_specific_activities_enabled: boolean | null
          sharing_vices_enabled: boolean | null
          signup_discount_code: string | null
          smoker: boolean | null
          status_color: string | null
          status_expiry: string | null
          std_acknowledgment: string | null
          std_acknowledgment_locked: boolean | null
          synth_accepted_at: string | null
          synth_age_range: string | null
          synth_avatar_class_id: string | null
          synth_avatar_color: string | null
          synth_city: string | null
          synth_codename: string | null
          synth_consent_analytics: boolean | null
          synth_consent_scoring: boolean | null
          synth_country: string | null
          synth_display_name: string | null
          synth_domain_interest: string | null
          synth_experience_level: string | null
          synth_gender: string | null
          synth_gender_self_describe: string | null
          synth_intake_completed_at: string | null
          synth_intake_started_at: string | null
          synth_leaderboard_visibility: string | null
          synth_llm_experience_level: string | null
          synth_primary_assistant: string | null
          synth_primary_assistant_other: string | null
          synth_primary_goal: string | null
          synth_state_region: string | null
          synth_usage_frequency: string | null
          synth_use_cases: string[] | null
          tiktok_handle: string | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          user_interests: Json | null
          user_references: string | null
          validity_expires_at: string | null
          vibe_metadata: Json | null
          vices: string[] | null
          where_from: string | null
        }
        Insert: {
          access_approved_by?: string | null
          birthday?: string | null
          circumcised?: boolean | null
          company_name?: string | null
          covid_vaccinated?: boolean | null
          created_at?: string
          current_home_city?: string | null
          disclaimer_accepted?: boolean | null
          email?: string | null
          email_shareable?: boolean | null
          email_verified?: boolean | null
          employer_id?: string | null
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          idv_status?: string | null
          idv_tier?: string | null
          idv_verified_at?: string | null
          idv_verified_hash?: string | null
          instagram_handle?: string | null
          investor_access_approved?: boolean | null
          investor_access_approved_at?: string | null
          investor_access_requested_at?: string | null
          is_valid?: boolean | null
          lab_certified?: boolean | null
          lab_disclaimer_accepted?: boolean | null
          lab_disclaimer_accepted_at?: string | null
          lab_logo_url?: string | null
          last_campaign_received?: string | null
          last_marketing_email_sent_at?: string | null
          linkedin_handle?: string | null
          member_id?: string | null
          onlyfans_handle?: string | null
          originator_id?: string | null
          partner_access_approved?: boolean | null
          partner_access_approved_at?: string | null
          partner_access_requested_at?: string | null
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
          sharing_relationship_style_enabled?: boolean | null
          sharing_sensory_prefs_enabled?: boolean | null
          sharing_social_dynamic_enabled?: boolean | null
          sharing_social_enabled?: boolean | null
          sharing_specific_activities_enabled?: boolean | null
          sharing_vices_enabled?: boolean | null
          signup_discount_code?: string | null
          smoker?: boolean | null
          status_color?: string | null
          status_expiry?: string | null
          std_acknowledgment?: string | null
          std_acknowledgment_locked?: boolean | null
          synth_accepted_at?: string | null
          synth_age_range?: string | null
          synth_avatar_class_id?: string | null
          synth_avatar_color?: string | null
          synth_city?: string | null
          synth_codename?: string | null
          synth_consent_analytics?: boolean | null
          synth_consent_scoring?: boolean | null
          synth_country?: string | null
          synth_display_name?: string | null
          synth_domain_interest?: string | null
          synth_experience_level?: string | null
          synth_gender?: string | null
          synth_gender_self_describe?: string | null
          synth_intake_completed_at?: string | null
          synth_intake_started_at?: string | null
          synth_leaderboard_visibility?: string | null
          synth_llm_experience_level?: string | null
          synth_primary_assistant?: string | null
          synth_primary_assistant_other?: string | null
          synth_primary_goal?: string | null
          synth_state_region?: string | null
          synth_usage_frequency?: string | null
          synth_use_cases?: string[] | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          user_interests?: Json | null
          user_references?: string | null
          validity_expires_at?: string | null
          vibe_metadata?: Json | null
          vices?: string[] | null
          where_from?: string | null
        }
        Update: {
          access_approved_by?: string | null
          birthday?: string | null
          circumcised?: boolean | null
          company_name?: string | null
          covid_vaccinated?: boolean | null
          created_at?: string
          current_home_city?: string | null
          disclaimer_accepted?: boolean | null
          email?: string | null
          email_shareable?: boolean | null
          email_verified?: boolean | null
          employer_id?: string | null
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          idv_status?: string | null
          idv_tier?: string | null
          idv_verified_at?: string | null
          idv_verified_hash?: string | null
          instagram_handle?: string | null
          investor_access_approved?: boolean | null
          investor_access_approved_at?: string | null
          investor_access_requested_at?: string | null
          is_valid?: boolean | null
          lab_certified?: boolean | null
          lab_disclaimer_accepted?: boolean | null
          lab_disclaimer_accepted_at?: string | null
          lab_logo_url?: string | null
          last_campaign_received?: string | null
          last_marketing_email_sent_at?: string | null
          linkedin_handle?: string | null
          member_id?: string | null
          onlyfans_handle?: string | null
          originator_id?: string | null
          partner_access_approved?: boolean | null
          partner_access_approved_at?: string | null
          partner_access_requested_at?: string | null
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
          sharing_relationship_style_enabled?: boolean | null
          sharing_sensory_prefs_enabled?: boolean | null
          sharing_social_dynamic_enabled?: boolean | null
          sharing_social_enabled?: boolean | null
          sharing_specific_activities_enabled?: boolean | null
          sharing_vices_enabled?: boolean | null
          signup_discount_code?: string | null
          smoker?: boolean | null
          status_color?: string | null
          status_expiry?: string | null
          std_acknowledgment?: string | null
          std_acknowledgment_locked?: boolean | null
          synth_accepted_at?: string | null
          synth_age_range?: string | null
          synth_avatar_class_id?: string | null
          synth_avatar_color?: string | null
          synth_city?: string | null
          synth_codename?: string | null
          synth_consent_analytics?: boolean | null
          synth_consent_scoring?: boolean | null
          synth_country?: string | null
          synth_display_name?: string | null
          synth_domain_interest?: string | null
          synth_experience_level?: string | null
          synth_gender?: string | null
          synth_gender_self_describe?: string | null
          synth_intake_completed_at?: string | null
          synth_intake_started_at?: string | null
          synth_leaderboard_visibility?: string | null
          synth_llm_experience_level?: string | null
          synth_primary_assistant?: string | null
          synth_primary_assistant_other?: string | null
          synth_primary_goal?: string | null
          synth_state_region?: string | null
          synth_usage_frequency?: string | null
          synth_use_cases?: string[] | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          user_interests?: Json | null
          user_references?: string | null
          validity_expires_at?: string | null
          vibe_metadata?: Json | null
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
          {
            foreignKeyName: "profiles_originator_id_fkey"
            columns: ["originator_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
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
      scan_audit_log: {
        Row: {
          created_at: string | null
          data_purged_at: string | null
          data_retained: boolean | null
          id: string
          result: string
          scan_timestamp: string | null
          scan_type: string
          session_hash: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_purged_at?: string | null
          data_retained?: boolean | null
          id?: string
          result: string
          scan_timestamp?: string | null
          scan_type: string
          session_hash?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_purged_at?: string | null
          data_retained?: boolean | null
          id?: string
          result?: string
          scan_timestamp?: string | null
          scan_type?: string
          session_hash?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_audit_log_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      senate_conflicts: {
        Row: {
          challenge_id: string
          conflict_question: string
          created_at: string
          id: string
          resolution_notes: string | null
          resolved: boolean | null
          senators_involved: string[]
          topic: string | null
        }
        Insert: {
          challenge_id: string
          conflict_question: string
          created_at?: string
          id?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          senators_involved: string[]
          topic?: string | null
        }
        Update: {
          challenge_id?: string
          conflict_question?: string
          created_at?: string
          id?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          senators_involved?: string[]
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "senate_conflicts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "senate_sessions"
            referencedColumns: ["challenge_id"]
          },
        ]
      }
      senate_messages: {
        Row: {
          challenge_id: string
          created_at: string
          id: string
          latency_ms: number | null
          model: string
          output_json: Json
          provider: string
          round: number
          speaker: string
          tokens_used: number | null
        }
        Insert: {
          challenge_id: string
          created_at?: string
          id?: string
          latency_ms?: number | null
          model: string
          output_json: Json
          provider: string
          round?: number
          speaker: string
          tokens_used?: number | null
        }
        Update: {
          challenge_id?: string
          created_at?: string
          id?: string
          latency_ms?: number | null
          model?: string
          output_json?: Json
          provider?: string
          round?: number
          speaker?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "senate_messages_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "senate_sessions"
            referencedColumns: ["challenge_id"]
          },
        ]
      }
      senate_sessions: {
        Row: {
          budget: Json | null
          challenge_id: string
          completed_at: string | null
          confidence: number | null
          created_at: string
          created_by_email: string
          domain: string | null
          error_message: string | null
          estimated_cost_usd: number | null
          id: string
          judge_output_json: Json | null
          prompt: string
          status: string
          total_latency_ms: number | null
          total_tokens_used: number | null
        }
        Insert: {
          budget?: Json | null
          challenge_id: string
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          created_by_email: string
          domain?: string | null
          error_message?: string | null
          estimated_cost_usd?: number | null
          id?: string
          judge_output_json?: Json | null
          prompt: string
          status?: string
          total_latency_ms?: number | null
          total_tokens_used?: number | null
        }
        Update: {
          budget?: Json | null
          challenge_id?: string
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          created_by_email?: string
          domain?: string | null
          error_message?: string | null
          estimated_cost_usd?: number | null
          id?: string
          judge_output_json?: Json | null
          prompt?: string
          status?: string
          total_latency_ms?: number | null
          total_tokens_used?: number | null
        }
        Relationships: []
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
      social_embed_analytics: {
        Row: {
          click_count: number
          created_at: string
          event_type: string
          id: string
          platform: string
          updated_at: string
          user_id: string
        }
        Insert: {
          click_count?: number
          created_at?: string
          event_type?: string
          id?: string
          platform: string
          updated_at?: string
          user_id: string
        }
        Update: {
          click_count?: number
          created_at?: string
          event_type?: string
          id?: string
          platform?: string
          updated_at?: string
          user_id?: string
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
      staff_shifts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          qr_token: string | null
          qr_token_expires_at: string | null
          shift_end: string | null
          shift_start: string
          staff_name: string
          staff_role: string
          staff_user_id: string
          station_id: string | null
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          qr_token?: string | null
          qr_token_expires_at?: string | null
          shift_end?: string | null
          shift_start: string
          staff_name: string
          staff_role?: string
          staff_user_id: string
          station_id?: string | null
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          qr_token?: string | null
          qr_token_expires_at?: string | null
          shift_end?: string | null
          shift_start?: string
          staff_name?: string
          staff_role?: string
          staff_user_id?: string
          station_id?: string | null
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_shifts_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "venue_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_shifts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      statement_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          line_item_config: Json | null
          package_id: string | null
          template_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          line_item_config?: Json | null
          package_id?: string | null
          template_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          line_item_config?: Json | null
          package_id?: string | null
          template_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "statement_templates_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "industry_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_investors: {
        Row: {
          accredited_status: string
          admin_email_sent: boolean | null
          admin_notes: string | null
          confirmation_email_sent: boolean | null
          created_at: string
          email: string
          full_name: string
          id: string
          investment_amount: number
          investment_experience: string
          investment_objective: string
          linkedin_url: string | null
          payment_completed_at: string | null
          payment_handle: string | null
          payment_method: string
          payment_status: string | null
          phone: string | null
          referral_code: string | null
          referral_source: string | null
          risk_tolerance: string
          source_of_funds: string | null
          stripe_payment_intent: string | null
          updated_at: string
        }
        Insert: {
          accredited_status: string
          admin_email_sent?: boolean | null
          admin_notes?: string | null
          confirmation_email_sent?: boolean | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          investment_amount: number
          investment_experience: string
          investment_objective: string
          linkedin_url?: string | null
          payment_completed_at?: string | null
          payment_handle?: string | null
          payment_method: string
          payment_status?: string | null
          phone?: string | null
          referral_code?: string | null
          referral_source?: string | null
          risk_tolerance: string
          source_of_funds?: string | null
          stripe_payment_intent?: string | null
          updated_at?: string
        }
        Update: {
          accredited_status?: string
          admin_email_sent?: boolean | null
          admin_notes?: string | null
          confirmation_email_sent?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          investment_amount?: number
          investment_experience?: string
          investment_objective?: string
          linkedin_url?: string | null
          payment_completed_at?: string | null
          payment_handle?: string | null
          payment_method?: string
          payment_status?: string | null
          phone?: string | null
          referral_code?: string | null
          referral_source?: string | null
          risk_tolerance?: string
          source_of_funds?: string | null
          stripe_payment_intent?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stripe_webhook_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          response_body: string | null
          response_status: number | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_id: string
          event_type: string
          id?: string
          payload?: Json
          processed_at?: string | null
          response_body?: string | null
          response_status?: number | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          response_body?: string | null
          response_status?: number | null
        }
        Relationships: []
      }
      synth_audit_logs: {
        Row: {
          agent_outputs: Json | null
          coherence_score: number | null
          created_at: string
          failed_checks: string[] | null
          final_answer: string | null
          final_answer_hash: string | null
          id: string
          judge_output: Json | null
          outcome: string
          policy_ok: boolean | null
          processing_time_ms: number | null
          prompt_hash: string | null
          redaction_summary: Json | null
          request_id: string
          risk_decision: string
          sanitized_prompt: string | null
          timestamp: string
          user_role: string | null
          verification_results: Json | null
          verification_score: number | null
        }
        Insert: {
          agent_outputs?: Json | null
          coherence_score?: number | null
          created_at?: string
          failed_checks?: string[] | null
          final_answer?: string | null
          final_answer_hash?: string | null
          id?: string
          judge_output?: Json | null
          outcome: string
          policy_ok?: boolean | null
          processing_time_ms?: number | null
          prompt_hash?: string | null
          redaction_summary?: Json | null
          request_id?: string
          risk_decision: string
          sanitized_prompt?: string | null
          timestamp?: string
          user_role?: string | null
          verification_results?: Json | null
          verification_score?: number | null
        }
        Update: {
          agent_outputs?: Json | null
          coherence_score?: number | null
          created_at?: string
          failed_checks?: string[] | null
          final_answer?: string | null
          final_answer_hash?: string | null
          id?: string
          judge_output?: Json | null
          outcome?: string
          policy_ok?: boolean | null
          processing_time_ms?: number | null
          prompt_hash?: string | null
          redaction_summary?: Json | null
          request_id?: string
          risk_decision?: string
          sanitized_prompt?: string | null
          timestamp?: string
          user_role?: string | null
          verification_results?: Json | null
          verification_score?: number | null
        }
        Relationships: []
      }
      synth_calibration: {
        Row: {
          created_at: string
          id: string
          org_id: string | null
          seat_1_weight: number
          seat_2_weight: number
          seat_3_weight: number
          seat_4_weight: number
          seat_5_weight: number
          seat_6_weight: number
          seat_7_weight: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          org_id?: string | null
          seat_1_weight?: number
          seat_2_weight?: number
          seat_3_weight?: number
          seat_4_weight?: number
          seat_5_weight?: number
          seat_6_weight?: number
          seat_7_weight?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string | null
          seat_1_weight?: number
          seat_2_weight?: number
          seat_3_weight?: number
          seat_4_weight?: number
          seat_5_weight?: number
          seat_6_weight?: number
          seat_7_weight?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "synth_calibration_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      synth_calibration_audit: {
        Row: {
          action_type: string
          actor_user_id: string
          created_at: string
          from_value: Json | null
          id: string
          target_id: string | null
          to_value: Json | null
        }
        Insert: {
          action_type: string
          actor_user_id: string
          created_at?: string
          from_value?: Json | null
          id?: string
          target_id?: string | null
          to_value?: Json | null
        }
        Update: {
          action_type?: string
          actor_user_id?: string
          created_at?: string
          from_value?: Json | null
          id?: string
          target_id?: string | null
          to_value?: Json | null
        }
        Relationships: []
      }
      synth_entitlements: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          plan: string
          runs_remaining: number | null
          stripe_payment_intent: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          plan: string
          runs_remaining?: number | null
          stripe_payment_intent?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          plan?: string
          runs_remaining?: number | null
          stripe_payment_intent?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      synth_events: {
        Row: {
          answer_hash: string | null
          coherence_score: number | null
          created_at: string
          decision: Database["public"]["Enums"]["synth_decision"] | null
          event_type: Database["public"]["Enums"]["synth_event_type"]
          id: string
          metadata: Json | null
          prompt_hash: string | null
          request_id: string | null
          risk_decision:
            | Database["public"]["Enums"]["synth_risk_decision"]
            | null
          session_id: string | null
          source: Database["public"]["Enums"]["synth_event_source"]
          timestamp: string
          user_hash: string | null
          user_id: string | null
          verification_score: number | null
        }
        Insert: {
          answer_hash?: string | null
          coherence_score?: number | null
          created_at?: string
          decision?: Database["public"]["Enums"]["synth_decision"] | null
          event_type: Database["public"]["Enums"]["synth_event_type"]
          id?: string
          metadata?: Json | null
          prompt_hash?: string | null
          request_id?: string | null
          risk_decision?:
            | Database["public"]["Enums"]["synth_risk_decision"]
            | null
          session_id?: string | null
          source?: Database["public"]["Enums"]["synth_event_source"]
          timestamp?: string
          user_hash?: string | null
          user_id?: string | null
          verification_score?: number | null
        }
        Update: {
          answer_hash?: string | null
          coherence_score?: number | null
          created_at?: string
          decision?: Database["public"]["Enums"]["synth_decision"] | null
          event_type?: Database["public"]["Enums"]["synth_event_type"]
          id?: string
          metadata?: Json | null
          prompt_hash?: string | null
          request_id?: string | null
          risk_decision?:
            | Database["public"]["Enums"]["synth_risk_decision"]
            | null
          session_id?: string | null
          source?: Database["public"]["Enums"]["synth_event_source"]
          timestamp?: string
          user_hash?: string | null
          user_id?: string | null
          verification_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "synth_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "synth_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      synth_learning_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          is_error: boolean
          metadata: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          is_error?: boolean
          metadata?: Json | null
          score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          is_error?: boolean
          metadata?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      synth_policies: {
        Row: {
          coherence_threshold: number
          created_at: string
          id: string
          is_active: boolean | null
          phi_redaction_enabled: boolean | null
          pii_redaction_enabled: boolean | null
          policy_name: string
          storage_mode: string
          updated_at: string
          verification_threshold: number
        }
        Insert: {
          coherence_threshold?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          phi_redaction_enabled?: boolean | null
          pii_redaction_enabled?: boolean | null
          policy_name: string
          storage_mode?: string
          updated_at?: string
          verification_threshold?: number
        }
        Update: {
          coherence_threshold?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          phi_redaction_enabled?: boolean | null
          pii_redaction_enabled?: boolean | null
          policy_name?: string
          storage_mode?: string
          updated_at?: string
          verification_threshold?: number
        }
        Relationships: []
      }
      synth_prefills: {
        Row: {
          consumed: boolean
          created_at: string
          expires_at: string
          id: string
          prefill_id: string
          selected_text: string
          timestamp: number
          title: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          consumed?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          prefill_id: string
          selected_text: string
          timestamp: number
          title?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          consumed?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          prefill_id?: string
          selected_text?: string
          timestamp?: number
          title?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      synth_probation: {
        Row: {
          created_at: string
          enabled_by: string
          expires_at: string
          extra_logging: boolean
          id: string
          is_active: boolean
          notes: string | null
          org_id: string | null
          started_at: string
          step_up_auth: boolean
          strict_session_lock: boolean
          target_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled_by: string
          expires_at?: string
          extra_logging?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          org_id?: string | null
          started_at?: string
          step_up_auth?: boolean
          strict_session_lock?: boolean
          target_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled_by?: string
          expires_at?: string
          extra_logging?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          org_id?: string | null
          started_at?: string
          step_up_auth?: boolean
          strict_session_lock?: boolean
          target_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "synth_probation_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      synth_runs: {
        Row: {
          adaptation_score: number | null
          board_profile_id: string
          client_meta: Json | null
          coherence_score: number | null
          constraint_discipline_score: number | null
          created_at: string
          final_output: string | null
          id: string
          input_hash: string
          input_length: number
          integrity_flags: string[] | null
          integrity_score: number | null
          omission_resistance_score: number | null
          percentile: number
          policy_version_id: string
          processing_time_ms: number | null
          ranking_window: string
          reason_codes: string[] | null
          session_id: string | null
          source_hostname: string | null
          source_type: string
          source_url: string | null
          synth_index: number
          template_category: string | null
          template_id: string
          tier: string
          user_id: string
          verification_score: number | null
        }
        Insert: {
          adaptation_score?: number | null
          board_profile_id?: string
          client_meta?: Json | null
          coherence_score?: number | null
          constraint_discipline_score?: number | null
          created_at?: string
          final_output?: string | null
          id?: string
          input_hash: string
          input_length: number
          integrity_flags?: string[] | null
          integrity_score?: number | null
          omission_resistance_score?: number | null
          percentile: number
          policy_version_id?: string
          processing_time_ms?: number | null
          ranking_window: string
          reason_codes?: string[] | null
          session_id?: string | null
          source_hostname?: string | null
          source_type?: string
          source_url?: string | null
          synth_index: number
          template_category?: string | null
          template_id: string
          tier: string
          user_id: string
          verification_score?: number | null
        }
        Update: {
          adaptation_score?: number | null
          board_profile_id?: string
          client_meta?: Json | null
          coherence_score?: number | null
          constraint_discipline_score?: number | null
          created_at?: string
          final_output?: string | null
          id?: string
          input_hash?: string
          input_length?: number
          integrity_flags?: string[] | null
          integrity_score?: number | null
          omission_resistance_score?: number | null
          percentile?: number
          policy_version_id?: string
          processing_time_ms?: number | null
          ranking_window?: string
          reason_codes?: string[] | null
          session_id?: string | null
          source_hostname?: string | null
          source_type?: string
          source_url?: string | null
          synth_index?: number
          template_category?: string | null
          template_id?: string
          tier?: string
          user_id?: string
          verification_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "synth_runs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "synth_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      synth_security_events: {
        Row: {
          action_taken: string | null
          created_at: string
          escalation_level: number
          event_type: string
          id: string
          metrics: Json
          reason_codes: string[]
          resolved_at: string | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          escalation_level?: number
          event_type: string
          id?: string
          metrics?: Json
          reason_codes?: string[]
          resolved_at?: string | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          escalation_level?: number
          event_type?: string
          id?: string
          metrics?: Json
          reason_codes?: string[]
          resolved_at?: string | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      synth_senate_runs: {
        Row: {
          ballots: Json
          contested: boolean
          created_at: string
          final_answer: string | null
          id: string
          input_text: string
          judge_output: Json
          participation_summary: Json
          previous_hash: string | null
          processing_time_ms: number | null
          record_hash: string | null
          trace_id: string
          user_id: string
          weights_used: Json
        }
        Insert: {
          ballots?: Json
          contested?: boolean
          created_at?: string
          final_answer?: string | null
          id?: string
          input_text: string
          judge_output?: Json
          participation_summary?: Json
          previous_hash?: string | null
          processing_time_ms?: number | null
          record_hash?: string | null
          trace_id: string
          user_id: string
          weights_used?: Json
        }
        Update: {
          ballots?: Json
          contested?: boolean
          created_at?: string
          final_answer?: string | null
          id?: string
          input_text?: string
          judge_output?: Json
          participation_summary?: Json
          previous_hash?: string | null
          processing_time_ms?: number | null
          record_hash?: string | null
          trace_id?: string
          user_id?: string
          weights_used?: Json
        }
        Relationships: []
      }
      synth_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          event_count: number | null
          id: string
          last_activity_at: string
          source: Database["public"]["Enums"]["synth_event_source"]
          started_at: string
          user_hash: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          event_count?: number | null
          id?: string
          last_activity_at?: string
          source?: Database["public"]["Enums"]["synth_event_source"]
          started_at?: string
          user_hash?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          event_count?: number | null
          id?: string
          last_activity_at?: string
          source?: Database["public"]["Enums"]["synth_event_source"]
          started_at?: string
          user_hash?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      synth_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          non_negotiables: Json | null
          rubric: Json
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id: string
          is_active?: boolean | null
          name: string
          non_negotiables?: Json | null
          rubric?: Json
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          non_negotiables?: Json | null
          rubric?: Json
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      synth_user_metrics: {
        Row: {
          acceptance_rate: number | null
          audits_completed: number | null
          avg_coherence_score: number | null
          avg_time_to_decision_ms: number | null
          avg_verification_score: number | null
          completion_rate: number | null
          created_at: string
          human_reviews_requested: number | null
          id: string
          median_time_to_decision_ms: number | null
          metadata: Json | null
          period_end: string
          period_start: string
          period_type: string
          policy_blocks_triggered: number | null
          prompts_submitted: number | null
          reason_codes:
            | Database["public"]["Enums"]["synth_reason_code"][]
            | null
          review_rate: number | null
          revision_rate: number | null
          revisions_submitted: number | null
          rewrites_accepted: number | null
          rewrites_rejected: number | null
          tier_percentile: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          audits_completed?: number | null
          avg_coherence_score?: number | null
          avg_time_to_decision_ms?: number | null
          avg_verification_score?: number | null
          completion_rate?: number | null
          created_at?: string
          human_reviews_requested?: number | null
          id?: string
          median_time_to_decision_ms?: number | null
          metadata?: Json | null
          period_end: string
          period_start: string
          period_type?: string
          policy_blocks_triggered?: number | null
          prompts_submitted?: number | null
          reason_codes?:
            | Database["public"]["Enums"]["synth_reason_code"][]
            | null
          review_rate?: number | null
          revision_rate?: number | null
          revisions_submitted?: number | null
          rewrites_accepted?: number | null
          rewrites_rejected?: number | null
          tier_percentile?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          audits_completed?: number | null
          avg_coherence_score?: number | null
          avg_time_to_decision_ms?: number | null
          avg_verification_score?: number | null
          completion_rate?: number | null
          created_at?: string
          human_reviews_requested?: number | null
          id?: string
          median_time_to_decision_ms?: number | null
          metadata?: Json | null
          period_end?: string
          period_start?: string
          period_type?: string
          policy_blocks_triggered?: number | null
          prompts_submitted?: number | null
          reason_codes?:
            | Database["public"]["Enums"]["synth_reason_code"][]
            | null
          review_rate?: number | null
          revision_rate?: number | null
          revisions_submitted?: number | null
          rewrites_accepted?: number | null
          rewrites_rejected?: number | null
          tier_percentile?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      think_tank_entries: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: Database["public"]["Enums"]["think_tank_category"]
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category: Database["public"]["Enums"]["think_tank_category"]
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: Database["public"]["Enums"]["think_tank_category"]
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          version?: number | null
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
      user_wallets: {
        Row: {
          balance: number
          created_at: string
          daily_funded_amount: number
          daily_funded_date: string | null
          id: string
          monthly_funded_amount: number
          monthly_funded_month: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          daily_funded_amount?: number
          daily_funded_date?: string | null
          id?: string
          monthly_funded_amount?: number
          monthly_funded_month?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          daily_funded_amount?: number
          daily_funded_date?: string | null
          id?: string
          monthly_funded_amount?: number
          monthly_funded_month?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      valid_transactions: {
        Row: {
          community_pool_share: number | null
          created_at: string
          direct_payment_type: string | null
          gas_fee_applied: number
          ghost_pass_tier: string | null
          gross_amount: number
          id: string
          payment_method: string | null
          payment_model: string
          payment_reference: string | null
          processed_at: string | null
          promoter_code: string | null
          promoter_id: string | null
          promoter_share: number | null
          staff_user_id: string | null
          status: string
          transaction_fee_applied: number
          updated_at: string
          user_id: string
          valid_net: number
          valid_share: number | null
          venue_id: string
          venue_net: number
          venue_share: number | null
        }
        Insert: {
          community_pool_share?: number | null
          created_at?: string
          direct_payment_type?: string | null
          gas_fee_applied?: number
          ghost_pass_tier?: string | null
          gross_amount: number
          id?: string
          payment_method?: string | null
          payment_model: string
          payment_reference?: string | null
          processed_at?: string | null
          promoter_code?: string | null
          promoter_id?: string | null
          promoter_share?: number | null
          staff_user_id?: string | null
          status?: string
          transaction_fee_applied?: number
          updated_at?: string
          user_id: string
          valid_net?: number
          valid_share?: number | null
          venue_id: string
          venue_net?: number
          venue_share?: number | null
        }
        Update: {
          community_pool_share?: number | null
          created_at?: string
          direct_payment_type?: string | null
          gas_fee_applied?: number
          ghost_pass_tier?: string | null
          gross_amount?: number
          id?: string
          payment_method?: string | null
          payment_model?: string
          payment_reference?: string | null
          processed_at?: string | null
          promoter_code?: string | null
          promoter_id?: string | null
          promoter_share?: number | null
          staff_user_id?: string | null
          status?: string
          transaction_fee_applied?: number
          updated_at?: string
          user_id?: string
          valid_net?: number
          valid_share?: number | null
          venue_id?: string
          venue_net?: number
          venue_share?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "valid_transactions_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valid_transactions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_devices: {
        Row: {
          created_at: string | null
          device_name: string
          device_token: string | null
          device_type: string | null
          id: string
          is_online: boolean | null
          last_seen_at: string | null
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          device_name: string
          device_token?: string | null
          device_type?: string | null
          id?: string
          is_online?: boolean | null
          last_seen_at?: string | null
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          device_name?: string
          device_token?: string | null
          device_type?: string | null
          id?: string
          is_online?: boolean | null
          last_seen_at?: string | null
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_devices_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_gas_fee_config: {
        Row: {
          created_at: string
          id: string
          manual_gas_fee: number | null
          minimum_monthly_amount: number | null
          minimum_monthly_enabled: boolean
          updated_at: string
          use_auto_tier: boolean
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          manual_gas_fee?: number | null
          minimum_monthly_amount?: number | null
          minimum_monthly_enabled?: boolean
          updated_at?: string
          use_auto_tier?: boolean
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          manual_gas_fee?: number | null
          minimum_monthly_amount?: number | null
          minimum_monthly_enabled?: boolean
          updated_at?: string
          use_auto_tier?: boolean
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_gas_fee_config_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: true
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
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
      venue_ledger_entries: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          entry_type: string
          id: string
          idempotency_key: string | null
          paid_at: string | null
          stripe_transfer_id: string | null
          transaction_id: string | null
          venue_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          entry_type: string
          id?: string
          idempotency_key?: string | null
          paid_at?: string | null
          stripe_transfer_id?: string | null
          transaction_id?: string | null
          venue_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_type?: string
          id?: string
          idempotency_key?: string | null
          paid_at?: string | null
          stripe_transfer_id?: string | null
          transaction_id?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_ledger_entries_venue_id_fkey"
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
      venue_pool_distributions: {
        Row: {
          created_at: string | null
          distributed: boolean | null
          id: string
          pass_end_date: string
          pass_start_date: string
          total_pool_amount: number
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          distributed?: boolean | null
          id?: string
          pass_end_date: string
          pass_start_date: string
          total_pool_amount?: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          distributed?: boolean | null
          id?: string
          pass_end_date?: string
          pass_start_date?: string
          total_pool_amount?: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_pool_distributions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "incognito_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_privacy_stats: {
        Row: {
          avg_scan_time_ms: number | null
          data_retention_time_ms: number | null
          fan_satisfaction_score: number | null
          id: string
          last_updated: string | null
          threats_blocked_lifetime: number | null
          threats_blocked_today: number | null
          total_scans_lifetime: number | null
          total_scans_today: number | null
          venue_id: string | null
        }
        Insert: {
          avg_scan_time_ms?: number | null
          data_retention_time_ms?: number | null
          fan_satisfaction_score?: number | null
          id?: string
          last_updated?: string | null
          threats_blocked_lifetime?: number | null
          threats_blocked_today?: number | null
          total_scans_lifetime?: number | null
          total_scans_today?: number | null
          venue_id?: string | null
        }
        Update: {
          avg_scan_time_ms?: number | null
          data_retention_time_ms?: number | null
          fan_satisfaction_score?: number | null
          id?: string
          last_updated?: string | null
          threats_blocked_lifetime?: number | null
          threats_blocked_today?: number | null
          total_scans_lifetime?: number | null
          total_scans_today?: number | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_privacy_stats_venue_id_fkey"
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
      venue_scan_counts: {
        Row: {
          created_at: string
          gas_fees_collected: number
          id: string
          month_year: string
          scan_count: number
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          gas_fees_collected?: number
          id?: string
          month_year: string
          scan_count?: number
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          gas_fees_collected?: number
          id?: string
          month_year?: string
          scan_count?: number
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_scan_counts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_settings: {
        Row: {
          age_policy: string | null
          allow_door_to_collect_payment: boolean | null
          created_at: string | null
          id: string
          offline_mode_enabled: boolean | null
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          age_policy?: string | null
          allow_door_to_collect_payment?: boolean | null
          created_at?: string | null
          id?: string
          offline_mode_enabled?: boolean | null
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          age_policy?: string | null
          allow_door_to_collect_payment?: boolean | null
          created_at?: string | null
          id?: string
          offline_mode_enabled?: boolean | null
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_settings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: true
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_statements: {
        Row: {
          account_manager_payouts: number | null
          adjustments: number | null
          created_at: string | null
          door_scan_count: number | null
          gross_spend: number | null
          id: string
          idv_fees_total: number | null
          instant_load_fees_total: number | null
          net_payout: number | null
          paid_at: string | null
          payout_status: string | null
          promoter_payouts: number | null
          purchase_scan_count: number | null
          refunds_voids: number | null
          scan_fees_total: number | null
          statement_period_end: string
          statement_period_start: string
          total_scan_count: number | null
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          account_manager_payouts?: number | null
          adjustments?: number | null
          created_at?: string | null
          door_scan_count?: number | null
          gross_spend?: number | null
          id?: string
          idv_fees_total?: number | null
          instant_load_fees_total?: number | null
          net_payout?: number | null
          paid_at?: string | null
          payout_status?: string | null
          promoter_payouts?: number | null
          purchase_scan_count?: number | null
          refunds_voids?: number | null
          scan_fees_total?: number | null
          statement_period_end: string
          statement_period_start: string
          total_scan_count?: number | null
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          account_manager_payouts?: number | null
          adjustments?: number | null
          created_at?: string | null
          door_scan_count?: number | null
          gross_spend?: number | null
          id?: string
          idv_fees_total?: number | null
          instant_load_fees_total?: number | null
          net_payout?: number | null
          paid_at?: string | null
          payout_status?: string | null
          promoter_payouts?: number | null
          purchase_scan_count?: number | null
          refunds_voids?: number | null
          scan_fees_total?: number | null
          statement_period_end?: string
          statement_period_start?: string
          total_scan_count?: number | null
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_statements_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_stations: {
        Row: {
          assigned_staff_name: string | null
          assignment_number: number
          created_at: string
          id: string
          is_active: boolean | null
          shift_assignment: string | null
          station_category: string
          station_name: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          assigned_staff_name?: string | null
          assignment_number?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          shift_assignment?: string | null
          station_category: string
          station_name: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          assigned_staff_name?: string | null
          assignment_number?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          shift_assignment?: string | null
          station_category?: string
          station_name?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_stations_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_visit_tracking: {
        Row: {
          id: string
          pool_distribution_id: string | null
          share_amount: number | null
          user_id: string
          venue_id: string | null
          visited_at: string | null
        }
        Insert: {
          id?: string
          pool_distribution_id?: string | null
          share_amount?: number | null
          user_id: string
          venue_id?: string | null
          visited_at?: string | null
        }
        Update: {
          id?: string
          pool_distribution_id?: string | null
          share_amount?: number | null
          user_id?: string
          venue_id?: string | null
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_visit_tracking_pool_distribution_id_fkey"
            columns: ["pool_distribution_id"]
            isOneToOne: false
            referencedRelation: "venue_pool_distributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_visit_tracking_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "partner_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      verifications: {
        Row: {
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string | null
          validation_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          validation_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          validation_id?: string
        }
        Relationships: []
      }
      wallet_funding_transactions: {
        Row: {
          amount: number
          convenience_fee: number
          created_at: string
          credited_at: string | null
          id: string
          payment_method: string
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          total_charged: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          convenience_fee: number
          created_at?: string
          credited_at?: string | null
          id?: string
          payment_method?: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          total_charged: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          convenience_fee?: number
          created_at?: string
          credited_at?: string | null
          id?: string
          payment_method?: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          total_charged?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          pass_duration_hrs: number | null
          pass_label: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          pass_duration_hrs?: number | null
          pass_label?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          pass_duration_hrs?: number | null
          pass_label?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
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
      cleanup_expired_synth_prefills: { Args: never; Returns: undefined }
      credit_wallet: {
        Args: {
          p_amount: number
          p_fee: number
          p_transaction_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      decrement_synth_trial_run: {
        Args: { p_entitlement_id: string }
        Returns: boolean
      }
      detect_session_lock_trigger: {
        Args: {
          p_current_readability: number
          p_current_tokens: number
          p_language_shift?: boolean
          p_previous_readability: number
          p_previous_tokens: number
          p_session_id: string
          p_user_id: string
        }
        Returns: {
          action: string
          escalation_level: number
          reason_codes: string[]
          should_escalate: boolean
        }[]
      }
      generate_member_id: { Args: never; Returns: string }
      generate_synth_codename: { Args: { p_tier?: string }; Returns: string }
      get_or_create_synth_entitlement: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          plan: string
          runs_remaining: number | null
          stripe_payment_intent: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "synth_entitlements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_or_create_synth_session: {
        Args: {
          p_source?: Database["public"]["Enums"]["synth_event_source"]
          p_user_hash?: string
          p_user_id: string
        }
        Returns: string
      }
      get_or_create_wallet: {
        Args: { p_user_id: string }
        Returns: {
          balance: number
          created_at: string
          daily_funded_amount: number
          daily_funded_date: string | null
          id: string
          monthly_funded_amount: number
          monthly_funded_month: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_wallets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_public_venues: {
        Args: never
        Returns: {
          category: Database["public"]["Enums"]["venue_category"]
          city: string
          country: string
          id: string
          venue_name: string
        }[]
      }
      get_venue_gas_fee: { Args: { p_venue_id: string }; Returns: number }
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
      increment_global_stat: {
        Args: { increment_by?: number; stat_name: string }
        Returns: undefined
      }
      is_venue_operator: {
        Args: { _user_id: string; _venue_id: string }
        Returns: boolean
      }
      is_within_scan_grace_window: {
        Args: {
          p_event_type: string
          p_grace_seconds?: number
          p_user_id: string
          p_venue_id: string
        }
        Returns: boolean
      }
      log_synth_event: {
        Args: {
          p_answer_hash?: string
          p_coherence_score?: number
          p_decision?: Database["public"]["Enums"]["synth_decision"]
          p_event_type: Database["public"]["Enums"]["synth_event_type"]
          p_metadata?: Json
          p_prompt_hash?: string
          p_request_id?: string
          p_risk_decision?: Database["public"]["Enums"]["synth_risk_decision"]
          p_source?: Database["public"]["Enums"]["synth_event_source"]
          p_user_id: string
          p_verification_score?: number
        }
        Returns: string
      }
      record_billable_scan_event: {
        Args: {
          p_event_type: string
          p_fee_amount?: number
          p_idempotency_key: string
          p_pos_transaction_id?: string
          p_scan_log_id?: string
          p_user_id: string
          p_venue_id: string
        }
        Returns: string
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
      operator_event_type:
        | "STATION_SWITCH"
        | "SHIFT_START"
        | "SHIFT_END"
        | "SCAN_PERFORMED"
        | "STATION_LOGIN"
        | "STATION_LOGOUT"
      operator_verification_type: "self_entered" | "pin" | "biometric_future"
      order_status:
        | "pending"
        | "sample_collected"
        | "result_received"
        | "result_received_locked"
        | "verified_active"
      result_status: "negative" | "positive" | "inconclusive"
      synth_decision:
        | "RELEASE_FULL"
        | "RELEASE_SAFE_PARTIAL"
        | "REFUSE"
        | "HUMAN_REVIEW_REQUIRED"
      synth_event_source: "console" | "extension" | "partner" | "api"
      synth_event_type:
        | "PROMPT_SUBMITTED"
        | "AUDIT_STARTED"
        | "AUDIT_COMPLETED"
        | "DECISION_VIEWED"
        | "SAFE_ANSWER_COPIED"
        | "SAFE_ANSWER_INSERTED"
        | "USER_ACCEPTED_REWRITE"
        | "USER_REJECTED_REWRITE"
        | "USER_EDITED_AND_RESUBMITTED"
        | "USER_CHANGED_RISKY_INTENT"
        | "HUMAN_REVIEW_REQUESTED"
        | "HUMAN_REVIEW_COMPLETED"
        | "HUMAN_REVIEW_OVERRULED"
        | "POLICY_BLOCK_TRIGGERED"
        | "INJECTION_PATTERN_DETECTED"
        | "TEMPLATE_DUPLICATION_DETECTED"
        | "ANOMALY_SCORE_SPIKE_DETECTED"
      synth_reason_code:
        | "HIGH_STABILITY_OVER_TIME"
        | "CONSISTENT_CONTRADICTION_AVOIDANCE"
        | "STRONG_EVIDENCE_DISCIPLINE"
        | "SAFE_REFRAME_BEHAVIOR"
        | "CALIBRATED_UNCERTAINTY"
        | "HIGH_ACCEPTANCE_OF_SAFE_REWRITES"
        | "HIGH_UNSUPPORTED_CLAIM_RATE"
        | "LOW_STABILITY_HIGH_VARIANCE"
        | "FREQUENT_POLICY_BOUNDARY_HITS"
        | "REPEATED_TEMPLATE_USAGE"
        | "INCONSISTENT_REVISIONS"
        | "OVERCONFIDENT_LANGUAGE_PATTERN"
        | "ESCALATED_DUE_TO_LOW_COHERENCE"
        | "ESCALATED_DUE_TO_LOW_VERIFICATION"
        | "REFUSED_DUE_TO_POLICY_BLOCK"
        | "RELEASED_SAFE_PARTIAL_DUE_TO_RESTRICTED_RISK"
      synth_risk_decision: "ALLOW" | "RESTRICT" | "BLOCK"
      test_type: "STD_PANEL" | "TOX_10_PANEL"
      think_tank_category:
        | "synth_standards"
        | "playbooks"
        | "decision_log"
        | "templates"
      venue_category:
        | "Nightlife"
        | "Gentlemen"
        | "Lifestyle"
        | "Resort"
        | "Spa"
        | "NFL Stadium"
        | "NBA Arena"
        | "MLB Stadium"
        | "NHL Arena"
        | "NCAA Stadium"
        | "MLS Stadium"
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
      operator_event_type: [
        "STATION_SWITCH",
        "SHIFT_START",
        "SHIFT_END",
        "SCAN_PERFORMED",
        "STATION_LOGIN",
        "STATION_LOGOUT",
      ],
      operator_verification_type: ["self_entered", "pin", "biometric_future"],
      order_status: [
        "pending",
        "sample_collected",
        "result_received",
        "result_received_locked",
        "verified_active",
      ],
      result_status: ["negative", "positive", "inconclusive"],
      synth_decision: [
        "RELEASE_FULL",
        "RELEASE_SAFE_PARTIAL",
        "REFUSE",
        "HUMAN_REVIEW_REQUIRED",
      ],
      synth_event_source: ["console", "extension", "partner", "api"],
      synth_event_type: [
        "PROMPT_SUBMITTED",
        "AUDIT_STARTED",
        "AUDIT_COMPLETED",
        "DECISION_VIEWED",
        "SAFE_ANSWER_COPIED",
        "SAFE_ANSWER_INSERTED",
        "USER_ACCEPTED_REWRITE",
        "USER_REJECTED_REWRITE",
        "USER_EDITED_AND_RESUBMITTED",
        "USER_CHANGED_RISKY_INTENT",
        "HUMAN_REVIEW_REQUESTED",
        "HUMAN_REVIEW_COMPLETED",
        "HUMAN_REVIEW_OVERRULED",
        "POLICY_BLOCK_TRIGGERED",
        "INJECTION_PATTERN_DETECTED",
        "TEMPLATE_DUPLICATION_DETECTED",
        "ANOMALY_SCORE_SPIKE_DETECTED",
      ],
      synth_reason_code: [
        "HIGH_STABILITY_OVER_TIME",
        "CONSISTENT_CONTRADICTION_AVOIDANCE",
        "STRONG_EVIDENCE_DISCIPLINE",
        "SAFE_REFRAME_BEHAVIOR",
        "CALIBRATED_UNCERTAINTY",
        "HIGH_ACCEPTANCE_OF_SAFE_REWRITES",
        "HIGH_UNSUPPORTED_CLAIM_RATE",
        "LOW_STABILITY_HIGH_VARIANCE",
        "FREQUENT_POLICY_BOUNDARY_HITS",
        "REPEATED_TEMPLATE_USAGE",
        "INCONSISTENT_REVISIONS",
        "OVERCONFIDENT_LANGUAGE_PATTERN",
        "ESCALATED_DUE_TO_LOW_COHERENCE",
        "ESCALATED_DUE_TO_LOW_VERIFICATION",
        "REFUSED_DUE_TO_POLICY_BLOCK",
        "RELEASED_SAFE_PARTIAL_DUE_TO_RESTRICTED_RISK",
      ],
      synth_risk_decision: ["ALLOW", "RESTRICT", "BLOCK"],
      test_type: ["STD_PANEL", "TOX_10_PANEL"],
      think_tank_category: [
        "synth_standards",
        "playbooks",
        "decision_log",
        "templates",
      ],
      venue_category: [
        "Nightlife",
        "Gentlemen",
        "Lifestyle",
        "Resort",
        "Spa",
        "NFL Stadium",
        "NBA Arena",
        "MLB Stadium",
        "NHL Arena",
        "NCAA Stadium",
        "MLS Stadium",
      ],
    },
  },
} as const
