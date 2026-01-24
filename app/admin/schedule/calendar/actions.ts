import { getServerTime } from "@/app/user/booking/actions";
import { Database } from "@/utils/database";
import { AppointmentType, AttachmentTableInsert, ScheduleType } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchSchedule = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    startDate: string;
    endDate: string;
  },
) => {
  const { data, error } = await supabaseClient.rpc("get_schedule", {
    input_data: params,
  });
  if (error) throw error;

  return data as ScheduleType[];
};

export const fetchAppointmentDatabyAdmin = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentId: string;
  },
) => {
  const { data, error } = await supabaseClient.rpc("get_appointment_by_admin", {
    input_data: params,
  });
  if (error) throw error;
  return data as AppointmentType;
};

export const cancelAppointment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentId: string;
  },
) => {
  const { appointmentId } = params;
  const serverTime = await getServerTime(supabaseClient);
  const { error } = await supabaseClient
    .from("appointment_table")
    .update({
      appointment_date_updated: serverTime,
      appointment_status: "CANCELLED",
    })
    .eq("appointment_id", appointmentId);
  if (error) throw error;
};

export const completeSchedule = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentId: string;
    price: number;
    imageData: AttachmentTableInsert;
  },
) => {
  const { error } = await supabaseClient.rpc("complete_schedule", {
    input_data: params,
  });
  if (error) throw error;
};

export const fetchBlockedSchedules = async (
  supabaseClient: SupabaseClient<Database>,
  params: { startDate: string; endDate: string },
) => {
  const { startDate, endDate } = params;
  const { data, error } = await supabaseClient
    .from("blocked_schedule_table")
    .select("*")
    .gte("blocked_schedule_date", startDate)
    .lte("blocked_schedule_date", endDate);
  if (error) throw error;
  return data;
};

export const upsertBlockedSchedule = async (
  supabaseClient: SupabaseClient<Database>,
  params: { day: string; time: string | null },
) => {
  const { day, time } = params;
  const { error } = await supabaseClient.from("blocked_schedule_table").upsert(
    {
      blocked_schedule_date: day,
      blocked_schedule_time: time,
    },
    { ignoreDuplicates: true },
  );
  if (error) throw error;
};

export const deleteBlockedSchedule = async (
  supabaseClient: SupabaseClient<Database>,
  params: { day: string; time: string | null },
) => {
  const { day, time } = params;
  let query = supabaseClient
    .from("blocked_schedule_table")
    .delete()
    .eq("blocked_schedule_date", day);

  if (time === null) {
    query = query.is("blocked_schedule_time", null);
  } else {
    query = query.eq("blocked_schedule_time", time);
  }
  const { error } = await query;
  if (error) throw error;
};
