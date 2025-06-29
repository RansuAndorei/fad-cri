import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const signInUser = async (
  supabaseClient: SupabaseClient<Database>,
  params: { email: string; password: string },
) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    ...params,
  });

  return { data, error };
};
