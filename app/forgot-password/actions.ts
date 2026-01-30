import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const sendResetPasswordEmail = async (
  supabaseClient: SupabaseClient<Database>,
  email: string,
) => {
  await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });
};
