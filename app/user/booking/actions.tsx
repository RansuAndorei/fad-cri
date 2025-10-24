import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";
import moment from "moment";

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

export const getScheduleSlot = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient.from("schedule_slot_table").select("*");
  if (error) throw error;
  return data;
};

export const getMaxScheduleDate = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("system_setting_table")
    .select("system_setting_value")
    .eq("system_setting_key", "MAX_SCHEDULE_DATE")
    .single();
  if (error) throw error;
  return Number(data.system_setting_value);
};

export const getDateAppointments = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    date: string;
  },
) => {
  const { date } = params;

  const startOfDay = moment(date).startOf("day").utcOffset(8).toISOString();
  const endOfDay = moment(date).endOf("day").utcOffset(8).toISOString();

  const { data, error } = await supabaseClient
    .from("appointment_table")
    .select("appointment_schedule")
    .gte("appointment_schedule", startOfDay)
    .lte("appointment_schedule", endOfDay)
    .in("appointment_status", ["SCHEDULED", "COMPLETED"])
    .order("appointment_schedule");
  if (error) throw error;
  const timeList = data.map((item) =>
    moment(item.appointment_schedule).utcOffset(8).format("HH:mm:ss+08"),
  );
  return timeList;
};
