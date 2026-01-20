import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const checkServiceType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    serviceTypeLabel: string;
    currentId?: string;
  },
): Promise<boolean> => {
  const { serviceTypeLabel, currentId } = params;

  let query = supabaseClient
    .from("service_type_table")
    .select("*", { count: "exact", head: true })
    .eq("service_type_label", serviceTypeLabel)
    .eq("service_type_is_disabled", false);

  if (currentId) {
    query = query.not("service_type_id", "eq", currentId);
  }

  const { count, error } = await query;
  if (error) throw error;

  return count === 0;
};
