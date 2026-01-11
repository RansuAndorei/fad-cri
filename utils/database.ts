export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      appointment_detail_table: {
        Row: {
          appointment_detail_appointment_id: string;
          appointment_detail_id: string;
          appointment_detail_is_removal_done_by_fad_cri: boolean;
          appointment_detail_is_with_removal: boolean;
          appointment_detail_type: string;
        };
        Insert: {
          appointment_detail_appointment_id: string;
          appointment_detail_id?: string;
          appointment_detail_is_removal_done_by_fad_cri?: boolean;
          appointment_detail_is_with_removal: boolean;
          appointment_detail_type: string;
        };
        Update: {
          appointment_detail_appointment_id?: string;
          appointment_detail_id?: string;
          appointment_detail_is_removal_done_by_fad_cri?: boolean;
          appointment_detail_is_with_removal?: boolean;
          appointment_detail_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointment_detail_table_appointment_detail_appointment_id_fkey";
            columns: ["appointment_detail_appointment_id"];
            isOneToOne: true;
            referencedRelation: "appointment_table";
            referencedColumns: ["appointment_id"];
          },
        ];
      };
      appointment_table: {
        Row: {
          appointment_date_created: string;
          appointment_date_updated: string | null;
          appointment_id: string;
          appointment_is_disabled: boolean;
          appointment_is_rescheduled: boolean;
          appointment_schedule: string;
          appointment_schedule_note: string | null;
          appointment_status: Database["public"]["Enums"]["appointment_status"];
          appointment_user_id: string;
        };
        Insert: {
          appointment_date_created?: string;
          appointment_date_updated?: string | null;
          appointment_id?: string;
          appointment_is_disabled?: boolean;
          appointment_is_rescheduled?: boolean;
          appointment_schedule: string;
          appointment_schedule_note?: string | null;
          appointment_status?: Database["public"]["Enums"]["appointment_status"];
          appointment_user_id: string;
        };
        Update: {
          appointment_date_created?: string;
          appointment_date_updated?: string | null;
          appointment_id?: string;
          appointment_is_disabled?: boolean;
          appointment_is_rescheduled?: boolean;
          appointment_schedule?: string;
          appointment_schedule_note?: string | null;
          appointment_status?: Database["public"]["Enums"]["appointment_status"];
          appointment_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointment_table_appointment_user_id_fkey";
            columns: ["appointment_user_id"];
            isOneToOne: false;
            referencedRelation: "user_table";
            referencedColumns: ["user_id"];
          },
        ];
      };
      appointment_type_table: {
        Row: {
          appointment_type_created: string;
          appointment_type_id: string;
          appointment_type_label: string;
        };
        Insert: {
          appointment_type_created?: string;
          appointment_type_id?: string;
          appointment_type_label: string;
        };
        Update: {
          appointment_type_created?: string;
          appointment_type_id?: string;
          appointment_type_label?: string;
        };
        Relationships: [];
      };
      attachment_table: {
        Row: {
          attachment_bucket: string;
          attachment_date_created: string;
          attachment_id: string;
          attachment_is_disabled: boolean;
          attachment_mime_type: string | null;
          attachment_name: string;
          attachment_path: string;
          attachment_size: number | null;
        };
        Insert: {
          attachment_bucket: string;
          attachment_date_created?: string;
          attachment_id?: string;
          attachment_is_disabled?: boolean;
          attachment_mime_type?: string | null;
          attachment_name: string;
          attachment_path: string;
          attachment_size?: number | null;
        };
        Update: {
          attachment_bucket?: string;
          attachment_date_created?: string;
          attachment_id?: string;
          attachment_is_disabled?: boolean;
          attachment_mime_type?: string | null;
          attachment_name?: string;
          attachment_path?: string;
          attachment_size?: number | null;
        };
        Relationships: [];
      };
      email_resend_table: {
        Row: {
          email_resend_date_created: string;
          email_resend_email: string;
          email_resend_id: string;
        };
        Insert: {
          email_resend_date_created?: string;
          email_resend_email: string;
          email_resend_id?: string;
        };
        Update: {
          email_resend_date_created?: string;
          email_resend_email?: string;
          email_resend_id?: string;
        };
        Relationships: [];
      };
      error_table: {
        Row: {
          error_date_created: string;
          error_function: string;
          error_id: string;
          error_message: string;
          error_url: string;
          error_user_email: string | null;
          error_user_id: string | null;
        };
        Insert: {
          error_date_created?: string;
          error_function: string;
          error_id?: string;
          error_message: string;
          error_url: string;
          error_user_email?: string | null;
          error_user_id?: string | null;
        };
        Update: {
          error_date_created?: string;
          error_function?: string;
          error_id?: string;
          error_message?: string;
          error_url?: string;
          error_user_email?: string | null;
          error_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "error_table_error_user_id_fkey";
            columns: ["error_user_id"];
            isOneToOne: false;
            referencedRelation: "user_table";
            referencedColumns: ["user_id"];
          },
        ];
      };
      payment_table: {
        Row: {
          payment_amount: number;
          payment_appointment_id: string;
          payment_checkout_id: string | null;
          payment_checkout_url: string | null;
          payment_currency: string;
          payment_date_created: string;
          payment_date_paid: string | null;
          payment_date_updated: string;
          payment_description: string | null;
          payment_external_id: string | null;
          payment_failure_code: string | null;
          payment_failure_message: string | null;
          payment_id: string;
          payment_intent_id: string | null;
          payment_method: string;
          payment_status: Database["public"]["Enums"]["payment_status"];
        };
        Insert: {
          payment_amount: number;
          payment_appointment_id: string;
          payment_checkout_id?: string | null;
          payment_checkout_url?: string | null;
          payment_currency?: string;
          payment_date_created?: string;
          payment_date_paid?: string | null;
          payment_date_updated?: string;
          payment_description?: string | null;
          payment_external_id?: string | null;
          payment_failure_code?: string | null;
          payment_failure_message?: string | null;
          payment_id?: string;
          payment_intent_id?: string | null;
          payment_method: string;
          payment_status: Database["public"]["Enums"]["payment_status"];
        };
        Update: {
          payment_amount?: number;
          payment_appointment_id?: string;
          payment_checkout_id?: string | null;
          payment_checkout_url?: string | null;
          payment_currency?: string;
          payment_date_created?: string;
          payment_date_paid?: string | null;
          payment_date_updated?: string;
          payment_description?: string | null;
          payment_external_id?: string | null;
          payment_failure_code?: string | null;
          payment_failure_message?: string | null;
          payment_id?: string;
          payment_intent_id?: string | null;
          payment_method?: string;
          payment_status?: Database["public"]["Enums"]["payment_status"];
        };
        Relationships: [
          {
            foreignKeyName: "payment_table_payment_appointment_id_fkey";
            columns: ["payment_appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointment_table";
            referencedColumns: ["appointment_id"];
          },
        ];
      };
      reminder_table: {
        Row: {
          reminder_date_created: string;
          reminder_id: string;
          reminder_order: number;
          reminder_value: string;
        };
        Insert: {
          reminder_date_created?: string;
          reminder_id?: string;
          reminder_order: number;
          reminder_value: string;
        };
        Update: {
          reminder_date_created?: string;
          reminder_id?: string;
          reminder_order?: number;
          reminder_value?: string;
        };
        Relationships: [];
      };
      schedule_slot_table: {
        Row: {
          schedule_slot_day: Database["public"]["Enums"]["day"];
          schedule_slot_id: string;
          schedule_slot_note: string | null;
          schedule_slot_time: string;
        };
        Insert: {
          schedule_slot_day: Database["public"]["Enums"]["day"];
          schedule_slot_id?: string;
          schedule_slot_note?: string | null;
          schedule_slot_time: string;
        };
        Update: {
          schedule_slot_day?: Database["public"]["Enums"]["day"];
          schedule_slot_id?: string;
          schedule_slot_note?: string | null;
          schedule_slot_time?: string;
        };
        Relationships: [];
      };
      system_setting_table: {
        Row: {
          system_setting_date_created: string;
          system_setting_date_updated: string | null;
          system_setting_id: string;
          system_setting_key: string;
          system_setting_value: string;
        };
        Insert: {
          system_setting_date_created?: string;
          system_setting_date_updated?: string | null;
          system_setting_id?: string;
          system_setting_key: string;
          system_setting_value: string;
        };
        Update: {
          system_setting_date_created?: string;
          system_setting_date_updated?: string | null;
          system_setting_id?: string;
          system_setting_key?: string;
          system_setting_value?: string;
        };
        Relationships: [];
      };
      user_table: {
        Row: {
          user_avatar: string | null;
          user_birth_date: string;
          user_date_created: string;
          user_email: string;
          user_first_name: string;
          user_gender: Database["public"]["Enums"]["gender"];
          user_id: string;
          user_is_disabled: boolean;
          user_last_name: string;
          user_phone_number: string;
        };
        Insert: {
          user_avatar?: string | null;
          user_birth_date: string;
          user_date_created?: string;
          user_email: string;
          user_first_name: string;
          user_gender: Database["public"]["Enums"]["gender"];
          user_id?: string;
          user_is_disabled?: boolean;
          user_last_name: string;
          user_phone_number: string;
        };
        Update: {
          user_avatar?: string | null;
          user_birth_date?: string;
          user_date_created?: string;
          user_email?: string;
          user_first_name?: string;
          user_gender?: Database["public"]["Enums"]["gender"];
          user_id?: string;
          user_is_disabled?: boolean;
          user_last_name?: string;
          user_phone_number?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_appointment: { Args: { input_data: Json }; Returns: Json };
      get_appointment_by_admin: { Args: { input_data: Json }; Returns: Json };
      get_appointment_status_count: {
        Args: { input_data: Json };
        Returns: Json;
      };
      get_appointment_status_monthly_count: {
        Args: { input_data: Json };
        Returns: Json;
      };
      get_appointment_total_count: {
        Args: { input_data: Json };
        Returns: number;
      };
      get_dashboard_client_list: { Args: { input_data: Json }; Returns: Json };
      get_dashboard_type_list: { Args: { input_data: Json }; Returns: Json };
      get_email_resend_timer: { Args: { input_data: Json }; Returns: number };
      get_schedule: { Args: { input_data: Json }; Returns: Json };
      get_server_time: { Args: never; Returns: string };
      insert_appointment: { Args: { input_data: Json }; Returns: string };
      upsert_reminders: { Args: { input_data: Json }; Returns: undefined };
    };
    Enums: {
      appointment_status: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
      day: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
      gender: "MALE" | "FEMALE" | "OTHER";
      payment_status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"],
      day: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
      gender: ["MALE", "FEMALE", "OTHER"],
      payment_status: ["PENDING", "PAID", "FAILED", "CANCELLED"],
    },
  },
} as const;
