import { Database } from "@/utils/database";
import { combineDateTime } from "@/utils/functions";
import { BookingFormValues, PaymentTableInsert } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const insertAppointment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    bookingData: Omit<BookingFormValues, "inspoLeft" | "inspoRight">;
    inspoData: { hand: string; finger: string; imageUrl: string };
    userId: string;
  },
) => {
  const { bookingData, inspoData, userId } = params;
  const { scheduleDate, scheduleTime, removal, removalType } = bookingData;

  if (!scheduleDate) throw new Error("Missing Schedule Date.");
  const { data, error } = await supabaseClient.rpc("insert_appointment", {
    input_data: {
      ...bookingData,
      inspoData,
      schedule: String(combineDateTime(new Date(scheduleDate), scheduleTime).toISOString()),
      isWithRemoval: removal === "with",
      isRemovalDoneByFadCri: removalType === "fad",
      userId,
    },
  });
  if (error) throw error;

  return data;
};

export const insertPayment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    paymentData: PaymentTableInsert;
  },
) => {
  const { paymentData } = params;
  const { error } = await supabaseClient.from("payment_table").insert(paymentData);
  if (error) throw error;
};
