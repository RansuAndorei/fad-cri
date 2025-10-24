import { Database } from "@/utils/database";
import { AppointmentType, ScheduleType } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getSchedule = async (
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

export const getAppointmentDatabyAdmin = async (
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
