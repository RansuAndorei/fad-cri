import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const getServiceTypeList = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("service_type_table")
    .select("*")
    .eq("service_type_is_disabled", false)
    .eq("service_type_is_active", true)
    .order("service_type_label");
  if (error) throw error;
  return data;
};
