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
      profiles: {
        Row: {
          birthday: string | null
          circumcised: boolean | null
          company_name: string | null
          covid_vaccinated: boolean | null
          created_at: string
          current_home_city: string | null
          disclaimer_accepted: boolean | null
          email_shareable: boolean | null
          facebook_handle: string | null
          full_name: string | null
          gender_identity: string | null
          health_document_uploaded_at: string | null
          health_document_url: string | null
          id: string
          instagram_handle: string | null
          lab_disclaimer_accepted: boolean | null
          lab_disclaimer_accepted_at: string | null
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
          relationship_status: string | null
          selected_interests: string[] | null
          sexual_orientation: string | null
          sexual_preferences: string | null
          smoker: boolean | null
          status_color: string | null
          std_acknowledgment: string | null
          std_acknowledgment_locked: boolean | null
          tiktok_handle: string | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          user_interests: Json | null
          user_references: string | null
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
          email_shareable?: boolean | null
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          instagram_handle?: string | null
          lab_disclaimer_accepted?: boolean | null
          lab_disclaimer_accepted_at?: string | null
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
          relationship_status?: string | null
          selected_interests?: string[] | null
          sexual_orientation?: string | null
          sexual_preferences?: string | null
          smoker?: boolean | null
          status_color?: string | null
          std_acknowledgment?: string | null
          std_acknowledgment_locked?: boolean | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          user_interests?: Json | null
          user_references?: string | null
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
          email_shareable?: boolean | null
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          instagram_handle?: string | null
          lab_disclaimer_accepted?: boolean | null
          lab_disclaimer_accepted_at?: string | null
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
          relationship_status?: string | null
          selected_interests?: string[] | null
          sexual_orientation?: string | null
          sexual_preferences?: string | null
          smoker?: boolean | null
          status_color?: string | null
          std_acknowledgment?: string | null
          std_acknowledgment_locked?: boolean | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          user_interests?: Json | null
          user_references?: string | null
          where_from?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    }
    Enums: {
      app_role:
        | "guest"
        | "registered"
        | "paid"
        | "active_member"
        | "administrator"
      order_status: "pending" | "sample_collected" | "result_received"
      result_status: "negative" | "positive" | "inconclusive"
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
      order_status: ["pending", "sample_collected", "result_received"],
      result_status: ["negative", "positive", "inconclusive"],
    },
  },
} as const
