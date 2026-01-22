import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const insertReminders = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    reminders: { order: number; value: string }[];
  },
) => {
  const { error } = await supabaseClient.rpc("upsert_reminders", { input_data: params });
  if (error) throw error;
};

export const fetchReminders = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("reminder_table")
    .select("*")
    .order("reminder_order");
  if (error) throw error;
  return data;
};
