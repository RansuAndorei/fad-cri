import { SKIPPED_ERROR_MESSAGES } from "@/utils/constants";
import { Database } from "@/utils/database";
import { ErrorTableInsert } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const insertError = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    errorTableRow: ErrorTableInsert;
  },
) => {
  const { errorTableRow } = params;
  if (SKIPPED_ERROR_MESSAGES.includes(errorTableRow.error_message)) {
    return;
  }

  const { error } = await supabaseClient.from("error_table").insert(errorTableRow);
  if (error) throw error;
};
