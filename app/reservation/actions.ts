import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchScheduleSlot = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient.from("schedule_slot_table").select("*");
  if (error) throw error;
  return data;
};

export const fetchAppointmentPerMonth = async (
  supabaseClient: SupabaseClient<Database>,
  params: { startOfMonth: string; endOfMonth: string },
) => {
  const { startOfMonth, endOfMonth } = params;

  const { data, error } = await supabaseClient
    .from("appointment_table")
    .select("appointment_schedule")
    .in("appointment_status", ["SCHEDULED", "COMPLETED"])
    .gte("appointment_schedule", startOfMonth)
    .lte("appointment_schedule", endOfMonth);
  if (error) throw error;
  return data;
};
