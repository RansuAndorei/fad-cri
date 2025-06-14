import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const checkIfEmailExists = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    email: string;
  },
) => {
  const { count, error } = await supabaseClient
    .from("user_table")
    .select("*", { head: true })
    .eq("user_email", params.email);
  if (error) throw error;
  return Boolean(count);
};

export const getEmailResendTimer = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    email: string;
  },
) => {
  const { data, error } = await supabaseClient.rpc("get_email_resend_timer", {
    input_data: params,
  });
  if (error) throw error;

  return data as number;
};
