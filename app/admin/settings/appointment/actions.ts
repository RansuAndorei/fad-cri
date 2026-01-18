import { getServerTime } from "@/app/user/booking/actions";
import { Database } from "@/utils/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const getAppointmentTypeSettings = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("appointment_type_table")
    .select("*")
    .eq("appointment_type_is_disabled", false)
    .order("appointment_type_label");
  if (error) throw error;

  return data;
};

export const checkAppointmentType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentTypeLabel: string;
    currentId?: string;
  },
): Promise<boolean> => {
  const { appointmentTypeLabel, currentId } = params;

  let query = supabaseClient
    .from("appointment_type_table")
    .select("*", { count: "exact", head: true })
    .eq("appointment_type_label", appointmentTypeLabel)
    .eq("appointment_type_is_disabled", false);

  if (currentId) {
    query = query.not("appointment_type_id", "eq", currentId);
  }

  const { count, error } = await query;
  if (error) throw error;

  return count === 0;
};

export const insertAppointmentType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentTypeLabel: string;
    isActive: boolean;
  },
) => {
  const { appointmentTypeLabel, isActive } = params;

  const { error } = await supabaseClient.from("appointment_type_table").insert({
    appointment_type_label: appointmentTypeLabel,
    appointment_type_is_active: isActive,
  });
  if (error) throw error;
};

export const deleteAppointmentType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentTypeId: string;
  },
) => {
  const { appointmentTypeId } = params;

  const { error } = await supabaseClient
    .from("appointment_type_table")
    .update({
      appointment_type_is_disabled: true,
    })
    .eq("appointment_type_id", appointmentTypeId);
  if (error) throw error;
};

export const updateAppointmentType = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    id: string;
    appointmentTypeLabel: string;
    isActive: boolean;
  },
) => {
  const { id, appointmentTypeLabel, isActive } = params;

  const currentDate = await getServerTime(supabaseClient);
  const { error } = await supabaseClient
    .from("appointment_type_table")
    .update({
      appointment_type_label: appointmentTypeLabel,
      appointment_type_is_active: isActive,
      appointment_type_date_updated: currentDate,
    })
    .eq("appointment_type_id", id);
  if (error) throw error;
};
