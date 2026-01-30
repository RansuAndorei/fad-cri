import { DATE_AND_TIME_FORMAT, TIME_FORMAT } from "@/utils/constants";
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

export const fetchServiceTypeList = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("service_type_table")
    .select("*")
    .eq("service_type_is_disabled", false)
    .order("service_type_label");
  if (error) throw error;
  if (!data) throw new Error("No service types found");
  return data;
};

export const fetchScheduleSlot = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient.from("schedule_slot_table").select("*");
  if (error) throw error;
  return data;
};

export const getMaxScheduleDate = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("system_setting_table")
    .select("system_setting_value")
    .eq("system_setting_key", "MAX_SCHEDULE_DATE_MONTH")
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

  const startOfDay = moment(date).startOf("day").format(DATE_AND_TIME_FORMAT);
  const endOfDay = moment(date).endOf("day").format(DATE_AND_TIME_FORMAT);

  const serverTime = await getServerTime(supabaseClient);
  const serverTimestamp = new Date(serverTime).getTime();
  const fiveMinutesAgo = new Date(serverTimestamp - 5 * 60 * 1000).toISOString();

  const { data, error } = await supabaseClient
    .from("appointment_table")
    .select("appointment_schedule")
    .gte("appointment_schedule", startOfDay)
    .lte("appointment_schedule", endOfDay)
    .or(
      `appointment_status.eq.SCHEDULED,appointment_status.eq.COMPLETED,and(appointment_status.eq.PENDING,appointment_date_created.gte.'${fiveMinutesAgo}')`,
    )
    .order("appointment_schedule");
  if (error) throw error;
  const timeList = data.map((item) => moment(item.appointment_schedule).format(TIME_FORMAT));
  return timeList;
};

export const fetchReminders = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("reminder_table")
    .select("*")
    .order("reminder_order");
  if (error) throw error;
  return data;
};

export const recheckSchedule = async (
  supabaseClient: SupabaseClient<Database>,
  params: { schedule: string },
) => {
  const { schedule } = params;

  const serverTime = await getServerTime(supabaseClient);
  const serverTimestamp = new Date(serverTime).getTime();
  const fiveMinutesAgo = new Date(serverTimestamp - 5 * 60 * 1000).toISOString();

  const { count, error } = await supabaseClient
    .from("appointment_table")
    .select("*", { count: "exact", head: true })
    .eq("appointment_schedule", schedule)
    .or(
      `appointment_status.eq.SCHEDULED,appointment_status.eq.COMPLETED,and(appointment_status.eq.PENDING,appointment_date_created.gte.'${fiveMinutesAgo}')`,
    )
    .limit(1);
  if (error) throw error;

  return !count;
};
