import { Database } from "@/utils/database";
import { FAQCategoryEnum, FAQTableInsert } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const insertFAQs = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    category: FAQCategoryEnum;
    faqs: FAQTableInsert[];
  },
) => {
  const { error } = await supabaseClient.rpc("upsert_faqs", { input_data: params });
  if (error) throw error;
};

export const fetchFAQs = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient.from("faq_table").select("*").order("faq_order");
  if (error) throw error;
  return data;
};
