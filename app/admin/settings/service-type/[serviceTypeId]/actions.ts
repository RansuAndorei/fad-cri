import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const getServiceType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    serviceTypeId: string;
  },
) => {
  const { serviceTypeId } = params;
  const { data, error } = await supabaseClient
    .from("service_type_table")
    .select("*")
    .eq("service_type_is_disabled", false)
    .eq("service_type_id", serviceTypeId)
    .single();
  if (error) throw error;
  return data;
};
