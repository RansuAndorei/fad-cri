import { Database } from "@/utils/database";
import { AppointmentStatusEnum, AppointmentTableType } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchAppointmentList = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    page: number;
    limit: number;
    sortStatus: {
      columnAccessor: string;
      direction: string;
    };
    userId: string | null;
    type: string | null;
    status: AppointmentStatusEnum | null;
    user: string | null;
  },
) => {
  const { data, error } = await supabaseClient.rpc("fetch_appointment_list", {
    input_data: {
      ...params,
      adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    },
  });
  if (error) throw error;
  return data as { data: AppointmentTableType[]; count: number };
};
