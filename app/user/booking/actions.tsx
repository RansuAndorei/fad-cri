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

export const getServerTime = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient.rpc("get_server_time");
  if (error) throw error;
  return data;
};

export const getAppointmentType = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("appointment_type_table")
    .select("appointment_type_label");
  if (error) throw error;
  if (!data) throw new Error("No appointment types found");
  return data.map((item) => item.appointment_type_label);
};
