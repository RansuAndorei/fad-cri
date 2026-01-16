import { Database } from "@/utils/database";
import { AppointmentTableUpdate, PaymentTableUpdate } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const updatePayment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    paymentData: PaymentTableUpdate;
    paymentIntentId: string;
  },
) => {
  const { paymentData, paymentIntentId } = params;
  const { error } = await supabaseClient
    .from("payment_table")
    .update(paymentData)
    .eq("payment_intent_id", paymentIntentId);
  if (error) throw error;
};

export const updateAppointment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    appointmentData: AppointmentTableUpdate;
    appointmentId: string;
  },
) => {
  const { appointmentData, appointmentId } = params;
  const { error } = await supabaseClient
    .from("appointment_table")
    .update(appointmentData)
    .eq("appointment_id", appointmentId);
  if (error) throw error;
};
