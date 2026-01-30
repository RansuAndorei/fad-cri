import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchFAQList = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient.from("faq_table").select("*").order("faq_order");
  if (error) throw error;
  return data;
};
