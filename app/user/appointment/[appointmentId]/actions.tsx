import { Database } from "@/utils/database";
import { AppointmentType } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getAppointmentData = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentId: string;
    userId: string;
    isCancelled: boolean;
  },
) => {
  const { data, error } = await supabaseClient.rpc("get_appointment", {
    input_data: params,
  });
  if (error) throw error;
  return data as AppointmentType;
};
