import { Database } from "@/utils/database";
import { ScheduleSlotTableRow } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchScheduleList = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("schedule_slot_table")
    .select("*")
    .order("schedule_slot_time");
  if (error) throw error;

  return data;
};

export const updateScheduleSlots = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    scheduleSlots: ScheduleSlotTableRow[];
  },
) => {
  const { error } = await supabaseClient.rpc("upsert_schedule_slot", { input_data: params });
  if (error) throw error;
};
