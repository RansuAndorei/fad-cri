import { Database } from "@/utils/database";
import { AppointmentStatusEnum, AppointmentTableType } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getAppointmentList = async (
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
  },
) => {
  const { page, limit, sortStatus, userId, type, status } = params;

  let query = supabaseClient
    .from("appointment_table")
    .select("*, appointment_detail: appointment_detail_table!inner(*)", { count: "exact" })
    .eq("appointment_is_disabled", false);
  if (userId) {
    query = query.eq("appointment_user_id", userId);
  }
  if (type) {
    query = query.eq("appointment_detail.appointment_detail_type", type);
  }
  if (status) {
    query = query.eq("appointment_status", status);
  }
  query = query.order(sortStatus.columnAccessor, { ascending: sortStatus.direction === "asc" });
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return { data: data as AppointmentTableType[], count: count ?? 0 };
};
