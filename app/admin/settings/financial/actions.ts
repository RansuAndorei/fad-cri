import { Database } from "@/utils/database";
import { SettingsEnum } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchFinancialSettings = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("system_setting_table")
    .select("system_setting_key, system_setting_value")
    .in("system_setting_key", [
      "BOOKING_FEE",
      "MAX_SCHEDULE_DATE_MONTH",
      "LATE_FEE_1",
      "LATE_FEE_2",
      "LATE_FEE_3",
      "LATE_FEE_4",
    ]);

  if (error) throw error;

  return data.reduce<Record<SettingsEnum, string>>(
    (acc, row) => {
      acc[row.system_setting_key as SettingsEnum] = row.system_setting_value;
      return acc;
    },
    {} as Record<SettingsEnum, string>,
  );
};
