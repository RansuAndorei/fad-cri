export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      address_table: {
        Row: {
          address_barangay: string
          address_city: string
          address_date_created: string
          address_id: string
          address_province: string
          address_region: string
          address_street: string
          address_zip_code: string
        }
        Insert: {
          address_barangay: string
          address_city: string
          address_date_created?: string
          address_id?: string
          address_province: string
          address_region: string
          address_street: string
          address_zip_code: string
        }
        Update: {
          address_barangay?: string
          address_city?: string
          address_date_created?: string
          address_id?: string
          address_province?: string
          address_region?: string
          address_street?: string
          address_zip_code?: string
        }
        Relationships: []
      }
      email_resend_table: {
        Row: {
          email_resend_date_created: string
          email_resend_email: string
          email_resend_id: string
        }
        Insert: {
          email_resend_date_created?: string
          email_resend_email: string
          email_resend_id?: string
        }
        Update: {
          email_resend_date_created?: string
          email_resend_email?: string
          email_resend_id?: string
        }
        Relationships: []
      }
      error_table: {
        Row: {
          error_date_created: string
          error_function: string
          error_id: string
          error_message: string
          error_url: string
          error_user_email: string | null
          error_user_id: string | null
        }
        Insert: {
          error_date_created?: string
          error_function: string
          error_id?: string
          error_message: string
          error_url: string
          error_user_email?: string | null
          error_user_id?: string | null
        }
        Update: {
          error_date_created?: string
          error_function?: string
          error_id?: string
          error_message?: string
          error_url?: string
          error_user_email?: string | null
          error_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_table_error_user_id_fkey"
            columns: ["error_user_id"]
            isOneToOne: false
            referencedRelation: "user_table"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_table: {
        Row: {
          user_address_id: string | null
          user_avatar: string | null
          user_birth_date: string | null
          user_date_created: string
          user_email: string
          user_first_name: string
          user_gender: Database["public"]["Enums"]["gender"] | null
          user_id: string
          user_is_disabled: boolean
          user_last_name: string
          user_phone_number: string | null
        }
        Insert: {
          user_address_id?: string | null
          user_avatar?: string | null
          user_birth_date?: string | null
          user_date_created?: string
          user_email: string
          user_first_name: string
          user_gender?: Database["public"]["Enums"]["gender"] | null
          user_id?: string
          user_is_disabled?: boolean
          user_last_name: string
          user_phone_number?: string | null
        }
        Update: {
          user_address_id?: string | null
          user_avatar?: string | null
          user_birth_date?: string | null
          user_date_created?: string
          user_email?: string
          user_first_name?: string
          user_gender?: Database["public"]["Enums"]["gender"] | null
          user_id?: string
          user_is_disabled?: boolean
          user_last_name?: string
          user_phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_table_user_address_id_fkey"
            columns: ["user_address_id"]
            isOneToOne: false
            referencedRelation: "address_table"
            referencedColumns: ["address_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_email_resend_timer: {
        Args: { input_data: Json }
        Returns: Json
      }
    }
    Enums: {
      gender: "MALE" | "FEMALE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender: ["MALE", "FEMALE"],
    },
  },
} as const
