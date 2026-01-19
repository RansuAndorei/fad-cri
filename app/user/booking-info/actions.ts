import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const getBookingInfoSystemSettings = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("system_setting_table")
    .select("*")
    .in("system_setting_key", [
      "BOOKING_FEE",
      "LATE_FEE_1",
      "LATE_FEE_2",
      "LATE_FEE_3",
      "LATE_FEE_4",
    ]);
  if (error) throw error;

  return data;
};
