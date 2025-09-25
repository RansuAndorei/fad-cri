import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const getBookingFee = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("system_setting_table")
    .select("system_setting_value")
    .eq("system_setting_key", "BOOKING_FEE")
    .single();
  if (error) throw error;
  return Number(data.system_setting_value);
};
