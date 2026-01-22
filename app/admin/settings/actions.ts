import { Database } from "@/utils/database";
import { SettingsEnum } from "@/utils/types";
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

export const fetchSystemSettings = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    keyList: SettingsEnum[];
  },
) => {
  const { keyList } = params;
  const { data, error } = await supabaseClient
    .from("system_setting_table")
    .select("*")
    .in("system_setting_key", keyList);
  if (error) throw error;

  const dataMap = new Map(data.map((item) => [item.system_setting_key, item]));
  const missingKeys = keyList.filter((key) => !dataMap.has(key));
  if (missingKeys.length > 0) {
    throw new Error(`Missing system settings: ${missingKeys.join(", ")}`);
  }

  return keyList.reduce<Record<SettingsEnum, (typeof data)[number]>>(
    (acc, key) => {
      acc[key] = dataMap.get(key)!;
      return acc;
    },
    {} as Record<SettingsEnum, (typeof data)[number]>,
  );
};
