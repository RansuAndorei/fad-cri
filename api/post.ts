import { SKIPPED_ERROR_MESSAGES } from "@/utils/constants";
import { Database } from "@/utils/database";
import { ErrorTableInsert } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const signUpUser = async (
  supabaseClient: SupabaseClient<Database>,
  params: { email: string; password: string },
) => {
  const { data, error } = await supabaseClient.auth.signUp(params);
  if (error) throw error;

  if (data.user && data.user.identities && data.user.identities?.length > 0) {
    return { data };
  } else {
    return { data, customError: "Email already registered." };
  }
};

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

export const resendEmail = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    email: string;
  },
) => {
  const { email } = params;
  const { error } = await supabaseClient.from("email_resend_table").insert({
    email_resend_email: email,
  });
  if (error) throw error;
};
