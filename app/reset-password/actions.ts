import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const resetPassword = async (supabaseClient: SupabaseClient<Database>, password: string) => {
  const { error } = await supabaseClient.auth.updateUser({ password });
  return { error: error };
};
