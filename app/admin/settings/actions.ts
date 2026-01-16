import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const updateSettings = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    settings: {
      system_setting_key: string;
      system_setting_value: string;
    }[];
  },
) => {
  const { error } = await supabaseClient.rpc("update_system_settings", { input_data: params });
  if (error) throw error;
};
