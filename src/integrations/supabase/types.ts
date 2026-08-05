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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ad_spend: {
        Row: {
          campaign: string | null
          clicks: number | null
          created_at: string
          currency: string | null
          date: string
          id: string
          impressions: number | null
          notes: string | null
          source: string
          spend: number
          updated_at: string
        }
        Insert: {
          campaign?: string | null
          clicks?: number | null
          created_at?: string
          currency?: string | null
          date: string
          id?: string
          impressions?: number | null
          notes?: string | null
          source: string
          spend?: number
          updated_at?: string
        }
        Update: {
          campaign?: string | null
          clicks?: number | null
          created_at?: string
          currency?: string | null
          date?: string
          id?: string
          impressions?: number | null
          notes?: string | null
          source?: string
          spend?: number
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          currency: string | null
          duration_seconds: number | null
          event_type: string
          exit_destination: string | null
          id: string
          is_returning_visitor: boolean | null
          order_id: string | null
          order_total: number | null
          page_path: string | null
          price: number | null
          product_handle: string | null
          product_id: string | null
          product_title: string | null
          quantity: number | null
          referrer: string | null
          screen_width: number | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant_id: string | null
          variant_title: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          duration_seconds?: number | null
          event_type: string
          exit_destination?: string | null
          id?: string
          is_returning_visitor?: boolean | null
          order_id?: string | null
          order_total?: number | null
          page_path?: string | null
          price?: number | null
          product_handle?: string | null
          product_id?: string | null
          product_title?: string | null
          quantity?: number | null
          referrer?: string | null
          screen_width?: number | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          variant_title?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          duration_seconds?: number | null
          event_type?: string
          exit_destination?: string | null
          id?: string
          is_returning_visitor?: boolean | null
          order_id?: string | null
          order_total?: number | null
          page_path?: string | null
          price?: number | null
          product_handle?: string | null
          product_id?: string | null
          product_title?: string | null
          quantity?: number | null
          referrer?: string | null
          screen_width?: number | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          variant_title?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string
          category_id: string
          content: string
          created_at: string
          date: string
          excerpt: string
          faq: Json | null
          fb_caption: string | null
          id: string
          ig_caption: string | null
          image: string | null
          is_social_synced: boolean
          li_caption: string | null
          meta_description: string
          published: boolean
          read_time: number
          related_product_handles: string[] | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          category_id: string
          content: string
          created_at?: string
          date?: string
          excerpt: string
          faq?: Json | null
          fb_caption?: string | null
          id?: string
          ig_caption?: string | null
          image?: string | null
          is_social_synced?: boolean
          li_caption?: string | null
          meta_description: string
          published?: boolean
          read_time?: number
          related_product_handles?: string[] | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          category_id?: string
          content?: string
          created_at?: string
          date?: string
          excerpt?: string
          faq?: Json | null
          fb_caption?: string | null
          id?: string
          ig_caption?: string | null
          image?: string | null
          is_social_synced?: boolean
          li_caption?: string | null
          meta_description?: string
          published?: boolean
          read_time?: number
          related_product_handles?: string[] | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          activity: number | null
          age: number | null
          created_at: string
          days: number | null
          email: string | null
          flavor: string | null
          gender: string | null
          goal: string | null
          height: number | null
          id: string
          kosher: boolean | null
          name: string
          phone: string
          target_calories: number | null
          weight: number | null
        }
        Insert: {
          activity?: number | null
          age?: number | null
          created_at?: string
          days?: number | null
          email?: string | null
          flavor?: string | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          kosher?: boolean | null
          name: string
          phone: string
          target_calories?: number | null
          weight?: number | null
        }
        Update: {
          activity?: number | null
          age?: number | null
          created_at?: string
          days?: number | null
          email?: string | null
          flavor?: string | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          kosher?: boolean | null
          name?: string
          phone?: string
          target_calories?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          form_data: Json | null
          id: string
          lead_id: string | null
          results_data: Json | null
        }
        Insert: {
          created_at?: string
          form_data?: Json | null
          id?: string
          lead_id?: string | null
          results_data?: Json | null
        }
        Update: {
          created_at?: string
          form_data?: Json | null
          id?: string
          lead_id?: string | null
          results_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "plans_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          is_approved: boolean
          is_verified_purchase: boolean
          product_handle: string
          rating: number
          reviewer_email: string | null
          reviewer_name: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_handle: string
          rating: number
          reviewer_email?: string | null
          reviewer_name: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_handle?: string
          rating?: number
          reviewer_email?: string | null
          reviewer_name?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          badges: string[]
          calories: number
          category: string
          created_at: string
          emoji: string
          id: string
          image_url: string | null
          ingredients: string[]
          prep_minutes: number
          product_handle: string
          product_name: string
          protein: number
          published: boolean
          sort_order: number
          steps: string[]
          title: string
          updated_at: string
        }
        Insert: {
          badges?: string[]
          calories?: number
          category: string
          created_at?: string
          emoji?: string
          id: string
          image_url?: string | null
          ingredients?: string[]
          prep_minutes?: number
          product_handle?: string
          product_name?: string
          protein?: number
          published?: boolean
          sort_order?: number
          steps?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          badges?: string[]
          calories?: number
          category?: string
          created_at?: string
          emoji?: string
          id?: string
          image_url?: string | null
          ingredients?: string[]
          prep_minutes?: number
          product_handle?: string
          product_name?: string
          protein?: number
          published?: boolean
          sort_order?: number
          steps?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
