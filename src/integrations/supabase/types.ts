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
          facebook_handle: string | null
          full_name: string | null
          gender_identity: string | null
          health_document_uploaded_at: string | null
          health_document_url: string | null
          id: string
          instagram_handle: string | null
          member_id: string | null
          onlyfans_handle: string | null
          partner_preferences: Json | null
          payment_date: string | null
          payment_status: string | null
          phone: string | null
          profile_image_url: string | null
          qr_code_url: string | null
          relationship_status: string | null
          selected_interests: string[] | null
          sexual_orientation: string | null
          sexual_preferences: string | null
          smoker: boolean | null
          status_color: string | null
          std_acknowledgment: string | null
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
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          instagram_handle?: string | null
          member_id?: string | null
          onlyfans_handle?: string | null
          partner_preferences?: Json | null
          payment_date?: string | null
          payment_status?: string | null
          phone?: string | null
          profile_image_url?: string | null
          qr_code_url?: string | null
          relationship_status?: string | null
          selected_interests?: string[] | null
          sexual_orientation?: string | null
          sexual_preferences?: string | null
          smoker?: boolean | null
          status_color?: string | null
          std_acknowledgment?: string | null
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
          facebook_handle?: string | null
          full_name?: string | null
          gender_identity?: string | null
          health_document_uploaded_at?: string | null
          health_document_url?: string | null
          id?: string
          instagram_handle?: string | null
          member_id?: string | null
          onlyfans_handle?: string | null
          partner_preferences?: Json | null
          payment_date?: string | null
          payment_status?: string | null
          phone?: string | null
          profile_image_url?: string | null
          qr_code_url?: string | null
          relationship_status?: string | null
          selected_interests?: string[] | null
          sexual_orientation?: string | null
          sexual_preferences?: string | null
          smoker?: boolean | null
          status_color?: string | null
          std_acknowledgment?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_member_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
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
    },
  },
} as const
