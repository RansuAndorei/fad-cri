import { Database } from "@/utils/database";
import { ServiceTypeTableInsert, ServiceTypeTableUpdate } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getServiceTypeSettings = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("service_type_table")
    .select("*")
    .eq("service_type_is_disabled", false)
    .order("service_type_label");
  if (error) throw error;

  return data;
};

export const deleteServiceType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    serviceTypeId: string;
  },
) => {
  const { serviceTypeId } = params;

  const { error } = await supabaseClient
    .from("service_type_table")
    .update({
      service_type_is_disabled: true,
    })
    .eq("service_type_id", serviceTypeId);
  if (error) throw error;
};

export const insertServiceType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    serviceTypeData: ServiceTypeTableInsert;
  },
) => {
  const { serviceTypeData } = params;
  const { data, error } = await supabaseClient
    .from("service_type_table")
    .insert(serviceTypeData)
    .select("service_type_id")
    .single();
  if (error) throw error;
  return data.service_type_id;
};

export const updateServiceType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    serviceTypeId: string;
    serviceTypeData: ServiceTypeTableUpdate;
  },
) => {
  const { serviceTypeId, serviceTypeData } = params;
  const { error } = await supabaseClient
    .from("service_type_table")
    .update(serviceTypeData)
    .eq("service_type_id", serviceTypeId);
  if (error) throw error;
};
