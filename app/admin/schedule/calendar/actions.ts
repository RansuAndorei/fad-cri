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
